export const signs = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];

export const initialFilters = {
  search: "",
  specialty: "",
  language: "",
  mode: "",
  sort: "recommended"
};

export const initialBooking = {
  name: "",
  concern: "",
  birthDate: "",
  birthTime: "",
  place: "",
  durationMinutes: 5,
  mode: "chat"
};

export const initialProfile = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  birthTime: "",
  place: "",
  concern: "",
  gender: "",
  preferredLanguage: ""
};

export const initialSignIn = {
  role: "user",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  adminCode: "",
  remember: true
};

export const signInModes = {
  user: {
    label: "Customer",
    signInTitle: "Sign in as a customer",
    registerTitle: "Create customer account",
    signInDescription: "Continue bookings, wallet activity, saved kundli details, and chat history.",
    registerDescription: "Register for consultations, wallet access, saved kundli details, and chat history.",
    email: "customer@astrotalk.test",
    password: "user123",
    highlights: ["Saved consultations", "Wallet balance", "Personalized tools"]
  },
  admin: {
    label: "Admin",
    signInTitle: "Sign in as admin",
    registerTitle: "Create admin account",
    signInDescription: "Manage astrologers, bookings, service content, and live support queues.",
    registerDescription: "Register an operations account for approvals, bookings, and service controls.",
    email: "admin@astrotalk.test",
    password: "admin123",
    adminCode: "ADMIN-2026",
    highlights: ["Astrologer approvals", "Booking desk", "Catalog controls"]
  }
};
