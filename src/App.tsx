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
  RefreshCw,
  X,
  User,
  Heart,
  Bell,
  BellOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { UserStats, ScriptureVerse } from "./types";
import { DEFAULT_USER_STATS, DEFAULT_VERSES } from "./data";

// Sub-components
import HomeView from "./components/HomeView";
import FocusView from "./components/FocusView";
import PathView from "./components/PathView";
import PrayerView from "./components/PrayerView";
import MissionView from "./components/MissionView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [activeVerse, setActiveVerse] = useState<ScriptureVerse>(DEFAULT_VERSES[0]); // Day 4 vine by default
  const [stats, setStats] = useState<UserStats>(DEFAULT_USER_STATS);
  const [isStudyMode, setIsStudyMode] = useState<boolean>(false);
  
  // Settings overlay control
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [settingsStatusMessage, setSettingsStatusMessage] = useState<string | null>(null);

  // Daily Bible study reminder notification settings
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<string>("default");

  // Load stats from LocalStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem("sanctuary_user_stats");
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        setNewUsername(parsed.username);
      } catch (e) {
        // ignore
      }
    } else {
      setNewUsername(DEFAULT_USER_STATS.username);
    }

    const remindersStored = localStorage.getItem("sanctuary_reminders_enabled");
    if (remindersStored === "true") {
      setRemindersEnabled(true);
    }
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleToggleReminders = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support local desktop notifications.");
      return;
    }

    if (!remindersEnabled) {
      Notification.requestPermission().then((permission) => {
        setPermissionStatus(permission);
        if (permission === "granted") {
          setRemindersEnabled(true);
          localStorage.setItem("sanctuary_reminders_enabled", "true");
          try {
            new Notification("DCPL Sanctuary Reminders", {
              body: "Daily reminders successfully activated on this browser ledger.",
            });
          } catch (err) {
            console.error("Failed to showcase immediate Notification: ", err);
          }
        } else {
          alert("Permission was not granted. Please enable notifications in your browser settings to use this feature.");
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
      alert("Please ensure browser notification permissions are granted first.");
      return;
    }

    setSettingsStatusMessage("Scheduled! Expect test reminder in 5 seconds...");

    setTimeout(() => {
      setSettingsStatusMessage(null);
      if (Notification.permission === "granted") {
        try {
          new Notification("DCPL Sanctuary Daily Study", {
            body: "Time for your daily scripture study check-in! Return to the sanctuary and keep building your habits.",
          });
        } catch (err) {
          console.error("Notification creation error: ", err);
        }
      }
    }, 5500);
  };

  const handleUpdateStats = (updatedStats: UserStats) => {
    setStats(updatedStats);
    localStorage.setItem("sanctuary_user_stats", JSON.stringify(updatedStats));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      alert("Please specify a valid name!");
      return;
    }
    const updated = { ...stats, username: newUsername };
    handleUpdateStats(updated);
    setSettingsStatusMessage("Profile updated successfully!");
    setTimeout(() => {
      setSettingsStatusMessage(null);
      setShowSettings(false);
    }, 1500);
  };

  const handleClearAllData = () => {
    const confirmClear = window.confirm(
      "CONFIRM: This will permanently wipe all your local highlights, prayers, and growth journey progress cached on this device under your web browser sandboxed container. There is no cloud backup to restore from. Continue?"
    );
    if (confirmClear) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSelectVerseForStudy = (verse: ScriptureVerse) => {
    setActiveVerse(verse);
    setIsStudyMode(true);
  };

  // Convert month or active date labels for screen indicators
  const currentLongDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <div className="bg-[#F9F8F6] min-h-screen text-[#1A1A1A] flex flex-col selection:bg-neutral-200 selection:text-black font-sans" id="app_root_layout">
      
      {/* Top Main Navigation Header Bar */}
      <header className="sticky top-0 z-30 bg-[#F9F8F6]/90 backdrop-blur-md border-b-2 border-[#1A1A1A]" id="navigation_main_header">
        <div className="flex justify-between items-baseline w-full px-5 py-5 max-w-[1040px] mx-auto">
          <div className="flex items-baseline gap-6">
            <button
              onClick={() => { setActiveTab("home"); setIsStudyMode(false); }}
              className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A] hover:opacity-85 transition-opacity uppercase"
            >
              DCPL
            </button>
            <span className="hidden md:inline text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Spiritual Ledger</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-sans uppercase tracking-widest text-[#1A1A1A]">
            <span className="hidden sm:flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full"></span> Ledger Active</span>
            <button
              onClick={() => setShowSettings(true)}
              className="hover:text-black hover:underline flex items-center gap-1 transition-colors uppercase font-bold tracking-widest"
              id="header_settings_trigger"
            >
              <span>Settings</span>
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Content viewport */}
      <main className="flex-grow max-w-[1040px] w-full mx-auto px-5 py-8" id="viewport_main_content">
        <AnimatePresence mode="wait">
          {isStudyMode ? (
            <motion.div
              key="study_viewport"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FocusView
                verse={activeVerse}
                onBack={() => setIsStudyMode(false)}
              />
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
                  <div className="border-l-4 border-[#1A1A1A] pl-5 space-y-1.5" id="bible_tab_intro">
                    <span className="font-sans text-[11px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold block">
                      Scripture Selection
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">
                      Word Study Plan
                    </h2>
                    <p className="text-sm text-neutral-500 max-w-lg font-sans leading-relaxed">
                      Select milestones to begin analyzing translations, historic context, and personal applications below on our study deck.
                    </p>
                  </div>

                  {/* List of default available study tracks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="bible_day_grid">
                    {DEFAULT_VERSES.map((verseItem) => {
                      const isActive = activeVerse.id === verseItem.id;
                      return (
                        <div
                          key={verseItem.id}
                          className={`p-8 border bg-white rounded-none transition flex flex-col justify-between text-left ${
                            isActive
                              ? "border-2 border-[#1A1A1A]"
                              : "border-neutral-200 hover:border-[#1A1A1A]"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-baseline mb-4">
                              <span className="text-[10px] font-bold font-sans uppercase text-neutral-455 tracking-widest">
                                Day {verseItem.dayNumber} of {verseItem.totalDays}
                              </span>
                              {isActive && (
                                <span className="text-[9px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-wider font-sans">
                                  Default Selected
                                </span>
                              )}
                            </div>

                            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-3">
                              {verseItem.reference}
                            </h3>

                            {/* Pull-out excerpt preview */}
                            <p className="text-xs text-neutral-400 italic line-clamp-2 font-serif leading-relaxed mb-6">
                              {verseItem.verseLines[0]}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => {
                                  setActiveVerse(verseItem);
                                  setIsStudyMode(true);
                                }}
                              className="bg-[#1A1A1A] text-white hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-widest px-4 py-3 rounded-none text-center transition flex-1 flex items-center justify-center gap-1.5"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Focus Study</span>
                            </button>
                            <button
                              onClick={() => {
                                  setActiveVerse(verseItem);
                                  alert(`Day plan updated to ${verseItem.reference}!`);
                                }}
                              className="border border-[#1A1A1A] hover:bg-neutral-50 text-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest px-4 py-3 rounded-none transition"
                            >
                              Set Active
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "path" && <PathView />}

              {activeTab === "prayer" && <PrayerView />}

              {activeTab === "mission" && (
                <MissionView stats={stats} onUpdateStats={handleUpdateStats} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Tab Sticky Navigation Header for absolute mobile navigation feel */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F9F8F6] border-t-2 border-[#1A1A1A] py-4 px-4 flex justify-around items-center" id="sticky_bottom_nav">
        <div className="flex justify-around items-center w-full max-w-md mx-auto">
          {/* Dashboard Home tab */}
          <button
            onClick={() => { setActiveTab("home"); setIsStudyMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "home" && !isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"
            }`}
            id="tab_trigger_home"
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Home</span>
          </button>

          {/* Scripture tab */}
          <button
            onClick={() => { setActiveTab("bible"); setIsStudyMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "bible" || isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"
            }`}
            id="tab_trigger_bible"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Bible</span>
          </button>

          {/* Growth Path tab */}
          <button
            onClick={() => { setActiveTab("path"); setIsStudyMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "path" && !isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"
            }`}
            id="tab_trigger_path"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Path</span>
          </button>

          {/* Mission tab */}
          <button
            onClick={() => { setActiveTab("mission"); setIsStudyMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "mission" && !isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"
            }`}
            id="tab_trigger_mission"
          >
            <Compass className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Mission</span>
          </button>

          {/* Practice Journal prayer tab */}
          <button
            onClick={() => { setActiveTab("prayer"); setIsStudyMode(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "prayer" && !isStudyMode ? "text-[#1A1A1A] font-bold scale-105" : "text-neutral-400 hover:text-neutral-600"
            }`}
            id="tab_trigger_prayer"
          >
            <BookMarked className="w-5 h-5" />
            <span className="text-[9px] font-sans uppercase tracking-widest font-bold">Prayer</span>
          </button>
        </div>
      </nav>

      {/* Settings Dialog Overlay popup */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="settings_modal_wrapper">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 w-full max-w-md relative z-10 rounded-none shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] overflow-y-auto max-h-[90vh]"
              id="settings_modal_content"
            >
              <div className="flex justify-between items-center mb-6 border-b border-[#1A1A1A] pb-3" id="settings_modal_header">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#1A1A1A]" />
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A] italic">Sanctuary Settings</h3>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 rounded-none border border-[#1A1A1A] flex items-center justify-center hover:bg-neutral-100 text-[#1A1A1A] transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form profile modifications */}
              <form onSubmit={handleSaveSettings} className="space-y-6 text-left" id="settings_profile_form">
                <div>
                  <label className="block text-[10px] text-neutral-450 font-sans font-bold uppercase mb-2 tracking-widest">
                    My Account Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-neutral-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full bg-neutral-50 border border-[#1A1A1A] py-2.5 pl-10 pr-4 text-sm focus:outline-none rounded-none text-[#1A1A1A]"
                      placeholder="My customized display name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-450 font-sans font-bold uppercase mb-2 tracking-widest">
                    App theme preset selection
                  </label>
                  <p className="text-xs text-[#1A1A1A] leading-relaxed p-4 border border-[#1A1A1A] bg-neutral-50 italic">
                    Editorial Aesthetic Preset activated. Structured with active ivory tones (#F9F8F6), classic serifs, and high-contrast charcoal lines to clear digital clutter.
                  </p>
                </div>

                {/* Local Daily Study notifications settings block */}
                <div className="border border-[#1A1A1A] p-4 bg-white space-y-3.5" id="notifications_settings_container">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <label className="block text-[10px] text-neutral-450 font-sans font-bold uppercase tracking-widest">
                        Daily Study Reminders
                      </label>
                      <span className="text-[10px] text-neutral-500 font-sans block mt-0.5" id="notification_status_description">
                        Local browser notifications without remote servers
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer" id="reminders_toggle_label">
                      <input
                        type="checkbox"
                        checked={remindersEnabled}
                        onChange={handleToggleReminders}
                        className="sr-only peer"
                        id="checkbox_daily_reminders"
                      />
                      <div className="w-11 h-6 bg-neutral-200 border border-[#1A1A1A] rounded-none peer peer-checked:bg-[#1A1A1A] transition" />
                      <div className={`absolute left-1 top-1 w-4 h-4 bg-white border border-[#1A1A1A] rounded-none transition ${remindersEnabled ? "translate-x-5 border-[#1A1A1A]" : ""}`} />
                    </label>
                  </div>

                  {remindersEnabled && (
                    <div className="pt-3 border-t border-[#1A1A1A] border-dashed space-y-2.5" id="notifications_test_panel">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-neutral-500 uppercase">OS Permission Status:</span>
                        <span className={`font-bold uppercase ${
                          permissionStatus === "granted" ? "text-green-600" :
                          permissionStatus === "denied" ? "text-red-500" : "text-amber-600"
                        }`} id="permission_status_label">
                          {permissionStatus.toUpperCase()}
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={sendTestNotificationImmediately}
                        className="w-full border border-[#1A1A1A] bg-[#F9F8F6] hover:bg-neutral-50 py-2 text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A] transition rounded-none flex items-center justify-center gap-1.5"
                        id="btn_trigger_test_notification"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Send test reminder in 5 seconds</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* GDPR statement */}
                <div className="p-4 bg-neutral-50 border border-[#1A1A1A] font-sans space-y-2">
                  <div className="flex gap-2 items-center text-[#1A1A1A] font-bold text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    <span>Lumina Ledger Compliance</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-500 font-sans">
                    All scriptures bookmarks, prayer journal requests, habit streaks, completed levels and progress stats are handled and stored <strong>locally on your physical device</strong> using standard web sandboxed LocalStorage. No remote analytical queries or telemetry tracking are executed. Privacy is complete.
                  </p>
                </div>

                {settingsStatusMessage && (
                  <p className="text-xs text-green-600 font-bold text-center">
                    {settingsStatusMessage}
                  </p>
                )}

                {/* Action buttons */}
                <div className="pt-4 border-t border-[#1A1A1A] flex flex-col gap-2.5">
                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] text-white hover:bg-neutral-800 py-3 text-xs uppercase font-bold tracking-widest text-center transition rounded-none"
                  >
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

    </div>
  );
}
