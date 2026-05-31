import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";
import type { AuthRequest } from "../auth.js";
import type { DbPrayer } from "../db.js";

const router = Router();
router.use(requireAuth as any);

const FREE_TIER_PRAYER_LIMIT = 5;

function parsePrayer(row: DbPrayer) {
  return {
    id: row.id,
    text: row.text,
    categoryTags: JSON.parse(row.category_tags) as string[],
    answered: row.answered === 1,
    answerText: row.answer_text ?? undefined,
    shared: row.shared === 1,
    timestamp: new Date(row.created_at * 1000).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

router.get("/", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const rows = db
    .prepare("SELECT * FROM prayers WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as DbPrayer[];
  return res.json(rows.map(parsePrayer));
});

router.post("/", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const tier = req.user!.tier;
  const { text, categoryTags = [] } = req.body as { text?: string; categoryTags?: string[] };

  if (!text?.trim()) {
    return res.status(400).json({ error: "Prayer text is required" });
  }

  if (tier === "free") {
    const count = (
      db.prepare("SELECT COUNT(*) as n FROM prayers WHERE user_id = ?").get(userId) as { n: number }
    ).n;
    if (count >= FREE_TIER_PRAYER_LIMIT) {
      return res.status(403).json({
        error: "Free plan limit reached",
        upgradeRequired: true,
        limit: FREE_TIER_PRAYER_LIMIT,
      });
    }
  }

  const result = db
    .prepare("INSERT INTO prayers (user_id, text, category_tags) VALUES (?, ?, ?)")
    .run(userId, text.trim(), JSON.stringify(categoryTags));

  const row = db.prepare("SELECT * FROM prayers WHERE id = ?").get(result.lastInsertRowid) as DbPrayer;
  return res.status(201).json(parsePrayer(row));
});

router.patch("/:id", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { answered, answerText, shared } = req.body as { answered?: boolean; answerText?: string; shared?: boolean };

  const existing = db
    .prepare("SELECT * FROM prayers WHERE id = ? AND user_id = ?")
    .get(id, userId) as DbPrayer | undefined;

  if (!existing) {
    return res.status(404).json({ error: "Prayer not found" });
  }

  db.prepare(
    "UPDATE prayers SET answered = ?, answer_text = ?, shared = ?, updated_at = unixepoch() WHERE id = ? AND user_id = ?"
  ).run(answered ? 1 : 0, answerText ?? null, shared !== undefined ? (shared ? 1 : 0) : existing.shared, id, userId);

  const updated = db.prepare("SELECT * FROM prayers WHERE id = ?").get(id) as DbPrayer;
  return res.json(parsePrayer(updated));
});

// GET /prayers/:id/shares — get list of user_ids this prayer is shared with
router.get("/:id/shares", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const prayer = db.prepare("SELECT * FROM prayers WHERE id = ? AND user_id = ?").get(id, userId) as DbPrayer | undefined;
  if (!prayer) return res.status(404).json({ error: "Prayer not found" });
  const rows = db.prepare("SELECT shared_with_user_id FROM prayer_shares WHERE prayer_id = ?").all(id) as { shared_with_user_id: number }[];
  return res.json({ sharedWith: rows.map(r => r.shared_with_user_id) });
});

// PUT /prayers/:id/shares — replace share list; body: { sharedWith: number[] }
router.put("/:id/shares", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { sharedWith } = req.body as { sharedWith: number[] };

  const prayer = db.prepare("SELECT * FROM prayers WHERE id = ? AND user_id = ?").get(id, userId) as DbPrayer | undefined;
  if (!prayer) return res.status(404).json({ error: "Prayer not found" });

  // Verify all targets are accepted partners
  const validPartners = db.prepare(`
    SELECT CASE WHEN requester_id=? THEN partner_id ELSE requester_id END as pid
    FROM accountability_partners WHERE status='accepted' AND (requester_id=? OR partner_id=?)
  `).all(userId, userId, userId) as { pid: number }[];
  const validIds = new Set(validPartners.map(p => p.pid));
  const filtered = (sharedWith || []).filter(uid => validIds.has(uid));

  const shared = filtered.length > 0 ? 1 : 0;
  db.prepare("UPDATE prayers SET shared = ?, updated_at = unixepoch() WHERE id = ?").run(shared, id);
  db.prepare("DELETE FROM prayer_shares WHERE prayer_id = ?").run(id);
  for (const uid of filtered) {
    db.prepare("INSERT OR IGNORE INTO prayer_shares (prayer_id, shared_with_user_id) VALUES (?,?)").run(id, uid);
  }

  const updated = db.prepare("SELECT * FROM prayers WHERE id = ?").get(id) as DbPrayer;
  return res.json({ ...parsePrayer(updated), sharedWith: filtered });
});

// POST /prayers/:id/react — toggle "praying for" reaction
router.post("/:id/react", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const prayer = db.prepare("SELECT * FROM prayers WHERE id = ? AND shared = 1").get(id) as any;
  if (!prayer) return res.status(404).json({ error: "Not found" });
  const isCircle = db.prepare(`
    SELECT 1 FROM accountability_partners
    WHERE status = 'accepted' AND (
      (requester_id = ? AND partner_id = ?) OR (requester_id = ? AND partner_id = ?)
    )
  `).get(userId, prayer.user_id, prayer.user_id, userId);
  if (!isCircle && prayer.user_id !== userId) return res.status(403).json({ error: "Not in circle" });

  const existing = db.prepare("SELECT id FROM prayer_reactions WHERE prayer_id=? AND user_id=?").get(id, userId);
  if (existing) {
    db.prepare("DELETE FROM prayer_reactions WHERE prayer_id=? AND user_id=?").run(id, userId);
    return res.json({ reacted: false });
  } else {
    db.prepare("INSERT INTO prayer_reactions (prayer_id, user_id) VALUES (?,?)").run(id, userId);
    return res.json({ reacted: true });
  }
});

router.delete("/:id", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const result = db
    .prepare("DELETE FROM prayers WHERE id = ? AND user_id = ?")
    .run(id, userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Prayer not found" });
  }
  return res.status(204).end();
});

export default router;
