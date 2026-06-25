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
  userPanel: (session) =>
    request("/api/panels/user", {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`,
        "x-demo-role": session?.user?.role || "user"
      }
    }),
  adminPanel: (session) =>
    request("/api/panels/admin", {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`,
        "x-demo-role": session?.user?.role || "admin"
      }
    }),
  book: (payload) =>
    request("/api/consultations", {
      method: "POST",
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
