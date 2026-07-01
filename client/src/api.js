const headers = {
  "Content-Type": "application/json"
};

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {})
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload;
}

export const api = {
  astrologers: (query = {}) => {
    const params = new URLSearchParams(
      Object.entries(query).filter(([, value]) => value !== "" && value != null)
    );
    return request(`/api/astrologers?${params.toString()}`);
  },
  filters: () => request("/api/filters"),
  horoscope: (sign) => request(`/api/horoscope?sign=${encodeURIComponent(sign)}`),
  stats: () => request("/api/stats"),
  services: () => request("/api/services"),
  testimonials: () => request("/api/testimonials"),
  signIn: (payload) =>
    request("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  profile: (session) =>
    request("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      }
    }),
  updateProfile: (payload, session) =>
    request("/api/auth/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      },
      body: JSON.stringify(payload)
    }),
  userPanel: (session) =>
    request("/api/panels/user", {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      }
    }),
  astrologerPanel: (session) =>
    request("/api/panels/astrologer", {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      }
    }),
  adminPanel: (session) =>
    request("/api/panels/admin", {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      }
    }),
  book: (payload, session) =>
    request("/api/consultations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      },
      body: JSON.stringify(payload)
    }),
  consultationSession: (bookingId, session) =>
    request(`/api/consultations/${encodeURIComponent(bookingId)}/session`, {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      }
    }),
  sendConsultationMessage: (bookingId, payload, session) =>
    request(`/api/consultations/${encodeURIComponent(bookingId)}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      },
      body: JSON.stringify(payload)
    }),
  consultationSignals: (bookingId, session) =>
    request(`/api/consultations/${encodeURIComponent(bookingId)}/signals`, {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      }
    }),
  sendConsultationSignal: (bookingId, payload, session) =>
    request(`/api/consultations/${encodeURIComponent(bookingId)}/signals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      },
      body: JSON.stringify(payload)
    }),
  rechargeWallet: (payload, session) =>
    request("/api/payments/wallet/recharge", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      },
      body: JSON.stringify(payload)
    }),
  verifyPayment: (payload, session) =>
    request("/api/payments/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      },
      body: JSON.stringify(payload)
    }),
  openFailedConsultation: (payload, session) =>
    request("/api/payments/consultations/failed", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.token || ""}`
      },
      body: JSON.stringify(payload)
    }),
  kundli: (payload) =>
    request("/api/tools/kundli", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  compatibility: (payload) =>
    request("/api/tools/compatibility", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
