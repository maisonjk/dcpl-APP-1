const BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("dcpl_token");
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
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
    share: (id: number, shared: boolean) => request<Prayer>("PATCH", `/prayers/${id}`, { shared }),
    getShares: (id: number) => request<{ sharedWith: number[] }>("GET", `/prayers/${id}/shares`),
    setShares: (id: number, sharedWith: number[]) =>
      request<Prayer & { sharedWith: number[] }>("PUT", `/prayers/${id}/shares`, { sharedWith }),
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
  accountability: {
    list: () => request<AccountabilityPartner[]>("GET", "/accountability"),
    invite: (query: string) => request<AccountabilityPartner>("POST", "/accountability", { query }),
    accept: (id: number) => request<{ ok: boolean }>("PATCH", `/accountability/${id}/accept`, {}),
    remove: (id: number) => request<void>("DELETE", `/accountability/${id}`),
    feed: () => request<CirclePrayer[]>("GET", "/accountability/feed"),
    checkins: () => request<CircleCheckin[]>("GET", "/accountability/checkins"),
    encourage: (partnerId: number) => request<{ ok: boolean }>("POST", `/accountability/encourage/${partnerId}`, {}),
    encouragements: () => request<Encouragement[]>("GET", "/accountability/encouragements"),
    reactPrayer: (id: number) => request<{ reacted: boolean }>("POST", `/prayers/${id}/react`, {}),
  },
  stripe: {
    checkout: (priceId: string) =>
      request<{ url: string }>("POST", "/stripe/checkout", { priceId }),
    portal: () => request<{ url: string }>("POST", "/stripe/portal"),
  },
};

export interface Prayer {
  id: number;
  text: string;
  categoryTags: string[];
  answered: boolean;
  answerText?: string;
  shared: boolean;
  timestamp: string;
}

export interface CirclePrayer {
  id: number;
  text: string;
  username: string;
  answered: boolean;
  reactionCount: number;
  iReacted: boolean;
  timestamp: string;
}

export interface CircleCheckin {
  userId: number;
  username: string;
  streak: number;
  checkedInToday: boolean;
  checklist: { prayer: boolean; word: boolean; obedience: boolean };
}

export interface Encouragement {
  id: number;
  username: string;
  timestamp: string;
}

export interface AccountabilityPartner {
  id: number;
  status: "pending" | "accepted";
  username: string;
  email: string;
  direction: "sent" | "received";
  createdAt: number;
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
