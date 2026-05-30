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
  const { answered, answerText } = req.body as { answered?: boolean; answerText?: string };

  const existing = db
    .prepare("SELECT * FROM prayers WHERE id = ? AND user_id = ?")
    .get(id, userId) as DbPrayer | undefined;

  if (!existing) {
    return res.status(404).json({ error: "Prayer not found" });
  }

  db.prepare(
    "UPDATE prayers SET answered = ?, answer_text = ?, updated_at = unixepoch() WHERE id = ? AND user_id = ?"
  ).run(answered ? 1 : 0, answerText ?? null, id, userId);

  const updated = db.prepare("SELECT * FROM prayers WHERE id = ?").get(id) as DbPrayer;
  return res.json(parsePrayer(updated));
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
