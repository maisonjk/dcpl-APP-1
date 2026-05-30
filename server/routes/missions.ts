import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";
import type { AuthRequest } from "../auth.js";
import type { DbMission } from "../db.js";

const router = Router();
router.use(requireAuth as any);

router.get("/", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const rows = db
    .prepare("SELECT id, status FROM missions WHERE user_id = ?")
    .all(userId) as DbMission[];
  const map: Record<string, string> = {};
  for (const r of rows) map[r.id] = r.status;
  return res.json(map);
});

router.put("/:id", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { status } = req.body as { status?: string };

  const validStatuses = ["idle", "active", "completed"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: "status must be idle, active, or completed" });
  }

  db.prepare(`
    INSERT INTO missions (id, user_id, status, updated_at)
    VALUES (?, ?, ?, unixepoch())
    ON CONFLICT (id, user_id) DO UPDATE SET status = excluded.status, updated_at = unixepoch()
  `).run(id, userId, status);

  return res.json({ id, status });
});

export default router;
