import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Compass,
  TrendingUp,
  BookOpen,
  Heart,
  Eye,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Plus,
  Send,
  Users
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { UserStats, ScriptureVerse } from "../types";

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
  
  // Seed past 6 days deterministically if they do not exist
  for (let i = 6; i >= 1; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (historyStore[key] === undefined) {
      // Create a wavy trend of completions keys
      const mockCounts = [2, 3, 1, 3, 2, 3];
      historyStore[key] = mockCounts[i % mockCounts.length];
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

interface HomeViewProps {
  stats: UserStats;
  verse: ScriptureVerse;
  onUpdateStats: (newStats: UserStats) => void;
  onLaunchStudy: () => void;
  onNavigateTab: (tabId: string) => void;
}

export default function HomeView({
  stats,
  verse,
  onUpdateStats,
  onLaunchStudy,
  onNavigateTab
}: HomeViewProps) {
  const [showEncourageNotification, setShowEncourageNotification] = useState<string | null>(null);
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

  const handleEncourage = (name: string) => {
    setShowEncourageNotification(`Sent high-key encouragement to ${name}!`);
    setTimeout(() => setShowEncourageNotification(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
      id="home_view_wrapper"
    >
      {/* Welcome Message Greeting Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-6" id="home_greeting">
        <div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Good morning, <span className="italic">{stats.username}</span>
          </h2>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mt-1.5 font-sans">
            May your path be clear today. Find rest in the silence.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white px-5 py-2.5 border border-[#1A1A1A] rounded-none" id="stats_quick_badge">
          <div className="text-left border-r border-neutral-200 pr-5">
            <span className="block text-[9px] uppercase font-bold tracking-widest text-neutral-400 font-sans">Level</span>
            <span className="font-serif text-xl font-bold text-[#1A1A1A]">{stats.level}</span>
          </div>
          <div className="text-left">
            <span className="block text-[9px] uppercase font-bold tracking-widest text-neutral-400 font-sans">Streak</span>
            <span className="font-serif text-xl font-bold text-[#1A1A1A]">{stats.currentStreak} Days</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Left column layout for Scripture + checklist; Right column for Bento stats & Accountability circle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="home_dashboard_grid">
        {/* Left 7 Columns - Scripture card and dynamic progress tracker */}
        <div className="lg:col-span-7 space-y-8" id="home_col_left">
          {/* Daily Verse Card */}
          <div className="bg-white border border-[#1A1A1A] rounded-none p-8 relative overflow-hidden" id="card_daily_verse">
            {/* Watermark decorative icon block */}
            <div className="absolute -right-6 -top-6 opacity-[0.02] select-none pointer-events-none">
              <BookOpen className="w-48 h-48 text-[#1A1A1A]" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-baseline border-b border-neutral-100 pb-3" id="verse_heading">
                <span className="font-sans text-[10px] text-[#1A1A1A] uppercase tracking-widest font-bold">
                  Daily Verse Focus
                </span>
                <span className="font-sans text-[11px] text-neutral-500 italic">
                  {verse.reference}
                </span>
              </div>

              {/* The core scripture passage italicized */}
              <div className="space-y-3" id="verse_body">
                <blockquote className="font-serif text-xl text-[#1A1A1A] leading-relaxed italic text-left">
                  {verse.verseLines[0]}
                </blockquote>
              </div>

              <div className="h-[2px] w-12 bg-[#1A1A1A]" />

              {/* Reflection summary items */}
              <div className="space-y-5" id="verse_reflection_box">
                <div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1 font-sans">
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
                    <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1 font-sans">
                      Today's Invitation
                    </h4>
                    <p className="text-sm text-[#1A1A1A] font-sans italic">
                      {verse.actionStep}
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to actions to study scripture */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3" id="verse_actions">
                <button
                  onClick={onLaunchStudy}
                  className="bg-[#1A1A1A] hover:bg-neutral-800 text-white font-sans text-[11px] font-bold uppercase tracking-widest py-3.5 px-6 rounded-none transition-all duration-200 flex-1"
                  id="btn_launch_study"
                >
                  Start Bible Study
                </button>
                <button
                  onClick={() => onNavigateTab("path")}
                  className="bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-neutral-50 font-sans text-[11px] font-bold uppercase tracking-widest py-3.5 px-6 rounded-none transition-all"
                  id="btn_full_context"
                >
                  Growth Journey Context
                </button>
              </div>
            </div>
          </div>

          {/* Quick Access Grid Links for Mobile/Tablet users */}
          <div className="grid grid-cols-2 gap-4 md:hidden" id="mobile_quick_links">
            <button
              onClick={() => onNavigateTab("mission")}
              className="bg-white border border-[#1A1A1A] p-5 rounded-none flex items-center gap-3 text-left active:bg-neutral-50"
            >
              <div className="w-10 h-10 rounded-none border border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-[#1A1A1A]">Missions</span>
                <span className="text-[10px] text-neutral-400">Kingdom Action</span>
              </div>
            </button>
            <button
              onClick={() => onNavigateTab("path")}
              className="bg-white border border-[#1A1A1A] p-5 rounded-none flex items-center gap-3 text-left active:bg-neutral-50"
            >
              <div className="w-10 h-10 rounded-none border border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-[#1A1A1A]">My Path</span>
                <span className="text-[10px] text-neutral-400">Growth Stages</span>
              </div>
            </button>
          </div>

          {/* Habit Accountability Checklist Status Section */}
          <div className="bg-white border border-[#1A1A1A] rounded-none p-6" id="card_habits">
            <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-3" id="habits_header">
              <h3 className="font-sans text-[11px] text-[#1A1A1A] uppercase tracking-widest font-bold">
                Accountability Checklist
              </h3>
              <span className="text-[10px] uppercase font-sans tracking-wider text-neutral-400 font-medium">
                Today's Spiritual Habits
              </span>
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
                <span className="text-xs font-sans uppercase tracking-widest text-[9px] font-bold">Prayer</span>
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
                <span className="text-xs font-sans uppercase tracking-widest text-[9px] font-bold">Word</span>
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
                <span className="text-xs font-sans uppercase tracking-widest text-[9px] font-bold">Obedience</span>
                {stats.checklist.obedience && (
                  <div className="absolute right-2 top-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </button>
            </div>
            <p className="text-[10px] text-neutral-400 text-center mt-4 uppercase tracking-widest font-sans font-bold">
              Tap habits above to toggle your check-in status
            </p>

            {/* 7-day Habit Consistency Sparkline */}
            <div className="mt-6 pt-5 border-t border-neutral-100" id="habits_sparkline_section">
              <div className="flex justify-between items-baseline mb-4" id="habits_sparkline_title">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A] font-sans">
                  7-Day Habit Consistency Wave
                </span>
                <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                  Daily Completions (0-3)
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
        </div>

        {/* Right 5 Columns - Bento widgets, streak card milestones, accountability community bubble circle group */}
        <div className="lg:col-span-5 space-y-8" id="home_col_right">
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
                <p className="font-serif text-lg leading-relaxed text-[#1A1A1A] italic">
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
          <div className="bg-white p-8 border border-[#1A1A1A] rounded-none flex flex-col justify-between" id="bento_action_step">
            <div>
              <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest font-bold block mb-3">
                Today's Action Step
              </span>
              <p className="font-serif text-xl font-bold text-[#1A1A1A] leading-snug mb-6 italic">
                "Write down three things you&apos;re surrendering today in prayer."
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

          {/* Growth Journey timeline summary layout card */}
          <div className="bg-white border border-[#1A1A1A] rounded-none p-6" id="bento_path_preview">
            <div className="flex justify-between items-center mb-6" id="path_preview_header">
              <h3 className="font-sans text-[11px] text-[#1A1A1A] uppercase tracking-widest font-bold">
                The Journey
              </h3>
              <span className="text-xs text-neutral-500 font-sans uppercase tracking-widest text-[10px] font-bold">Level {stats.level} Disciple</span>
            </div>

            {/* Compact timeline display */}
            <div className="space-y-4 relative pl-3" id="compact_path_timeline">
              <div className="absolute left-[20px] top-2 bottom-2 w-px bg-neutral-200" />

              <div className="flex items-center gap-4 relative">
                <div className="w-4 h-4 bg-neutral-200 border border-[#1A1A1A] flex items-center justify-center text-white z-10" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-neutral-400 line-through">Foundations of Grace</p>
                  <p className="text-[10px] text-neutral-400">Completed stage 1 & 2</p>
                </div>
              </div>

              <div className="flex items-center gap-4 relative">
                <div className="w-4 h-4 bg-[#1A1A1A] flex items-center justify-center z-10">
                  <div className="w-1.5 h-1.5 bg-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#1A1A1A]">The Discipline of Prayer</p>
                  <p className="text-[11px] text-[#1A1A1A] font-medium italic">Currently Active stage (64% progress)</p>
                </div>
              </div>

              <div className="flex items-center gap-4 relative">
                <div className="w-4 h-4 border border-dashed border-neutral-400 bg-white z-10" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-neutral-400">Quietness &amp; Trust</p>
                  <p className="text-[10px] text-neutral-400">Next milestone stage</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("path")}
              className="w-full mt-6 py-3 border border-[#1A1A1A] font-sans text-[10px] font-bold uppercase tracking-widest text-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all"
              id="details_path_trigger"
            >
              Analyze Growth Path
            </button>
          </div>

          {/* Accountability Community circle list */}
          <div className="bg-white border border-[#1A1A1A] rounded-none p-6" id="card_accountability_circle">
            <h4 className="font-sans text-[11px] text-neutral-400 uppercase tracking-widest font-bold mb-5">
              Accountability Circle
            </h4>

            <div className="space-y-4" id="circle_list">
              <div className="flex items-center justify-between" id="circle_user_1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-[#1A1A1A] bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-600">
                    SC
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800">Sarah Chen</p>
                    <p className="text-[10px] text-neutral-400 font-medium">Active Now</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEncourage("Sarah Chen")}
                  className="px-2 py-1 border border-[#1A1A1A] text-[9px] font-bold uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-all"
                >
                  Poke
                </button>
              </div>

              <div className="flex items-center justify-between" id="circle_user_2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-neutral-300 bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-400">
                    TW
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400">Thomas Wright</p>
                    <p className="text-[10px] text-neutral-400">Completed Study</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEncourage("Thomas Wright")}
                  className="px-3 py-1 bg-[#1A1A1A] text-white text-[9px] font-sans font-bold uppercase tracking-wider transition-colors hover:bg-neutral-800"
                >
                  Encourage
                </button>
              </div>
            </div>

            {/* Notification alert toast */}
            {showEncourageNotification && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-2.5 bg-neutral-100 border border-[#1A1A1A] text-[#1A1A1A] text-xs text-center"
              >
                {showEncourageNotification}
              </motion.div>
            )}
          </div>

          <div className="text-center px-4">
            <p className="font-serif text-xs italic text-neutral-400">
              "Be still, and know that I am God." — Psalm 46:10
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
