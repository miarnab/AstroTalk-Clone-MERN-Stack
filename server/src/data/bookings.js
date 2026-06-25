export const demoConsultations = [
  {
    bookingId: "AST-DEMO-2401",
    astrologerId: "astro-isha",
    astrologerName: "Isha Sharma",
    customerName: "Mitra Sharma",
    concern: "Career clarity for a role change",
    mode: "chat",
    birthDate: "1996-08-18",
    birthTime: "07:30",
    place: "Delhi",
    etaMinutes: 2,
    status: "confirmed",
    createdAt: "2026-06-25T03:45:00.000Z",
    updatedAt: "2026-06-25T03:45:00.000Z"
  },
  {
    bookingId: "AST-DEMO-1832",
    astrologerId: "astro-radhika",
    astrologerName: "Radhika Menon",
    customerName: "Aarav Mehta",
    concern: "Marriage compatibility",
    mode: "call",
    birthDate: "1994-02-12",
    birthTime: "21:10",
    place: "Mumbai",
    etaMinutes: 8,
    status: "waiting",
    createdAt: "2026-06-24T13:20:00.000Z",
    updatedAt: "2026-06-24T13:20:00.000Z"
  },
  {
    bookingId: "AST-DEMO-9914",
    astrologerId: "astro-neeraj",
    astrologerName: "Neeraj Vyas",
    customerName: "Meera Kapoor",
    concern: "Business name numerology",
    mode: "chat",
    birthDate: "1991-11-03",
    birthTime: "10:40",
    place: "Ahmedabad",
    etaMinutes: 5,
    status: "completed",
    createdAt: "2026-06-23T10:05:00.000Z",
    updatedAt: "2026-06-23T10:45:00.000Z"
  }
];

export function rememberDemoConsultation(booking) {
  const timestamp = new Date().toISOString();
  const storedBooking = {
    ...booking,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  demoConsultations.unshift(storedBooking);
  demoConsultations.splice(25);
  return storedBooking;
}

export function getDemoConsultations() {
  return demoConsultations;
}
