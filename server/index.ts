import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import prayerRoutes from "./routes/prayers.js";
import missionRoutes from "./routes/missions.js";
import progressRoutes from "./routes/progress.js";
import stripeRoutes from "./routes/stripe.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Stripe webhook needs raw body — mount BEFORE json middleware
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/prayers", prayerRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/stripe", stripeRoutes);

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
