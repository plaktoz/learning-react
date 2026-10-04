"use client";

// PROTOTYPE — delete before merging to main
// Floating variant switcher. Hidden in production.

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface PrototypeSwitcherProps {
  variants: { key: string; label: string }[];
  current: string;
}

export function PrototypeSwitcher({ variants, current }: PrototypeSwitcherProps) {
  if (process.env.NODE_ENV === "production") return null;

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentIndex = variants.findIndex((v) => v.key === current);
  const prev = variants[(currentIndex - 1 + variants.length) % variants.length];
  const next = variants[(currentIndex + 1) % variants.length];

  function go(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", key);
    router.replace(`?${params.toString()}`);
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      const editable = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;
      if (editable) return;
      if (e.key === "ArrowLeft") go(prev.key);
      if (e.key === "ArrowRight") go(next.key);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const currentVariant = variants[currentIndex];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-zinc-900 px-4 py-2 text-white shadow-lg text-sm select-none">
      <button
        onClick={() => go(prev.key)}
        className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Previous variant"
      >
        ←
      </button>
      <span className="font-mono font-medium tracking-wide px-1">
        {currentVariant.key} — {currentVariant.label}
      </span>
      <button
        onClick={() => go(next.key)}
        className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Next variant"
      >
        →
      </button>
    </div>
  );
}
