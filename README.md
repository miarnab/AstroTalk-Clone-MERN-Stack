# Astrotalk Clone Using MERN

A full-stack astrology consultation app built with MongoDB, Express, React, and Node.js.

## What Is Included

- React client with astrologer discovery, filters, booking, horoscope, kundli, compatibility, services, and testimonials.
- Role-based user and admin panels after sign-in.
- Customer and admin registration with hashed passwords.
- Express API with seeded data for immediate local use.
- Auth endpoints at `/api/auth/register` and `/api/auth/signin`.
- Server endpoints for user/admin panel summaries at `/api/panels/user` and `/api/panels/admin`.
- Optional MongoDB support through `MONGO_URI`.
- Single root command to run the client and server together.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## MongoDB

The API works without MongoDB by using seeded data. To use MongoDB, copy `.env.example` to `server/.env` or root `.env`, set `MONGO_URI`, and restart the server.

```env
PORT=5000
CLIENT_URL=http://127.0.0.1:5173
MONGO_URI=mongodb://127.0.0.1:27017/astrotalk_clone
```

Admin registration and sign-in use `ADMIN-2026` by default. Set `ADMIN_REGISTRATION_CODE`
or `ADMIN_CODE` in the environment to change it.
