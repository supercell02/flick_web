"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Plus, Minus } from "lucide-react";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CreditTransactionHistory() {
  const transactions = useQuery(api.credits.getCreditTransactions);

  if (transactions === undefined) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-14 bg-[#F5F5F5] animate-pulse border border-[#E5E5E5]"
          />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="border border-[#E5E5E5] px-6 py-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-[#888888]">
          No transactions yet.
        </p>
        <p className="font-mono text-xs text-[#888888] mt-1">
          Buy your first credit pack to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-black divide-y divide-[#E5E5E5]">
      {transactions.map((tx) => {
        const isPurchase = tx.type === "purchase" || tx.type === "refund";
        return (
          <div
            key={tx._id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <div
              className={`w-7 h-7 flex items-center justify-center flex-shrink-0 border ${
                isPurchase ? "border-black bg-black text-white" : "border-[#E5E5E5] bg-white text-black"
              }`}
            >
              {isPurchase ? (
                <Plus size={12} strokeWidth={1.5} />
              ) : (
                <Minus size={12} strokeWidth={1.5} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs truncate">{tx.description}</p>
              <p className="font-mono text-[10px] text-[#888888] uppercase tracking-widest mt-0.5">
                {formatDate(tx.createdAt)}
              </p>
            </div>

            <span
              className={`font-mono text-sm font-semibold flex-shrink-0 ${
                isPurchase ? "text-black" : "text-[#888888]"
              }`}
            >
              {isPurchase ? "+" : "-"}
              {tx.amount}
            </span>
          </div>
        );
      })}
    </div>
  );
}
