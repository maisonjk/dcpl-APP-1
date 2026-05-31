import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, BookOpen, ChevronLeft, Check, Share2, HelpCircle } from "lucide-react";
import { ScriptureVerse } from "../types";

interface FocusViewProps {
  verse: ScriptureVerse;
  onBack: () => void;
}

export default function FocusView({ verse, onBack }: FocusViewProps) {
  const [activeTab, setActiveTab] = useState<"meaning" | "context" | "application">("meaning");
  const [highlightedParagraphs, setHighlightedParagraphs] = useState<number[]>([]);
  const [savedInsight, setSavedInsight] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Load saved highlights on mount
  useEffect(() => {
    const key = `focus_highlights_${verse.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setHighlightedParagraphs(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }

    const savedNotesKey = `focus_insight_${verse.id}`;
    const savedNotes = localStorage.getItem(savedNotesKey);
    if (savedNotes) {
      setSavedInsight(savedNotes);
    }
  }, [verse.id]);

  const toggleHighlight = (index: number) => {
    let newHighlights = [...highlightedParagraphs];
    if (newHighlights.includes(index)) {
      newHighlights = newHighlights.filter((i) => i !== index);
    } else {
      newHighlights.push(index);
    }
    setHighlightedParagraphs(newHighlights);
    localStorage.setItem(`focus_highlights_${verse.id}`, JSON.stringify(newHighlights));
  };

  const handleShare = () => {
    const textToCopy = `${verse.reference}\n\n${verse.verseLines.join("\n\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const [highlightHint, setHighlightHint] = useState(false);

  const handleSaveInsight = () => {
    if (highlightedParagraphs.length === 0) {
      setHighlightHint(true);
      setTimeout(() => setHighlightHint(false), 3000);
      return;
    }
    const insightMessage = `Saved highlight for ${verse.reference} on Day ${verse.dayNumber}: ${highlightedParagraphs.length} verse line(s)`;
    setSavedInsight(insightMessage);
    localStorage.setItem(`focus_insight_${verse.id}`, insightMessage);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-[700px] mx-auto min-h-screen px-4 pb-28 pt-8"
      id="focus_view_container"
    >
      {/* Top action header bar */}
      <div className="flex justify-between items-center mb-8" id="focus_header">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-none border border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] hover:bg-neutral-100 transition-colors"
          id="focus_back_button"
          aria-label="Go Back to Home"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 " id="focus_day_progress">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]">
            Day {verse.dayNumber} of {verse.totalDays}
          </span>
          <div className="w-14 h-2 border border-[#1A1A1A] bg-white rounded-none p-[1px]">
            <div
              className="h-full bg-[#1A1A1A] transition-all"
              style={{ width: `${(verse.dayNumber / verse.totalDays) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-none border border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] hover:bg-neutral-100 transition-colors relative"
          id="focus_share_button"
          aria-label="Share Scripture"
        >
          <Share2 className="w-4 h-4" />
          <AnimatePresence>
            {copiedNotification && (
              <motion.span
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: -35, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute text-[9px] bg-[#1A1A1A] text-white px-2 py-1 rounded-none border border-[#1A1A1A] shadow-md whitespace-nowrap font-sans font-bold uppercase tracking-widest"
              >
                Copied to clipboard
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mini Pillar Pills Selector */}
      <div className="flex border border-[#1A1A1A] bg-white rounded-none p-1 mb-10 max-w-sm mx-auto" id="focus_tabs">
        <button
          onClick={() => setActiveTab("meaning")}
          className={`flex-1 text-center py-2 text-[10px] font-bold uppercase tracking-widest rounded-none transition-all duration-200 ${
            activeTab === "meaning"
              ? "bg-[#1A1A1A] text-white"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
          id="focus_tab_meaning"
        >
          Simple Meaning
        </button>
        <button
          onClick={() => setActiveTab("context")}
          className={`flex-1 text-center py-2 text-[10px] font-bold uppercase tracking-widest rounded-none transition-all duration-200 ${
            activeTab === "context"
              ? "bg-[#1A1A1A] text-white"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
          id="focus_tab_context"
        >
          Context
        </button>
        <button
          onClick={() => setActiveTab("application")}
          className={`flex-1 text-center py-2 text-[10px] font-bold uppercase tracking-widest rounded-none transition-all duration-200 ${
            activeTab === "application"
              ? "bg-[#1A1A1A] text-white"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
          id="focus_tab_application"
        >
          Application
        </button>
      </div>

      {/* Contextual Meaning Card Block based on Active Tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-white border-2 border-[#1A1A1A] rounded-none p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] mb-10 text-left"
          id="focus_commentary_card"
        >
          {activeTab === "meaning" && (
            <p className="text-neutral-700 font-serif italic text-base leading-relaxed">
              "{verse.simpleMeaning}"
            </p>
          )}

          {activeTab === "context" && (
            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-[#1A1A1A] uppercase mb-2 font-sans border-b border-gray-100 pb-1.5">
                Scriptural Backdrop & Context
              </h4>
              <p className="text-neutral-600 text-sm leading-relaxed font-sans">
                {verse.context}
              </p>
            </div>
          )}

          {activeTab === "application" && (
            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-[#1A1A1A] uppercase mb-2 font-sans border-b border-gray-100 pb-1.5">
                Practical Application
              </h4>
              <p className="text-neutral-600 text-sm leading-relaxed font-sans">
                {verse.application}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Scripture Display Block */}
      <div className="text-center mb-10" id="focus_scripture_core">
        <span className="font-serif text-base tracking-wider font-extrabold text-[#1A1A1A] uppercase block mb-6 italic">
          {verse.reference}
        </span>

        <div className="space-y-6 px-1.5 md:px-6" id="focus_scripture_paragraphs">
          {verse.verseLines.map((line, index) => {
            const isHighlighted = highlightedParagraphs.includes(index);
            return (
              <motion.p
                key={index}
                onClick={() => toggleHighlight(index)}
                whileHover={{ scale: 1.005 }}
                className={`text-lg md:text-xl leading-relaxed text-neutral-900 font-serif cursor-pointer transition-all duration-200 p-4 select-none text-left rounded-none ${
                  isHighlighted
                    ? "bg-neutral-100 text-black border-l-4 border-[#1A1A1A]"
                    : "hover:bg-neutral-50 border-l border-transparent"
                }`}
              >
                {line}
              </motion.p>
            );
          })}
        </div>
      </div>

      {/* Main button overlay actions */}
      <div className="space-y-4" id="focus_save_section">
        <button
          onClick={handleSaveInsight}
          className="w-full bg-[#1A1A1A] hover:bg-neutral-800 text-white py-4 px-6 rounded-none font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition"
          id="button_highlight_save"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Keep Marked Progress Study</span>
        </button>

        <p className={`text-center text-[10px] font-sans tracking-widest uppercase transition-colors ${highlightHint ? "text-red-500 font-bold" : "text-neutral-450"}`}>
          {highlightHint ? "Tap a verse paragraph first to select it" : "Tap verse paragraphs above to highlight them"}
        </p>

        {/* Saved breakthrough badge feedback */}
        {savedInsight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-neutral-100 border border-[#1A1A1A] text-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest rounded-none text-center flex items-center justify-center gap-2 "
            id="focus_saved_badge"
          >
            <Check className="w-4 h-4 text-green-600" />
            <span>Insight saved to device ledger</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
