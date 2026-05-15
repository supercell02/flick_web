"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Zap } from "lucide-react";

export function CreditBalance() {
  const data = useQuery(api.credits.getUserCredits);

  if (data === undefined) {
    return (
      <div className="flex items-center gap-1 h-6 w-20 bg-[#E5E5E5] animate-pulse rounded-full" />
    );
  }

  const balance = data?.balance ?? 0;

  return (
    <div className="flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-full font-mono text-xs tracking-widest uppercase">
      <Zap size={11} strokeWidth={1.5} fill="currentColor" />
      <span>{balance}</span>
    </div>
  );
}
