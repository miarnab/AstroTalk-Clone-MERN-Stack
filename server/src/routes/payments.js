import { Router } from "express";
import Consultation from "../models/Consultation.js";
import { rememberDemoConsultation } from "../data/bookings.js";
import {
  createPaymentOrder,
  findPaymentOrder,
  markPaymentOrderFailed,
  markPaymentOrderPaid,
  publicCheckoutOrder,
  verifyRazorpaySignature
} from "../services/payments.js";
import {
  creditWalletForSession,
  readAuthSession,
  recordWalletSpendForSession
} from "./auth.js";

const router = Router();

function requireCustomer(req, res) {
  const session = readAuthSession(req);

  if (!session) {
    res.status(401).json({ message: "Sign in to continue with payment." });
    return null;
  }

  if (session.role !== "user") {
    res.status(403).json({ message: "Only customer accounts can make payments." });
    return null;
  }

  return session;
}

function toSerializableBooking(booking) {
  const item = typeof booking?.toObject === "function" ? booking.toObject() : booking;

  return {
    bookingId: item.bookingId,
    astrologerId: item.astrologerId,
    astrologerName: item.astrologerName,
    customerId: item.customerId,
    customerEmail: item.customerEmail,
    customerName: item.customerName,
    concern: item.concern,
    mode: item.mode,
    durationMinutes: item.durationMinutes,
    consultationFee: item.consultationFee,
    amountPaid: item.amountPaid,
    currency: item.currency,
    paymentStatus: item.paymentStatus,
    razorpayOrderId: item.razorpayOrderId,
    razorpayPaymentId: item.razorpayPaymentId,
    paidAt: item.paidAt?.toISOString?.() || item.paidAt || null,
    birthDate: item.birthDate,
    birthTime: item.birthTime,
    place: item.place,
    etaMinutes: item.etaMinutes,
    status: item.status,
    createdAt: item.createdAt?.toISOString?.() || item.createdAt || null,
    updatedAt: item.updatedAt?.toISOString?.() || item.updatedAt || null
  };
}

async function createPaidConsultation(req, order, paymentId) {
  const paidAt = new Date();
  const booking = {
    ...order.consultation,
    paymentStatus: "paid",
    razorpayOrderId: order.razorpayOrderId,
    razorpayPaymentId: paymentId,
    paidAt
  };

  if (req.app.locals.mongoReady) {
    const existing = await Consultation.findOne({ razorpayOrderId: order.razorpayOrderId });
    if (existing) return toSerializableBooking(existing);

    const created = await Consultation.create(booking);
    return toSerializableBooking(created);
  }

  return rememberDemoConsultation(booking);
}

function readAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.round(amount) : 0;
}

router.post("/wallet/recharge", async (req, res, next) => {
  const session = requireCustomer(req, res);
  if (!session) return;

  try {
    const amount = readAmount(req.body.amount);

    if (amount < 50 || amount > 50000) {
      return res.status(400).json({ message: "Recharge amount must be between Rs 50 and Rs 50,000." });
    }

    const paymentOrder = await createPaymentOrder(req, {
      session,
      purpose: "wallet",
      amount,
      receiptPrefix: "wallet",
      notes: {
        purpose: "wallet_recharge",
        userEmail: session.email
      },
      wallet: {
        rechargeAmount: amount
      }
    });

    res.status(201).json({
      message: "Payment order created. Complete payment to recharge the wallet.",
      ...publicCheckoutOrder(paymentOrder),
      recharge: {
        amount
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  const session = requireCustomer(req, res);
  if (!session) return;

  try {
    const {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Razorpay payment details are required." });
    }

    const order = await findPaymentOrder(req, razorpayOrderId);

    if (!order) {
      return res.status(404).json({ message: "Payment order was not found." });
    }

    if (order.userEmail !== session.email) {
      return res.status(403).json({ message: "This payment order belongs to another account." });
    }

    if (order.status === "paid") {
      return res.json({
        message: "Payment was already verified.",
        purpose: order.purpose,
        ...(order.result || {})
      });
    }

    const isValidSignature = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    if (!isValidSignature) {
      await markPaymentOrderFailed(req, razorpayOrderId);
      return res.status(400).json({ message: "Payment signature verification failed." });
    }

    let payload;

    if (order.purpose === "consultation") {
      const booking = await createPaidConsultation(req, order, razorpayPaymentId);
      const wallet = await recordWalletSpendForSession(req, session, order.amount);
      payload = {
        booking,
        wallet
      };
    } else if (order.purpose === "wallet") {
      const wallet = await creditWalletForSession(req, session, order.wallet?.rechargeAmount || order.amount);
      payload = {
        recharge: {
          amount: order.wallet?.rechargeAmount || order.amount,
          currency: order.currency
        },
        wallet
      };
    } else {
      return res.status(400).json({ message: "Unsupported payment purpose." });
    }

    await markPaymentOrderPaid(req, razorpayOrderId, {
      razorpayPaymentId,
      payload
    });

    res.json({
      message: "Payment verified successfully.",
      purpose: order.purpose,
      ...payload
    });
  } catch (error) {
    next(error);
  }
});

export default router;
