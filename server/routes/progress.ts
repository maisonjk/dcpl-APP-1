import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";
import type { AuthRequest } from "../auth.js";
import type { DbProgress } from "../db.js";

const router = Router();
router.use(requireAuth as any);

function parseProgress(row: DbProgress) {
  return {
    currentStreak: row.current_streak,
    level: row.level,
    completedMissionsCount: row.completed_missions_count,
    checklist: {
      prayer: row.checklist_prayer === 1,
      word: row.checklist_word === 1,
      obedience: row.checklist_obedience === 1,
    },
    lastCheckinDate: row.last_checkin_date,
    activeVerseId: row.active_verse_id,
    pathRequirements: JSON.parse(row.path_requirements) as unknown[],
  };
}

router.get("/", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  db.prepare("INSERT OR IGNORE INTO progress (user_id) VALUES (?)").run(userId);
  const row = db.prepare("SELECT * FROM progress WHERE user_id = ?").get(userId) as DbProgress;
  return res.json(parseProgress(row));
});

router.put("/", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const {
    currentStreak,
    level,
    completedMissionsCount,
    checklist,
    lastCheckinDate,
    activeVerseId,
    pathRequirements,
  } = req.body as {
    currentStreak?: number;
    level?: number;
    completedMissionsCount?: number;
    checklist?: { prayer: boolean; word: boolean; obedience: boolean };
    lastCheckinDate?: string;
    activeVerseId?: string;
    pathRequirements?: unknown[];
  };

  db.prepare("INSERT OR IGNORE INTO progress (user_id) VALUES (?)").run(userId);

  db.prepare(`
    UPDATE progress SET
      current_streak = COALESCE(?, current_streak),
      level = COALESCE(?, level),
      completed_missions_count = COALESCE(?, completed_missions_count),
      checklist_prayer = COALESCE(?, checklist_prayer),
      checklist_word = COALESCE(?, checklist_word),
      checklist_obedience = COALESCE(?, checklist_obedience),
      last_checkin_date = COALESCE(?, last_checkin_date),
      active_verse_id = COALESCE(?, active_verse_id),
      path_requirements = COALESCE(?, path_requirements),
      updated_at = unixepoch()
    WHERE user_id = ?
  `).run(
    currentStreak ?? null,
    level ?? null,
    completedMissionsCount ?? null,
    checklist ? (checklist.prayer ? 1 : 0) : null,
    checklist ? (checklist.word ? 1 : 0) : null,
    checklist ? (checklist.obedience ? 1 : 0) : null,
    lastCheckinDate ?? null,
    activeVerseId ?? null,
    pathRequirements ? JSON.stringify(pathRequirements) : null,
    userId
  );

  const row = db.prepare("SELECT * FROM progress WHERE user_id = ?").get(userId) as DbProgress;
  return res.json(parseProgress(row));
});

export default router;
