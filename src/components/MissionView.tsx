import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check, Heart, BookOpen, MessageCircle, Users, HelpCircle, Trophy, Zap } from "lucide-react";
import { Mission, UserStats } from "../types";
import { DEFAULT_MISSIONS } from "../data";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

interface MissionViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export default function MissionView({ stats, onUpdateStats }: MissionViewProps) {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [completedMissionTitle, setCompletedMissionTitle] = useState<string | null>(null);

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

  const saveMissions = (updated: Mission[], changedId: string, changedStatus: string) => {
    setMissions(updated);
    if (user) {
      api.missions.update(changedId, changedStatus).catch(console.error);
    }
  };

  const handleStartMission = (missionId: string) => {
    const updated = missions.map((m) =>
      m.id === missionId ? { ...m, status: "active" as const } : m
    );
    saveMissions(updated, missionId, "active");
    setToastMessage("Mission set to active! Step out in divine confidence today.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCompleteMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    const updated = missions.map((m) =>
      m.id === missionId ? { ...m, status: "completed" as const } : m
    );
    saveMissions(updated, missionId, "completed");

    const newCompletedCount = stats.completedMissionsCount + 1;
    let newLevel = stats.level;
    if (newCompletedCount % 4 === 0) {
      newLevel += 1; // Milestone promotions
    }

    onUpdateStats({
      ...stats,
      completedMissionsCount: newCompletedCount,
      level: newLevel
    });

    if (mission) {
      setCompletedMissionTitle(mission.title);
      setTimeout(() => setCompletedMissionTitle(null), 3500);
    }
  };

  // Convert icon name strings to actual Lucide component wrappers with Stark Styling
  const renderIcon = (type: string) => {
    switch (type) {
      case "Heart":
        return <Heart className="w-6 h-6 text-[#1A1A1A]" />;
      case "BookOpen":
        return <BookOpen className="w-6 h-6 text-[#1A1A1A]" />;
      case "MessageCircle":
        return <MessageCircle className="w-6 h-6 text-[#1A1A1A]" />;
      case "Users":
        return <Users className="w-6 h-6 text-[#1A1A1A]" />;
      default:
        return <Check className="w-6 h-6 text-[#1A1A1A]" />;
    }
  };

  // Calculate dynamic level progress thresholds based on completed mission actions
  const completedCount = stats.completedMissionsCount;
  const isBeginning = true; // Always unlocked as entry level
  const isConsistent = completedCount >= 5;
  const isInfluencer = completedCount >= 10;
  const isLeader = completedCount >= 15;
  const isApostle = completedCount >= 20;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[800px] mx-auto space-y-12 pb-24 text-left"
      id="mission_view_container"
    >
      {/* Visual Header Panel block */}
      <section className="text-left border-l-4 border-[#1A1A1A] pl-5 space-y-1.5" id="mission_heading">
        <span className="font-sans text-[10px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold block">
          Kingdom Action
        </span>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A]">
          Spiritual Assignments
        </h2>
        <p className="text-sm text-neutral-500 font-sans leading-relaxed">
          Faith is a verb. Choose a mission below to step out in love, expand your comfort margins, and serve the world around you.
        </p>
      </section>

      {/* Grid of Missions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1A1A1A] border-2 border-[#1A1A1A]" id="mission_actions_grid">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="bg-white p-8 flex flex-col justify-between hover:bg-neutral-50/50 transition text-left rounded-none"
            id={`mission_card_${mission.id}`}
          >
            <div>
              <div className="mb-4" id="mission_icon_box">
                {renderIcon(mission.iconType)}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">{mission.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-8">
                {mission.description}
              </p>
            </div>

            {/* Stage Toggle Button statuses: Start, progress complete, or already completed */}
            <div id="mission_cta_box">
              {mission.status === "idle" && (
                <button
                  onClick={() => handleStartMission(mission.id)}
                  className="w-full border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white py-3.5 font-sans text-[9px] font-bold uppercase tracking-[0.2em] transition duration-200 rounded-none cursor-pointer"
                >
                  Start Mission
                </button>
              )}

              {mission.status === "active" && (
                <button
                  onClick={() => handleCompleteMission(mission.id)}
                  className="w-full bg-[#1A1A1A] text-white hover:bg-neutral-800 py-3.5 font-sans text-[9px] font-bold uppercase tracking-[0.2em] transition duration-200 animate-pulse flex items-center justify-center gap-1.5 rounded-none cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Complete Mission</span>
                </button>
              )}

              {mission.status === "completed" && (
                <div className="w-full bg-neutral-100 border-2 border-[#1A1A1A] text-[#1A1A1A] py-3.5 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-center flex items-center justify-center gap-1 rounded-none">
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                  <span>Completed Today</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mission completion banner */}
      <AnimatePresence>
        {completedMissionTitle && (
          <motion.div
            key="mission-complete"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white p-6 text-center space-y-1"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Mission Complete</p>
            <p className="font-serif text-lg font-bold">{completedMissionTitle}</p>
            <p className="text-[10px] text-neutral-400 italic">"Well done, good and faithful servant." — Matthew 25:23</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Impact Journey Status Panel */}
      <section className="border-t border-[#1A1A1A] pt-10 text-left space-y-6" id="mission_progression_panel">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-1">Impact Ledger</h3>
            <p className="text-xs text-neutral-500 font-sans">
              Dynamic tracking of active spiritual assignments based on logged milestones.
            </p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-auto py-2 px-4 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] font-mono text-xs font-bold tracking-wider uppercase rounded-none">
            <span>{stats.completedMissionsCount} completed</span>
          </div>
        </div>

        {/* Dynamic Progression horizontal bar */}
        <div className="relative py-6" id="progress_bar_horizontal">
          <div className="h-[2px] bg-neutral-200 w-full absolute top-1/2 -translate-y-1/2" />
          
          {/* Highlighted portion bar */}
          <div
            className="h-[2px] bg-[#1A1A1A] absolute top-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              width: `${
                completedCount >= 20 ? 100 :
                completedCount >= 15 ? 75 :
                completedCount >= 10 ? 50 :
                completedCount >= 5 ? 25 : 0
              }%`
            }}
          />

          <div className="relative z-10 flex justify-between" id="progress_points">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-none border-2 transition ${isBeginning ? "bg-[#1A1A1A] border-[#1A1A1A]" : "bg-white border-neutral-300"}`} />
              <span className={`text-[8px] font-bold uppercase tracking-widest ${isBeginning ? "text-[#1A1A1A]" : "text-neutral-400"}`}>
                Beginning
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-none border-2 transition ${isConsistent ? "bg-[#1A1A1A] border-[#1A1A1A]" : "bg-white border-neutral-300"}`} />
              <span className={`text-[8px] font-bold uppercase tracking-widest ${isConsistent ? "text-[#1A1A1A]" : "text-neutral-400"}`}>
                Consistent
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-none border-2 transition ${isInfluencer ? "bg-[#1A1A1A] border-[#1A1A1A]" : "bg-white border-neutral-300"}`} />
              <span className={`text-[8px] font-bold uppercase tracking-widest ${isInfluencer ? "text-[#1A1A1A]" : "text-neutral-400"}`}>
                Influencer
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-none border-2 transition ${isLeader ? "bg-[#1A1A1A] border-[#1A1A1A]" : "bg-white border-neutral-300"}`} />
              <span className={`text-[8px] font-bold uppercase tracking-widest ${isLeader ? "text-[#1A1A1A]" : "text-neutral-400"}`}>
                Leader
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-none border-2 transition ${isApostle ? "bg-[#1A1A1A] border-[#1A1A1A]" : "bg-white border-neutral-300"}`} />
              <span className={`text-[8px] font-bold uppercase tracking-widest ${isApostle ? "text-[#1A1A1A]" : "text-neutral-400"}`}>
                Apostle
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual notification banner toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 left-4 right-4 sm:max-w-[358px] sm:left-1/2 sm:-translate-x-1/2 bg-[#1A1A1A] text-white p-5 rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,0.3)] flex items-center justify-between gap-4 z-50 text-left border-2 border-white"
            id="mission_toast"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-white animate-bounce flex-shrink-0" />
              <span className="text-xs font-bold font-sans uppercase tracking-wider">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-neutral-305 hover:text-white text-[9px] font-mono tracking-widest uppercase transition cursor-pointer"
            >
              [Dismiss]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
