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
    password: "user123"
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
    dashboard: profile.dashboard
  };
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
    email: normalizeEmail(account.email)
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

router.post("/register", register);
router.post("/signin", signIn);

export default router;
