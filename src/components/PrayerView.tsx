import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Check, MessageSquare, History, Sparkles, Filter, CheckCircle2, ChevronRight, X } from "lucide-react";
import { Prayer } from "../types";
import { DEFAULT_PRAYERS } from "../data";

export default function PrayerView() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newPrayerText, setNewPrayerText] = useState("");
  const [isMarkedAsAnswered, setIsMarkedAsAnswered] = useState(false);
  const [inlineAnswerText, setInlineAnswerText] = useState("");
  
  // Tag selector helpers
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const availableTags = ["WORK", "WISDOM", "HEALTH", "FAMILY", "GUIDANCE", "FAITH"];
  
  // Filter tag
  const [filterTag, setFilterTag] = useState<string>("ALL");

  // Filter prayers
  const filteredPrayers = filterTag === "ALL"
    ? prayers
    : prayers.filter((p) => p.categoryTags.includes(filterTag));
  
  // Loaded state or saves
  useEffect(() => {
    const saved = localStorage.getItem("sanctuary_prayers");
    if (saved) {
      try {
        setPrayers(JSON.parse(saved));
      } catch (e) {
        setPrayers(DEFAULT_PRAYERS);
      }
    } else {
      setPrayers(DEFAULT_PRAYERS);
    }
  }, []);

  const savePrayers = (updatedPrayers: Prayer[]) => {
    setPrayers(updatedPrayers);
    localStorage.setItem("sanctuary_prayers", JSON.stringify(updatedPrayers));
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleWritePrayer = () => {
    if (!newPrayerText.trim()) {
      alert("Please write down what is on your heart first!");
      return;
    }

    const newPrayer: Prayer = {
      id: `p_${Date.now()}`,
      text: newPrayerText,
      timestamp: "TODAY, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      categoryTags: selectedTags.length > 0 ? selectedTags : ["PERSONAL"],
      answered: isMarkedAsAnswered,
      answerText: isMarkedAsAnswered ? (inlineAnswerText.trim() || undefined) : undefined
    };

    const updated = [newPrayer, ...prayers];
    savePrayers(updated);
    
    // Clear form inputs
    setNewPrayerText("");
    setIsMarkedAsAnswered(false);
    setInlineAnswerText("");
    setSelectedTags([]);
  };

  const handleToggleAnswered = (prayerId: string) => {
    const defaultMessagesPreset = "Breakthrough received. Faithful prayer answered.";
    const updated = prayers.map((p) => {
      if (p.id === prayerId) {
        const isNowAnswered = !p.answered;
        return {
          ...p,
          answered: isNowAnswered,
          answerText: isNowAnswered ? defaultMessagesPreset : undefined
        };
      }
      return p;
    });
    savePrayers(updated);
  };

  const handleDeletePrayer = (prayerId: string) => {
    const updated = prayers.filter((p) => p.id !== prayerId);
    savePrayers(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[800px] mx-auto space-y-12 pb-24 text-left"
      id="prayer_view_container"
    >
      {/* Intro visual header panel */}
      <section className="text-left border-l-4 border-[#1A1A1A] pl-5 space-y-1.5" id="prayer_heading">
        <span className="font-sans text-[10px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold block">
          Prayer Journal
        </span>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A]">
          Reflection Ledger
        </h2>
        <p className="text-xs italic text-neutral-500 font-sans">
          "Pray without ceasing." — 1 Thessalonians 5:17
        </p>
      </section>

      {/* Entry Form widget block */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-6 text-left" id="prayer_form_card">
        <div>
          <label className="block text-[10px] text-neutral-450 font-sans font-bold uppercase tracking-widest mb-2">
            Active Prayer Request
          </label>
          <textarea
            value={newPrayerText}
            onChange={(e) => setNewPrayerText(e.target.value)}
            className="w-full bg-neutral-50/50 border border-[#1A1A1A] rounded-none p-4 font-serif text-base text-[#1A1A1A] focus:outline-none min-h-[140px] resize-none placeholder:text-neutral-300"
            placeholder="What is on your heart today? Describe it in your list journal..."
            id="input_prayer_text"
          />
        </div>

        {/* Tag checklist selector pills */}
        <div>
          <span className="block text-[10px] text-neutral-450 font-sans font-bold uppercase tracking-widest mb-2.5">
            Add Prayer Category Tags
          </span>
          <div className="flex flex-wrap gap-2" id="available_tags_list">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest border transition-all rounded-none ${
                    isSelected
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-transparent text-neutral-400 border-[#1A1A1A] hover:bg-neutral-50"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliding Mark as Answered toggle switches */}
        <div className="flex items-center justify-between py-4 border-t border-[#1A1A1A]" id="answered_switch_pnl">
          <div className="text-left">
            <span className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wide font-sans">
              Mark as Answered Immediately
            </span>
            <span className="text-[11px] text-neutral-500 font-sans">
              Check this if you are recording a breakthrough or testimony right now
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isMarkedAsAnswered}
              onChange={() => setIsMarkedAsAnswered(!isMarkedAsAnswered)}
              className="sr-only peer"
              id="checkbox_marked_answered"
            />
            <div className="w-11 h-6 bg-neutral-200 border border-[#1A1A1A] rounded-none peer peer-checked:bg-[#1A1A1A] transition" />
            <div className={`absolute left-1 top-1 w-4 h-4 bg-white border border-[#1A1A1A] rounded-none transition ${isMarkedAsAnswered ? "translate-x-5 border-[#1A1A1A]" : ""}`} />
          </label>
        </div>

        {/* Show secondary inputs if Answered is toggled on the new entry */}
        <AnimatePresence>
          {isMarkedAsAnswered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-dashed border-[#1A1A1A] pt-4"
              id="answer_text_pnl"
            >
              <label className="block text-[10px] text-[#1A1A1A] font-sans font-bold uppercase tracking-widest mb-2">
                Write how God answered this prayer (Praise report)
              </label>
              <textarea
                value={inlineAnswerText}
                onChange={(e) => setInlineAnswerText(e.target.value)}
                className="w-full bg-neutral-50 border border-[#1A1A1A] p-3 text-xs text-neutral-700 italic font-serif placeholder:text-neutral-300 rounded-none focus:outline-none"
                placeholder="E.g. Healing was complete, peace was restored..."
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-4" id="write_prayer_button_box">
          <button
            onClick={handleWritePrayer}
            className="w-full md:w-auto bg-[#1A1A1A] text-white hover:bg-neutral-800 font-bold text-xs uppercase tracking-widest py-4 px-12 transition-all shadow-sm outline-none rounded-none"
            id="btn_write_prayer"
          >
            Write Prayer Post
          </button>
        </div>
      </div>

      {/* Timeline List of Past Prayers */}
      <section className="space-y-6" id="prayer_logs_list">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#1A1A1A] pb-3.5 gap-4" id="prayer_logs_header">
          <div className="flex items-baseline gap-3">
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Past Journal entries</h3>
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-450 tracking-widest font-bold" id="prayer_entries_count">
              ({filteredPrayers.length} of {prayers.length})
            </span>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto animate-fade-in" id="prayer_filter_dropdown_box">
            <Filter className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-450 tracking-widest mr-1">Filter:</span>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="bg-white border border-[#1A1A1A] rounded-none py-1 px-2.5 text-[10px] font-mono uppercase font-bold text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] cursor-pointer"
              id="select_prayer_category_filter"
            >
              <option value="ALL">Show All</option>
              <option value="WORK">Work</option>
              <option value="WISDOM">Wisdom</option>
              <option value="HEALTH">Health</option>
              <option value="FAMILY">Family</option>
              <option value="GUIDANCE">Guidance</option>
              <option value="FAITH">Faith</option>
              <option value="PERSONAL">Personal</option>
            </select>
          </div>
        </div>

        <div className="relative pl-8 space-y-6" id="prayer_chronological_list">
          {prayers.length === 0 ? (
            <p className="text-center text-xs text-neutral-400 py-10 font-sans">
              Your prayer timeline is empty. Record your first private prayer request above!
            </p>
          ) : filteredPrayers.length === 0 ? (
            <p className="text-center text-xs text-neutral-400 py-10 font-sans border border-[#1A1A1A] p-6 bg-[#F9F8F6]" id="empty_filter_message">
              No entries found with category "{filterTag}".
            </p>
          ) : (
            filteredPrayers.map((prayer) => (
              <div key={prayer.id} className="relative pb-6 border-b border-gray-100 last:border-b-0 text-left">
                {/* Timeline status indicator dots with line connector */}
                <span className="absolute left-[-24px] top-1.5 w-4 h-4 rounded-none border border-[#1A1A1A] bg-white flex items-center justify-center">
                  <span className={`w-2 h-2 rounded-none ${prayer.answered ? "bg-emerald-600 animate-pulse" : "bg-neutral-200"}`} />
                </span>

                <div className="bg-white p-6 border border-[#1A1A1A] hover:border-[#1A1A1A] transition rounded-none shadow-[2px_2px_0px_rgba(26,26,26,0.1)] space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                    <span className="font-bold tracking-wider">{prayer.timestamp}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAnswered(prayer.id)}
                        className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest border transition-all rounded-none ${
                          prayer.answered
                            ? "bg-neutral-100 border-[#1A1A1A] text-emerald-800"
                            : "bg-neutral-50 border-[#1A1A1A] text-neutral-500 hover:bg-neutral-100 animate-pulse"
                        }`}
                      >
                        {prayer.answered ? "✓ Testimony active" : "Mark Answered"}
                      </button>
                      <button
                        onClick={() => handleDeletePrayer(prayer.id)}
                        className="text-neutral-450 hover:text-red-600 transition-colors ml-1 p-1 border border-neutral-200 rounded-none hover:border-red-600"
                        title="Delete Entry"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Core Prayer request text body */}
                  <p className="text-sm md:text-base leading-relaxed text-[#1A1A1A] font-serif">
                    {prayer.text}
                  </p>

                  {/* Dynamic Category Labels */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prayer.categoryTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 border border-[#1A1A1A] text-[#1A1A1A] font-bold text-[9px] uppercase tracking-widest font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Showcase answered sub-cards with praise quotes */}
                  <AnimatePresence>
                    {prayer.answered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-neutral-50 border-l-4 border-emerald-600 rounded-none mt-3 text-left"
                      >
                        <div className="flex gap-2 items-center mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-[9px] text-emerald-800 font-bold tracking-widest uppercase font-mono">
                            Breakthrough Testimony
                          </span>
                        </div>
                        <p className="text-xs text-neutral-800 italic font-medium leading-relaxed font-serif">
                          "{prayer.answerText || "Testimony recorded successfully. Praise be to God."}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Quote citation displays */}
      <section className="pt-10 border-t-2 border-[#1A1A1A] flex justify-center" id="prayer_footer_quote">
        <div className="max-w-[500px] text-center px-4 py-8 border-y border-neutral-200">
          <p className="font-serif text-base text-neutral-800 font-bold italic mb-3">
            "The prayer is powerful and effective."
          </p>
          <span className="font-mono text-xs uppercase text-[#1A1A1A] font-bold tracking-wider">
            James 5:16
          </span>
        </div>
      </section>
    </motion.div>
  );
}
