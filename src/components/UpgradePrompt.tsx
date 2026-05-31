import React from "react";
import { Zap } from "lucide-react";

interface UpgradePromptProps {
  message: string;
  onUpgrade: () => void;
}

export default function UpgradePrompt({ message, onUpgrade }: UpgradePromptProps) {
  return (
    <div className="border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center space-y-3">
      <Zap className="w-6 h-6 text-neutral-400 mx-auto" />
      <p className="text-sm text-neutral-600 font-sans">{message}</p>
      <button
        onClick={onUpgrade}
        className="bg-[#1A1A1A] text-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-neutral-800 transition"
      >
        Upgrade Plan
      </button>
    </div>
  );
}
