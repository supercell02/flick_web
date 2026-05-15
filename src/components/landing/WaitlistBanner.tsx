"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Transition } from "framer-motion";

const transition: Transition = { duration: 0.4, ease: "easeOut" };

const TickIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2.5 8L6.5 12L13.5 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 7h10M8 3l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function WaitlistBanner() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="bg-black text-white border-b border-white/10">
      {/* Decorative gradient strip */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={transition}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12"
        >
          {/* Text */}
          <div className="md:max-w-sm">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-4">
              Early Access
            </p>
            <h2 className="font-serif text-2xl md:text-4xl font-bold leading-tight mb-3">
              Join the early access waitlist
            </h2>
            <p className="font-mono text-xs text-white/50 leading-relaxed">
              Be the first to Flick at your next party.
            </p>
          </div>

          {/* Form / confirmation */}
          <div className="w-full md:max-w-md">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-4 border border-white/20 rounded-2xl px-5 py-4 bg-white/5"
                >
                  <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                    <TickIcon />
                  </div>
                  <p className="font-mono text-sm text-white">
                    You&apos;re on the list.{" "}
                    <span className="text-white/50">We&apos;ll be in touch.</span>
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="text"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Email or WhatsApp number"
                    aria-label="Email or WhatsApp number"
                    className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 outline-none focus:border-white/50 transition-colors"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-flick-yellow text-black px-6 py-3 font-mono text-[10px] uppercase tracking-widest rounded-xl hover:bg-flick-yellow/80 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    Join Waitlist
                    <ArrowRight />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
