import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { signToken } from "../auth.js";
import type { DbUser } from "../db.js";

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

export default router;
