import { Router } from "express";
import Astrologer from "../models/Astrologer.js";
import Consultation from "../models/Consultation.js";
import { rememberDemoConsultation } from "../data/bookings.js";
import { astrologers } from "../data/seed.js";

const router = Router();

function createBookingId() {
  return `AST-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now()
    .toString()
    .slice(-4)}`;
}

async function findAstrologer(req, astrologerId) {
  if (req.app.locals.mongoReady) {
    return Astrologer.findOne({ id: astrologerId }).lean();
  }

  return astrologers.find((item) => item.id === astrologerId);
}

router.post("/", async (req, res, next) => {
  try {
    const { astrologerId, name, concern, mode, birthDate, birthTime, place } = req.body;

    if (!astrologerId || !name || !concern || !mode) {
      return res.status(400).json({
        message: "Astrologer, name, concern, and consultation mode are required."
      });
    }

    const astrologer = await findAstrologer(req, astrologerId);

    if (!astrologer) {
      return res.status(404).json({ message: "Astrologer not found." });
    }

    if (!astrologer.modes.includes(mode)) {
      return res.status(400).json({ message: `${astrologer.name} is not available for ${mode}.` });
    }

    const etaMinutes = astrologer.status === "online" ? 2 : astrologer.status === "busy" ? 8 : 25;

    const booking = {
      bookingId: createBookingId(),
      astrologerId,
      astrologerName: astrologer.name,
      customerName: name,
      concern,
      mode,
      birthDate,
      birthTime,
      place,
      etaMinutes,
      status: "confirmed"
    };

    if (req.app.locals.mongoReady) {
      await Consultation.create(booking);
    } else {
      rememberDemoConsultation(booking);
    }

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

export default router;
