import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Compass,
  TrendingUp,
  BookOpen,
  Heart,
  MessageCircle,
  Eye,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Plus,
  Send,
  Users,
  UserPlus,
  Check,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import { api, AccountabilityPartner, CirclePrayer, CircleCheckin, Encouragement } from "../api";
import { useAuth } from "../auth/AuthContext";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { UserStats, ScriptureVerse } from "../types";
import { READING_PLANS, CURRICULUM_PLANS } from "../data";

// Rotating Scriptural Affirmation cards
const AFFIRMATIONS = [
  {
    text: "I am fearfully and wonderfully made. God's grace is sufficient for me in my weakness today.",
    scripture: "Psalm 139:14 & 2 Cor 12:9"
  },
  {
    text: "I do not carry a spirit of fear, but of power, love, and a disciplined, sound mind. Peace is my guard.",
    scripture: "2 Timothy 1:7 & Phil 4:7"
  },
  {
    text: "I can do all things through Him who strengthens me. He has prepared good works for me today.",
    scripture: "Philippians 4:13 & Eph 2:10"
  },
  {
    text: "The Lord is my shepherd; I lack absolutely nothing. He directs my paths and restores my soul.",
    scripture: "Psalm 23:1 & Proverbs 3:6"
  },
  {
    text: "I am confident of this: He who began a good work in me will be totally faithful to complete it.",
    scripture: "Philippians 1:6"
  },
  {
    text: "I cast all my burdens onto the Lord, for He cares for me deeply. I find perfect rest in His presence.",
    scripture: "1 Peter 5:7 & Psalm 55:22"
  }
];

// Dynamic local helper to compute or retrieve the last 7 days of checklist completions
const getHabitHistoryData = (checklist: { prayer: boolean; word: boolean; obedience: boolean }) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const data = [];
  
  // Calculate today's completed count
  const todayCount = (checklist.prayer ? 1 : 0) + (checklist.word ? 1 : 0) + (checklist.obedience ? 1 : 0);
  
  let historyStore: Record<string, number> = {};
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("sanctuary_habit_history");
    if (stored) {
      try {
        historyStore = JSON.parse(stored);
      } catch (e) {
        // ignore
      }
    }
  }
  
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];
  
  // Update today's count in the history store
  historyStore[todayKey] = todayCount;
  
  // Past days default to 0 if no real data recorded yet
  for (let i = 6; i >= 1; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (historyStore[key] === undefined) {
      historyStore[key] = 0;
    }
  }
  
  if (typeof window !== "undefined") {
    localStorage.setItem("sanctuary_habit_history", JSON.stringify(historyStore));
  }
  
  // Construct final charting dataset
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayName = weekdays[d.getDay()];
    data.push({
      date: i === 0 ? "Today" : dayName,
      key,
      completed: historyStore[key] ?? 0
    });
  }
  
  return data;
};

function AccountabilityCircle({ onNavigateTab }: { onNavigateTab: (tabId: string) => void }) {
  const { user } = useAuth();
  const [partners, setPartners] = useState<AccountabilityPartner[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [encouraged, setEncouraged] = useState<string | null>(null);
  const [feed, setFeed] = useState<CirclePrayer[]>([]);
  const [checkins, setCheckins] = useState<CircleCheckin[]>([]);
  const [encouragements, setEncouragements] = useState<Encouragement[]>([]);
  const [activeSection, setActiveSection] = useState<"partners" | "prayers" | "checkins">("partners");
  const [encouragedIds, setEncouragedIds] = useState<Set<number>>(new Set());

  const load = useCallback(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      api.accountability.list(),
      api.accountability.feed(),
      api.accountability.checkins(),
      api.accountability.encouragements(),
    ])
      .then(([p, f, c, e]) => {
        setPartners(p);
        setFeed(f);
        setCheckins(c);
        setEncouragements(e);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const p = await api.accountability.invite(query.trim());
      setPartners((prev) => [p, ...prev]);
      setQuery("");
      setShowInvite(false);
    } catch (err: any) {
      setError(err.data?.error || err.message || "Could not send invite");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async (id: number) => {
    await api.accountability.accept(id);
    setPartners((prev) => prev.map((p) => p.id === id ? { ...p, status: "accepted" } : p));
  };

  const handleRemove = async (id: number) => {
    await api.accountability.remove(id);
    setPartners((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEncourage = (name: string) => {
    setEncouraged(name);
    setTimeout(() => setEncouraged(null), 3000);
  };

  const handleReactPrayer = async (prayerId: number) => {
    const result = await api.accountability.reactPrayer(prayerId);
    setFeed((prev) => prev.map((p) => p.id === prayerId
      ? { ...p, iReacted: result.reacted, reactionCount: p.reactionCount + (result.reacted ? 1 : -1) }
      : p
    ));
  };

  const handleSendEncouragement = async (partnerId: number) => {
    await api.accountability.encourage(partnerId);
    setEncouragedIds((prev) => new Set([...prev, partnerId]));
  };

  const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const accepted = partners.filter((p) => p.status === "accepted");
  const pendingReceived = partners.filter((p) => p.status === "pending" && p.direction === "received");
  const pendingSent = partners.filter((p) => p.status === "pending" && p.direction === "sent");

  if (!user) {
    return (
      <div className="bg-white border border-[#1A1A1A] rounded-none p-6" id="card_accountability_circle">
        <h4 className="font-sans text-[11px] text-neutral-400 uppercase tracking-widest font-bold mb-4">Accountability Circle</h4>
        <div className="text-center py-4 space-y-2">
          <Users className="w-8 h-8 text-neutral-200 mx-auto" />
          <p className="text-xs text-neutral-400 font-sans">Sign in to connect with accountability partners.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#1A1A1A] rounded-none p-6" id="card_accountability_circle">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-sans text-[11px] text-neutral-400 uppercase tracking-widest font-bold">
          Accountability Circle
        </h4>
        <button
          onClick={() => { setActiveSection("partners"); setShowInvite((v) => !v); setError(null); }}
          className="flex items-center gap-1 px-2.5 py-1.5 border border-[#1A1A1A] text-[9px] font-bold uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-all"
        >
          <UserPlus className="w-3 h-3" />
          <span>Invite</span>
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex mb-5 border-b border-neutral-200">
        {(["partners", "prayers", "checkins"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`px-3 py-2 text-[9px] font-bold uppercase tracking-widest transition border-b-2 -mb-px ${
              activeSection === tab
                ? "border-[#1A1A1A] text-[#1A1A1A]"
                : "border-transparent text-neutral-400 hover:text-[#1A1A1A]"
            }`}
          >
            {tab === "partners" ? "Partners" : tab === "prayers" ? "Circle Prayers" : "Check-ins"}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
        </div>
      )}

      {/* Partners tab */}
      {activeSection === "partners" && !loading && (
        <div>
          {/* Invite form */}
          {showInvite && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 border border-dashed border-[#1A1A1A] p-4 space-y-2 overflow-hidden"
            >
              <p className="text-[10px] text-neutral-500 font-sans">Enter their username or email address.</p>
              <form onSubmit={handleInvite} className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="username or email"
                  className="flex-1 border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-[#1A1A1A] rounded-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#1A1A1A] text-white px-3 py-2 text-[9px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition disabled:opacity-50 flex items-center gap-1"
                >
                  {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>Send</span>
                </button>
              </form>
              {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
            </motion.div>
          )}

          {/* Pending invites received */}
          {pendingReceived.length > 0 && (
            <div className="mb-4 space-y-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 font-sans">Pending invites</p>
              {pendingReceived.map((p) => (
                <div key={p.id} className="flex items-center justify-between bg-neutral-50 border border-neutral-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-neutral-300 bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-500">
                      {initials(p.username)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800">{p.username}</p>
                      <p className="text-[10px] text-neutral-400">Wants to join your circle</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAccept(p.id)}
                      className="px-2 py-1 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Accept
                    </button>
                    <button onClick={() => handleRemove(p.id)} className="text-neutral-300 hover:text-red-500 transition">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Accepted partners */}
          {accepted.length > 0 && (
            <div className="space-y-4">
              {accepted.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-[#1A1A1A] bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-600">
                      {initials(p.username)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800">{p.username}</p>
                      <p className="text-[10px] text-neutral-400">In your circle</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEncourage(p.username)}
                      className="px-2 py-1 border border-[#1A1A1A] text-[9px] font-bold uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-all"
                    >
                      Encourage
                    </button>
                    <button onClick={() => handleRemove(p.id)} className="text-neutral-300 hover:text-red-500 transition">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sent and awaiting */}
          {pendingSent.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 font-sans">Awaiting response</p>
              {pendingSent.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-300" />
                    <p className="text-xs text-neutral-500">{p.username}</p>
                  </div>
                  <button onClick={() => handleRemove(p.id)} className="text-neutral-300 hover:text-red-500 transition">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {accepted.length === 0 && pendingReceived.length === 0 && pendingSent.length === 0 && !showInvite && (
            <div className="text-center py-6 space-y-2">
              <Users className="w-8 h-8 text-neutral-200 mx-auto" />
              <p className="text-xs text-neutral-400 font-sans">No partners yet.</p>
              <p className="text-[10px] text-neutral-400 font-sans">Invite someone by their username or email.</p>
            </div>
          )}

          {encouraged && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-2.5 bg-neutral-100 border border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest text-center"
            >
              Encouragement sent to {encouraged}!
            </motion.div>
          )}
        </div>
      )}

      {/* Circle Prayers tab */}
      {activeSection === "prayers" && !loading && (
        <div className="space-y-3">
          {feed.length === 0 ? (
            <div className="text-center py-6 space-y-3">
              <MessageCircle className="w-7 h-7 text-neutral-200 mx-auto" />
              <p className="text-xs text-neutral-400 font-sans italic">No shared prayers yet.</p>
              <p className="text-[10px] text-neutral-400 font-sans">Share a prayer from your Prayer Journal and your circle can pray with you.</p>
              <button
                onClick={() => onNavigateTab("prayer")}
                className="text-[9px] font-bold uppercase tracking-widest border border-[#1A1A1A] px-4 py-2 hover:bg-[#1A1A1A] hover:text-white transition"
              >
                Open Prayer Journal →
              </button>
            </div>
          ) : (
            feed.map((p) => (
              <div key={p.id} className="border border-neutral-200 bg-white p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 flex-shrink-0 border border-neutral-300 bg-neutral-100 flex items-center justify-center text-[9px] font-bold text-neutral-500">
                    {p.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">{p.username}</span>
                      {p.answered && (
                        <span className="text-[8px] font-bold uppercase tracking-widest bg-green-100 text-green-700 px-1.5 py-0.5">✓ Answered</span>
                      )}
                      <span className="text-[9px] text-neutral-400 ml-auto">{p.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-700 font-sans leading-relaxed line-clamp-3">{p.text}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleReactPrayer(p.id)}
                    className={`flex items-center gap-1.5 border text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 transition ${
                      p.iReacted
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                    }`}
                  >
                    🙏 Praying{p.reactionCount > 0 ? ` (${p.reactionCount})` : ""}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Check-ins tab */}
      {activeSection === "checkins" && !loading && (
        <div className="space-y-3">
          {encouragements.length > 0 && (
            <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1">
              {encouragements.map((e) => (
                <p key={e.id} className="text-[10px] text-neutral-600 font-sans">
                  🙏 <span className="font-bold">{e.username}</span> is praying for you today
                  <span className="text-neutral-400 ml-1">· {e.timestamp}</span>
                </p>
              ))}
            </div>
          )}

          {checkins.length === 0 ? (
            <div className="text-center py-6 space-y-1">
              <Heart className="w-7 h-7 text-neutral-200 mx-auto" />
              <p className="text-xs text-neutral-400 font-sans italic">Accept partners to see their check-ins.</p>
            </div>
          ) : (
            checkins.map((c) => (
              <div key={c.userId} className="border border-neutral-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-[#1A1A1A] bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                      {c.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800">{c.username}</p>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-wider">🔥 {c.streak} day streak</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(["prayer", "word", "obedience"] as const).map((item) => (
                      <div
                        key={item}
                        title={item}
                        className={`w-3 h-3 border ${c.checklist[item] ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-neutral-300 bg-white"}`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleSendEncouragement(c.userId)}
                  disabled={encouragedIds.has(c.userId)}
                  className={`w-full border text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 transition ${
                    encouragedIds.has(c.userId)
                      ? "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-default"
                      : "border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                  }`}
                >
                  {encouragedIds.has(c.userId) ? "Sent ✓" : "I'm praying for you today 🙏"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface HomeViewProps {
  stats: UserStats;
  verse: ScriptureVerse;
  onUpdateStats: (newStats: UserStats) => void;
  onLaunchStudy: () => void;
  onNavigateTab: (tabId: string) => void;
  activePlanId?: string | null;
  planProgress?: Record<string, number>;
  setPlanProgress?: (p: Record<string, number>) => void;
  getActivePlanVerse?: (planId: string) => ScriptureVerse;
  setActiveVerse?: (v: ScriptureVerse) => void;
  setIsStudyMode?: (v: boolean) => void;
  setIsCurriculumMode?: (v: boolean) => void;
  setBibleToast?: (msg: string | null) => void;
}

export default function HomeView({
  stats,
  verse,
  onUpdateStats,
  onLaunchStudy,
  onNavigateTab,
  activePlanId,
  planProgress = {},
  setPlanProgress,
  getActivePlanVerse,
  setActiveVerse,
  setIsStudyMode,
  setIsCurriculumMode,
  setBibleToast,
}: HomeViewProps) {
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const chartData = getHabitHistoryData(stats.checklist);

  const handleNextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  // Toggle checklist item
  const toggleChecklist = (key: "prayer" | "word" | "obedience") => {
    const updatedChecklist = { ...stats.checklist, [key]: !stats.checklist[key] };
    
    // Auto-calculate simple level or streak adjustments for interaction feedback
    let newStreak = stats.currentStreak;
    const isCompletedNow = updatedChecklist[key];
    
    // If turning on, give streak trigger update
    if (isCompletedNow) {
      // Just a simple visual bump
      const allCompleted = updatedChecklist.prayer && updatedChecklist.word && updatedChecklist.obedience;
      if (allCompleted) {
        newStreak += 1;
      }
    } else {
      const allPriorCompleted = stats.checklist.prayer && stats.checklist.word && stats.checklist.obedience;
      if (allPriorCompleted && newStreak > 5) {
        newStreak -= 1;
      }
    }

    onUpdateStats({
      ...stats,
      currentStreak: newStreak,
      checklist: updatedChecklist
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
      id="home_view_wrapper"
    >
      {/* Welcome Message Greeting Section */}
      <section className="flex flex-col gap-4 border-b border-[#1A1A1A] pb-6" id="home_greeting">
        <div>
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-neutral-400 mb-1">
            {(() => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; })()}
          </p>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-[#1A1A1A] leading-none">
            {stats.username}
          </h2>
          <p className="text-sm text-neutral-400 font-sans mt-2 leading-snug">
            May your path be clear today. Find rest in the silence.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white px-5 py-2.5 border border-[#1A1A1A] rounded-none" id="stats_quick_badge">
          <div className="text-left border-r border-neutral-200 pr-5">
            <span className="block text-[10px] uppercase font-semibold tracking-[0.12em] text-neutral-400 font-sans">Level</span>
            <span className="font-sans text-2xl font-bold text-[#1A1A1A]">{stats.level}</span>
          </div>
          <div className="text-left">
            <span className="block text-[10px] uppercase font-semibold tracking-[0.12em] text-neutral-400 font-sans">Streak</span>
            <span className="font-sans text-2xl font-bold text-[#1A1A1A]">{stats.currentStreak} days</span>
          </div>
        </div>
      </section>

      {/* Active Study Plan Card */}
      {activePlanId && activePlanId !== "curriculum" && (() => {
        const plan = READING_PLANS.find(p => p.id === activePlanId);
        if (!plan || !getActivePlanVerse) return null;
        const currentDay = planProgress[plan.id] ?? 1;
        const planVerse = getActivePlanVerse(plan.id);
        const progressPct = Math.round(((currentDay - 1) / plan.totalDays) * 100);
        return (
          <section className="text-left" id="home_active_plan_card">
            <div className="p-6 border-2 border-[#1A1A1A] bg-white flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold font-sans uppercase text-neutral-400 tracking-widest block mb-1">{plan.theme}</span>
                  <h3 className="font-serif text-base font-bold text-[#1A1A1A]">{plan.title}</h3>
                </div>
                <span className="text-[9px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-wider font-sans whitespace-nowrap ml-4">Day {currentDay}/{plan.totalDays}</span>
              </div>
              <div className="mb-4">
                <div className="h-1 bg-neutral-100 w-full">
                  <div className="h-1 bg-[#1A1A1A] transition-all" style={{ width: `${progressPct}%` }} />
                </div>
                <p className="text-[10px] font-sans text-neutral-400 mt-1">{progressPct}% complete</p>
              </div>
              <div className="bg-neutral-50 p-3 mb-4">
                <span className="text-[9px] font-bold font-sans uppercase tracking-widest text-neutral-400 block mb-1">Today — {planVerse.reference}</span>
                <p className="text-xs text-neutral-600 italic font-serif leading-relaxed line-clamp-2">{planVerse.verseLines[0]}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { if (setActiveVerse) setActiveVerse(planVerse); if (setIsStudyMode) setIsStudyMode(true); }}
                  className="bg-[#1A1A1A] text-white hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-widest px-4 py-3 rounded-none text-center transition flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Study Day {currentDay}</span>
                </button>
                {currentDay < plan.totalDays && (
                  <button
                    onClick={() => {
                      if (!setPlanProgress || !setBibleToast) return;
                      const next = currentDay + 1;
                      const updated = { ...planProgress, [plan.id]: next };
                      setPlanProgress(updated);
                      localStorage.setItem("dcpl_plan_progress", JSON.stringify(updated));
                      setBibleToast(`Day ${currentDay} complete — Day ${next} unlocked`);
                      setTimeout(() => setBibleToast(null), 3000);
                    }}
                    className="border border-[#1A1A1A] hover:bg-neutral-50 text-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest px-4 py-3 rounded-none transition w-full text-center"
                  >
                    ✓ Done for Today
                  </button>
                )}
                {currentDay >= plan.totalDays && (
                  <span className="border border-neutral-200 text-neutral-400 text-[10px] uppercase font-bold tracking-widest px-4 py-3 text-center block">
                    Plan Completed ✓
                  </span>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Active Curriculum Card */}
      {activePlanId === "curriculum" && (() => {
        const totalLessons = CURRICULUM_PLANS.reduce((s, p) => s + p.topics.reduce((ts, t) => ts + t.lessons.length, 0), 0);
        const completedLessons = (() => { try { return (JSON.parse(localStorage.getItem("dcpl_curriculum_completed") || "[]") as string[]).length; } catch { return 0; } })();
        const pct = Math.round((completedLessons / totalLessons) * 100);
        return (
          <section className="text-left" id="home_active_curriculum_card">
            <div className="p-6 border-2 border-[#1A1A1A] bg-white flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold font-sans uppercase text-neutral-400 tracking-widest block mb-1">Discipleship Curriculum</span>
                  <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Growing in Christ</h3>
                  <p className="text-xs text-neutral-500 font-sans mt-0.5">4 modules · 11 topics · 33 lessons</p>
                </div>
                <span className="text-[9px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-wider font-sans whitespace-nowrap ml-4">Active</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 mb-1.5">
                  <span>{completedLessons} of {totalLessons} lessons</span>
                  <span>{pct}% complete</span>
                </div>
                <div className="h-1 bg-neutral-100 w-full">
                  <div className="h-1 bg-[#1A1A1A] transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <button
                onClick={() => { if (setIsCurriculumMode) setIsCurriculumMode(true); }}
                className="bg-[#1A1A1A] text-white hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-widest px-4 py-3 rounded-none text-center transition flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Curriculum</span>
              </button>
            </div>
          </section>
        );
      })()}

      {/* Main Grid: Left column layout for Scripture + checklist; Right column for Bento stats & Accountability circle */}
      <div className="space-y-6" id="home_dashboard_grid">
          {/* Daily Verse Card */}
          <div className="bg-white border border-[#1A1A1A] rounded-none p-5 relative overflow-hidden" id="card_daily_verse">
            {/* Watermark decorative icon block */}
            <div className="absolute -right-6 -top-6 opacity-[0.02] select-none pointer-events-none">
              <BookOpen className="w-48 h-48 text-[#1A1A1A]" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3" id="verse_heading">
                <span className="font-sans text-[10px] text-neutral-400 uppercase tracking-[0.12em] font-semibold">
                  Daily Verse
                </span>
                <span className="font-sans text-xs text-neutral-500">
                  {verse.reference}
                </span>
              </div>

              {/* The core scripture passage italicized */}
              <div className="space-y-3" id="verse_body">
                <blockquote className="font-serif text-base text-[#1A1A1A] leading-loose italic text-left line-clamp-4">
                  {verse.verseLines[0]}
                </blockquote>
              </div>

              <div className="h-[2px] w-12 bg-[#1A1A1A]" />

              {/* Reflection summary items */}
              <div className="space-y-5" id="verse_reflection_box">
                <div>
                  <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-[0.12em] mb-1.5 font-sans">
                    Reflection
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    {verse.simpleMeaning}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 border border-[#1A1A1A] text-[#1A1A1A] flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] text-neutral-400 font-semibold uppercase tracking-[0.12em] mb-1.5 font-sans">
                      Today's Invitation
                    </h4>
                    <p className="text-sm text-[#1A1A1A] font-sans italic leading-relaxed">
                      {verse.actionStep}
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to actions to study scripture */}
              <div className="pt-4 flex flex-col gap-2" id="verse_actions">
                <button
                  onClick={onLaunchStudy}
                  className="bg-[#1A1A1A] hover:bg-neutral-800 text-white font-sans text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-none transition-all duration-200 w-full"
                  id="btn_launch_study"
                >
                  Start Bible Study
                </button>
                <button
                  onClick={() => onNavigateTab("path")}
                  className="text-xs font-sans text-neutral-400 hover:text-neutral-700 py-1 transition-all text-center"
                  id="btn_full_context"
                >
                  View Growth Journey →
                </button>
              </div>
            </div>
          </div>


          {/* Habit Accountability Checklist Status Section */}
          <div className="bg-white border border-[#1A1A1A] rounded-none p-6" id="card_habits">
            <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-3" id="habits_header">
              <h3 className="font-sans text-[10px] text-neutral-400 uppercase tracking-[0.12em] font-semibold">
                Daily Habits
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3" id="habits_grid">
              {/* Prayer Habit Indicator Card */}
              <button
                onClick={() => toggleChecklist("prayer")}
                className={`flex flex-col items-center justify-center p-4 rounded-none border transition-all duration-300 relative overflow-hidden group ${
                  stats.checklist.prayer
                    ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                    : "bg-transparent border-neutral-200 text-neutral-400 hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                }`}
                id="habit_prayer_btn"
              >
                <div className={`w-10 h-10 border flex items-center justify-center mb-2.5 transition-colors ${
                  stats.checklist.prayer ? "border-white text-white" : "border-neutral-200 text-neutral-400"
                }`}>
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-sans uppercase tracking-wider font-bold">Prayer</span>
                {stats.checklist.prayer && (
                  <div className="absolute right-2 top-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </button>

              {/* Word Study Habit Indicator Card */}
              <button
                onClick={() => toggleChecklist("word")}
                className={`flex flex-col items-center justify-center p-4 rounded-none border transition-all duration-300 relative overflow-hidden group ${
                  stats.checklist.word
                    ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                    : "bg-transparent border-neutral-200 text-neutral-400 hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                }`}
                id="habit_word_btn"
              >
                <div className={`w-10 h-10 border flex items-center justify-center mb-2.5 transition-colors ${
                  stats.checklist.word ? "border-white text-white" : "border-neutral-200 text-neutral-400"
                }`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-sans uppercase tracking-wider font-bold">Word</span>
                {stats.checklist.word && (
                  <div className="absolute right-2 top-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </button>

              {/* Obedience Love Indicator Card */}
              <button
                onClick={() => toggleChecklist("obedience")}
                className={`flex flex-col items-center justify-center p-4 rounded-none border transition-all duration-300 relative overflow-hidden group ${
                  stats.checklist.obedience
                    ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                    : "bg-transparent border-neutral-200 text-neutral-400 hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                }`}
                id="habit_obedience_btn"
              >
                <div className={`w-10 h-10 border flex items-center justify-center mb-2.5 transition-colors ${
                  stats.checklist.obedience ? "border-white text-white" : "border-neutral-200 text-neutral-400"
                }`}>
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-sans uppercase tracking-wider font-bold">Obedience</span>
                {stats.checklist.obedience && (
                  <div className="absolute right-2 top-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </button>
            </div>
            {stats.checklist.prayer && stats.checklist.word && stats.checklist.obedience ? (
              <motion.p
                key="all-done"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-[#1A1A1A] text-center mt-4 uppercase tracking-widest font-sans font-bold"
              >
                All done for today 🙏 Come back tomorrow.
              </motion.p>
            ) : (
              <p className="text-xs text-neutral-400 text-center mt-4 font-sans">
                Tap a habit above to check it off for today.
              </p>
            )}

            {/* 7-day Habit Consistency Sparkline */}
            <div className="mt-6 pt-5 border-t border-neutral-100" id="habits_sparkline_section">
              <div className="flex justify-between items-baseline mb-4" id="habits_sparkline_title">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 font-sans">
                  7-Day Consistency
                </span>
                <span className="text-[10px] font-sans text-neutral-400">
                  0–3 habits / day
                </span>
              </div>
              
              <div className="h-16 w-full" id="sparkline_container">
                {isMounted && (
                  <ResponsiveContainer width="100%" height={64} minWidth={0}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <XAxis 
                        dataKey="date" 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: '#737373', fontSize: 8, fontFamily: 'monospace' }}
                      />
                      <YAxis
                        domain={[0, 3]}
                        ticks={[0, 1, 2, 3]}
                        hide={true}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-[#1A1A1A] text-white p-2 text-[8px] font-sans font-bold uppercase tracking-widest border border-[#1A1A1A] rounded-none shadow-md">
                                <p>{data.date}: {data.completed} / 3 Tasks</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                        cursor={{ stroke: '#1A1A1A', strokeWidth: 1, strokeDasharray: '2 2' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#1A1A1A" 
                        strokeWidth={1.5} 
                        dot={{ r: 2, stroke: '#1A1A1A', strokeWidth: 1.5, fill: '#FFFFFF' }}
                        activeDot={{ r: 3.5, stroke: '#1A1A1A', strokeWidth: 1.5, fill: '#1A1A1A' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Daily Affirmation rotating scriptural card */}
          <div className="bg-[#F9F8F6] border border-[#1A1A1A] rounded-none p-6 text-left relative overflow-hidden" id="bento_daily_affirmation">
            <div className="flex justify-between items-center border-b border-neutral-300 pb-3 mb-4" id="affirmation_heading">
              <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#1A1A1A]" />
                Spiritual Decree
              </span>
              <button
                onClick={handleNextAffirmation}
                className="p-1.5 border border-[#1A1A1A] bg-white hover:bg-neutral-50 text-[#1A1A1A] transition rounded-none cursor-pointer flex items-center justify-center gap-1 font-sans text-[8px] font-bold uppercase tracking-wider"
                title="Rotate Affirmation"
                id="btn_rotate_affirmation"
              >
                <span>Rotate</span>
                <span className="text-[10px] font-serif">&rarr;</span>
              </button>
            </div>

            <div className="min-h-[100px] flex flex-col justify-between">
              {/* Animated content key swap */}
              <motion.div
                key={affirmationIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <p className="font-serif text-sm leading-relaxed text-[#1A1A1A] italic">
                  "{AFFIRMATIONS[affirmationIndex].text}"
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A] bg-white border border-[#1A1A1A] px-2 py-0.5">
                    {AFFIRMATIONS[affirmationIndex].scripture}
                  </span>
                  <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                    Card {affirmationIndex + 1} / {AFFIRMATIONS.length}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Action Step invitation journal widget card */}
          <div className="bg-white p-8 border border-[#1A1A1A] rounded-none flex flex-col justify-between overflow-hidden" id="bento_action_step">
            <div>
              <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest font-bold block mb-3">
                Today's Action Step
              </span>
              <p className="font-serif text-base font-semibold text-[#1A1A1A] leading-snug mb-6 italic">
                "{verse.actionStep}"
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("prayer")}
              className="flex items-center gap-1.5 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest hover:gap-3 transition-all duration-300 text-left cursor-pointer group"
              id="open_journal_bento"
            >
              <span>Open Prayer Journal</span>
              <ArrowRight className="w-4 h-4 text-[#1A1A1A] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>


          {/* Accountability Circle */}
          <AccountabilityCircle onNavigateTab={onNavigateTab} />

          <div className="text-center px-4">
            <p className="font-serif text-xs italic text-neutral-400">
              "Be still, and know that I am God." — Psalm 46:10
            </p>
          </div>
      </div>
    </motion.div>
  );
}
