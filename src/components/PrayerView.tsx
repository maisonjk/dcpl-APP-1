import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Check, Trash2, ChevronDown, ChevronUp, Loader2, Users } from "lucide-react";
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
  const [shareToast, setShareToast] = useState<string | null>(null);

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

  const handleToggleShare = async (prayer: Prayer) => {
    const updated = await api.prayers.share(prayer.id, !prayer.shared);
    setPrayers((prev) => prev.map((p) => (p.id === prayer.id ? updated : p)));
    if (updated.shared) {
      setShareToast("Your circle can now see this prayer");
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  const handleMarkAnswered = async (prayer: Prayer) => {
    const updated = await api.prayers.update(prayer.id, true, answerText[prayer.id] || undefined);
    setPrayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setExpandedId(null);
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

  const filtered = filterTag === "ALL" ? prayers : prayers.filter((p) => p.categoryTags.includes(filterTag));

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
        {!isAtLeast("disciple_plus") && user && (
          <p className="text-xs text-neutral-500">
            {prayers.length}/{FREE_LIMIT} prayers used on free plan
          </p>
        )}
      </div>

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
                <p className="text-sm font-sans text-neutral-800 leading-relaxed flex-1">{prayer.text}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleShare(prayer)}
                    className={`flex items-center gap-1 border text-[9px] font-bold uppercase tracking-widest px-2 py-1 transition ${
                      prayer.shared
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "border-neutral-300 text-neutral-400 hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                    }`}
                    title={prayer.shared ? "Shared with circle" : "Share with circle"}
                  >
                    <Users className="w-3 h-3" />
                    <span>{prayer.shared ? "Shared with Circle" : "Share with Circle"}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(prayer.id)}
                    className="text-neutral-300 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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

      {shareToast && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-28 left-4 right-4 sm:max-w-[358px] sm:left-1/2 sm:-translate-x-1/2 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-3 text-center z-50"
        >
          {shareToast}
        </motion.div>
      )}
    </motion.div>
  );
}
