# UX Polish Sprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship five focused UX improvements — desktop phone-frame layout, Bible plan selection flow, checklist all-done feedback, Circle Prayers guidance, Prayer share label, and Mission completion moment + remove debug button.

**Architecture:** All changes are pure frontend. No new API routes or DB migrations needed. Each task touches 1–2 files and is independently shippable. State for the active plan is stored in localStorage under `dcpl_active_plan_id`.

**Tech Stack:** React 19, TypeScript, Tailwind 4, Framer Motion (`motion/react`), localStorage

---

## File Map

| File | What changes |
|---|---|
| `src/App.tsx` | Desktop phone-frame wrapper (max-w-[390px]), Bible tab plan-selection flow, active plan state |
| `src/components/HomeView.tsx` | All-done banner after all 3 checklist items checked |
| `src/components/PrayerView.tsx` | Rename Share → "Share with Circle", toast on share |
| `src/components/MissionView.tsx` | Completion moment card, remove Reset button |

---

### Task 1: Desktop phone-frame layout

Wrap the entire app in a centered 390px column on screens ≥640px so it feels like a phone on desktop.

**Files:**
- Modify: `src/App.tsx:169`

- [ ] **Step 1: Add the phone-frame wrapper**

In `src/App.tsx`, find the outermost app div (line ~169):
```tsx
<div className="bg-[#F9F8F6] min-h-screen text-[#1A1A1A] flex flex-col selection:bg-neutral-200 selection:text-black font-sans" id="app_root_layout">
```

Replace with:
```tsx
<div className="bg-neutral-300 min-h-screen flex items-start justify-center sm:py-0" id="app_frame_outer">
<div className="bg-[#F9F8F6] min-h-screen w-full sm:max-w-[390px] text-[#1A1A1A] flex flex-col selection:bg-neutral-200 selection:text-black font-sans relative" id="app_root_layout">
```

And close the extra wrapper div just before the final closing `</div>` of the file (after the existing closing `</div>`):
```tsx
</div> {/* app_frame_outer */}
```

- [ ] **Step 2: Fix the header bar** — it currently uses `max-w-[1040px] mx-auto`. Since the frame is now 390px, remove the max-width constraint from the header inner div (line ~173):

Find:
```tsx
<div className="flex justify-between items-baseline w-full px-5 py-5 max-w-[1040px] mx-auto">
```
Replace with:
```tsx
<div className="flex justify-between items-baseline w-full px-5 py-5">
```

- [ ] **Step 3: Fix the main content area** — remove the old max-width from `<main>` (line ~224):

Find:
```tsx
<main className="flex-grow max-w-[1040px] w-full mx-auto px-5 py-8" id="viewport_main_content">
```
Replace with:
```tsx
<main className="flex-grow w-full px-5 py-8" id="viewport_main_content">
```

- [ ] **Step 4: Fix the nav bar** — it uses `max-w-lg mx-auto`. Since it now sits inside a 390px frame, remove that constraint (line ~422):

Find:
```tsx
<div className="flex justify-around items-center w-full max-w-lg mx-auto">
```
Replace with:
```tsx
<div className="flex justify-around items-center w-full">
```

- [ ] **Step 5: Verify visually**

Open http://localhost:3000 on desktop. The app should appear as a centered phone-width column with a neutral grey background on each side. On mobile, it should look identical to before (full width).

- [ ] **Step 6: Commit**
```bash
git add src/App.tsx
git commit -m "feat: constrain app to 390px phone-frame on desktop"
```

---

### Task 2: Bible tab — plan selection flow

Replace the current "all plans always show Study/Mark Done" layout with a proper selection flow: cards are chooseable, one becomes active, others become secondary.

**Files:**
- Modify: `src/App.tsx` (Bible tab section, lines ~276–400)

**Key concepts:**
- `activePlanId`: stored in localStorage under `dcpl_active_plan_id`. `null` = no plan chosen yet.
- When `activePlanId` is null: show all 4 plan cards as selection options (no Study/Mark Done buttons).
- When `activePlanId` is set: show the active plan at top with Study/current-day and Mark Done buttons. Show remaining plans below as "Other Plans" in a compact list with a "Switch Plan" button each.
- Switching plan: show a `window.confirm()` dialog — "Switch to [plan name]? Your progress on [current plan] will be reset." If confirmed, set new activePlanId and reset the old plan's progress in `planProgress`.
- The curriculum card ("Growing in Christ") participates in this same flow — it can be the active plan. When active, its button says "Open Curriculum" as before.

- [ ] **Step 1: Add activePlanId state to App.tsx**

After the existing `planProgress` state (around line 37), add:
```tsx
const [activePlanId, setActivePlanId] = useState<string | null>(() => {
  return localStorage.getItem("dcpl_active_plan_id") || null;
});

const setActivePlan = (planId: string) => {
  setActivePlanId(planId);
  localStorage.setItem("dcpl_active_plan_id", planId);
};

const switchPlan = (newPlanId: string, newPlanTitle: string) => {
  const currentTitle = activePlanId
    ? ([...READING_PLANS, { id: "curriculum", title: "Growing in Christ" }].find(p => p.id === activePlanId)?.title ?? activePlanId)
    : "";
  const confirmed = window.confirm(
    `Switch to "${newPlanTitle}"? Your progress on "${currentTitle}" will be reset to Day 1.`
  );
  if (!confirmed) return;
  // Reset old plan progress
  if (activePlanId && activePlanId !== "curriculum") {
    const updated = { ...planProgress, [activePlanId]: 1 };
    setPlanProgress(updated);
    localStorage.setItem("dcpl_plan_progress", JSON.stringify(updated));
  }
  setActivePlan(newPlanId);
};
```

- [ ] **Step 2: Replace the Bible tab JSX**

Find the entire Bible tab block starting at `{activeTab === "bible" && (` and replace the inner content (the `<div className="space-y-10 text-left" id="bible_tab_container">` block) with:

```tsx
{activeTab === "bible" && (
  <div className="space-y-8 text-left" id="bible_tab_container">
    <div className="border-l-4 border-[#1A1A1A] pl-5 space-y-1.5">
      <span className="font-sans text-[11px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold block">Reading Plans</span>
      <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">Word Study</h2>
      <p className="text-sm text-neutral-500 font-sans leading-relaxed">
        {activePlanId ? "Your active plan is shown below." : "Choose a plan to begin your daily Word study."}
      </p>
    </div>

    {/* No plan chosen yet — show all as selection cards */}
    {!activePlanId && (
      <div className="grid grid-cols-1 gap-4">
        {READING_PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setActivePlan(plan.id)}
            className="p-6 border border-neutral-200 hover:border-[#1A1A1A] bg-white text-left transition group"
          >
            <span className="text-[10px] font-bold font-sans uppercase text-neutral-400 tracking-widest block mb-1">{plan.theme}</span>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1">{plan.title}</h3>
            <p className="text-xs text-neutral-500 font-sans mb-3">{plan.description}</p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{plan.totalDays} days →</span>
          </button>
        ))}

        {/* Curriculum selection card */}
        <button
          onClick={() => setActivePlan("curriculum")}
          className="p-6 border border-neutral-200 hover:border-[#1A1A1A] bg-white text-left transition group"
        >
          <span className="text-[10px] font-bold font-sans uppercase text-neutral-400 tracking-widest block mb-1">Discipleship Curriculum</span>
          <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1">Growing in Christ</h3>
          <p className="text-xs text-neutral-500 font-sans mb-3">4 modules · 11 topics · 33 lessons on discipleship, theology, and spiritual formation.</p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">33 lessons →</span>
        </button>
      </div>
    )}

    {/* Active plan — reading plan */}
    {activePlanId && activePlanId !== "curriculum" && (() => {
      const plan = READING_PLANS.find(p => p.id === activePlanId);
      if (!plan) return null;
      const currentDay = planProgress[plan.id] ?? 1;
      const verse = getActivePlanVerse(plan.id);
      const progressPct = Math.round(((currentDay - 1) / plan.totalDays) * 100);
      return (
        <div className="p-8 border-2 border-[#1A1A1A] bg-white flex flex-col text-left">
          <div className="flex justify-between items-start mb-5">
            <div>
              <span className="text-[10px] font-bold font-sans uppercase text-neutral-400 tracking-widest block mb-1">{plan.theme}</span>
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">{plan.title}</h3>
              <p className="text-xs text-neutral-500 font-sans mt-1">{plan.description}</p>
            </div>
            <span className="text-[9px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-wider font-sans whitespace-nowrap ml-4">Active</span>
          </div>
          <div className="mb-5">
            <div className="flex justify-between text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400 mb-1.5">
              <span>Day {currentDay} of {plan.totalDays}</span>
              <span>{progressPct}% complete</span>
            </div>
            <div className="h-1 bg-neutral-100 w-full">
              <div className="h-1 bg-[#1A1A1A] transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
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
                ✓ Done for Today
              </button>
            )}
            {currentDay >= plan.totalDays && (
              <span className="border border-neutral-200 text-neutral-400 text-[10px] uppercase font-bold tracking-widest px-4 py-3">
                Completed ✓
              </span>
            )}
          </div>
        </div>
      );
    })()}

    {/* Active plan — curriculum */}
    {activePlanId === "curriculum" && (() => {
      const totalLessons = CURRICULUM_PLANS.reduce((s, p) => s + p.topics.reduce((ts, t) => ts + t.lessons.length, 0), 0);
      const completedLessons = (() => { try { return (JSON.parse(localStorage.getItem("dcpl_curriculum_completed") || "[]") as string[]).length; } catch { return 0; } })();
      const pct = Math.round((completedLessons / totalLessons) * 100);
      return (
        <div className="p-8 border-2 border-[#1A1A1A] bg-white flex flex-col text-left">
          <div className="flex justify-between items-start mb-5">
            <div>
              <span className="text-[10px] font-bold font-sans uppercase text-neutral-400 tracking-widest block mb-1">Discipleship Curriculum</span>
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Growing in Christ</h3>
              <p className="text-xs text-neutral-500 font-sans mt-1">4 modules · 11 topics · 33 lessons.</p>
            </div>
            <span className="text-[9px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-wider font-sans whitespace-nowrap ml-4">Active</span>
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

    {/* Other Plans — compact list shown when a plan is active */}
    {activePlanId && (
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-sans">Other Plans</p>
        {[
          ...READING_PLANS.filter(p => p.id !== activePlanId).map(p => ({
            id: p.id, title: p.title, subtitle: `${p.totalDays} days · ${p.theme}`
          })),
          ...(activePlanId !== "curriculum" ? [{ id: "curriculum", title: "Growing in Christ", subtitle: "33 lessons · Discipleship Curriculum" }] : []),
        ].map(p => (
          <div key={p.id} className="flex items-center justify-between p-4 border border-neutral-200 bg-white">
            <div>
              <p className="text-xs font-bold text-neutral-700">{p.title}</p>
              <p className="text-[10px] text-neutral-400">{p.subtitle}</p>
            </div>
            <button
              onClick={() => switchPlan(p.id, p.title)}
              className="text-[9px] font-bold uppercase tracking-widest border border-neutral-300 px-3 py-1.5 hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition text-neutral-500"
            >
              Switch
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
)}
```

- [ ] **Step 3: Verify**

Open http://localhost:3000 → Bible tab.
- With no active plan: see 4 chooseable cards, no Study/Mark Done buttons.
- Click a plan: it becomes active with Study Day N and "✓ Done for Today". Other plans appear below as compact rows with Switch buttons.
- Click Switch: confirm dialog appears. Confirm → old plan resets, new plan becomes active.

- [ ] **Step 4: Commit**
```bash
git add src/App.tsx
git commit -m "feat: Bible tab plan selection flow — choose one active plan at a time"
```

---

### Task 3: Checklist all-done celebration banner

When all three habits (Prayer, Word, Obedience) are checked, show a brief "All done for today 🙏" line below the checklist grid.

**Files:**
- Modify: `src/components/HomeView.tsx` (~line 764)

- [ ] **Step 1: Add the all-done banner**

In `HomeView.tsx`, find the paragraph after the habit grid (line ~765):
```tsx
<p className="text-[10px] text-neutral-400 text-center mt-4 uppercase tracking-widest font-sans font-bold">
  Tap habits above to toggle your check-in status
</p>
```

Replace with:
```tsx
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
  <p className="text-[10px] text-neutral-400 text-center mt-4 uppercase tracking-widest font-sans font-bold">
    Tap habits above to toggle your check-in status
  </p>
)}
```

Make sure `motion` is imported — it already is via `import { motion, ... } from "motion/react"` in HomeView.tsx. Verify with:
```bash
grep "motion" src/components/HomeView.tsx | head -3
```

- [ ] **Step 2: Verify**

Open Home tab. Check all three habit tiles (Prayer, Word, Obedience). The helper text below should animate in: "All done for today 🙏 Come back tomorrow." Uncheck one — it should revert to the grey helper text.

- [ ] **Step 3: Commit**
```bash
git add src/components/HomeView.tsx
git commit -m "feat: show all-done celebration banner when all 3 habits are checked"
```

---

### Task 4: Prayer share — rename button + toast feedback

Make the share action self-explanatory: rename "Share" → "Share with Circle" and show a brief toast when sharing.

**Files:**
- Modify: `src/components/PrayerView.tsx`

- [ ] **Step 1: Read the current share button**

```bash
grep -n "Share\|share\|toast\|Toast" src/components/PrayerView.tsx
```

You'll see the share button around line 181–190 and `handleToggleShare` around line 52.

- [ ] **Step 2: Add a shareToast state**

At the top of the `PrayerView` component, after the existing state declarations, add:
```tsx
const [shareToast, setShareToast] = useState<string | null>(null);
```

- [ ] **Step 3: Update handleToggleShare to trigger toast**

Find `handleToggleShare` (~line 52):
```tsx
const handleToggleShare = async (prayer: Prayer) => {
  const updated = await api.prayers.share(prayer.id, !prayer.shared);
  setPrayers((prev) => prev.map((p) => (p.id === prayer.id ? updated : p)));
};
```

Replace with:
```tsx
const handleToggleShare = async (prayer: Prayer) => {
  const updated = await api.prayers.share(prayer.id, !prayer.shared);
  setPrayers((prev) => prev.map((p) => (p.id === prayer.id ? updated : p)));
  if (updated.shared) {
    setShareToast("Your circle can now see this prayer");
    setTimeout(() => setShareToast(null), 3000);
  }
};
```

- [ ] **Step 4: Update the share button label**

Find the share button JSX (~line 181–190):
```tsx
<span>{prayer.shared ? "Shared" : "Share"}</span>
```
Replace with:
```tsx
<span>{prayer.shared ? "Shared with Circle" : "Share with Circle"}</span>
```

- [ ] **Step 5: Add toast UI**

Find the return JSX in PrayerView. Just before the final closing `</div>` of the component's return, add:
```tsx
{shareToast && (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="fixed bottom-28 left-4 right-4 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-3 text-center z-50"
  >
    {shareToast}
  </motion.div>
)}
```

Make sure `motion` and `useState` are imported in PrayerView.tsx. Check:
```bash
grep "^import" src/components/PrayerView.tsx | head -5
```
If `motion` is missing, add: `import { motion } from "motion/react";`

- [ ] **Step 6: Verify**

Go to Prayer tab → add a prayer if none exist → click "Share with Circle". Button label flips to "Shared with Circle". A dark toast slides up from the bottom: "Your circle can now see this prayer."

- [ ] **Step 7: Commit**
```bash
git add src/components/PrayerView.tsx
git commit -m "feat: rename Share to 'Share with Circle' + toast feedback on share"
```

---

### Task 5: Circle Prayers empty state — link to Prayer tab

When Circle Prayers has no content, tell the user exactly what to do and give them a button to go there.

**Files:**
- Modify: `src/components/HomeView.tsx` (~line 391)

The `HomeView` component doesn't have access to `setActiveTab` (which lives in `App.tsx`). The cleanest approach is to pass an `onGoToPrayer` callback prop into `HomeView` and wire it up in `App.tsx`.

- [ ] **Step 1: Add onGoToPrayer prop to HomeView**

Find the `HomeView` component's props interface near the top of `HomeView.tsx`:
```bash
grep -n "interface HomeViewProps\|function HomeView\|HomeViewProps" src/components/HomeView.tsx | head -5
```

Add or update the props interface:
```tsx
interface HomeViewProps {
  onGoToPrayer?: () => void;
}
```

Update the function signature:
```tsx
function HomeView({ onGoToPrayer }: HomeViewProps) {
```

- [ ] **Step 2: Pass the prop in App.tsx**

Find where `HomeView` is rendered in `App.tsx` (~line 266):
```tsx
{activeTab === "home" && (
  <HomeView ... />
```

Add the prop:
```tsx
{activeTab === "home" && (
  <HomeView onGoToPrayer={() => setActiveTab("prayer")} ... />
```

(Keep any existing props like `stats`, `onUpdateStats`, etc.)

- [ ] **Step 3: Update the Circle Prayers empty state**

In `HomeView.tsx`, find the Circle Prayers empty state (~line 391):
```tsx
{feed.length === 0 ? (
  <div className="text-center py-6 space-y-1">
    <MessageCircle className="w-7 h-7 text-neutral-200 mx-auto" />
    <p className="text-xs text-neutral-400 font-sans italic">No shared prayers yet. Ask your partners to share a prayer.</p>
  </div>
) : (
```

Replace with:
```tsx
{feed.length === 0 ? (
  <div className="text-center py-6 space-y-3">
    <MessageCircle className="w-7 h-7 text-neutral-200 mx-auto" />
    <p className="text-xs text-neutral-400 font-sans italic">No shared prayers yet.</p>
    <p className="text-[10px] text-neutral-400 font-sans">Share a prayer from your Prayer Journal and your circle can pray with you.</p>
    {onGoToPrayer && (
      <button
        onClick={onGoToPrayer}
        className="text-[9px] font-bold uppercase tracking-widest border border-[#1A1A1A] px-4 py-2 hover:bg-[#1A1A1A] hover:text-white transition"
      >
        Open Prayer Journal →
      </button>
    )}
  </div>
) : (
```

- [ ] **Step 4: Verify**

Sign in → go to Home → switch to Circle Prayers tab (assuming no shared prayers from partners). You should see: "No shared prayers yet." + explanation text + "Open Prayer Journal →" button. Clicking it should navigate to the Prayer tab.

- [ ] **Step 5: Commit**
```bash
git add src/components/HomeView.tsx src/App.tsx
git commit -m "feat: Circle Prayers empty state links to Prayer Journal"
```

---

### Task 6: Mission completion moment + remove Reset button

When a mission is completed, briefly show an acknowledgment card over the mission grid. Remove the "Reset mission states" debug button from the UI.

**Files:**
- Modify: `src/components/MissionView.tsx`

- [ ] **Step 1: Add completedMission state**

Near the top of `MissionView`, after existing state declarations, add:
```tsx
const [completedMissionTitle, setCompletedMissionTitle] = useState<string | null>(null);
```

- [ ] **Step 2: Update handleCompleteMission to set the title**

Find `handleCompleteMission` in MissionView.tsx:
```bash
grep -n "handleCompleteMission\|handleComplete" src/components/MissionView.tsx
```

It likely looks like:
```tsx
const handleCompleteMission = (id: string) => {
  // ... sets mission status to completed
};
```

Capture the mission title and trigger the celebration, then auto-clear after 3 seconds:
```tsx
const handleCompleteMission = (id: string) => {
  const mission = missions.find(m => m.id === id);
  setMissions((prev) => prev.map((m) => m.id === id ? { ...m, status: "completed" as const } : m));
  api.missions.update(id, "completed").catch(console.error);
  if (mission) {
    setCompletedMissionTitle(mission.title);
    setTimeout(() => setCompletedMissionTitle(null), 3500);
  }
};
```

- [ ] **Step 3: Add the completion banner**

In the MissionView return JSX, directly after the mission grid closing `</div>` (the one with id `mission_actions_grid`), add:

```tsx
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
```

Make sure `AnimatePresence` wraps it if it's inside a conditional — or just rely on the `motion.div` fade. The key prop ensures React remounts it on each completion.

- [ ] **Step 4: Remove the Reset button**

Find and delete the entire Reset block (~line 176–184):
```tsx
{/* Reset Missions tool button action list */}
<div className="flex justify-end pt-2" id="mission_reset_tools">
  <button
    onClick={handleResetMissions}
    className="text-[9px] font-mono uppercase tracking-widest text-neutral-450 hover:text-neutral-700 border-b border-dashed border-[#1A1A1A] cursor-pointer"
  >
    Reset mission states
  </button>
</div>
```

Also remove the `handleResetMissions` function if it's no longer used anywhere else:
```bash
grep -n "handleResetMissions\|Reset" src/components/MissionView.tsx
```
Delete the function definition if it appears only in that one button.

- [ ] **Step 5: Verify**

Go to Mission tab → click "Start Mission" on any card → click "Complete Mission". A dark banner should appear below the grid: "Mission Complete / [mission name] / Matthew 25:23 quote." It fades out after 3.5 seconds. The "Reset mission states" link should be gone.

- [ ] **Step 6: Commit**
```bash
git add src/components/MissionView.tsx
git commit -m "feat: mission completion banner + remove debug Reset button"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Task 1 — Desktop phone-frame (390px centered column)
- ✅ Task 2 — Bible plan selection flow (choose 1, active plan view, switch with confirm)
- ✅ Task 3 — Checklist all-done banner ("All done for today 🙏")
- ✅ Task 4 — "Share with Circle" label + share toast
- ✅ Task 5 — Circle Prayers empty state with link to Prayer Journal
- ✅ Task 6 — Mission completion moment + remove Reset button

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:** `activePlanId: string | null`, `switchPlan(newPlanId: string, newPlanTitle: string)`, `completedMissionTitle: string | null`, `onGoToPrayer?: () => void` — all consistent across tasks.
