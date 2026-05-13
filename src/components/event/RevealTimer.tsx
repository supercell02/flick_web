"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface RevealTimerProps {
  revealAt: number;
}

function getTimeLeft(revealAt: number) {
  const diff = revealAt - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

export function RevealTimer({ revealAt }: RevealTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(revealAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const tl = getTimeLeft(revealAt);
      setTimeLeft(tl);
      if (!tl) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [revealAt]);

  if (!timeLeft) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="border border-black p-4 bg-[#F5F5F5] flex items-center gap-3">
      <Clock size={16} strokeWidth={1.5} />
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-1">
          Gallery reveals in
        </p>
        <p className="font-mono text-xl font-medium tracking-tight">
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </p>
      </div>
    </div>
  );
}
