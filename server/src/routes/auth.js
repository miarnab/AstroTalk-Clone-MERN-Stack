import { Router } from "express";
import { randomUUID } from "node:crypto";
import User from "../models/User.js";
import { createAuthToken, hashPassword, verifyAuthToken, verifyPassword } from "../utils/security.js";

const router = Router();

const roleProfiles = {
  user: {
    role: "user",
    dashboard: "Customer dashboard",
    nextStep: "Your wallet, bookings, and consultation history are ready."
  },
  admin: {
    role: "admin",
    dashboard: "Admin console",
    nextStep: "Astrologer approvals, bookings, and service controls are ready."
  }
};

const demoAccounts = [
  {
    id: "usr-demo",
    name: "Mitra Sharma",
    email: "customer@astrotalk.test",
    phone: "9876543210",
    role: "user",
    password: "user123",
    profile: {
      birthDate: "1996-08-18",
      birthTime: "07:30",
      place: "Delhi",
      concern: "Career growth and family harmony",
      gender: "Female",
      preferredLanguage: "Hindi"
    }
  },
  {
    id: "adm-demo",
    name: "Admin Desk",
    email: "admin@astrotalk.test",
    phone: "9000000000",
    role: "admin",
    password: "admin123",
    adminCodeVerified: true
  }
];

const memoryAccounts = new Map();
const defaultWallet = {
  balance: 1200,
  rewards: 340,
  freeMinutes: 12,
  spendThisMonth: 860
};
const emptyCustomerProfile = {
  birthDate: "",
  birthTime: "",
  place: "",
  concern: "",
  gender: "",
  preferredLanguage: ""
};

function normalize(value = "") {
  return String(value).trim();
}

function normalizeEmail(value = "") {
  return normalize(value).toLowerCase();
}

function normalizeRole(value = "") {
  const role = normalize(value).toLowerCase();
  return role === "customer" ? "user" : role;
}

function getAdminCode() {
  return normalize(process.env.ADMIN_REGISTRATION_CODE || process.env.ADMIN_CODE || "ADMIN-2026").toUpperCase();
}

function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function isValidAdminCode(value) {
  return normalize(value).toUpperCase() === getAdminCode();
}

function isValidPhone(value) {
  return normalize(value).replace(/\D/g, "").length >= 7;
}

function seedMemoryAccounts() {
  if (memoryAccounts.size > 0) return;

  demoAccounts.forEach((account) => {
    memoryAccounts.set(account.email, {
      ...account,
      wallet: account.role === "user" ? { ...defaultWallet } : undefined,
      passwordHash: hashPassword(account.password),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
}

function toAccountObject(account) {
  return typeof account?.toObject === "function" ? account.toObject() : account;
}

function publicUser(account) {
  const item = toAccountObject(account);
  const profile = roleProfiles[item.role];

  return {
    id: item.id || item._id?.toString(),
    name: item.name,
    email: item.email,
    phone: item.phone,
    role: item.role,
    dashboard: profile.dashboard,
    profile: profileSnapshot(item)
  };
}

function walletSnapshot(account) {
  return {
    ...defaultWallet,
    ...(toAccountObject(account)?.wallet || {})
  };
}

function profileSnapshot(account) {
  return {
    ...emptyCustomerProfile,
    ...(toAccountObject(account)?.profile || {})
  };
}

async function findAccountBySession(req, session) {
  if (!session?.email) return null;

  if (req.app.locals.mongoReady) {
    return User.findOne({ email: session.email });
  }

  seedMemoryAccounts();
  return memoryAccounts.get(session.email) || null;
}

async function updateWalletForSession(req, session, updater) {
  const account = await findAccountBySession(req, session);

  if (!account || account.role !== "user") return null;

  const nextWallet = updater(walletSnapshot(account));

  if (req.app.locals.mongoReady) {
    account.wallet = nextWallet;
    await account.save();
    return walletSnapshot(account);
  }

  account.wallet = nextWallet;
  account.updatedAt = new Date();
  memoryAccounts.set(account.email, account);
  return walletSnapshot(account);
}

function createSession(account, message) {
  const user = publicUser(account);
  const profile = roleProfiles[user.role];

  return {
    token: createAuthToken({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    }),
    user,
    message,
    nextStep: profile.nextStep
  };
}

async function findAccount(req, email) {
  if (req.app.locals.mongoReady) {
    return User.findOne({ email });
  }

  seedMemoryAccounts();
  return memoryAccounts.get(email) || null;
}

async function createAccount(req, account) {
  const normalizedAccount = {
    ...account,
    email: normalizeEmail(account.email),
    profile: account.profile || { ...emptyCustomerProfile },
    wallet: account.role === "user" ? { ...defaultWallet } : undefined
  };

  if (req.app.locals.mongoReady) {
    return User.create(normalizedAccount);
  }

  const now = new Date();
  const storedAccount = {
    ...normalizedAccount,
    id: `${normalizedAccount.role}-${randomUUID()}`,
    createdAt: now,
    updatedAt: now
  };

  memoryAccounts.set(storedAccount.email, storedAccount);
  return storedAccount;
}

function validateRole(role, res, action) {
  if (!["user", "admin"].includes(role)) {
    res.status(400).json({ message: `Choose customer or admin ${action}.` });
    return false;
  }

  return true;
}

function readProfilePayload(payload = {}) {
  const source =
    payload.profile && typeof payload.profile === "object"
      ? { ...payload, ...payload.profile }
      : payload;

  return {
    birthDate: normalize(source.birthDate),
    birthTime: normalize(source.birthTime),
    place: normalize(source.place),
    concern: normalize(source.concern),
    gender: normalize(source.gender),
    preferredLanguage: normalize(source.preferredLanguage)
  };
}

async function requireCustomerAccount(req, res) {
  const session = readAuthSession(req);

  if (!session) {
    res.status(401).json({ message: "Sign in to manage your customer profile." });
    return null;
  }

  if (session.role !== "user") {
    res.status(403).json({ message: "Only customer accounts can manage consultation profiles." });
    return null;
  }

  const account = await findAccountBySession(req, session);

  if (!account) {
    res.status(404).json({ message: "Customer account not found." });
    return null;
  }

  return { account, session };
}

export async function ensureDemoAccounts(mongoReady) {
  seedMemoryAccounts();

  if (!mongoReady) return;

  await Promise.all(
    demoAccounts.map(async (account) => {
      const existing = await User.findOne({ email: account.email });
      if (existing) return;

      await User.create({
        name: account.name,
        email: account.email,
        phone: account.phone,
        role: account.role,
        profile: account.profile || { ...emptyCustomerProfile },
        adminCodeVerified: Boolean(account.adminCodeVerified),
        passwordHash: hashPassword(account.password)
      });
    })
  );
}

export function readAuthSession(req) {
  const header = req.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  return verifyAuthToken(token);
}

export async function getWalletForSession(req, session) {
  const account = await findAccountBySession(req, session);

  if (!account || account.role !== "user") return { ...defaultWallet };

  return walletSnapshot(account);
}

export async function creditWalletForSession(req, session, amount) {
  const creditAmount = Math.max(0, Number(amount) || 0);

  return updateWalletForSession(req, session, (wallet) => ({
    ...wallet,
    balance: wallet.balance + creditAmount
  }));
}

export async function recordWalletSpendForSession(req, session, amount) {
  const spendAmount = Math.max(0, Number(amount) || 0);

  return updateWalletForSession(req, session, (wallet) => ({
    ...wallet,
    spendThisMonth: wallet.spendThisMonth + spendAmount
  }));
}

export async function register(req, res, next) {
  try {
    const role = normalizeRole(req.body.role);
    const name = normalize(req.body.name);
    const email = normalizeEmail(req.body.email);
    const phone = normalize(req.body.phone);
    const password = normalize(req.body.password);
    const confirmPassword = normalize(req.body.confirmPassword);
    const adminCode = normalize(req.body.adminCode);

    if (!validateRole(role, res, "registration")) return;

    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Enter the account holder name." });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ message: "Enter a valid phone number." });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    if (!confirmPassword || password !== confirmPassword) {
      return res.status(400).json({ message: "Confirm password must match the password." });
    }

    if (role === "admin" && !isValidAdminCode(adminCode)) {
      return res.status(401).json({ message: "Enter the correct admin registration code." });
    }

    const existing = await findAccount(req, email);

    if (existing) {
      return res.status(409).json({ message: "An account already exists with this email." });
    }

    const account = await createAccount(req, {
      name,
      email,
      phone,
      role,
      adminCodeVerified: role === "admin",
      passwordHash: hashPassword(password)
    });

    const label = role === "admin" ? "Admin" : "Customer";

    res.status(201).json(createSession(account, `${label} account created.`));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account already exists with this email." });
    }

    next(error);
  }
}

export async function signIn(req, res, next) {
  try {
    const role = normalizeRole(req.body.role);
    const email = normalizeEmail(req.body.email);
    const password = normalize(req.body.password);
    const adminCode = normalize(req.body.adminCode);

    if (!validateRole(role, res, "sign in")) return;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    if (role === "admin" && !isValidAdminCode(adminCode)) {
      return res.status(401).json({ message: "Enter the correct admin access code." });
    }

    const account = await findAccount(req, email);

    if (!account || !verifyPassword(password, account.passwordHash)) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    if (account.role !== role) {
      const label = account.role === "admin" ? "admin" : "customer";
      return res.status(403).json({ message: `This email is registered as a ${label} account.` });
    }

    const profile = roleProfiles[role];
    res.json(createSession(account, `${profile.dashboard} unlocked.`));
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const result = await requireCustomerAccount(req, res);
    if (!result) return;

    res.json({
      user: publicUser(result.account)
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const result = await requireCustomerAccount(req, res);
    if (!result) return;

    const { account } = result;
    const name = normalize(req.body.name || account.name);
    const phone = normalize(req.body.phone || account.phone);
    const profile = readProfilePayload(req.body);

    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Enter the customer name." });
    }

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ message: "Enter a valid phone number." });
    }

    account.name = name;
    account.phone = phone;
    account.profile = profile;
    account.updatedAt = new Date();

    if (req.app.locals.mongoReady) {
      await account.save();
    } else {
      memoryAccounts.set(account.email, account);
    }

    res.json(createSession(account, "Customer profile saved."));
  } catch (error) {
    next(error);
  }
}

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/register", register);
router.post("/signin", signIn);

export default router;
