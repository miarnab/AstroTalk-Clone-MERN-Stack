export const stats = [
  { label: "Astrologers", value: "325+" },
  { label: "Daily chats", value: "18k" },
  { label: "Avg. rating", value: "4.8" },
  { label: "Languages", value: "12" }
];

export const astrologers = [
  {
    id: "astro-isha",
    name: "Isha Sharma",
    title: "Vedic astrologer",
    specialties: ["Love", "Career", "Kundli"],
    languages: ["Hindi", "English"],
    experience: 12,
    rating: 4.9,
    orders: 18420,
    pricePerMinute: 18,
    modes: ["chat", "call"],
    status: "online",
    responseTime: "1 min",
    accent: "#f4b400"
  },
  {
    id: "astro-neeraj",
    name: "Neeraj Vyas",
    title: "Numerology expert",
    specialties: ["Numerology", "Business", "Finance"],
    languages: ["Hindi", "Gujarati"],
    experience: 9,
    rating: 4.8,
    orders: 12980,
    pricePerMinute: 15,
    modes: ["chat"],
    status: "online",
    responseTime: "2 min",
    accent: "#188b8b"
  },
  {
    id: "astro-radhika",
    name: "Radhika Menon",
    title: "Tarot and relationship guide",
    specialties: ["Tarot", "Love", "Marriage"],
    languages: ["English", "Malayalam"],
    experience: 7,
    rating: 4.7,
    orders: 9760,
    pricePerMinute: 12,
    modes: ["chat", "call"],
    status: "busy",
    responseTime: "7 min",
    accent: "#e85d75"
  },
  {
    id: "astro-abhay",
    name: "Abhay Rao",
    title: "KP and Vastu consultant",
    specialties: ["Vastu", "Career", "Property"],
    languages: ["Hindi", "Marathi"],
    experience: 16,
    rating: 4.9,
    orders: 22340,
    pricePerMinute: 25,
    modes: ["call"],
    status: "online",
    responseTime: "1 min",
    accent: "#5661d9"
  },
  {
    id: "astro-farah",
    name: "Farah Khan",
    title: "Life path coach",
    specialties: ["Career", "Education", "Finance"],
    languages: ["English", "Urdu"],
    experience: 10,
    rating: 4.8,
    orders: 11120,
    pricePerMinute: 20,
    modes: ["chat", "call"],
    status: "online",
    responseTime: "3 min",
    accent: "#2d9b68"
  },
  {
    id: "astro-dev",
    name: "Dev Trivedi",
    title: "Marriage and dosha specialist",
    specialties: ["Marriage", "Kundli", "Remedies"],
    languages: ["Hindi", "English", "Bengali"],
    experience: 14,
    rating: 4.9,
    orders: 19870,
    pricePerMinute: 22,
    modes: ["chat", "call"],
    status: "offline",
    responseTime: "22 min",
    accent: "#d76a03"
  }
];

export const services = [
  {
    id: "daily-horoscope",
    title: "Daily Horoscope",
    description: "Sign-wise guidance for love, career, finance, and energy.",
    tone: "solar"
  },
  {
    id: "kundli",
    title: "Free Kundli",
    description: "Birth chart snapshot with ascendant, moon sign, and nakshatra.",
    tone: "teal"
  },
  {
    id: "matchmaking",
    title: "Kundli Matching",
    description: "Compatibility scoring with practical relationship focus areas.",
    tone: "rose"
  },
  {
    id: "panchang",
    title: "Panchang",
    description: "Tithi, nakshatra, yoga, and muhurat-style daily summary.",
    tone: "indigo"
  },
  {
    id: "tarot",
    title: "Tarot Reading",
    description: "A quick card-led view of the question on your mind.",
    tone: "green"
  },
  {
    id: "shop",
    title: "Remedies Store",
    description: "Gemstone, rudraksha, and ritual recommendations.",
    tone: "amber"
  }
];

export const testimonials = [
  {
    id: "review-1",
    name: "Aarav",
    text: "The career session was clear, direct, and surprisingly practical.",
    rating: 5
  },
  {
    id: "review-2",
    name: "Meera",
    text: "I booked a call in under a minute and got thoughtful marriage guidance.",
    rating: 5
  },
  {
    id: "review-3",
    name: "Kabir",
    text: "The kundli report helped me understand what to ask in the live chat.",
    rating: 4
  }
];

export const horoscopes = {
  aries: {
    sign: "Aries",
    mood: "Decisive",
    love: 74,
    career: 82,
    money: 68,
    energy: 88,
    luckyNumber: 9,
    luckyColor: "Coral",
    advice: "Move fast on one priority, then give people room to catch up."
  },
  taurus: {
    sign: "Taurus",
    mood: "Grounded",
    love: 80,
    career: 72,
    money: 86,
    energy: 66,
    luckyNumber: 6,
    luckyColor: "Emerald",
    advice: "A patient financial choice can do more than a dramatic one today."
  },
  gemini: {
    sign: "Gemini",
    mood: "Curious",
    love: 78,
    career: 84,
    money: 63,
    energy: 79,
    luckyNumber: 5,
    luckyColor: "Sky",
    advice: "Ask the second question. The useful detail arrives after the obvious answer."
  },
  cancer: {
    sign: "Cancer",
    mood: "Reflective",
    love: 88,
    career: 69,
    money: 71,
    energy: 73,
    luckyNumber: 2,
    luckyColor: "Pearl",
    advice: "Protect your peace before you try to repair everyone else's day."
  },
  leo: {
    sign: "Leo",
    mood: "Radiant",
    love: 83,
    career: 90,
    money: 75,
    energy: 92,
    luckyNumber: 1,
    luckyColor: "Gold",
    advice: "Lead with warmth first; the authority will follow naturally."
  },
  virgo: {
    sign: "Virgo",
    mood: "Precise",
    love: 70,
    career: 89,
    money: 82,
    energy: 65,
    luckyNumber: 4,
    luckyColor: "Olive",
    advice: "Tidy the system, not every tiny surface. Your time matters too."
  },
  libra: {
    sign: "Libra",
    mood: "Balanced",
    love: 91,
    career: 76,
    money: 70,
    energy: 74,
    luckyNumber: 7,
    luckyColor: "Rose",
    advice: "A direct but kind conversation clears more space than another compromise."
  },
  scorpio: {
    sign: "Scorpio",
    mood: "Focused",
    love: 77,
    career: 86,
    money: 79,
    energy: 81,
    luckyNumber: 8,
    luckyColor: "Maroon",
    advice: "Trust the pattern you noticed. It is asking for one clean boundary."
  },
  sagittarius: {
    sign: "Sagittarius",
    mood: "Expansive",
    love: 73,
    career: 80,
    money: 69,
    energy: 87,
    luckyNumber: 3,
    luckyColor: "Violet",
    advice: "Say yes to movement, but give the plan one anchor before you go."
  },
  capricorn: {
    sign: "Capricorn",
    mood: "Strategic",
    love: 68,
    career: 92,
    money: 88,
    energy: 76,
    luckyNumber: 10,
    luckyColor: "Charcoal",
    advice: "The long road looks better once today's first milestone is visible."
  },
  aquarius: {
    sign: "Aquarius",
    mood: "Inventive",
    love: 72,
    career: 85,
    money: 74,
    energy: 83,
    luckyNumber: 11,
    luckyColor: "Aqua",
    advice: "Bring the unusual idea, then translate it into one practical next step."
  },
  pisces: {
    sign: "Pisces",
    mood: "Intuitive",
    love: 89,
    career: 70,
    money: 67,
    energy: 78,
    luckyNumber: 12,
    luckyColor: "Lavender",
    advice: "Your instinct is useful, especially when it is paired with a written plan."
  }
};
