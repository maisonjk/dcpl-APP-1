import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

interface LoginModalProps {
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function LoginModal({ onClose, initialMode = "login" }: LoginModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
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
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, username, password);
      }
      onClose();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-neutral-50 border border-[#1A1A1A] py-2.5 pl-10 pr-4 text-sm focus:outline-none rounded-none text-[#1A1A1A]";

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
            {mode === "login" ? "Welcome Back" : "Join the Sanctuary"}
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
              <span className="absolute left-3 top-3 text-neutral-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          )}

          <div className="relative">
            <span className="absolute left-3 top-3 text-neutral-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-3 text-neutral-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              placeholder={mode === "register" ? "Password (8+ characters)" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
              minLength={mode === "register" ? 8 : undefined}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A1A1A] text-white py-3 text-xs uppercase font-bold tracking-widest hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {isSubmitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-4">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
            className="font-bold text-[#1A1A1A] underline"
          >
            {mode === "login" ? "Create a free account" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
