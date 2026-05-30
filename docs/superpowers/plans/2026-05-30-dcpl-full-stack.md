# DCPL Sanctuary Full-Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the DCPL Sanctuary frontend-only app into a fully functional full-stack application with Express/SQLite backend, JWT auth, cloud data sync, and Stripe-powered subscription monetization.

**Architecture:** Express REST API with SQLite (better-sqlite3) stores users, prayers, missions, and progress server-side; the React frontend replaces localStorage with API calls; a new Pricing page drives Stripe Checkout for three subscription tiers.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind 4, Express 4, better-sqlite3, jsonwebtoken, bcryptjs, Stripe Node SDK, stripe-js

---

## File Map

### New files (backend)
- `server/index.ts` — Express app entry point, middleware, route registration
- `server/db.ts` — SQLite connection, schema creation, migration
- `server/auth.ts` — JWT helpers (sign, verify, middleware)
- `server/routes/auth.ts` — POST /api/auth/register, POST /api/auth/login
- `server/routes/prayers.ts` — CRUD /api/prayers
- `server/routes/missions.ts` — CRUD /api/missions
- `server/routes/progress.ts` — GET/PUT /api/progress (streak, checklist, level)
- `server/routes/stripe.ts` — POST /api/stripe/checkout, POST /api/stripe/webhook, GET /api/stripe/portal

### New files (frontend)
- `src/api.ts` — typed fetch wrapper with JWT header injection
- `src/auth/AuthContext.tsx` — React context: user, token, login, logout, plan tier
- `src/auth/LoginModal.tsx` — email/password login + signup form modal
- `src/components/PricingView.tsx` — full pricing page with 3 tiers + Stripe Checkout redirect
- `src/components/UpgradePrompt.tsx` — inline gate shown when free user hits a paywalled feature

### Modified files
- `package.json` — add better-sqlite3, jsonwebtoken, bcryptjs, stripe, @stripe/stripe-js; remove @google/genai
- `vite.config.ts` — add proxy `/api` → `localhost:3001` for dev
- `src/App.tsx` — wrap in AuthProvider, add Pricing tab, gate paywalled features
- `src/components/HomeView.tsx` — replace localStorage reads with API calls; remove Google CDN avatar
- `src/components/PrayerView.tsx` — replace localStorage with API calls; gate prayer count for free tier
- `src/components/MissionView.tsx` — replace localStorage with API calls; gate missions for free tier
- `src/components/PathView.tsx` — replace localStorage with API calls
- `src/data.ts` — remove avatar URL
- `src/types.ts` — add User, AuthState, SubscriptionTier types
- `.env.example` — document all env vars

---

## Task 1: Clean up dependencies and types

**Files:**
- Modify: `package.json`
- Modify: `src/types.ts`
- Modify: `src/data.ts`
- Create: `.env.example`

- [ ] **Step 1: Remove AI dependency, add backend deps**

In `/Users/jik/dcpl/package.json`, replace the `"dependencies"` block with:

```json
"dependencies": {
  "@stripe/stripe-js": "^4.0.0",
  "@tailwindcss/vite": "^4.1.14",
  "@vitejs/plugin-react": "^5.0.4",
  "better-sqlite3": "^9.4.3",
  "bcryptjs": "^2.4.3",
  "dotenv": "^17.2.3",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "lucide-react": "^0.546.0",
  "motion": "^12.23.24",
  "react": "^19.0.1",
  "react-dom": "^19.0.1",
  "recharts": "^3.8.1",
  "stripe": "^16.0.0",
  "vite": "^6.2.3"
}
```

And replace `"devDependencies"` with:

```json
"devDependencies": {
  "@types/bcryptjs": "^2.4.6",
  "@types/better-sqlite3": "^7.6.8",
  "@types/express": "^4.17.21",
  "@types/jsonwebtoken": "^9.0.6",
  "@types/node": "^22.14.0",
  "autoprefixer": "^10.4.21",
  "esbuild": "^0.25.0",
  "tailwindcss": "^4.1.14",
  "tsx": "^4.21.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.3"
}
```

Also add to `"scripts"`:
```json
"server": "tsx watch server/index.ts",
"server:prod": "tsx server/index.ts"
```

- [ ] **Step 2: Add new types to `src/types.ts`**

Append to the end of `/Users/jik/dcpl/src/types.ts`:

```typescript
export type SubscriptionTier = "free" | "disciple_plus" | "church_leader";

export interface User {
  id: number;
  email: string;
  username: string;
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
```

- [ ] **Step 3: Remove Google CDN avatar from `src/data.ts`**

In `/Users/jik/dcpl/src/data.ts`, change the `avatarUrl` in `DEFAULT_USER_STATS`:

```typescript
export const DEFAULT_USER_STATS: UserStats = {
  username: "Seeker",
  avatarUrl: "",
  completedMissionsCount: 0,
  currentStreak: 0,
  level: 1,
  checklist: {
    prayer: false,
    word: false,
    obedience: false,
  },
};
```

- [ ] **Step 4: Create `.env.example`**

Create `/Users/jik/dcpl/.env.example`:

```bash
# Server
PORT=3001
JWT_SECRET=change_this_to_a_random_32_char_string
NODE_ENV=development

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_DISCIPLE_MONTHLY=price_...
STRIPE_PRICE_DISCIPLE_YEARLY=price_...
STRIPE_PRICE_CHURCH_MONTHLY=price_...
STRIPE_PRICE_CHURCH_YEARLY=price_...

# Frontend (Vite exposes VITE_ prefixed vars)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001
```

- [ ] **Step 5: Install dependencies**

```bash
cd /Users/jik/dcpl && npm install
```

Expected: clean install, no errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/jik/dcpl && git add -A && git commit -m "chore: swap AI deps for backend stack, add types"
```

---

## Task 2: Build the database layer

**Files:**
- Create: `server/db.ts`

- [ ] **Step 1: Create `server/db.ts`**

Create `/Users/jik/dcpl/server/db.ts`:

```typescript
import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data.db");

export const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    tier TEXT NOT NULL DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS prayers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    category_tags TEXT NOT NULL DEFAULT '[]',
    answered INTEGER NOT NULL DEFAULT 0,
    answer_text TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS missions (
    id TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'idle',
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    PRIMARY KEY (id, user_id)
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    completed_missions_count INTEGER NOT NULL DEFAULT 0,
    checklist_prayer INTEGER NOT NULL DEFAULT 0,
    checklist_word INTEGER NOT NULL DEFAULT 0,
    checklist_obedience INTEGER NOT NULL DEFAULT 0,
    last_checkin_date TEXT,
    active_verse_id TEXT NOT NULL DEFAULT 'v1',
    path_requirements TEXT NOT NULL DEFAULT '[]',
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

export type DbUser = {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  tier: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: number;
};

export type DbProgress = {
  user_id: number;
  current_streak: number;
  level: number;
  completed_missions_count: number;
  checklist_prayer: number;
  checklist_word: number;
  checklist_obedience: number;
  last_checkin_date: string | null;
  active_verse_id: string;
  path_requirements: string;
  updated_at: number;
};

export type DbPrayer = {
  id: number;
  user_id: number;
  text: string;
  category_tags: string;
  answered: number;
  answer_text: string | null;
  created_at: number;
  updated_at: number;
};

export type DbMission = {
  id: string;
  user_id: number;
  status: string;
  updated_at: number;
};
```

- [ ] **Step 2: Verify DB creates without error**

```bash
cd /Users/jik/dcpl && node -e "require('./server/db.ts')" 2>&1 || npx tsx -e "import './server/db.ts'; console.log('DB OK')"
```

Expected: `DB OK` and a `data.db` file appears.

- [ ] **Step 3: Commit**

```bash
cd /Users/jik/dcpl && git add server/db.ts && git commit -m "feat: sqlite schema with users, prayers, missions, progress"
```

---

## Task 3: Auth helpers and middleware

**Files:**
- Create: `server/auth.ts`

- [ ] **Step 1: Create `server/auth.ts`**

Create `/Users/jik/dcpl/server/auth.ts`:

```typescript
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_in_prod";

export interface JwtPayload {
  userId: number;
  email: string;
  tier: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jik/dcpl && git add server/auth.ts && git commit -m "feat: JWT sign/verify + requireAuth middleware"
```

---

## Task 4: Auth routes (register + login)

**Files:**
- Create: `server/routes/auth.ts`

- [ ] **Step 1: Create `server/routes/auth.ts`**

Create `/Users/jik/dcpl/server/routes/auth.ts`:

```typescript
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

  // Create default progress row
  db.prepare(`
    INSERT OR IGNORE INTO progress (user_id) VALUES (?)
  `).run(userId);

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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jik/dcpl && git add server/routes/auth.ts && git commit -m "feat: register + login routes with bcrypt"
```

---

## Task 5: Prayers API routes

**Files:**
- Create: `server/routes/prayers.ts`

- [ ] **Step 1: Create `server/routes/prayers.ts`**

Create `/Users/jik/dcpl/server/routes/prayers.ts`:

```typescript
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

// GET /api/prayers
router.get("/", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const rows = db
    .prepare("SELECT * FROM prayers WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as DbPrayer[];
  return res.json(rows.map(parsePrayer));
});

// POST /api/prayers
router.post("/", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const tier = req.user!.tier;
  const { text, categoryTags = [] } = req.body as { text?: string; categoryTags?: string[] };

  if (!text?.trim()) {
    return res.status(400).json({ error: "Prayer text is required" });
  }

  if (tier === "free") {
    const count = (
      db.prepare("SELECT COUNT(*) as n FROM prayers WHERE user_id = ?").get(userId) as {
        n: number;
      }
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
    .prepare(
      "INSERT INTO prayers (user_id, text, category_tags) VALUES (?, ?, ?)"
    )
    .run(userId, text.trim(), JSON.stringify(categoryTags));

  const row = db
    .prepare("SELECT * FROM prayers WHERE id = ?")
    .get(result.lastInsertRowid) as DbPrayer;
  return res.status(201).json(parsePrayer(row));
});

// PATCH /api/prayers/:id
router.patch("/:id", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { answered, answerText } = req.body as {
    answered?: boolean;
    answerText?: string;
  };

  const existing = db
    .prepare("SELECT * FROM prayers WHERE id = ? AND user_id = ?")
    .get(id, userId) as DbPrayer | undefined;

  if (!existing) {
    return res.status(404).json({ error: "Prayer not found" });
  }

  db.prepare(
    "UPDATE prayers SET answered = ?, answer_text = ?, updated_at = unixepoch() WHERE id = ? AND user_id = ?"
  ).run(answered ? 1 : 0, answerText ?? null, id, userId);

  const updated = db
    .prepare("SELECT * FROM prayers WHERE id = ?")
    .get(id) as DbPrayer;
  return res.json(parsePrayer(updated));
});

// DELETE /api/prayers/:id
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jik/dcpl && git add server/routes/prayers.ts && git commit -m "feat: prayers CRUD API with free-tier limit"
```

---

## Task 6: Missions and Progress API routes

**Files:**
- Create: `server/routes/missions.ts`
- Create: `server/routes/progress.ts`

- [ ] **Step 1: Create `server/routes/missions.ts`**

Create `/Users/jik/dcpl/server/routes/missions.ts`:

```typescript
import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";
import type { AuthRequest } from "../auth.js";
import type { DbMission } from "../db.js";

const router = Router();
router.use(requireAuth as any);

// GET /api/missions — returns status map { [missionId]: status }
router.get("/", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const rows = db
    .prepare("SELECT id, status FROM missions WHERE user_id = ?")
    .all(userId) as DbMission[];
  const map: Record<string, string> = {};
  for (const r of rows) map[r.id] = r.status;
  return res.json(map);
});

// PUT /api/missions/:id
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
```

- [ ] **Step 2: Create `server/routes/progress.ts`**

Create `/Users/jik/dcpl/server/routes/progress.ts`:

```typescript
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

// GET /api/progress
router.get("/", (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  db.prepare("INSERT OR IGNORE INTO progress (user_id) VALUES (?)").run(userId);
  const row = db.prepare("SELECT * FROM progress WHERE user_id = ?").get(userId) as DbProgress;
  return res.json(parseProgress(row));
});

// PUT /api/progress
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
```

- [ ] **Step 3: Commit**

```bash
cd /Users/jik/dcpl && git add server/routes/missions.ts server/routes/progress.ts && git commit -m "feat: missions status API and progress sync API"
```

---

## Task 7: Stripe routes

**Files:**
- Create: `server/routes/stripe.ts`

- [ ] **Step 1: Create `server/routes/stripe.ts`**

Create `/Users/jik/dcpl/server/routes/stripe.ts`:

```typescript
import { Router, raw } from "express";
import Stripe from "stripe";
import { db } from "../db.js";
import { requireAuth } from "../auth.js";
import type { AuthRequest } from "../auth.js";
import type { DbUser } from "../db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

const router = Router();

const PRICE_IDS: Record<string, string> = {
  disciple_monthly: process.env.STRIPE_PRICE_DISCIPLE_MONTHLY || "",
  disciple_yearly: process.env.STRIPE_PRICE_DISCIPLE_YEARLY || "",
  church_monthly: process.env.STRIPE_PRICE_CHURCH_MONTHLY || "",
  church_yearly: process.env.STRIPE_PRICE_CHURCH_YEARLY || "",
};

const TIER_BY_PRICE: Record<string, string> = {
  [PRICE_IDS.disciple_monthly]: "disciple_plus",
  [PRICE_IDS.disciple_yearly]: "disciple_plus",
  [PRICE_IDS.church_monthly]: "church_leader",
  [PRICE_IDS.church_yearly]: "church_leader",
};

// POST /api/stripe/checkout
router.post("/checkout", requireAuth as any, async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { priceId } = req.body as { priceId?: string };

  if (!priceId || !Object.values(PRICE_IDS).includes(priceId)) {
    return res.status(400).json({ error: "Invalid price ID" });
  }

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as DbUser;

  let customerId = user.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.username,
      metadata: { userId: String(user.id) },
    });
    customerId = customer.id;
    db.prepare("UPDATE users SET stripe_customer_id = ? WHERE id = ?").run(customerId, userId);
  }

  const origin = req.headers.origin || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancel`,
    metadata: { userId: String(userId) },
  });

  return res.json({ url: session.url });
});

// POST /api/stripe/portal
router.post("/portal", requireAuth as any, async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as DbUser;

  if (!user.stripe_customer_id) {
    return res.status(400).json({ error: "No billing account found" });
  }

  const origin = req.headers.origin || "http://localhost:3000";
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${origin}/`,
  });

  return res.json({ url: session.url });
});

// POST /api/stripe/webhook  — raw body required for signature verification
router.post(
  "/webhook",
  raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      return res.status(400).json({ error: "Webhook signature verification failed" });
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price.id || "";
      const tier = TIER_BY_PRICE[priceId] || "free";
      const customerId = subscription.customer as string;

      db.prepare(
        "UPDATE users SET tier = ?, stripe_subscription_id = ? WHERE stripe_customer_id = ?"
      ).run(tier, subscription.id, customerId);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      db.prepare(
        "UPDATE users SET tier = 'free', stripe_subscription_id = NULL WHERE stripe_customer_id = ?"
      ).run(customerId);
    }

    return res.json({ received: true });
  }
);

export default router;
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jik/dcpl && git add server/routes/stripe.ts && git commit -m "feat: stripe checkout, portal, and webhook routes"
```

---

## Task 8: Express server entry point

**Files:**
- Create: `server/index.ts`

- [ ] **Step 1: Create `server/index.ts`**

Create `/Users/jik/dcpl/server/index.ts`:

```typescript
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

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Serve built frontend in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

app.listen(PORT, () => {
  console.log(`DCPL server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 2: Add `cors` package**

```bash
cd /Users/jik/dcpl && npm install cors @types/cors
```

- [ ] **Step 3: Test server boots**

```bash
cd /Users/jik/dcpl && JWT_SECRET=test STRIPE_SECRET_KEY=sk_test_placeholder npx tsx server/index.ts &
sleep 2 && curl -s http://localhost:3001/api/health && kill %1
```

Expected: `{"ok":true}`

- [ ] **Step 4: Commit**

```bash
cd /Users/jik/dcpl && git add server/index.ts && git commit -m "feat: express server entry point, all routes wired"
```

---

## Task 9: Vite dev proxy

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Update `vite.config.ts`**

Replace the contents of `/Users/jik/dcpl/vite.config.ts` with:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jik/dcpl && git add vite.config.ts && git commit -m "chore: vite proxy /api to express server"
```

---

## Task 10: Frontend API client

**Files:**
- Create: `src/api.ts`

- [ ] **Step 1: Create `src/api.ts`**

Create `/Users/jik/dcpl/src/api.ts`:

```typescript
const BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("dcpl_token");
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || "Request failed"), { data });
  return data as T;
}

export const api = {
  auth: {
    register: (email: string, username: string, password: string) =>
      request<{ token: string; user: { id: number; email: string; username: string; tier: string } }>(
        "POST", "/auth/register", { email, username, password }
      ),
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: number; email: string; username: string; tier: string } }>(
        "POST", "/auth/login", { email, password }
      ),
  },
  prayers: {
    list: () => request<Prayer[]>("GET", "/prayers"),
    create: (text: string, categoryTags: string[]) =>
      request<Prayer>("POST", "/prayers", { text, categoryTags }),
    update: (id: number, answered: boolean, answerText?: string) =>
      request<Prayer>("PATCH", `/prayers/${id}`, { answered, answerText }),
    delete: (id: number) => request<void>("DELETE", `/prayers/${id}`),
  },
  missions: {
    list: () => request<Record<string, string>>("GET", "/missions"),
    update: (id: string, status: string) =>
      request<{ id: string; status: string }>("PUT", `/missions/${id}`, { status }),
  },
  progress: {
    get: () => request<ProgressData>("GET", "/progress"),
    update: (data: Partial<ProgressData>) => request<ProgressData>("PUT", "/progress", data),
  },
  stripe: {
    checkout: (priceId: string) =>
      request<{ url: string }>("POST", "/stripe/checkout", { priceId }),
    portal: () => request<{ url: string }>("POST", "/stripe/portal"),
  },
};

// Local types matching the server response shapes
export interface Prayer {
  id: number;
  text: string;
  categoryTags: string[];
  answered: boolean;
  answerText?: string;
  timestamp: string;
}

export interface ProgressData {
  currentStreak: number;
  level: number;
  completedMissionsCount: number;
  checklist: { prayer: boolean; word: boolean; obedience: boolean };
  lastCheckinDate: string | null;
  activeVerseId: string;
  pathRequirements: unknown[];
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jik/dcpl && git add src/api.ts && git commit -m "feat: typed API client with JWT auth header"
```

---

## Task 11: Auth context and login modal

**Files:**
- Create: `src/auth/AuthContext.tsx`
- Create: `src/auth/LoginModal.tsx`

- [ ] **Step 1: Create `src/auth/AuthContext.tsx`**

Create `/Users/jik/dcpl/src/auth/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import type { User, SubscriptionTier } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  tier: SubscriptionTier;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isAtLeast: (required: SubscriptionTier) => boolean;
}

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  disciple_plus: 1,
  church_leader: 2,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("dcpl_token");
    const storedUser = localStorage.getItem("dcpl_user");
    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const persist = (tok: string, u: User) => {
    localStorage.setItem("dcpl_token", tok);
    localStorage.setItem("dcpl_user", JSON.stringify(u));
    setToken(tok);
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.auth.login(email, password);
    persist(result.token, result.user as User);
  }, []);

  const register = useCallback(async (email: string, username: string, password: string) => {
    const result = await api.auth.register(email, username, password);
    persist(result.token, result.user as User);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dcpl_token");
    localStorage.removeItem("dcpl_user");
    setToken(null);
    setUser(null);
  }, []);

  const tier: SubscriptionTier = (user?.tier as SubscriptionTier) || "free";

  const isAtLeast = useCallback(
    (required: SubscriptionTier) => TIER_RANK[tier] >= TIER_RANK[required],
    [tier]
  );

  return (
    <AuthContext.Provider value={{ user, token, isLoading, tier, login, register, logout, isAtLeast }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
```

- [ ] **Step 2: Create `src/auth/LoginModal.tsx`**

Create `/Users/jik/dcpl/src/auth/LoginModal.tsx`:

```typescript
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

interface LoginModalProps {
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function LoginModal({ onClose, initialMode = "login" }: LoginModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, username, password);
      }
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-neutral-50 border border-[#1A1A1A] py-2.5 pl-10 pr-4 text-sm focus:outline-none rounded-none text-[#1A1A1A]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 w-full max-w-md relative z-10 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]"
      >
        <div className="flex justify-between items-center mb-6 border-b border-[#1A1A1A] pb-3">
          <h3 className="font-serif text-xl font-bold text-[#1A1A1A] italic">
            {mode === "login" ? "Welcome Back" : "Join the Sanctuary"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-[#1A1A1A] flex items-center justify-center hover:bg-neutral-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          )}

          <div className="relative">
            <span className="absolute left-3 top-3 text-neutral-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-3 text-neutral-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              placeholder={mode === "register" ? "Password (8+ characters)" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
              minLength={mode === "register" ? 8 : undefined}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A1A1A] text-white py-3 text-xs uppercase font-bold tracking-widest hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {isSubmitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-4">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
            className="font-bold text-[#1A1A1A] underline"
          >
            {mode === "login" ? "Create a free account" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/jik/dcpl && git add src/auth/ && git commit -m "feat: auth context + login/register modal"
```

---

## Task 12: Pricing view

**Files:**
- Create: `src/components/PricingView.tsx`

- [ ] **Step 1: Create `src/components/PricingView.tsx`**

Create `/Users/jik/dcpl/src/components/PricingView.tsx`:

```typescript
import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, Zap, Church, HandHeart, Loader2 } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";

const PRICE_IDS = {
  disciple_monthly: import.meta.env.VITE_STRIPE_PRICE_DISCIPLE_MONTHLY || "",
  disciple_yearly: import.meta.env.VITE_STRIPE_PRICE_DISCIPLE_YEARLY || "",
  church_monthly: import.meta.env.VITE_STRIPE_PRICE_CHURCH_MONTHLY || "",
  church_yearly: import.meta.env.VITE_STRIPE_PRICE_CHURCH_YEARLY || "",
};

interface PricingViewProps {
  onSignUpRequired: () => void;
}

export default function PricingView({ onSignUpRequired }: PricingViewProps) {
  const { user, tier, isAtLeast } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planKey: "disciple" | "church") => {
    if (!user) {
      onSignUpRequired();
      return;
    }
    const priceId =
      billing === "monthly"
        ? PRICE_IDS[`${planKey}_monthly`]
        : PRICE_IDS[`${planKey}_yearly`];

    if (!priceId) {
      alert("Stripe price IDs not configured. Add them to your .env file.");
      return;
    }

    setLoading(planKey);
    try {
      const { url } = await api.stripe.checkout(priceId);
      if (url) window.location.href = url;
    } catch {
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setLoading("portal");
    try {
      const { url } = await api.stripe.portal();
      if (url) window.location.href = url;
    } catch {
      alert("Unable to open billing portal.");
    } finally {
      setLoading(null);
    }
  };

  const freePlan = {
    name: "Free",
    icon: <HandHeart className="w-5 h-5" />,
    price: { monthly: "$0", yearly: "$0" },
    tagline: "Begin your discipleship journey",
    features: [
      "Daily Bible verse",
      "Basic Bible study",
      "Prayer journal (5 prayers)",
      "30-day discipleship path",
      "1 accountability partner",
      "Basic reminders",
    ],
    cta: "Current Plan",
    tierKey: "free" as const,
    popular: false,
  };

  const disciplePlan = {
    name: "Disciple Plus",
    icon: <Zap className="w-5 h-5" />,
    price: { monthly: "$7.99", yearly: "$79" },
    tagline: "Deepen your faith, grow together",
    features: [
      "Everything in Free",
      "Unlimited Bible study tracks",
      "Accountability circles (up to 5)",
      "AI scripture reflections",
      "Mission challenges",
      "Premium devotionals",
      "Prayer groups",
      "Growth insights",
    ],
    cta: "Start Disciple Plus",
    tierKey: "disciple_plus" as const,
    popular: true,
  };

  const churchPlan = {
    name: "Church & Leader",
    icon: <Church className="w-5 h-5" />,
    price: { monthly: "$49", yearly: "$499" },
    tagline: "Lead your congregation forward",
    features: [
      "Everything in Disciple Plus",
      "Church dashboard",
      "Up to 100 members",
      "Group discipleship tracking",
      "Leader tools",
      "Custom reading plans",
      "Prayer request management",
      "Church branding",
      "Engagement analytics",
    ],
    cta: "Start Church Plan",
    tierKey: "church_leader" as const,
    popular: false,
  };

  const plans = [freePlan, disciplePlan, churchPlan];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[900px] mx-auto space-y-10 pb-28 text-left"
    >
      {/* Header */}
      <div className="border-l-4 border-[#1A1A1A] pl-5 space-y-1.5">
        <span className="font-sans text-[11px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold block">
          Membership Plans
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">
          Invest in Your Spiritual Growth
        </h2>
        <p className="text-sm text-neutral-500 max-w-lg font-sans leading-relaxed">
          Start free, upgrade when you're ready to go deeper. Cancel anytime.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-4">
        <div className="flex border border-[#1A1A1A] bg-white p-1 w-fit">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
              billing === "monthly" ? "bg-[#1A1A1A] text-white" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
              billing === "yearly" ? "bg-[#1A1A1A] text-white" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Yearly
            <span className="ml-1.5 text-[8px] bg-green-600 text-white px-1.5 py-0.5 font-bold">
              SAVE 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = tier === plan.tierKey;
          const isOwned = isAtLeast(plan.tierKey);

          return (
            <div
              key={plan.tierKey}
              className={`flex flex-col border-2 bg-white p-6 relative ${
                plan.popular
                  ? "border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]"
                  : "border-neutral-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#1A1A1A]">{plan.icon}</span>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">{plan.name}</h3>
              </div>

              <div className="mb-1">
                <span className="font-serif text-3xl font-bold text-[#1A1A1A]">
                  {plan.price[billing]}
                </span>
                <span className="text-neutral-400 text-xs font-sans ml-1">
                  /{billing === "monthly" ? "mo" : "yr"}
                </span>
              </div>

              <p className="text-xs text-neutral-500 font-sans mb-5 leading-relaxed">
                {plan.tagline}
              </p>

              <ul className="space-y-2 mb-6 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-neutral-700 font-sans">
                    <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.tierKey === "free" ? (
                <div className="w-full border border-[#1A1A1A] py-3 text-[10px] uppercase font-bold tracking-widest text-center text-neutral-500">
                  {isCurrent ? "Your current plan" : "Free forever"}
                </div>
              ) : isCurrent ? (
                <button
                  onClick={handleManageBilling}
                  disabled={loading === "portal"}
                  className="w-full border border-[#1A1A1A] hover:bg-neutral-50 py-3 text-[10px] uppercase font-bold tracking-widest text-center transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading === "portal" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Manage Billing
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleSubscribe(plan.tierKey === "disciple_plus" ? "disciple" : "church")
                  }
                  disabled={!!loading}
                  className={`w-full py-3 text-[10px] uppercase font-bold tracking-widest text-center transition disabled:opacity-50 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-[#1A1A1A] text-white hover:bg-neutral-800"
                      : "border border-[#1A1A1A] hover:bg-neutral-50 text-[#1A1A1A]"
                  }`}
                >
                  {loading === (plan.tierKey === "disciple_plus" ? "disciple" : "church") && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center text-[11px] text-neutral-400 font-sans">
        Secure payments via Stripe · Cancel anytime · No hidden fees
      </p>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jik/dcpl && git add src/components/PricingView.tsx && git commit -m "feat: pricing page with 3 tiers and Stripe checkout"
```

---

## Task 13: UpgradePrompt component

**Files:**
- Create: `src/components/UpgradePrompt.tsx`

- [ ] **Step 1: Create `src/components/UpgradePrompt.tsx`**

Create `/Users/jik/dcpl/src/components/UpgradePrompt.tsx`:

```typescript
import React from "react";
import { Zap } from "lucide-react";

interface UpgradePromptProps {
  message: string;
  onUpgrade: () => void;
}

export default function UpgradePrompt({ message, onUpgrade }: UpgradePromptProps) {
  return (
    <div className="border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center space-y-3">
      <Zap className="w-6 h-6 text-neutral-400 mx-auto" />
      <p className="text-sm text-neutral-600 font-sans">{message}</p>
      <button
        onClick={onUpgrade}
        className="bg-[#1A1A1A] text-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-neutral-800 transition"
      >
        Upgrade Plan
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jik/dcpl && git add src/components/UpgradePrompt.tsx && git commit -m "feat: upgrade prompt component for gated features"
```

---

## Task 14: Wire PrayerView to API

**Files:**
- Modify: `src/components/PrayerView.tsx`

- [ ] **Step 1: Replace `src/components/PrayerView.tsx` with API-backed version**

Read the current file first to understand all existing UI, then replace the entire component with one that uses `api.prayers.*` instead of localStorage. The full replacement:

```typescript
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookMarked, Plus, Send, Check, Trash2, Tag, ChevronDown, ChevronUp, Loader2
} from "lucide-react";
import { api, type Prayer } from "../api";
import { useAuth } from "../auth/AuthContext";
import UpgradePrompt from "./UpgradePrompt";

const AVAILABLE_TAGS = ["WORK", "WISDOM", "HEALTH", "FAMILY", "GUIDANCE", "FAITH"];
const FREE_LIMIT = 5;

interface PrayerViewProps {
  onUpgrade: () => void;
}

export default function PrayerView({ onUpgrade }: PrayerViewProps) {
  const { user, isAtLeast } = useAuth();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newText, setNewText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [filterTag, setFilterTag] = useState<string>("ALL");

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    api.prayers.list().then(setPrayers).catch(console.error).finally(() => setIsLoading(false));
  }, [user]);

  const canAddMore = isAtLeast("disciple_plus") || prayers.length < FREE_LIMIT;

  const handleAddPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !user) return;
    if (!canAddMore) { onUpgrade(); return; }

    setIsSaving(true);
    try {
      const created = await api.prayers.create(newText.trim(), selectedTags);
      setPrayers((prev) => [created, ...prev]);
      setNewText("");
      setSelectedTags([]);
    } catch (err: unknown) {
      const e = err as { data?: { upgradeRequired?: boolean } };
      if (e.data?.upgradeRequired) onUpgrade();
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkAnswered = async (prayer: Prayer) => {
    const updated = await api.prayers.update(prayer.id, true, answerText[prayer.id] || undefined);
    setPrayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDelete = async (id: number) => {
    await api.prayers.delete(id);
    setPrayers((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered =
    filterTag === "ALL" ? prayers : prayers.filter((p) => p.categoryTags.includes(filterTag));

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[700px] mx-auto space-y-8 pb-28 text-left"
    >
      <div className="border-l-4 border-[#1A1A1A] pl-5 space-y-1.5">
        <span className="font-sans text-[11px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold block">
          Prayer Journal
        </span>
        <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">Your Prayers</h2>
        {!isAtLeast("disciple_plus") && (
          <p className="text-xs text-neutral-500">
            {prayers.length}/{FREE_LIMIT} prayers used on free plan
          </p>
        )}
      </div>

      {/* New prayer form */}
      {user ? (
        <form onSubmit={handleAddPrayer} className="border-2 border-[#1A1A1A] bg-white p-5 space-y-4">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Write your prayer request…"
            rows={3}
            className="w-full border border-neutral-200 p-3 text-sm focus:outline-none focus:border-[#1A1A1A] font-sans resize-none rounded-none"
          />
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 border transition ${
                  selectedTags.includes(tag)
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "border-neutral-300 text-neutral-500 hover:border-[#1A1A1A]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {!canAddMore ? (
            <UpgradePrompt
              message="You've reached the free plan limit of 5 prayers. Upgrade for unlimited prayer journaling."
              onUpgrade={onUpgrade}
            />
          ) : (
            <button
              type="submit"
              disabled={isSaving || !newText.trim()}
              className="flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Add Prayer
            </button>
          )}
        </form>
      ) : (
        <div className="border-2 border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
          <button onClick={onUpgrade} className="underline font-bold text-[#1A1A1A]">Sign in</button> to save your prayers across devices.
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", ...AVAILABLE_TAGS].map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 border transition ${
              filterTag === tag
                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                : "border-neutral-300 text-neutral-500 hover:border-[#1A1A1A]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Prayer list */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((prayer) => (
            <motion.div
              key={prayer.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`border bg-white p-5 space-y-3 ${
                prayer.answered ? "border-green-200 bg-green-50/30" : "border-neutral-200"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <p className="text-sm font-sans text-neutral-800 leading-relaxed flex-1">
                  {prayer.text}
                </p>
                <button
                  onClick={() => handleDelete(prayer.id)}
                  className="text-neutral-300 hover:text-red-500 transition flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {prayer.categoryTags.map((tag) => (
                    <span key={tag} className="text-[8px] font-bold uppercase tracking-widest bg-neutral-100 px-2 py-0.5 text-neutral-500">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">{prayer.timestamp}</span>
              </div>

              {prayer.answered ? (
                <div className="flex items-start gap-2 pt-2 border-t border-green-200">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700 italic">{prayer.answerText || "Marked as answered"}</p>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setExpandedId(expandedId === prayer.id ? null : prayer.id)}
                    className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest hover:text-[#1A1A1A] flex items-center gap-1 transition"
                  >
                    {expandedId === prayer.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    Mark Answered
                  </button>
                  <AnimatePresence>
                    {expandedId === prayer.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 space-y-2">
                          <textarea
                            value={answerText[prayer.id] || ""}
                            onChange={(e) => setAnswerText((prev) => ({ ...prev, [prayer.id]: e.target.value }))}
                            placeholder="How did God answer this prayer? (optional)"
                            rows={2}
                            className="w-full border border-neutral-200 p-2 text-xs font-sans resize-none focus:outline-none focus:border-[#1A1A1A] rounded-none"
                          />
                          <button
                            onClick={() => handleMarkAnswered(prayer)}
                            className="bg-green-600 text-white px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-green-700 transition flex items-center gap-1.5"
                          >
                            <Check className="w-3 h-3" /> Confirm Answered
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-sm text-neutral-400 text-center py-10 font-sans italic">
            {user ? "No prayers yet. Write your first one above." : "Sign in to see your prayer journal."}
          </p>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jik/dcpl && git add src/components/PrayerView.tsx && git commit -m "feat: PrayerView connected to prayers API, free tier gate"
```

---

## Task 15: Wire MissionView and PathView to API

**Files:**
- Modify: `src/components/MissionView.tsx`
- Modify: `src/components/PathView.tsx`

- [ ] **Step 1: Update MissionView to use API**

Replace the `useEffect` localStorage load in `/Users/jik/dcpl/src/components/MissionView.tsx`:

Remove:
```typescript
  useEffect(() => {
    const saved = localStorage.getItem("sanctuary_missions");
    if (saved) {
      try {
        setMissions(JSON.parse(saved));
      } catch (e) {
        setMissions(DEFAULT_MISSIONS);
      }
    } else {
      setMissions(DEFAULT_MISSIONS);
    }
  }, []);
```

Add at the top of the component (after existing imports):
```typescript
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
```

And add `const { user } = useAuth();` inside the component.

Replace the `useEffect` with:
```typescript
  useEffect(() => {
    if (!user) {
      setMissions(DEFAULT_MISSIONS);
      return;
    }
    api.missions.list().then((statusMap) => {
      setMissions(
        DEFAULT_MISSIONS.map((m) => ({
          ...m,
          status: (statusMap[m.id] as "idle" | "active" | "completed") || "idle",
        }))
      );
    }).catch(() => setMissions(DEFAULT_MISSIONS));
  }, [user]);
```

Replace `saveMissions`:
```typescript
  const saveMissions = async (updated: Mission[]) => {
    setMissions(updated);
    if (user) {
      // sync only the changed mission
      const changed = updated.find((m, i) => m.status !== missions[i]?.status);
      if (changed) await api.missions.update(changed.id, changed.status).catch(console.error);
    }
  };
```

- [ ] **Step 2: Update PathView to use API**

In `/Users/jik/dcpl/src/components/PathView.tsx`:

Add imports at top:
```typescript
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
```

Inside the component, add `const { user } = useAuth();`.

Replace the first `useEffect` (localStorage load) with:
```typescript
  useEffect(() => {
    if (!user) return;
    api.progress.get().then((data) => {
      if (data.pathRequirements && Array.isArray(data.pathRequirements) && data.pathRequirements.length > 0) {
        setRequirements(data.pathRequirements as typeof requirements);
      }
    }).catch(console.error);
  }, [user]);
```

Replace `toggleRequirement` body with:
```typescript
  const toggleRequirement = (id: string) => {
    const updated = requirements.map((r) =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    setRequirements(updated);
    if (user) {
      api.progress.update({ pathRequirements: updated }).catch(console.error);
    }
  };
```

- [ ] **Step 3: Commit**

```bash
cd /Users/jik/dcpl && git add src/components/MissionView.tsx src/components/PathView.tsx && git commit -m "feat: MissionView + PathView synced to API when logged in"
```

---

## Task 16: Update App.tsx — auth, pricing tab, and progress sync

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Wrap app in AuthProvider in `src/main.tsx`**

Replace `/Users/jik/dcpl/src/main.tsx` with:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./auth/AuthContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

- [ ] **Step 2: Update `src/App.tsx` — add auth header controls, Pricing tab, API-synced stats**

At the top of `App.tsx`, add these imports after existing ones:
```typescript
import { useAuth } from "./auth/AuthContext";
import LoginModal from "./auth/LoginModal";
import PricingView from "./components/PricingView";
```

Inside `App()`, add:
```typescript
  const { user, logout, isLoading: authLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
```

Add a `useEffect` to sync stats from API when user logs in — add after the existing localStorage `useEffect`:
```typescript
  useEffect(() => {
    if (!user) return;
    import("./api").then(({ api }) => {
      api.progress.get().then((data) => {
        setStats({
          username: user.username,
          avatarUrl: "",
          currentStreak: data.currentStreak,
          level: data.level,
          completedMissionsCount: data.completedMissionsCount,
          checklist: data.checklist,
        });
      }).catch(console.error);
    });
  }, [user]);
```

In `handleUpdateStats`, add an API sync call after the localStorage set:
```typescript
  const handleUpdateStats = (updatedStats: UserStats) => {
    setStats(updatedStats);
    localStorage.setItem("sanctuary_user_stats", JSON.stringify(updatedStats));
    // Sync to server if logged in
    import("./api").then(({ api }) => {
      api.progress.update({
        currentStreak: updatedStats.currentStreak,
        level: updatedStats.level,
        completedMissionsCount: updatedStats.completedMissionsCount,
        checklist: updatedStats.checklist,
      }).catch(console.error);
    });
  };
```

In the header nav, replace the Settings button area with:
```typescript
          <div className="flex items-center gap-4 text-[11px] font-sans uppercase tracking-widest text-[#1A1A1A]">
            <span className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span> Ledger Active
            </span>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-[10px] text-neutral-500">{user.username}</span>
                <button
                  onClick={logout}
                  className="hover:text-black hover:underline text-[10px] uppercase font-bold tracking-widest transition"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="hover:text-black hover:underline flex items-center gap-1 transition-colors uppercase font-bold tracking-widest"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setLoginMode("login"); setShowLogin(true); }}
                  className="hover:underline text-[10px] uppercase font-bold tracking-widest transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setLoginMode("register"); setShowLogin(true); }}
                  className="bg-[#1A1A1A] text-white px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest hover:bg-neutral-800 transition"
                >
                  Join Free
                </button>
              </div>
            )}
          </div>
```

Add `"pricing"` tab to the active tab conditions for the main content area (add after `mission` block):
```typescript
              {activeTab === "pricing" && (
                <PricingView
                  onSignUpRequired={() => { setLoginMode("register"); setShowLogin(true); }}
                />
              )}
```

In the bottom nav, add a Pricing tab button after the Prayer tab:
```typescript
          <button
            onClick={() => { setActiveTab("pricing"); setIsStudyMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "pricing" && !isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Plans</span>
          </button>
```

Add `Zap` to the lucide imports at the top of `App.tsx`.

At the bottom of the JSX (before the closing `</div>`), add the LoginModal:
```typescript
      <AnimatePresence>
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            initialMode={loginMode}
          />
        )}
      </AnimatePresence>
```

Also update `PrayerView` usage to pass `onUpgrade`:
```typescript
              {activeTab === "prayer" && (
                <PrayerView
                  onUpgrade={() => { setActiveTab("pricing"); }}
                />
              )}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/jik/dcpl && git add src/App.tsx src/main.tsx && git commit -m "feat: auth integration in App, pricing tab, progress sync"
```

---

## Task 17: Final build verification

**Files:** none (verification only)

- [ ] **Step 1: TypeScript check**

```bash
cd /Users/jik/dcpl && npx tsc --noEmit
```

Expected: no errors. Fix any type errors before proceeding.

- [ ] **Step 2: Copy `.env.example` to `.env.local` for dev**

```bash
cd /Users/jik/dcpl && cp .env.example .env.local
```

Then edit `.env.local` to set at minimum:
```
PORT=3001
JWT_SECRET=dev_secret_32_chars_minimum_here
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
```

- [ ] **Step 3: Start server in background and verify health**

```bash
cd /Users/jik/dcpl && npx tsx server/index.ts &
sleep 2 && curl -s http://localhost:3001/api/health
```

Expected: `{"ok":true}`

- [ ] **Step 4: Test register + login flow via curl**

```bash
curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"Tester","password":"password123"}' | python3 -m json.tool
```

Expected: JSON with `token` and `user` fields including `"tier":"free"`.

- [ ] **Step 5: Start frontend dev server**

```bash
cd /Users/jik/dcpl && npm run dev
```

Expected: Vite starts on port 3000, proxies `/api` to 3001.

- [ ] **Step 6: Build production bundle**

```bash
cd /Users/jik/dcpl && npm run build
```

Expected: dist/ folder created, no build errors.

- [ ] **Step 7: Final commit**

```bash
cd /Users/jik/dcpl && git add -A && git commit -m "feat: full-stack DCPL — auth, API, pricing, Stripe ready"
```

---

## Stripe Setup Checklist (post-build)

Before going live, complete these steps in the Stripe dashboard:

1. Create 4 prices in Stripe dashboard:
   - Disciple Plus Monthly: $7.99/mo recurring
   - Disciple Plus Yearly: $79/yr recurring
   - Church & Leader Monthly: $49/mo recurring
   - Church & Leader Yearly: $499/yr recurring
2. Copy price IDs into `.env.local` (`STRIPE_PRICE_DISCIPLE_MONTHLY`, etc.)
3. Set up webhook endpoint pointing to `https://yourdomain.com/api/stripe/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy webhook secret into `STRIPE_WEBHOOK_SECRET`
5. For local webhook testing: `stripe listen --forward-to localhost:3001/api/stripe/webhook`
