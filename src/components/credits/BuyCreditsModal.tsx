"use client";

import { useEffect, useRef, useState } from "react";
import { X, Zap } from "lucide-react";
import { toast } from "sonner";

interface BuyCreditsModalProps {
  open: boolean;
  onClose: () => void;
}

const PACKS = [
  {
    id: "starter" as const,
    name: "Starter",
    price: 99,
    credits: 100,
    description: "Perfect for a small birthday party",
    popular: false,
  },
  {
    id: "party" as const,
    name: "Party",
    price: 249,
    credits: 300,
    description: "Great for weddings and college fests",
    popular: true,
  },
  {
    id: "host" as const,
    name: "Host",
    price: 499,
    credits: 700,
    description: "For frequent hosts and large events",
    popular: false,
  },
];

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  theme: { color: string };
  handler: (response: { razorpay_payment_id: string }) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-js")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function BuyCreditsModal({ open, onClose }: BuyCreditsModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstFocusRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handlePackClick(packId: "starter" | "party" | "host", packName: string) {
    setLoading(packId);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setLoading(null);
        return;
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packId }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        toast.error(err.error ?? "Failed to create order.");
        setLoading(null);
        return;
      }

      const data = (await res.json()) as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Flick",
        description: `${packName} Credits Pack`,
        theme: { color: "#F5C842" },
        handler: () => {
          toast.success("Payment successful! Your credits will appear shortly.");
          onClose();
        },
        modal: {
          ondismiss: () => {
            setLoading(null);
          },
        },
      });

      rzp.open();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buy Credits"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 bg-white border border-black w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
              Flick Credits
            </p>
            <h2 className="font-serif text-xl font-bold">Buy Credits</h2>
          </div>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="p-2 min-h-11 min-w-11 flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Packs */}
        <div className="divide-y divide-[#E5E5E5]">
          {PACKS.map((pack) => (
            <div
              key={pack.id}
              className="px-6 py-5 flex items-start justify-between gap-4 hover:bg-[#F5F5F5] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                    {pack.name}
                  </span>
                  {pack.popular && (
                    <span className="font-mono text-[9px] uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap size={12} strokeWidth={1.5} fill="currentColor" />
                  <span className="font-mono text-sm font-semibold">
                    {pack.credits} credits
                  </span>
                </div>
                <p className="font-mono text-xs text-[#888888]">{pack.description}</p>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="font-serif text-lg font-bold">₹{pack.price}</span>
                <button
                  onClick={() => handlePackClick(pack.id, pack.name)}
                  disabled={loading !== null}
                  className="bg-black text-white px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-11 border border-black"
                >
                  {loading === pack.id ? "Opening…" : "Buy"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="px-6 py-4 border-t border-[#E5E5E5]">
          <p className="font-mono text-[10px] text-[#888888] uppercase tracking-widest">
            Credits never expire · Secured by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
