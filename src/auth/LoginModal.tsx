import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import LegalModal from "../components/LegalModal";

type Mode = "login" | "register" | "forgot" | "reset";

interface LoginModalProps {
  onClose: () => void;
  initialMode?: "login" | "register";
  resetToken?: string; // passed in from URL ?token=... if deep-linked
}

export default function LoginModal({ onClose, initialMode = "login", resetToken }: LoginModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>(resetToken ? "reset" : initialMode);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(resetToken || "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [legalDoc, setLegalDoc] = useState<"terms" | "privacy" | null>(null);

  const inputClass =
    "w-full bg-neutral-50 border border-[#1A1A1A] py-2.5 pl-10 pr-4 text-sm focus:outline-none rounded-none text-[#1A1A1A]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
        onClose();
      } else if (mode === "register") {
        await register(email, username, password);
        onClose();
      } else if (mode === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSuccess("If that email is registered, a reset link has been sent. Check your inbox.");
        // Dev helper: if server returns token, show it
        if (data.__dev_token) {
          setSuccess(`[DEV] Reset token: ${data.__dev_token} — use it in the Reset Password screen.`);
          setToken(data.__dev_token);
        }
      } else if (mode === "reset") {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSuccess("Password updated. You can now sign in.");
        setTimeout(() => { setMode("login"); setSuccess(null); }, 2000);
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const titles: Record<Mode, string> = {
    login: "Welcome Back",
    register: "Join the Sanctuary",
    forgot: "Reset Password",
    reset: "Set New Password",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 w-full max-w-md relative z-10 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]"
      >
        <div className="flex justify-between items-center mb-6 border-b border-[#1A1A1A] pb-3">
          <h3 className="font-serif text-xl font-bold text-[#1A1A1A] italic">
            {titles[mode]}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-[#1A1A1A] flex items-center justify-center hover:bg-neutral-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-400"><User className="w-4 h-4" /></span>
              <input type="text" placeholder="Your name" value={username}
                onChange={(e) => setUsername(e.target.value)} className={inputClass} required />
            </div>
          )}

          {(mode === "login" || mode === "register" || mode === "forgot") && (
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-400"><Mail className="w-4 h-4" /></span>
              <input type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
            </div>
          )}

          {mode === "reset" && (
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-400"><Mail className="w-4 h-4" /></span>
              <input type="text" placeholder="Reset token" value={token}
                onChange={(e) => setToken(e.target.value)} className={inputClass} required />
            </div>
          )}

          {(mode === "login" || mode === "register" || mode === "reset") && (
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-400"><Lock className="w-4 h-4" /></span>
              <input type="password"
                placeholder={mode === "register" || mode === "reset" ? "Password (8+ characters)" : "Password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className={inputClass} required minLength={mode !== "login" ? 8 : undefined} />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 text-green-700 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <button type="submit" disabled={isSubmitting}
            className="w-full bg-[#1A1A1A] text-white py-3 text-xs uppercase font-bold tracking-widest hover:bg-neutral-800 transition disabled:opacity-50">
            {isSubmitting ? "Please wait…" :
              mode === "login" ? "Sign In" :
              mode === "register" ? "Create Account" :
              mode === "forgot" ? "Send Reset Link" :
              "Update Password"}
          </button>
        </form>

        <div className="mt-4 space-y-2 text-center text-xs text-neutral-500">
          {(mode === "login" || mode === "register") && (
            <p>
              {mode === "login" ? "New here?" : "Already have an account?"}{" "}
              <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); setSuccess(null); }}
                className="font-bold text-[#1A1A1A] underline">
                {mode === "login" ? "Create a free account" : "Sign in"}
              </button>
            </p>
          )}
          {mode === "login" && (
            <p>
              <button onClick={() => { setMode("forgot"); setError(null); setSuccess(null); }}
                className="text-neutral-400 hover:text-[#1A1A1A] transition underline">
                Forgot your password?
              </button>
            </p>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <p>
              <button onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                className="text-neutral-400 hover:text-[#1A1A1A] transition underline">
                ← Back to sign in
              </button>
            </p>
          )}
        {mode === "register" && (
          <p className="mt-3 text-center text-[10px] text-neutral-400 leading-relaxed">
            By creating an account you agree to our{" "}
            <button onClick={() => setLegalDoc("terms")} className="underline hover:text-[#1A1A1A]">Terms</button>
            {" "}and{" "}
            <button onClick={() => setLegalDoc("privacy")} className="underline hover:text-[#1A1A1A]">Privacy Policy</button>.
          </p>
        )}
        </div>
      </motion.div>

      <AnimatePresence>
        {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}
      </AnimatePresence>
    </div>
  );
}
