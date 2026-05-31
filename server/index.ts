import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import prayerRoutes from "./routes/prayers.js";
import missionRoutes from "./routes/missions.js";
import progressRoutes from "./routes/progress.js";
import stripeRoutes from "./routes/stripe.js";
import accountabilityRoutes from "./routes/accountability.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// CORS — locked to configured origin in production, open in dev
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? allowedOrigin : true,
  credentials: true,
}));

// Auth rate limit — max 20 attempts per 15 min per IP (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit — 300 req per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  message: { error: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stripe webhook needs raw body — must be mounted BEFORE express.json()
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

// Apply rate limiters
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/prayers", prayerRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/accountability", accountabilityRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

app.listen(PORT, () => {
  console.log(`DCPL server running on http://localhost:${PORT}`);
});
