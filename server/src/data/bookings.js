const memoryConsultations = [];

export function rememberConsultation(booking) {
  const timestamp = new Date().toISOString();
  const storedBooking = {
    ...booking,
    createdAt: booking.createdAt || timestamp,
    updatedAt: timestamp
  };

  memoryConsultations.unshift(storedBooking);
  memoryConsultations.splice(50);
  return storedBooking;
}

export function getConsultations() {
  return memoryConsultations;
}
