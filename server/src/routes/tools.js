import { Router } from "express";

const router = Router();

const signs = [
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

const nakshatras = [
  "Ashwini",
  "Bharani",
  "Rohini",
  "Mrigashira",
  "Pushya",
  "Magha",
  "Hasta",
  "Swati",
  "Anuradha",
  "Mula",
  "Shravana",
  "Revati"
];

function hashText(value) {
  return String(value)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

router.post("/kundli", (req, res) => {
  const { name = "", birthDate = "", birthTime = "", place = "" } = req.body;

  if (!name || !birthDate || !birthTime || !place) {
    return res.status(400).json({ message: "Name, date, time, and place are required." });
  }

  const seed = hashText(`${name}${birthDate}${birthTime}${place}`);
  const ascendant = signs[seed % signs.length];
  const moonSign = signs[(seed + 4) % signs.length];
  const nakshatra = nakshatras[(seed + 7) % nakshatras.length];
  const manglikScore = seed % 9;

  res.json({
    name,
    ascendant,
    moonSign,
    nakshatra,
    manglik: manglikScore > 5 ? "Partial" : "No major dosha",
    houseFocus: [
      { label: "Career", value: 65 + (seed % 27) },
      { label: "Love", value: 58 + (seed % 31) },
      { label: "Wealth", value: 61 + (seed % 25) }
    ],
    remedies: [
      "Start important work after a short grounding ritual.",
      "Keep communication written for decisions involving money.",
      "Offer gratitude before beginning a new weekly commitment."
    ]
  });
});

router.post("/compatibility", (req, res) => {
  const { firstName = "", firstSign = "", secondName = "", secondSign = "" } = req.body;

  if (!firstName || !firstSign || !secondName || !secondSign) {
    return res.status(400).json({ message: "Both names and signs are required." });
  }

  const firstIndex = signs.findIndex((sign) => sign.toLowerCase() === firstSign.toLowerCase());
  const secondIndex = signs.findIndex((sign) => sign.toLowerCase() === secondSign.toLowerCase());
  const distance = Math.abs(firstIndex - secondIndex);
  const harmony = Math.max(42, 92 - distance * 6 + ((firstName.length + secondName.length) % 9));
  const gunas = Math.round((harmony / 100) * 36);

  res.json({
    pair: `${firstName} + ${secondName}`,
    score: Math.min(98, harmony),
    gunas,
    summary:
      harmony > 78
        ? "Strong natural rhythm with clear emotional support."
        : harmony > 62
          ? "Promising match that improves with honest planning."
          : "Needs deliberate communication and patient expectation setting.",
    focus: ["Communication", "Shared routines", "Financial expectations"]
  });
});

export default router;
