import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";
import { db } from "../db.js";
import { signToken } from "../auth.js";
import type { DbUser } from "../db.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const router = Router();

router.post("/register", (req, res) => {
  const { email, username, password } = req.body as {
    email?: string;
    username?: string;
    password?: string;
  };

  if (!email || !username || !password) {
    return res.status(400).json({ error: "email, username, and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists" });
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare("INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)")
    .run(email.toLowerCase(), username.trim(), hash);

  const userId = result.lastInsertRowid as number;
  db.prepare("INSERT OR IGNORE INTO progress (user_id) VALUES (?)").run(userId);

  const token = signToken({ userId, email: email.toLowerCase(), tier: "free" });
  return res.status(201).json({
    token,
    user: { id: userId, email: email.toLowerCase(), username: username.trim(), tier: "free" },
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as DbUser | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken({ userId: user.id, email: user.email, tier: user.tier });
  return res.json({
    token,
    user: { id: user.id, email: user.email, username: user.username, tier: user.tier },
  });
});

// ─── Password Reset ────────────────────────────────────────────────────────────
// Step 1: Request a reset token (returns token in dev; in prod you email it)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: "email is required" });

  const user = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email.toLowerCase()) as { id: number } | undefined;

  // Always return 200 to avoid leaking whether an email is registered
  if (!user) return res.json({ ok: true });

  // Invalidate old tokens for this user
  db.prepare("DELETE FROM password_reset_tokens WHERE user_id = ?").run(user.id);

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour

  db.prepare(
    "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)"
  ).run(user.id, token, expiresAt);

  const appUrl = process.env.ALLOWED_ORIGIN || "http://localhost:3000";
  const resetUrl = `${appUrl}/?reset_token=${token}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@dcpl.app";

  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: `DCPL <${fromEmail}>`,
        to: email.toLowerCase(),
        subject: "Reset your DCPL password",
        html: `
          <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; color: #1A1A1A;">
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">Reset your password</h1>
            <p style="font-size: 14px; color: #737373; margin-bottom: 32px;">
              Someone requested a password reset for your DCPL account. If this wasn't you, you can safely ignore this email.
            </p>
            <a href="${resetUrl}"
              style="display: inline-block; background: #1A1A1A; color: #ffffff; padding: 14px 28px;
                     font-family: sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase;
                     letter-spacing: 0.1em; text-decoration: none;">
              Reset Password
            </a>
            <p style="font-size: 12px; color: #a3a3a3; margin-top: 32px;">
              This link expires in 1 hour. If the button doesn't work, copy this URL into your browser:<br/>
              <span style="color: #737373;">${resetUrl}</span>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
            <p style="font-size: 11px; color: #a3a3a3;">DCPL · Discipleship Community Platform</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Resend email failed:", err);
      // Don't expose email errors to client — still return ok
    }
  }

  // In dev (no RESEND_API_KEY), return token directly for testing
  if (process.env.NODE_ENV !== "production") {
    return res.json({ ok: true, __dev_token: token });
  }

  return res.json({ ok: true });
});

// Step 2: Verify token and set new password
router.post("/reset-password", (req, res) => {
  const { token, password } = req.body as { token?: string; password?: string };

  if (!token || !password) {
    return res.status(400).json({ error: "token and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const now = Math.floor(Date.now() / 1000);
  const row = db
    .prepare(
      "SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > ?"
    )
    .get(token, now) as { id: number; user_id: number } | undefined;

  if (!row) {
    return res.status(400).json({ error: "Invalid or expired reset link" });
  }

  const hash = bcrypt.hashSync(password, 10);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, row.user_id);
  db.prepare("UPDATE password_reset_tokens SET used = 1 WHERE id = ?").run(row.id);

  return res.json({ ok: true });
});

export default router;
