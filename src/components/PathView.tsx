import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Lock, BookOpen, Users, Compass, ShieldAlert, Award } from "lucide-react";
import { PathStage } from "../types";

export default function PathView() {
  const [discipleProgress, setDiscipleProgress] = useState<number>(64);
  const [requirements, setRequirements] = useState([
    { id: "r1", text: "Complete 'The Great Commission' module", completed: true },
    { id: "r2", text: "Guide 2 individuals through Seeker path", completed: false },
    { id: "r3", text: "Attend Leadership Workshop", completed: false }
  ]);

  useEffect(() => {
    const savedReqs = localStorage.getItem("path_requirements");
    if (savedReqs) {
      try {
        setRequirements(JSON.parse(savedReqs));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Recalculate progress when requirements change
  useEffect(() => {
    // Stage 3 base starts at 33% and increments up to 100% based on subtasks
    const completedCount = requirements.filter((r) => r.completed).length;
    const calculatedPercentage = Math.round(40 + (completedCount / requirements.length) * 60);
    setDiscipleProgress(calculatedPercentage);
  }, [requirements]);

  const toggleRequirement = (id: string) => {
    const updated = requirements.map((r) => {
      if (r.id === id) {
        return { ...r, completed: !r.completed };
      }
      return r;
    });
    setRequirements(updated);
    localStorage.setItem("path_requirements", JSON.stringify(updated));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[800px] mx-auto space-y-12 pb-24 text-left"
      id="path_view_container"
    >
      <section className="space-y-3" id="path_heading_intro">
        <span className="font-sans text-[10px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold block">
          The Journey of Faith
        </span>
        <h2 className="font-serif text-4xl font-bold text-[#1A1A1A]">
          Your Path to Growth
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-neutral-500 font-sans">
          Every step is a deliberate move towards a deeper relationship and a clearer purpose. Click on task checkpoints in the current stage to track your active progress.
        </p>
      </section>

      {/* Vertical Progression Timeline */}
      <div className="relative pl-12 space-y-8" id="path_timeline_flow">
        {/* Continuous vertical connector line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#1A1A1A]" />

        {/* Stage 1 - Seeker (Completed) */}
        <div className="relative flex items-start gap-6" id="path_stage_1">
          <div className="absolute -left-12 top-0 mt-0.5 w-10 h-10 bg-[#1A1A1A] flex items-center justify-center text-white border border-[#1A1A1A] rounded-none z-10 transition">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div className="pt-0.5 text-left">
            <h3 className="font-serif text-lg font-bold text-neutral-400">Seeker</h3>
            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Completed • Jan 2026</p>
          </div>
        </div>

        {/* Stage 2 - Believer (Completed) */}
        <div className="relative flex items-start gap-6" id="path_stage_2">
          <div className="absolute -left-12 top-0 mt-0.5 w-10 h-10 bg-[#1A1A1A] flex items-center justify-center text-white border border-[#1A1A1A] rounded-none z-10 transition">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div className="pt-0.5 text-left">
            <h3 className="font-serif text-lg font-bold text-neutral-400">Believer</h3>
            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Completed • March 2026</p>
          </div>
        </div>

        {/* Stage 3 - Disciple (Active & Interactive) */}
        <div className="relative flex items-start gap-6" id="path_stage_3">
          <div className="absolute -left-12 top-1.5 w-10 h-10 bg-[#F9F8F6] border-2 border-[#1A1A1A] flex items-center justify-center z-10 rounded-none">
            <div className="w-3.5 h-3.5 bg-[#1A1A1A] rounded-none animate-pulse" />
          </div>

          <div className="flex-1 bg-white border-2 border-[#1A1A1A] p-6 md:p-8 rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="text-left">
                <span className="inline-block px-2.5 py-0.5 border border-[#1A1A1A] text-[#1A1A1A] text-[9px] font-bold uppercase tracking-widest mb-2 font-sans bg-neutral-50">
                  Current Stage
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#1A1A1A]">Disciple</h3>
              </div>
              <div className="md:text-right text-left">
                <p className="text-[10px] text-neutral-400 uppercase font-sans font-bold tracking-widest">Progress</p>
                <p className="font-serif text-3xl font-bold text-[#1A1A1A]">{discipleProgress}%</p>
              </div>
            </div>

            {/* Stage subtrack disciplines item boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1A1A1A] border border-[#1A1A1A] mb-6">
              <div className="bg-white p-5 text-left rounded-none">
                <BookOpen className="w-5 h-5 text-[#1A1A1A] mb-2.5" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-0.5 font-sans">Deep Study</h4>
                <p className="text-[11px] text-neutral-500">4 of 7 completed</p>
              </div>
              <div className="bg-white p-5 text-left rounded-none">
                <Users className="w-5 h-5 text-[#1A1A1A] mb-2.5" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-0.5 font-sans">Fellowship</h4>
                <p className="text-[11px] text-neutral-500">Weekly group circle</p>
              </div>
              <div className="bg-white p-5 text-left rounded-none">
                <Compass className="w-5 h-5 text-[#1A1A1A] mb-2.5" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-0.5 font-sans">Journaling</h4>
                <p className="text-[11px] text-neutral-500">Dual entry habits</p>
              </div>
            </div>

            {/* Checklist of locked milestone criteria */}
            <div className="pt-6 border-t border-[#1A1A1A] text-left">
              <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-widest mb-4 font-sans">
                To reach Ambassador stage
              </p>

              <div className="space-y-3" id="path_progress_lock_tasks">
                {requirements.map((req) => (
                  <button
                    key={req.id}
                    onClick={() => toggleRequirement(req.id)}
                    className="flex items-center gap-3 w-full text-left p-2 rounded-none hover:bg-neutral-50 transition border border-transparent hover:border-neutral-200"
                  >
                    <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all rounded-none ${
                      req.completed
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                        : "border-[#1A1A1A] bg-white"
                    }`}>
                      {req.completed && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-xs text-neutral-805 transition ${req.completed ? "line-through opacity-50 font-mono" : "font-sans font-bold"}`}>
                      {req.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stage 4 - Ambassador (Locked) */}
        <div className="relative flex items-start gap-6 opacity-45" id="path_stage_4">
          <div className="absolute -left-12 top-0 mt-0.5 w-10 h-10 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center text-neutral-400 z-10 rounded-none">
            <Lock className="w-4 h-4" />
          </div>
          <div className="flex-1 border-2 border-dashed border-neutral-300 p-6 text-left bg-neutral-50/20 rounded-none">
            <div className="flex gap-1.5 items-center mb-1">
              <h3 className="font-serif text-lg font-bold text-neutral-600">Ambassador</h3>
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <p className="text-xs text-neutral-500 font-serif italic">Leading others toward the truth of grace.</p>
          </div>
        </div>
      </div>

      {/* Quote citation display */}
      <section className="pt-10 border-t-2 border-[#1A1A1A] text-center" id="path_quote_box">
        <blockquote className="font-serif text-lg text-neutral-800 italic mb-3">
          "I am the way, the truth, and the life."
        </blockquote>
        <span className="text-[10px] text-[#1A1A1A] uppercase tracking-widest font-bold font-mono">
          — John 14:6
        </span>
      </section>
    </motion.div>
  );
}
