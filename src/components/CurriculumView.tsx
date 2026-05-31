import React, { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Target, Zap } from "lucide-react";
import { CurriculumPlan, CurriculumLesson, ScriptureVerse } from "../types";
import { CURRICULUM_PLANS, ALL_VERSES, CURRICULUM_VERSES } from "../data";

const ALL_STUDY_VERSES = [...ALL_VERSES, ...CURRICULUM_VERSES];

interface LessonCardProps {
  lesson: CurriculumLesson;
  completed: boolean;
  onToggle: () => void;
  onStudyVerse: (verse: ScriptureVerse) => void;
  key?: React.Key;
}

function LessonCard({ lesson, completed, onToggle, onStudyVerse }: LessonCardProps) {
  const [expanded, setExpanded] = useState(false);
  const verse = ALL_STUDY_VERSES.find((v) => v.id === lesson.verseId);

  return (
    <div className={`border transition ${completed ? "border-neutral-200 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-400"}`}>
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setExpanded((e) => !e)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center transition ${completed ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-neutral-300 hover:border-[#1A1A1A]"}`}
        >
          {completed && <span className="text-white text-[10px] font-bold">✓</span>}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold font-sans ${completed ? "text-neutral-400 line-through" : "text-[#1A1A1A]"}`}>{lesson.title}</p>
          <p className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest mt-0.5">{lesson.scripture}</p>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-neutral-100 space-y-3">
          {verse && (
            <div className="bg-neutral-50 p-3 mt-3">
              <span className="text-[9px] font-bold font-sans uppercase tracking-widest text-neutral-400 block mb-1">{verse.reference}</span>
              <p className="text-xs text-neutral-600 italic font-serif line-clamp-2 leading-relaxed">{verse.verseLines[0]}</p>
            </div>
          )}
          <div className="flex items-start gap-2">
            <Target className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[9px] font-bold font-sans uppercase tracking-widest text-neutral-400 block">Goal</span>
              <p className="text-xs font-sans text-[#1A1A1A]">{lesson.goal}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[9px] font-bold font-sans uppercase tracking-widest text-neutral-400 block">Today's Practice</span>
              <p className="text-xs font-sans text-[#1A1A1A]">{lesson.practice}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            {verse && (
              <button
                onClick={() => onStudyVerse(verse)}
                className="bg-[#1A1A1A] text-white hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-widest px-4 py-2.5 rounded-none transition flex-1 flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3 h-3" />
                <span>Study Verse</span>
              </button>
            )}
            <button
              onClick={onToggle}
              className={`text-[10px] font-bold font-sans uppercase tracking-widest px-4 py-2.5 rounded-none transition ${
                completed
                  ? "border border-neutral-200 text-neutral-400 hover:text-[#1A1A1A] hover:border-neutral-400"
                  : "border border-[#1A1A1A] text-[#1A1A1A] hover:bg-neutral-50"
              }`}
            >
              {completed ? "Undo" : "Done"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface TopicSectionProps {
  plan: CurriculumPlan;
  topicId: string;
  completed: Set<string>;
  onToggle: (lessonId: string) => void;
  onStudyVerse: (verse: ScriptureVerse) => void;
  key?: React.Key;
}

function TopicSection({ plan, topicId, completed, onToggle, onStudyVerse }: TopicSectionProps) {
  const topic = plan.topics.find((t) => t.id === topicId)!;
  const [open, setOpen] = useState(false);
  const doneCount = topic.lessons.filter((l) => completed.has(l.id)).length;

  return (
    <div className="border border-neutral-200">
      <button
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-neutral-50 transition"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1">
          <p className="text-sm font-bold font-sans text-[#1A1A1A]">{topic.title}</p>
          <p className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest mt-0.5">
            {doneCount} of {topic.lessons.length} lessons complete
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-neutral-100">
            <div className="h-1 bg-[#1A1A1A] transition-all" style={{ width: `${(doneCount / topic.lessons.length) * 100}%` }} />
          </div>
          {open ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-neutral-100 divide-y divide-neutral-100">
          {topic.lessons.map((lesson) => {
            const props: LessonCardProps = { lesson, completed: completed.has(lesson.id), onToggle: () => onToggle(lesson.id), onStudyVerse };
            return <LessonCard key={lesson.id} {...props} />;
          })}
        </div>
      )}
    </div>
  );
}

interface CurriculumViewProps {
  onStudyVerse: (verse: ScriptureVerse) => void;
}

export default function CurriculumView({ onStudyVerse }: CurriculumViewProps) {
  const [activePlanId, setActivePlanId] = useState<string>(CURRICULUM_PLANS[0].id);
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("dcpl_curriculum_completed");
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  const toggleLesson = (lessonId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) { next.delete(lessonId); } else { next.add(lessonId); }
      localStorage.setItem("dcpl_curriculum_completed", JSON.stringify([...next]));
      return next;
    });
  };

  const activePlan = CURRICULUM_PLANS.find((p) => p.id === activePlanId)!;
  const allLessonIds = activePlan.topics.flatMap((t) => t.lessons.map((l) => l.id));
  const planDone = allLessonIds.filter((id) => completed.has(id)).length;
  const planTotal = allLessonIds.length;

  return (
    <div className="space-y-8 text-left">
      <div className="border-l-4 border-[#1A1A1A] pl-5 space-y-1.5">
        <span className="font-sans text-[11px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold block">Discipleship Curriculum</span>
        <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">Growing in Christ</h2>
        <p className="text-sm text-neutral-500 max-w-lg font-sans leading-relaxed">
          Structured lessons across four disciplines. Tap a lesson to study the verse in full.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {CURRICULUM_PLANS.map((plan) => {
          const ids = plan.topics.flatMap((t) => t.lessons.map((l) => l.id));
          const done = ids.filter((id) => completed.has(id)).length;
          const isActive = plan.id === activePlanId;
          return (
            <button
              key={plan.id}
              onClick={() => setActivePlanId(plan.id)}
              className={`p-3 text-left border transition ${isActive ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-neutral-200 bg-white hover:border-neutral-400"}`}
            >
              <p className="text-[10px] font-bold font-sans uppercase tracking-widest text-neutral-400">{done}/{ids.length}</p>
              <p className={`text-xs font-bold font-sans mt-0.5 leading-tight ${isActive ? "text-white" : "text-[#1A1A1A]"}`}>{plan.title}</p>
            </button>
          );
        })}
      </div>

      <div>
        <div className="flex justify-between text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 mb-1.5">
          <span>{activePlan.title}</span>
          <span>{planDone} of {planTotal} lessons</span>
        </div>
        <div className="h-1 bg-neutral-100">
          <div className="h-1 bg-[#1A1A1A] transition-all" style={{ width: `${planTotal > 0 ? (planDone / planTotal) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {activePlan.topics.map((topic) => {
          const props: TopicSectionProps = { plan: activePlan, topicId: topic.id, completed, onToggle: toggleLesson, onStudyVerse };
          return <TopicSection key={topic.id} {...props} />;
        })}
      </div>
    </div>
  );
}
