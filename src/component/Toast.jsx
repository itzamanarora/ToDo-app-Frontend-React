import { useState } from "react";

export function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-[#1E293B] px-4 py-3 text-sm text-[#F8FAFC] shadow-lg border border-[#334155] animate-in fade-in slide-in-from-top-2">
      <span className="flex-1 font-medium">{message}</span>
      <button
        onClick={onClose}
        className="rounded p-1 text-[#94A3B8] hover:text-[#FFFFFF] transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
