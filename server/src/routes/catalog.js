import { Router } from "express";
import Astrologer from "../models/Astrologer.js";
import { astrologers, horoscopes, services, stats, testimonials } from "../data/seed.js";

const router = Router();

const normalize = (value = "") => String(value).trim().toLowerCase();

function applyFilters(rows, query) {
  const specialty = normalize(query.specialty);
  const language = normalize(query.language);
  const mode = normalize(query.mode);
  const search = normalize(query.search);
  const sort = normalize(query.sort || "recommended");

  let result = [...rows];

  if (specialty) {
    result = result.filter((item) =>
      item.specialties.some((entry) => normalize(entry) === specialty)
    );
  }

  if (language) {
    result = result.filter((item) => item.languages.some((entry) => normalize(entry) === language));
  }

  if (mode) {
    result = result.filter((item) => item.modes.includes(mode));
  }

  if (search) {
    result = result.filter((item) => {
      const haystack = [item.name, item.title, ...item.specialties, ...item.languages]
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }

  if (sort === "price") {
    result.sort((a, b) => a.pricePerMinute - b.pricePerMinute);
  } else if (sort === "experience") {
    result.sort((a, b) => b.experience - a.experience);
  } else if (sort === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  } else {
    result.sort((a, b) => Number(b.status === "online") - Number(a.status === "online") || b.rating - a.rating);
  }

  return result;
}

async function getAstrologers(req) {
  if (!req.app.locals.mongoReady) return astrologers;
  const rows = await Astrologer.find().sort({ rating: -1 }).lean();
  return rows.map(({ _id, __v, ...item }) => item);
}

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "astrotalk-clone-api" });
});

router.get("/stats", (_req, res) => {
  res.json(stats);
});

router.get("/services", (_req, res) => {
  res.json(services);
});

router.get("/testimonials", (_req, res) => {
  res.json(testimonials);
});

router.get("/astrologers", async (req, res, next) => {
  try {
    const rows = await getAstrologers(req);
    const filtered = applyFilters(rows, req.query);
    res.json(filtered);
  } catch (error) {
    next(error);
  }
});

router.get("/filters", async (req, res, next) => {
  try {
    const rows = await getAstrologers(req);
    const specialties = [...new Set(rows.flatMap((item) => item.specialties))].sort();
    const languages = [...new Set(rows.flatMap((item) => item.languages))].sort();
    res.json({ specialties, languages, modes: ["chat", "call"] });
  } catch (error) {
    next(error);
  }
});

router.get("/horoscope", (req, res) => {
  const sign = normalize(req.query.sign || "leo");
  const horoscope = horoscopes[sign] || horoscopes.leo;
  res.json({
    ...horoscope,
    date: new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date())
  });
});

export default router;
