import { Router } from "express";
import Astrologer from "../models/Astrologer.js";
import { astrologers } from "../data/seed.js";
import { readAuthSession } from "./auth.js";
import { createPaymentOrder, publicCheckoutOrder } from "../services/payments.js";

const router = Router();

function createBookingId() {
  return `AST-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now()
    .toString()
    .slice(-4)}`;
}

function normalizeDuration(value) {
  const duration = Number.parseInt(value, 10);
  if (!Number.isFinite(duration)) return 5;
  return Math.min(60, Math.max(5, duration));
}

async function findAstrologer(req, astrologerId) {
  if (req.app.locals.mongoReady) {
    return Astrologer.findOne({ id: astrologerId }).lean();
  }

  return astrologers.find((item) => item.id === astrologerId);
}

router.post("/", async (req, res, next) => {
  try {
    const session = readAuthSession(req);

    if (!session) {
      return res.status(401).json({ message: "Sign in to book a chat or call with an astrologer." });
    }

    if (session.role !== "user") {
      return res.status(403).json({ message: "Only customer accounts can book consultations." });
    }

    const { astrologerId, name, concern, mode, birthDate, birthTime, place, durationMinutes } =
      req.body;

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
    const duration = normalizeDuration(durationMinutes);
    const consultationFee = Number(astrologer.pricePerMinute || 0) * duration;

    if (consultationFee <= 0) {
      return res.status(400).json({ message: "Unable to calculate consultation fees." });
    }

    const bookingDraft = {
      bookingId: createBookingId(),
      astrologerId,
      astrologerName: astrologer.name,
      customerId: session.id,
      customerEmail: session.email,
      customerName: name,
      concern,
      mode,
      durationMinutes: duration,
      consultationFee,
      amountPaid: consultationFee,
      currency: process.env.RAZORPAY_CURRENCY || "INR",
      birthDate,
      birthTime,
      place,
      etaMinutes,
      status: "confirmed"
    };

    const paymentOrder = await createPaymentOrder(req, {
      session,
      purpose: "consultation",
      amount: consultationFee,
      receiptPrefix: "consult",
      notes: {
        purpose: "consultation",
        bookingId: bookingDraft.bookingId,
        astrologerId,
        mode
      },
      consultation: bookingDraft
    });

    res.status(201).json({
      message: "Payment order created. Complete payment to confirm the consultation.",
      ...publicCheckoutOrder(paymentOrder),
      booking: bookingDraft
    });
  } catch (error) {
    next(error);
  }
});

export default router;
