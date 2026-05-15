"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Transition } from "framer-motion";

const transition: Transition = { duration: 0.4, ease: "easeOut" };

const fadeUp = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true as const, amount: 0.15 },
  transition,
};

type CtaStyle = "filled" | "outlined";

interface Plan {
  name: string;
  price: string;
  credits: string | null;
  desc: string;
  cta: string;
  ctaStyle: CtaStyle;
  popular: boolean;
  href?: string;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    credits: null,
    desc: "Up to 10 guests, always free",
    cta: "Start for free",
    ctaStyle: "filled",
    popular: false,
    href: "/sign-up",
  },
  {
    name: "Starter",
    price: "₹99",
    credits: "100 credits",
    desc: "Perfect for a birthday or small hangout",
    cta: "Get Early Access",
    ctaStyle: "outlined",
    popular: false,
  },
  {
    name: "Party",
    price: "₹249",
    credits: "300 credits",
    desc: "3–4 events. For people who actually party.",
    cta: "Get Early Access",
    ctaStyle: "filled",
    popular: true,
  },
  {
    name: "Host",
    price: "₹499",
    credits: "700 credits",
    desc: "For the one who always hosts.",
    cta: "Get Early Access",
    ctaStyle: "outlined",
    popular: false,
  },
];

const CREDIT_TABLE = [
  { guests: "Up to 25 guests", credits: "50 credits" },
  { guests: "Up to 50 guests", credits: "100 credits" },
  { guests: "Up to 100 guests", credits: "200 credits" },
  { guests: "Up to 200 guests", credits: "400 credits" },
];

const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
    <path d="M5 0.5L6.18 3.64L9.51 3.9L7.02 6.01L7.84 9.26L5 7.5L2.16 9.26L2.98 6.01L0.49 3.9L3.82 3.64L5 0.5Z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3.5 9L7.5 13L14.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface ModalProps {
  plan: string;
  onClose: () => void;
}

function EarlyAccessModal({ plan, onClose }: ModalProps) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
        className="relative bg-white border border-black rounded-2xl p-6 md:p-8 w-full max-w-md z-10 shadow-2xl"
        initial={{ y: 16, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 16, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-black/20 rounded-lg hover:bg-[#F5F5F5] transition-colors text-black/60 hover:text-black"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-5">
              <CheckIcon />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">You're in!</h3>
            <p className="font-mono text-xs text-[#888888] leading-relaxed">
              We'll WhatsApp you your early access link this week. 🎉
            </p>
            <button
              onClick={onClose}
              className="mt-7 bg-black text-white px-8 py-3 font-mono text-[10px] uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-1">
              Early Access — {plan}
            </p>
            <h3 id="modal-heading" className="font-serif text-2xl md:text-3xl font-bold mb-7">
              Grab your spot.
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="ea-name"
                  className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-2 block"
                >
                  Name
                </label>
                <input
                  ref={firstInputRef}
                  id="ea-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full border border-black/30 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:border-black transition-colors placeholder:text-black/25"
                />
              </div>

              <div>
                <label
                  htmlFor="ea-phone"
                  className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-2 block"
                >
                  WhatsApp Number
                </label>
                <input
                  id="ea-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-black/30 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:border-black transition-colors placeholder:text-black/25"
                />
              </div>

              {/* Hidden plan field */}
              <input type="hidden" name="plan" value={plan} readOnly />

              <button
                type="submit"
                className="w-full bg-black text-white py-3.5 font-mono text-[10px] uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors mt-1"
              >
                Get Early Access
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export function Pricing() {
  const [modalPlan, setModalPlan] = useState<string | null>(null);

  const closeModal = useCallback(() => setModalPlan(null), []);

  return (
    <>
      <section className="bg-white border-b border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          {/* Heading */}
          <motion.div {...fadeUp} className="mb-12 md:mb-16">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-4">
              Pricing
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-3">
              Simple pricing.
              <br />
              No subscriptions.
            </h2>
            <p className="font-mono text-sm text-[#888888]">
              Pay once per event. Credits never expire.
            </p>
          </motion.div>

          {/* Cards grid — 1 col on phones, 2 col on sm, 4 col on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 pt-5">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                viewport={{ once: true, amount: 0.15 }}
                whileHover={{
                  rotate: plan.popular ? 1.5 : i % 2 === 0 ? 1.5 : -1.5,
                  scale: 1.02,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: i * 0.08,
                  rotate: { type: "spring", stiffness: 300, damping: 20, delay: 0 },
                  scale: { type: "spring", stiffness: 300, damping: 20, delay: 0 },
                  boxShadow: { type: "spring", stiffness: 300, damping: 20, delay: 0 },
                }}
                className={`relative flex flex-col rounded-2xl border p-5 gap-5 ${
                  plan.popular
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black"
                }`}
              >
                {/* Most Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-flick-yellow text-black border border-flick-yellow font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                    <StarIcon />
                    Most Popular
                  </div>
                )}

                {/* Plan info */}
                <div>
                  <p
                    className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${
                      plan.popular ? "text-white/50" : "text-[#888888]"
                    }`}
                  >
                    {plan.name}
                  </p>
                  <p className="font-serif text-3xl md:text-4xl font-bold leading-none">
                    {plan.price}
                  </p>
                  <p
                    className={`font-mono text-xs mt-2 ${
                      plan.popular ? "text-white/50" : "text-[#888888]"
                    }`}
                  >
                    {plan.credits ?? "—"}
                  </p>
                </div>

                {/* Description */}
                <p
                  className={`font-mono text-xs leading-relaxed flex-1 ${
                    plan.popular ? "text-white/70" : "text-[#888888]"
                  }`}
                >
                  {plan.desc}
                </p>

                {/* CTA */}
                {plan.href ? (
                  <Link
                    href={plan.href}
                    className={`w-full min-h-[44px] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest rounded-xl transition-colors ${
                      plan.ctaStyle === "filled"
                        ? "bg-flick-yellow text-black hover:bg-flick-yellow/80"
                        : "border border-black text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => setModalPlan(plan.name)}
                    className={`w-full min-h-[44px] font-mono text-[10px] uppercase tracking-widest rounded-xl transition-colors ${
                      plan.popular
                        ? plan.ctaStyle === "filled"
                          ? "bg-flick-yellow text-black hover:bg-flick-yellow/80"
                          : "border border-white/40 text-white hover:bg-white/10"
                        : plan.ctaStyle === "filled"
                        ? "bg-flick-yellow text-black hover:bg-flick-yellow/80"
                        : "border border-black text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {plan.cta}
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Credit usage table */}
          <div className="mt-14 md:mt-16 w-full sm:max-w-sm">
            <motion.p
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-4"
            >
              How many credits per event?
            </motion.p>
            <div className="border border-black rounded-2xl overflow-hidden">
              {CREDIT_TABLE.map((row, i) => (
                <motion.div
                  key={row.guests}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.06 }}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    i < CREDIT_TABLE.length - 1 ? "border-b border-black" : ""
                  }`}
                >
                  <span className="font-mono text-xs text-[#888888]">{row.guests}</span>
                  <span className="font-mono text-xs font-semibold text-black">{row.credits}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal — rendered at root level */}
      <AnimatePresence>
        {modalPlan && (
          <EarlyAccessModal key="early-access-modal" plan={modalPlan} onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  );
}
