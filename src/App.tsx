import React, { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  TrendingUp,
  Compass,
  BookMarked,
  Settings,
  Shield,
  Trash2,
  X,
  User,
  Bell,
  Zap,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { UserStats, ScriptureVerse } from "./types";
import { DEFAULT_USER_STATS, READING_PLANS, ALL_VERSES, CURRICULUM_PLANS } from "./data";
import { api } from "./api";
import { useAuth } from "./auth/AuthContext";
import LoginModal from "./auth/LoginModal";

// Sub-components
import HomeView from "./components/HomeView";
import FocusView from "./components/FocusView";
import PathView from "./components/PathView";
import PrayerView from "./components/PrayerView";
import MissionView from "./components/MissionView";
import PricingView from "./components/PricingView";
import CurriculumView from "./components/CurriculumView";

export default function App() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [planProgress, setPlanProgress] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem("dcpl_plan_progress") || "{}"); } catch { return {}; }
  });
  const getActivePlanVerse = (planId: string): ScriptureVerse => {
    const day = planProgress[planId] ?? 1;
    return ALL_VERSES.find((v) => v.planId === planId && v.dayNumber === day) ?? ALL_VERSES.find((v) => v.planId === planId)!;
  };
  const [activeVerse, setActiveVerse] = useState<ScriptureVerse>(() => getActivePlanVerse("john21"));
  const [stats, setStats] = useState<UserStats>(DEFAULT_USER_STATS);
  const [isStudyMode, setIsStudyMode] = useState<boolean>(false);
  const [isCurriculumMode, setIsCurriculumMode] = useState<boolean>(false);
  const [studyReturnToCurriculum, setStudyReturnToCurriculum] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const [bibleToast, setBibleToast] = useState<string | null>(null);
  const [notifToast, setNotifToast] = useState<string | null>(null);
  const showNotifToast = (msg: string) => { setNotifToast(msg); setTimeout(() => setNotifToast(null), 4000); };
  const [newUsername, setNewUsername] = useState<string>("");
  const [settingsStatusMessage, setSettingsStatusMessage] = useState<string | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<string>("default");

  // Load local stats on mount
  useEffect(() => {
    const savedStats = localStorage.getItem("sanctuary_user_stats");
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        setNewUsername(parsed.username);
      } catch (e) { /* ignore */ }
    } else {
      setNewUsername(DEFAULT_USER_STATS.username);
    }

    const remindersStored = localStorage.getItem("sanctuary_reminders_enabled");
    if (remindersStored === "true") setRemindersEnabled(true);
    if ("Notification" in window) setPermissionStatus(Notification.permission);
  }, []);

  // Sync stats from API on login
  useEffect(() => {
    if (!user) return;
    api.progress.get().then((data) => {
      if (data.completedMissionsCount !== undefined || data.level !== undefined) {
        setStats((prev) => ({
          ...prev,
          username: user.username,
          completedMissionsCount: data.completedMissionsCount ?? prev.completedMissionsCount,
          level: data.level ?? prev.level,
        }));
      }
    }).catch(console.error);
  }, [user]);

  const handleUpdateStats = (updatedStats: UserStats) => {
    setStats(updatedStats);
    localStorage.setItem("sanctuary_user_stats", JSON.stringify(updatedStats));
    if (user) {
      api.progress.update({
        completedMissionsCount: updatedStats.completedMissionsCount,
        level: updatedStats.level,
      }).catch(console.error);
    }
  };

  const handleToggleReminders = () => {
    if (!("Notification" in window)) {
      showNotifToast("This browser does not support notifications.");
      return;
    }
    if (!remindersEnabled) {
      Notification.requestPermission().then((permission) => {
        setPermissionStatus(permission);
        if (permission === "granted") {
          setRemindersEnabled(true);
          localStorage.setItem("sanctuary_reminders_enabled", "true");
          try { new Notification("DCPL Sanctuary Reminders", { body: "Daily reminders successfully activated." }); }
          catch (err) { console.error(err); }
        } else {
          showNotifToast("Permission denied — enable notifications in your browser settings.");
          setRemindersEnabled(false);
          localStorage.setItem("sanctuary_reminders_enabled", "false");
        }
      });
    } else {
      setRemindersEnabled(false);
      localStorage.setItem("sanctuary_reminders_enabled", "false");
    }
  };

  const sendTestNotificationImmediately = () => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      showNotifToast("Enable notification permissions first.");
      return;
    }
    setSettingsStatusMessage("Scheduled! Expect test reminder in 5 seconds...");
    setTimeout(() => {
      setSettingsStatusMessage(null);
      if (Notification.permission === "granted") {
        try { new Notification("DCPL Sanctuary Daily Study", { body: "Time for your daily scripture study check-in!" }); }
        catch (err) { console.error(err); }
      }
    }, 5500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) { setSettingsStatusMessage("Please enter a valid name."); return; }
    const updated = { ...stats, username: newUsername };
    handleUpdateStats(updated);
    setSettingsStatusMessage("Profile updated successfully!");
    setTimeout(() => { setSettingsStatusMessage(null); setShowSettings(false); }, 1500);
  };

  const handleClearAllData = () => {
    const confirmClear = window.confirm(
      "CONFIRM: This will permanently wipe all your local highlights, prayers, and growth journey progress cached on this device. Continue?"
    );
    if (confirmClear) { localStorage.clear(); window.location.reload(); }
  };

  if (authLoading) {
    return (
      <div className="bg-[#F9F8F6] min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-neutral-300 min-h-screen flex items-start justify-center sm:py-0" id="app_frame_outer">
<div className="bg-[#F9F8F6] min-h-screen w-full sm:max-w-[390px] text-[#1A1A1A] flex flex-col selection:bg-neutral-200 selection:text-black font-sans relative" id="app_root_layout">

      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#F9F8F6]/90 backdrop-blur-md border-b-2 border-[#1A1A1A]" id="navigation_main_header">
        <div className="flex justify-between items-baseline w-full px-5 py-5">
          <div className="flex items-baseline gap-6">
            <button
              onClick={() => { setActiveTab("home"); setIsStudyMode(false); setIsCurriculumMode(false); }}
              className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A] hover:opacity-85 transition-opacity uppercase"
            >
              DCPL
            </button>
            <span className="hidden md:inline text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Spiritual Ledger</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-sans uppercase tracking-widest text-[#1A1A1A]">
            <span className="hidden sm:flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full"></span> Ledger Active</span>
            {user ? (
              <>
                <span className="hidden sm:inline font-bold text-neutral-600">{user.username}</span>
                <button
                  onClick={logout}
                  className="hover:text-black hover:underline flex items-center gap-1 transition-colors font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setLoginMode("login"); setShowLogin(true); }}
                  className="hover:underline font-bold transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setLoginMode("register"); setShowLogin(true); }}
                  className="bg-[#1A1A1A] text-white px-3 py-1.5 text-[10px] font-bold tracking-widest hover:bg-neutral-800 transition"
                >
                  Join Free
                </button>
              </>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="hover:text-black hover:underline flex items-center gap-1 transition-colors font-bold"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full px-5 py-8" id="viewport_main_content">
        <AnimatePresence mode="wait">
          {isStudyMode ? (
            <motion.div
              key="study_viewport"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FocusView verse={activeVerse} onBack={() => {
                setIsStudyMode(false);
                if (studyReturnToCurriculum) { setIsCurriculumMode(true); setStudyReturnToCurriculum(false); }
              }} />
            </motion.div>
          ) : isCurriculumMode ? (
            <motion.div
              key="curriculum_viewport"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <button
                  onClick={() => setIsCurriculumMode(false)}
                  className="text-[10px] font-bold font-sans uppercase tracking-widest text-neutral-400 hover:text-[#1A1A1A] transition flex items-center gap-1.5"
                >
                  ← Back to Plans
                </button>
              </div>
              <CurriculumView onStudyVerse={(verse) => { setActiveVerse(verse); setIsCurriculumMode(false); setStudyReturnToCurriculum(true); setIsStudyMode(true); }} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="min-h-[70vh] pb-24"
            >
              {activeTab === "home" && (
                <HomeView
                  stats={stats}
                  verse={activeVerse}
                  onUpdateStats={handleUpdateStats}
                  onLaunchStudy={() => setIsStudyMode(true)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === "bible" && (
                <div className="space-y-10 text-left" id="bible_tab_container">
                  <div className="border-l-4 border-[#1A1A1A] pl-5 space-y-1.5">
                    <span className="font-sans text-[11px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold block">Reading Plans</span>
                    <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">Word Study</h2>
                    <p className="text-sm text-neutral-500 max-w-lg font-sans leading-relaxed">
                      Choose a plan and study one passage per day. Each session includes context, application, and reflection.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {READING_PLANS.map((plan) => {
                      const currentDay = planProgress[plan.id] ?? 1;
                      const verse = getActivePlanVerse(plan.id);
                      const isActive = activeVerse.planId === plan.id;
                      const progressPct = Math.round(((currentDay - 1) / plan.totalDays) * 100);
                      return (
                        <div
                          key={plan.id}
                          className={`p-8 border bg-white rounded-none transition flex flex-col text-left ${
                            isActive ? "border-2 border-[#1A1A1A]" : "border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-5">
                            <div>
                              <span className="text-[10px] font-bold font-sans uppercase text-neutral-400 tracking-widest block mb-1">{plan.theme}</span>
                              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">{plan.title}</h3>
                              <p className="text-xs text-neutral-500 font-sans mt-1">{plan.description}</p>
                            </div>
                            {isActive && (
                              <span className="text-[9px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-wider font-sans whitespace-nowrap ml-4">Active</span>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div className="mb-5">
                            <div className="flex justify-between text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 mb-1.5">
                              <span>Day {currentDay} of {plan.totalDays}</span>
                              <span>{progressPct}% complete</span>
                            </div>
                            <div className="h-1 bg-neutral-100 w-full">
                              <div className="h-1 bg-[#1A1A1A] transition-all" style={{ width: `${progressPct}%` }} />
                            </div>
                          </div>

                          {/* Today's verse preview */}
                          <div className="bg-neutral-50 p-4 mb-5">
                            <span className="text-[9px] font-bold font-sans uppercase tracking-widest text-neutral-400 block mb-1">Today — {verse.reference}</span>
                            <p className="text-xs text-neutral-600 italic font-serif line-clamp-2 leading-relaxed">{verse.verseLines[0]}</p>
                          </div>

                          <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => { setActiveVerse(verse); setIsStudyMode(true); }}
                              className="bg-[#1A1A1A] text-white hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-widest px-4 py-3 rounded-none text-center transition flex-1 flex items-center justify-center gap-1.5"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Study Day {currentDay}</span>
                            </button>
                            {currentDay < plan.totalDays && (
                              <button
                                onClick={() => {
                                  const next = currentDay + 1;
                                  const updated = { ...planProgress, [plan.id]: next };
                                  setPlanProgress(updated);
                                  localStorage.setItem("dcpl_plan_progress", JSON.stringify(updated));
                                  setBibleToast(`Day ${currentDay} complete — Day ${next} unlocked`);
                                  setTimeout(() => setBibleToast(null), 3000);
                                }}
                                className="border border-[#1A1A1A] hover:bg-neutral-50 text-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest px-4 py-3 rounded-none transition"
                              >
                                Mark Done
                              </button>
                            )}
                            {currentDay === plan.totalDays && progressPct === 100 && (
                              <span className="border border-neutral-200 text-neutral-400 text-[10px] uppercase font-bold tracking-widest px-4 py-3">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Curriculum card */}
                    {(() => {
                      const totalLessons = CURRICULUM_PLANS.reduce((s, p) => s + p.topics.reduce((ts, t) => ts + t.lessons.length, 0), 0);
                      const completedLessons = (() => { try { return (JSON.parse(localStorage.getItem("dcpl_curriculum_completed") || "[]") as string[]).length; } catch { return 0; } })();
                      const pct = Math.round((completedLessons / totalLessons) * 100);
                      return (
                        <div className="p-8 border border-neutral-200 hover:border-neutral-400 bg-white rounded-none transition flex flex-col text-left">
                          <div className="flex justify-between items-start mb-5">
                            <div>
                              <span className="text-[10px] font-bold font-sans uppercase text-neutral-400 tracking-widest block mb-1">Discipleship Curriculum</span>
                              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Growing in Christ</h3>
                              <p className="text-xs text-neutral-500 font-sans mt-1">4 modules · 11 topics · 33 lessons on discipleship, theology, and spiritual formation.</p>
                            </div>
                          </div>
                          <div className="mb-5">
                            <div className="flex justify-between text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 mb-1.5">
                              <span>{completedLessons} of {totalLessons} lessons</span>
                              <span>{pct}% complete</span>
                            </div>
                            <div className="h-1 bg-neutral-100 w-full">
                              <div className="h-1 bg-[#1A1A1A] transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <div className="bg-neutral-50 p-4 mb-5">
                            <span className="text-[9px] font-bold font-sans uppercase tracking-widest text-neutral-400 block mb-1">Includes</span>
                            <p className="text-xs text-neutral-600 font-sans leading-relaxed">Growing in Christ · Message of Christ · Becoming Like Christ · Serving Christ</p>
                          </div>
                          <div className="pt-4 border-t border-gray-100">
                            <button
                              onClick={() => setIsCurriculumMode(true)}
                              className="bg-[#1A1A1A] text-white hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-widest px-4 py-3 rounded-none text-center transition w-full flex items-center justify-center gap-1.5"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Open Curriculum</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {activeTab === "path" && <PathView />}

              {activeTab === "prayer" && (
                <PrayerView onUpgrade={() => { setLoginMode("register"); setActiveTab("pricing"); }} />
              )}

              {activeTab === "mission" && (
                <MissionView stats={stats} onUpdateStats={handleUpdateStats} />
              )}

              {activeTab === "pricing" && (
                <PricingView onSignUpRequired={() => { setLoginMode("register"); setShowLogin(true); }} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="sticky bottom-0 mt-auto z-40 bg-[#F9F8F6] border-t-2 border-[#1A1A1A] py-4 px-4 flex justify-around items-center" id="sticky_bottom_nav">
        <div className="flex justify-around items-center w-full">
          <button
            onClick={() => { setActiveTab("home"); setIsStudyMode(false); setIsCurriculumMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "home" && !isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Home</span>
          </button>
          <button
            onClick={() => { setActiveTab("bible"); setIsStudyMode(false); setIsCurriculumMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "bible" || isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Bible</span>
          </button>
          <button
            onClick={() => { setActiveTab("path"); setIsStudyMode(false); setIsCurriculumMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "path" && !isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Path</span>
          </button>
          <button
            onClick={() => { setActiveTab("mission"); setIsStudyMode(false); setIsCurriculumMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "mission" && !isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Mission</span>
          </button>
          <button
            onClick={() => { setActiveTab("prayer"); setIsStudyMode(false); setIsCurriculumMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "prayer" && !isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            <BookMarked className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Prayer</span>
          </button>
          <button
            onClick={() => { setActiveTab("pricing"); setIsStudyMode(false); setIsCurriculumMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === "pricing" && !isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Plans</span>
          </button>
        </div>
      </nav>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 w-full max-w-md relative z-10 rounded-none shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6 border-b border-[#1A1A1A] pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#1A1A1A]" />
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A] italic">Sanctuary Settings</h3>
                </div>
                <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-none border border-[#1A1A1A] flex items-center justify-center hover:bg-neutral-100 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 text-left">
                <div>
                  <label className="block text-[10px] text-neutral-450 font-sans font-bold uppercase mb-2 tracking-widest">Display Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-neutral-400"><User className="w-4 h-4" /></span>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full bg-neutral-50 border border-[#1A1A1A] py-2.5 pl-10 pr-4 text-sm focus:outline-none rounded-none text-[#1A1A1A]"
                      placeholder="Display name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-450 font-sans font-bold uppercase mb-2 tracking-widest">App Theme</label>
                  <p className="text-xs text-[#1A1A1A] leading-relaxed p-4 border border-[#1A1A1A] bg-neutral-50 italic">
                    Editorial Aesthetic — ivory tones (#F9F8F6), classic serifs, high-contrast charcoal.
                  </p>
                </div>

                <div className="border border-[#1A1A1A] p-4 bg-white space-y-3.5">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <label className="block text-[10px] text-neutral-450 font-sans font-bold uppercase tracking-widest">Daily Study Reminders</label>
                      <span className="text-[10px] text-neutral-500 font-sans block mt-0.5">Local browser notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={remindersEnabled} onChange={handleToggleReminders} className="sr-only peer" />
                      <div className="w-11 h-6 bg-neutral-200 border border-[#1A1A1A] rounded-none peer peer-checked:bg-[#1A1A1A] transition" />
                      <div className={`absolute left-1 top-1 w-4 h-4 bg-white border border-[#1A1A1A] rounded-none transition ${remindersEnabled ? "translate-x-5" : ""}`} />
                    </label>
                  </div>
                  {remindersEnabled && (
                    <div className="pt-3 border-t border-[#1A1A1A] border-dashed space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-neutral-500 uppercase">Permission:</span>
                        <span className={`font-bold uppercase ${permissionStatus === "granted" ? "text-green-600" : permissionStatus === "denied" ? "text-red-500" : "text-amber-600"}`}>
                          {permissionStatus.toUpperCase()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={sendTestNotificationImmediately}
                        className="w-full border border-[#1A1A1A] bg-[#F9F8F6] hover:bg-neutral-50 py-2 text-[9px] uppercase font-bold tracking-widest transition rounded-none flex items-center justify-center gap-1.5"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Send test reminder in 5 seconds</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-neutral-50 border border-[#1A1A1A] font-sans space-y-2">
                  <div className="flex gap-2 items-center text-[#1A1A1A] font-bold text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    <span>Privacy</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-500">
                    Prayer journal, habits, and progress sync to your account when signed in. No third-party analytics or tracking.
                  </p>
                </div>

                {settingsStatusMessage && <p className="text-xs text-green-600 font-bold text-center">{settingsStatusMessage}</p>}

                <div className="pt-4 border-t border-[#1A1A1A] flex flex-col gap-2.5">
                  <button type="submit" className="w-full bg-[#1A1A1A] text-white hover:bg-neutral-800 py-3 text-xs uppercase font-bold tracking-widest text-center transition rounded-none">
                    Save Modifications
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllData}
                    className="w-full border border-red-200 hover:bg-red-50 hover:text-red-700 py-3 text-sm uppercase font-bold tracking-widest text-center text-red-500 transition flex items-center justify-center gap-1.5 rounded-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset Device Memory</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification permission toast */}
      <AnimatePresence>
        {notifToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-4 right-4 sm:max-w-[358px] sm:left-1/2 sm:-translate-x-1/2 bg-[#1A1A1A] text-white p-5 rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,0.3)] flex items-center justify-between gap-4 z-50 border-2 border-white"
          >
            <span className="text-xs font-bold font-sans uppercase tracking-wider">{notifToast}</span>
            <button onClick={() => setNotifToast(null)} className="text-neutral-400 hover:text-white text-[9px] font-mono tracking-widest uppercase transition">[×]</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bible set-active toast */}
      <AnimatePresence>
        {bibleToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-4 right-4 sm:max-w-[358px] sm:left-1/2 sm:-translate-x-1/2 bg-[#1A1A1A] text-white p-5 rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,0.3)] flex items-center justify-between gap-4 z-50 border-2 border-white"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-xs font-bold font-sans uppercase tracking-wider">{bibleToast}</span>
            </div>
            <button onClick={() => setBibleToast(null)} className="text-neutral-400 hover:text-white text-[9px] font-mono tracking-widest uppercase transition">
              [Dismiss]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <LoginModal
            initialMode={loginMode}
            onClose={() => setShowLogin(false)}
          />
        )}
      </AnimatePresence>
    </div>
    </div> {/* app_frame_outer */}
  );
}
