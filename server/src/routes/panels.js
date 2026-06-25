import { Router } from "express";
import Astrologer from "../models/Astrologer.js";
import Consultation from "../models/Consultation.js";
import { getDemoConsultations } from "../data/bookings.js";
import { astrologers, services } from "../data/seed.js";
import { getWalletForSession, readAuthSession } from "./auth.js";

const router = Router();

function readRequestedRole(req) {
  const session = readAuthSession(req);
  return String(session?.role || req.get("x-demo-role") || req.query.role || "").trim().toLowerCase();
}

function requireRole(req, res, role) {
  const requestedRole = readRequestedRole(req);

  if (requestedRole && requestedRole !== role) {
    res.status(403).json({ message: `This panel is only available for ${role} accounts.` });
    return false;
  }

  return true;
}

function toSerializableBooking(booking) {
  return {
    bookingId: booking.bookingId,
    astrologerId: booking.astrologerId,
    astrologerName: booking.astrologerName,
    customerId: booking.customerId,
    customerEmail: booking.customerEmail,
    customerName: booking.customerName,
    concern: booking.concern,
    mode: booking.mode,
    durationMinutes: booking.durationMinutes,
    consultationFee: booking.consultationFee,
    amountPaid: booking.amountPaid,
    currency: booking.currency,
    paymentStatus: booking.paymentStatus,
    razorpayOrderId: booking.razorpayOrderId,
    razorpayPaymentId: booking.razorpayPaymentId,
    paidAt: booking.paidAt?.toISOString?.() || booking.paidAt || null,
    birthDate: booking.birthDate,
    birthTime: booking.birthTime,
    place: booking.place,
    etaMinutes: booking.etaMinutes,
    status: booking.status,
    createdAt: booking.createdAt?.toISOString?.() || booking.createdAt || null,
    updatedAt: booking.updatedAt?.toISOString?.() || booking.updatedAt || null
  };
}

async function getAstrologerRows(req) {
  if (!req.app.locals.mongoReady) return astrologers;

  const rows = await Astrologer.find().sort({ rating: -1 }).lean();
  return rows.map(({ _id, __v, ...item }) => item);
}

async function getConsultationRows(req, session) {
  if (!req.app.locals.mongoReady) {
    const rows = getDemoConsultations();
    if (session?.role !== "user") return rows;

    const customerRows = rows.filter((item) => item.customerEmail === session.email);
    return customerRows.length ? customerRows : rows;
  }

  const query = session?.role === "user" ? { customerEmail: session.email } : {};
  const rows = await Consultation.find(query).sort({ createdAt: -1 }).limit(12).lean();
  return rows.map(toSerializableBooking);
}

function money(value) {
  return `Rs ${Number(value).toLocaleString("en-IN")}`;
}

router.get("/user", async (req, res, next) => {
  if (!requireRole(req, res, "user")) return;

  try {
    const session = readAuthSession(req);
    const [astrologerRows, consultations, wallet] = await Promise.all([
      getAstrologerRows(req),
      getConsultationRows(req, session),
      getWalletForSession(req, session)
    ]);

    const recommendations = astrologerRows
      .filter((item) => item.status !== "offline")
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        name: item.name,
        title: item.title,
        rating: item.rating,
        pricePerMinute: item.pricePerMinute,
        status: item.status,
        modes: item.modes
      }));

    const upcoming = consultations
      .filter((item) => item.status !== "completed")
      .slice(0, 3)
      .map(toSerializableBooking);

    const history = consultations
      .filter((item) => item.status === "completed")
      .concat(consultations.filter((item) => item.status !== "completed").slice(1))
      .slice(0, 4)
      .map(toSerializableBooking);

    res.json({
      profile: {
        tier: "Gold member",
        memberSince: "January 2025",
        savedBirthProfiles: 3
      },
      wallet,
      upcoming,
      history,
      savedTools: [
        {
          id: "kundli-default",
          title: "Personal kundli",
          detail: "Leo ascendant, Rohini nakshatra",
          updatedAt: "Updated today"
        },
        {
          id: "match-aarav-meera",
          title: "Compatibility check",
          detail: "Aarav + Meera, 31/36 gunas",
          updatedAt: "Updated yesterday"
        },
        {
          id: "daily-leo",
          title: "Daily horoscope",
          detail: "Career 90, energy 92",
          updatedAt: "Fresh for today"
        }
      ],
      recommendations,
      notifications: [
        "Your next chat starts in about 2 minutes.",
        "Isha Sharma shared a remedy note for your saved kundli.",
        "12 free consultation minutes are available in your wallet."
      ]
    });
  } catch (error) {
    next(error);
  }
});

router.get("/admin", async (req, res, next) => {
  if (!requireRole(req, res, "admin")) return;

  try {
    const session = readAuthSession(req);
    const [astrologerRows, consultations] = await Promise.all([
      getAstrologerRows(req),
      getConsultationRows(req, session)
    ]);

    const onlineCount = astrologerRows.filter((item) => item.status === "online").length;
    const busyCount = astrologerRows.filter((item) => item.status === "busy").length;
    const offlineCount = astrologerRows.filter((item) => item.status === "offline").length;
    const bookingQueue = consultations.slice(0, 6).map(toSerializableBooking);
    const revenueToday = consultations.reduce((total, item) => {
      const astrologer = astrologerRows.find((row) => row.id === item.astrologerId);
      return (
        total +
        (item.amountPaid ||
          item.consultationFee ||
          (astrologer?.pricePerMinute || 18) * Math.max(5, item.durationMinutes || 5))
      );
    }, 0);

    res.json({
      metrics: [
        {
          label: "Revenue today",
          value: money(revenueToday),
          detail: "+12% from yesterday"
        },
        {
          label: "Active bookings",
          value: String(consultations.filter((item) => item.status !== "completed").length),
          detail: "Chat and call queue"
        },
        {
          label: "Live astrologers",
          value: String(onlineCount),
          detail: `${busyCount} busy, ${offlineCount} offline`
        },
        {
          label: "Avg. rating",
          value: (
            astrologerRows.reduce((sum, item) => sum + item.rating, 0) / astrologerRows.length
          ).toFixed(1),
          detail: `${astrologerRows.length} listed experts`
        }
      ],
      astrologerStatus: {
        online: onlineCount,
        busy: busyCount,
        offline: offlineCount
      },
      approvalQueue: [
        {
          id: "approval-1",
          name: "Kavya Joshi",
          specialty: "Tarot",
          experience: 6,
          language: "Hindi, English",
          status: "Documents pending"
        },
        {
          id: "approval-2",
          name: "Om Prakash",
          specialty: "Vastu",
          experience: 18,
          language: "Hindi",
          status: "Interview ready"
        },
        {
          id: "approval-3",
          name: "Sana Mirza",
          specialty: "Numerology",
          experience: 8,
          language: "English, Urdu",
          status: "Profile review"
        }
      ],
      bookingQueue,
      catalogHealth: services.map((service, index) => ({
        id: service.id,
        title: service.title,
        status: index < 4 ? "live" : "draft",
        bookings: 120 - index * 13,
        conversion: `${18 - index}%`
      })),
      supportQueue: [
        {
          id: "ticket-1",
          customer: "Mitra Sharma",
          issue: "Wallet recharge confirmation",
          priority: "high",
          age: "4 min"
        },
        {
          id: "ticket-2",
          customer: "Aarav Mehta",
          issue: "Call reschedule request",
          priority: "medium",
          age: "12 min"
        },
        {
          id: "ticket-3",
          customer: "Meera Kapoor",
          issue: "Kundli export question",
          priority: "low",
          age: "24 min"
        }
      ]
    });
  } catch (error) {
    next(error);
  }
});

export default router;
