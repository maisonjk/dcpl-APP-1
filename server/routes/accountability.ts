import { Router } from "express";
import { db } from "../db";
import { requireAuth, AuthRequest } from "../auth";

const router = Router();
router.use(requireAuth as any);

// GET / — list accepted partners + pending invites sent to me
router.get("/", (req, res) => {
  const userId = (req as AuthRequest).user!.userId;

  const partners = db.prepare(`
    SELECT ap.id, ap.status, ap.requester_id, ap.partner_id, ap.created_at,
           u.username, u.email
    FROM accountability_partners ap
    JOIN users u ON (
      CASE WHEN ap.requester_id = ? THEN ap.partner_id ELSE ap.requester_id END = u.id
    )
    WHERE (ap.requester_id = ? OR ap.partner_id = ?)
    ORDER BY ap.created_at DESC
  `).all(userId, userId, userId) as any[];

  res.json(partners.map((p) => ({
    id: p.id,
    status: p.status,
    username: p.username,
    email: p.email,
    direction: p.requester_id === userId ? "sent" : "received",
    createdAt: p.created_at,
  })));
});

// POST / — send invite by username or email
router.post("/", (req, res) => {
  const userId = (req as AuthRequest).user!.userId;
  const { query } = req.body as { query: string };

  if (!query?.trim()) return res.status(400).json({ error: "Username or email required" });

  const target = db.prepare(
    "SELECT id, username, email FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)"
  ).get(query.trim(), query.trim()) as any;

  if (!target) return res.status(404).json({ error: "No user found with that username or email" });
  if (target.id === userId) return res.status(400).json({ error: "You can't add yourself" });

  const existing = db.prepare(
    "SELECT id, status FROM accountability_partners WHERE (requester_id = ? AND partner_id = ?) OR (requester_id = ? AND partner_id = ?)"
  ).get(userId, target.id, target.id, userId) as any;

  if (existing) {
    const msg = existing.status === "accepted" ? "Already in your circle" : "Invite already pending";
    return res.status(409).json({ error: msg });
  }

  const result = db.prepare(
    "INSERT INTO accountability_partners (requester_id, partner_id) VALUES (?, ?)"
  ).run(userId, target.id);

  res.status(201).json({
    id: result.lastInsertRowid,
    status: "pending",
    username: target.username,
    email: target.email,
    direction: "sent",
  });
});

// PATCH /:id/accept — accept a received invite
router.patch("/:id/accept", (req, res) => {
  const userId = (req as AuthRequest).user!.userId;
  const { id } = req.params;

  const invite = db.prepare(
    "SELECT * FROM accountability_partners WHERE id = ? AND partner_id = ? AND status = 'pending'"
  ).get(id, userId) as any;

  if (!invite) return res.status(404).json({ error: "Invite not found" });

  db.prepare("UPDATE accountability_partners SET status = 'accepted' WHERE id = ?").run(id);
  res.json({ ok: true });
});

// DELETE /:id — decline invite or remove partner
router.delete("/:id", (req, res) => {
  const userId = (req as AuthRequest).user!.userId;
  const { id } = req.params;

  const row = db.prepare(
    "SELECT * FROM accountability_partners WHERE id = ? AND (requester_id = ? OR partner_id = ?)"
  ).get(id, userId, userId);

  if (!row) return res.status(404).json({ error: "Not found" });

  db.prepare("DELETE FROM accountability_partners WHERE id = ?").run(id);
  res.status(204).end();
});

// GET /accountability/feed — shared prayers from circle members
router.get("/feed", (req, res) => {
  const userId = (req as AuthRequest).user!.userId;

  const partnerRows = db.prepare(`
    SELECT CASE WHEN requester_id=? THEN partner_id ELSE requester_id END as pid
    FROM accountability_partners WHERE status='accepted' AND (requester_id=? OR partner_id=?)
  `).all(userId, userId, userId) as {pid: number}[];

  const partnerIds = partnerRows.map(r => r.pid);
  if (partnerIds.length === 0) return res.json([]);

  const placeholders = partnerIds.map(() => '?').join(',');
  const prayers = db.prepare(`
    SELECT p.*, u.username,
      (SELECT COUNT(*) FROM prayer_reactions WHERE prayer_id=p.id) as reaction_count,
      (SELECT COUNT(*) FROM prayer_reactions WHERE prayer_id=p.id AND user_id=?) as i_reacted
    FROM prayers p
    JOIN users u ON u.id = p.user_id
    WHERE p.user_id IN (${placeholders}) AND (p.shared = 1 OR EXISTS(
      SELECT 1 FROM prayer_shares ps WHERE ps.prayer_id = p.id AND ps.shared_with_user_id = ?
    ))
    ORDER BY p.created_at DESC
    LIMIT 20
  `).all(userId, ...partnerIds, userId) as any[];

  res.json(prayers.map(p => ({
    id: p.id,
    text: p.text,
    username: p.username,
    answered: p.answered === 1,
    reactionCount: p.reaction_count,
    iReacted: p.i_reacted > 0,
    timestamp: new Date(p.created_at * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  })));
});

// GET /accountability/checkins — partners' checklist status for today
router.get("/checkins", (req, res) => {
  const userId = (req as AuthRequest).user!.userId;
  const today = new Date().toISOString().split("T")[0];

  const partnerRows = db.prepare(`
    SELECT CASE WHEN requester_id=? THEN partner_id ELSE requester_id END as pid
    FROM accountability_partners WHERE status='accepted' AND (requester_id=? OR partner_id=?)
  `).all(userId, userId, userId) as {pid: number}[];

  if (partnerRows.length === 0) return res.json([]);
  const partnerIds = partnerRows.map(r => r.pid);
  const placeholders = partnerIds.map(() => '?').join(',');

  const rows = db.prepare(`
    SELECT u.username, u.id,
      pr.checklist_prayer, pr.checklist_word, pr.checklist_obedience,
      pr.current_streak, pr.last_checkin_date
    FROM users u
    LEFT JOIN progress pr ON pr.user_id = u.id
    WHERE u.id IN (${placeholders})
  `).all(...partnerIds) as any[];

  res.json(rows.map(r => ({
    userId: r.id,
    username: r.username,
    streak: r.current_streak ?? 0,
    checkedInToday: r.last_checkin_date === today,
    checklist: {
      prayer: r.checklist_prayer === 1,
      word: r.checklist_word === 1,
      obedience: r.checklist_obedience === 1,
    },
  })));
});

// POST /accountability/encourage/:partnerId — send encouragement
router.post("/encourage/:partnerId", (req, res) => {
  const userId = (req as AuthRequest).user!.userId;
  const { partnerId } = req.params;

  const isCircle = db.prepare(`
    SELECT 1 FROM accountability_partners
    WHERE status='accepted' AND (
      (requester_id=? AND partner_id=?) OR (requester_id=? AND partner_id=?)
    )
  `).get(userId, partnerId, partnerId, userId);
  if (!isCircle) return res.status(403).json({ error: "Not in circle" });

  db.prepare("INSERT INTO encouragements (sender_id, receiver_id) VALUES (?,?)").run(userId, partnerId);
  res.status(201).json({ ok: true });
});

// GET /accountability/encouragements — get encouragements received (last 24h)
router.get("/encouragements", (req, res) => {
  const userId = (req as AuthRequest).user!.userId;
  const since = Math.floor(Date.now() / 1000) - 86400;

  const rows = db.prepare(`
    SELECT e.id, e.created_at, u.username
    FROM encouragements e
    JOIN users u ON u.id = e.sender_id
    WHERE e.receiver_id = ? AND e.created_at > ?
    ORDER BY e.created_at DESC
  `).all(userId, since) as any[];

  res.json(rows.map(r => ({
    id: r.id,
    username: r.username,
    timestamp: new Date(r.created_at * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  })));
});

export default router;
