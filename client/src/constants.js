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

export const initialAstrologerProfile = {
  name: "",
  email: "",
  phone: "",
  title: "",
  bio: "",
  city: "",
  specialties: "",
  languages: "",
  experience: "",
  pricePerMinute: "",
  modes: ["chat", "call"],
  status: "online",
  responseTime: "",
  availability: "",
  education: "",
  certifications: "",
  accent: "#f4b400"
};

export const initialSignIn = {
  role: "user",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  adminCode: "",
  remember: true,
  ...initialAstrologerProfile
};

export const signInModes = {
  user: {
    label: "Customer",
    signInTitle: "Sign in as a customer",
    registerTitle: "Create customer account",
    signInDescription: "Continue bookings, wallet activity, saved kundli details, and chat history.",
    registerDescription: "Register for consultations, wallet access, saved kundli details, and chat history.",
    emailPlaceholder: "customer@example.com",
    highlights: ["Saved consultations", "Wallet balance", "Personalized tools"]
  },
  astrologer: {
    label: "Astrologer",
    signInTitle: "Sign in as an astrologer",
    registerTitle: "Create astrologer profile",
    signInDescription: "Manage your public listing, availability, pricing, and consultations.",
    registerDescription: "Register and fill every listing detail customers need before booking.",
    emailPlaceholder: "astrologer@example.com",
    highlights: ["Public listing", "Availability controls", "Consultation queue"]
  },
  admin: {
    label: "Admin",
    signInTitle: "Sign in as admin",
    registerTitle: "Create admin account",
    signInDescription: "Manage astrologers, bookings, service content, and live support queues.",
    registerDescription: "Register an operations account for approvals, bookings, and service controls.",
    emailPlaceholder: "admin@example.com",
    adminCode: "ADMIN-2026",
    highlights: ["Astrologer approvals", "Booking desk", "Catalog controls"]
  }
};
