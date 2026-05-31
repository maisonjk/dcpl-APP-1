import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  BookMarked,
  Users,
  Compass,
  Bell,
  ChevronRight,
  ArrowRight,
  Check,
  Mail,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

type Stage =
  | "splash"
  | "slides"
  | "auth"
  | "profile"
  | "permissions"
  | "tutorial"
  | "done";

interface OnboardingFlowProps {
  onComplete: (username: string) => void;
}

// ─── Splash ───────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-full bg-[#1A1A1A] text-white"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-3"
      >
        <div className="w-16 h-16 border-2 border-white flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-serif text-5xl font-bold tracking-tight uppercase">DCPL</h1>
        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-neutral-400">
          Daily Devotion
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-12 flex gap-1.5"
      >
        <span className="w-1.5 h-1.5 bg-white rounded-full" />
        <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full" />
        <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full" />
      </motion.div>
    </motion.div>
  );
}

// ─── Onboarding Slides ────────────────────────────────────────────────────────
const SLIDES = [
  {
    eyebrow: "Scripture",
    headline: "Walk in the\nWord daily.",
    body: "A fresh verse, reflection, and invitation every morning — aligned to a reading plan designed around your season of faith.",
    icon: BookOpen,
    accent: "#1A1A1A",
  },
  {
    eyebrow: "Community",
    headline: "Stay\naccountable.",
    body: "Invite trusted friends into your circle. Share prayers, check in on each other's habits, and send encouragement.",
    icon: Users,
    accent: "#1A1A1A",
  },
  {
    eyebrow: "Mission",
    headline: "Put faith into\npractice.",
    body: "Take on spiritual assignments — acts of service, prayer, and witness — that bring your faith to life.",
    icon: Compass,
    accent: "#1A1A1A",
  },
];

function OnboardingSlides({ onDone }: { onDone: () => void }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < SLIDES.length - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  };

  const slide = SLIDES[current];
  const Icon = slide.icon;
  const isLast = current === SLIDES.length - 1;

  return (
    <div className="flex flex-col h-full bg-[#F9F8F6]">
      {/* Skip */}
      <div className="flex justify-end px-6 pt-5">
        <button
          onClick={onDone}
          className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 hover:text-[#1A1A1A] transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col justify-center px-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Icon */}
            <div className="w-14 h-14 border-2 border-[#1A1A1A] flex items-center justify-center">
              <Icon className="w-6 h-6 text-[#1A1A1A]" />
            </div>

            {/* Text */}
            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 font-sans">
                {slide.eyebrow}
              </p>
              <h2 className="font-serif text-4xl font-bold tracking-tight text-[#1A1A1A] leading-tight whitespace-pre-line">
                {slide.headline}
              </h2>
              <p className="text-sm font-sans text-neutral-500 leading-relaxed">
                {slide.body}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="px-8 pb-12 space-y-6">
        {/* Dots */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`h-[3px] rounded-none transition-all duration-300 ${
                i === current ? "bg-[#1A1A1A] w-8" : "bg-neutral-200 w-3"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {current > 0 && (
            <button
              onClick={goPrev}
              className="border-2 border-[#1A1A1A] text-[#1A1A1A] px-5 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition"
            >
              Back
            </button>
          )}
          <button
            onClick={goNext}
            className="flex-1 bg-[#1A1A1A] text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition flex items-center justify-center gap-2"
          >
            {isLast ? "Get Started" : "Next"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Auth Step ────────────────────────────────────────────────────────────────
function AuthStep({ onDone }: { onDone: (username: string) => void }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === "register") {
        await register(email, username, password);
        onDone(username);
      } else {
        const result = await login(email, password);
        onDone((result as any)?.username || email.split("@")[0]);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F9F8F6]">
      <div className="flex-1 flex flex-col justify-center px-8 py-10">
        {/* Header */}
        <div className="space-y-1 mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 font-sans">
            {mode === "register" ? "Create account" : "Welcome back"}
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A]">
            {mode === "register" ? "Join the\ncommunity." : "Sign back\nin."}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
              <input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:border-[#1A1A1A] outline-none text-sm font-sans bg-white rounded-none"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:border-[#1A1A1A] outline-none text-sm font-sans bg-white rounded-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 focus:border-[#1A1A1A] outline-none text-sm font-sans bg-white rounded-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-sans">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A1A1A] text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {mode === "register" ? "Create Account" : "Sign In"}
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Mode toggle */}
        <p className="text-xs text-neutral-400 font-sans text-center mt-6">
          {mode === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(null); }}
            className="font-semibold text-[#1A1A1A] underline underline-offset-2"
          >
            {mode === "register" ? "Sign in" : "Create one"}
          </button>
        </p>

        {/* Guest option */}
        <button
          onClick={() => onDone("Friend")}
          className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300 hover:text-neutral-500 transition-colors text-center w-full"
        >
          Continue without an account →
        </button>
      </div>
    </div>
  );
}

// ─── Profile Setup ────────────────────────────────────────────────────────────
function ProfileSetup({ initialName, onDone }: { initialName: string; onDone: (name: string) => void }) {
  const [name, setName] = useState(initialName);

  return (
    <div className="flex flex-col h-full bg-[#F9F8F6]">
      <div className="flex-1 flex flex-col justify-center px-8 py-10">
        <div className="space-y-1 mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 font-sans">
            Almost there
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            How should<br />we greet you?
          </h2>
          <p className="text-sm text-neutral-400 font-sans mt-3 leading-relaxed">
            This name appears on your home screen each day.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-2 font-sans">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-neutral-200 focus:border-[#1A1A1A] outline-none text-sm font-sans bg-white rounded-none"
            />
          </div>
        </div>
      </div>

      <div className="px-8 pb-12">
        <button
          onClick={() => onDone(name.trim() || initialName)}
          disabled={!name.trim()}
          className="w-full bg-[#1A1A1A] text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition disabled:opacity-40 flex items-center justify-center gap-2"
        >
          Looks good
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Permissions ──────────────────────────────────────────────────────────────
function PermissionsScreen({ onDone }: { onDone: () => void }) {
  const [requested, setRequested] = useState(false);

  const requestNotifications = async () => {
    if ("Notification" in window) {
      await Notification.requestPermission();
    }
    setRequested(true);
    setTimeout(onDone, 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#F9F8F6]">
      <div className="flex-1 flex flex-col justify-center px-8 py-10">
        <div className="w-14 h-14 border-2 border-[#1A1A1A] flex items-center justify-center mb-8">
          <Bell className="w-6 h-6 text-[#1A1A1A]" />
        </div>

        <div className="space-y-1 mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 font-sans">
            Stay on track
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Daily reminders.
          </h2>
        </div>

        <p className="text-sm text-neutral-500 font-sans leading-relaxed mb-10">
          Allow notifications and we'll send you a gentle nudge each morning — a verse, a habit check-in, or an encouragement from your circle.
        </p>

        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300 font-sans">
            We will never spam you
          </p>
          {["Daily verse reminder", "Habit check-in nudge", "Circle encouragements"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-neutral-600 font-sans">
              <Check className="w-3.5 h-3.5 text-[#1A1A1A] flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 pb-12 space-y-3">
        <button
          onClick={requestNotifications}
          disabled={requested}
          className="w-full bg-[#1A1A1A] text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {requested ? <Check className="w-4 h-4" /> : <>Allow Notifications <Bell className="w-3.5 h-3.5" /></>}
        </button>
        <button
          onClick={onDone}
          className="w-full text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300 hover:text-neutral-500 transition-colors py-2"
        >
          Not now
        </button>
      </div>
    </div>
  );
}

// ─── Tutorial ─────────────────────────────────────────────────────────────────
const TIPS = [
  {
    icon: BookMarked,
    title: "Choose a reading plan",
    body: "Go to the Reading tab and pick a plan that fits your season — a scripture journey, a topic study, or the full discipleship curriculum.",
  },
  {
    icon: BookOpen,
    title: "Then open the Word",
    body: "Once your plan is active, return to Home each morning. Your daily verse, reflection, and study will be waiting.",
  },
  {
    icon: Check,
    title: "Check in daily",
    body: "Tap Prayer, Word, and Obedience in the habit tracker to log your day.",
  },
  {
    icon: Users,
    title: "Build your circle",
    body: "Go to Home → Circle and invite someone by username or email.",
  },
  {
    icon: Compass,
    title: "Take a mission",
    body: "Head to Mission for a kingdom assignment — something you can do today.",
  },
];

function Tutorial({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col h-full bg-[#F9F8F6]">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 font-sans">
          Quick start
        </p>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A]">
          How it works.
        </h2>
      </div>

      {/* Tips list */}
      <div className="flex-1 px-8 py-4 space-y-4 overflow-y-auto">
        {TIPS.map((tip, i) => {
          const Icon = tip.icon;
          const isActive = i === step;
          const isDone = i < step;

          return (
            <motion.button
              key={i}
              onClick={() => setStep(i)}
              animate={{ opacity: isDone ? 0.45 : 1 }}
              className={`w-full flex items-start gap-4 p-5 border-2 text-left transition-colors ${
                isActive ? "border-[#1A1A1A] bg-white" : "border-neutral-100 bg-white"
              }`}
            >
              <div className={`w-9 h-9 border flex-shrink-0 flex items-center justify-center transition-colors ${
                isDone ? "border-neutral-200 bg-neutral-50" : isActive ? "border-[#1A1A1A] bg-[#1A1A1A]" : "border-neutral-200"
              }`}>
                {isDone
                  ? <Check className="w-4 h-4 text-neutral-400" />
                  : <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                }
              </div>
              <div className="space-y-0.5">
                <p className={`text-sm font-bold font-sans ${isActive ? "text-[#1A1A1A]" : "text-neutral-500"}`}>
                  {tip.title}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-neutral-500 font-sans leading-relaxed pt-1"
                  >
                    {tip.body}
                  </motion.p>
                )}
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-neutral-300 ml-auto flex-shrink-0 mt-0.5" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="px-8 pb-12 pt-4">
        {step < TIPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="w-full border-2 border-[#1A1A1A] text-[#1A1A1A] py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition flex items-center justify-center gap-2"
          >
            Next tip <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onDone}
            className="w-full bg-[#1A1A1A] text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition flex items-center justify-center gap-2"
          >
            Enter the app <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────
export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [stage, setStage] = useState<Stage>("splash");
  const [resolvedName, setResolvedName] = useState("Friend");

  const advance = (next: Stage) => setStage(next);

  return (
    <div className="bg-neutral-300 min-h-screen flex items-start justify-center">
      <div className="bg-[#F9F8F6] min-h-screen w-full sm:max-w-[390px] relative flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === "splash" && (
            <motion.div key="splash" className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <SplashScreen onDone={() => advance("slides")} />
            </motion.div>
          )}

          {stage === "slides" && (
            <motion.div key="slides" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OnboardingSlides onDone={() => advance("auth")} />
            </motion.div>
          )}

          {stage === "auth" && (
            <motion.div key="auth" className="absolute inset-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <AuthStep onDone={(name) => { setResolvedName(name); advance("profile"); }} />
            </motion.div>
          )}

          {stage === "profile" && (
            <motion.div key="profile" className="absolute inset-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <ProfileSetup initialName={resolvedName} onDone={(name) => { setResolvedName(name); advance("permissions"); }} />
            </motion.div>
          )}

          {stage === "permissions" && (
            <motion.div key="permissions" className="absolute inset-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <PermissionsScreen onDone={() => advance("tutorial")} />
            </motion.div>
          )}

          {stage === "tutorial" && (
            <motion.div key="tutorial" className="absolute inset-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <Tutorial onDone={() => { advance("done"); onComplete(resolvedName); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
