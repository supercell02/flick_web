"use client";

import { motion } from "framer-motion";
import type { Transition } from "framer-motion";

const transition: Transition = { duration: 0.4, ease: "easeOut" };

const fadeUp = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true as const, amount: 0.15 },
  transition,
};

const STEPS = [
  {
    number: "01",
    title: "Create your Flick",
    desc: "Name your event, set how long it stays open, and share the link.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeWidth="1.5" stroke="currentColor">
        <rect x="2" y="6" width="18" height="13" rx="2" />
        <path d="M7 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
        <circle cx="11" cy="13" r="3" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Guests join instantly",
    desc: "No app download. They scan, they shoot. Done.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeWidth="1.5" stroke="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="12" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="12" width="7" height="7" rx="1" />
        <path d="M12 12h2v2h-2zM16 12h3M12 16h3M16 16h3M19 19v-3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Reveal together",
    desc: "When the night ends, the album unlocks for everyone.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeWidth="1.5" stroke="currentColor">
        <path d="M2 11C2 11 5 4 11 4s9 7 9 7-3 7-9 7-9-7-9-7z" />
        <circle cx="11" cy="11" r="3" />
      </svg>
    ),
  },
];

const ArrowRight = () => (
  <svg width="36" height="16" viewBox="0 0 36 16" fill="none" aria-hidden="true">
    <line x1="0" y1="8" x2="28" y2="8" stroke="currentColor" strokeWidth="1" />
    <path d="M22 2L28 8L22 14" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function HowItWorks() {
  return (
    <section className="bg-black text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-24">
        {/* Heading */}
        <motion.div {...fadeUp} className="mb-14 md:mb-20">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-4">
            The Flow
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
            How a night becomes a film.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex flex-col md:flex-row md:items-start flex-1">
              {/* Step card */}
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.12 }}
                className="flex-1 flex flex-col gap-5"
              >
                {/* Icon + number row */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center text-white/60 flex-shrink-0">
                    {step.icon}
                  </div>
                  <span className="font-mono text-4xl font-bold text-flick-yellow/30 leading-none select-none">
                    {step.number}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="font-mono text-xs text-white/50 leading-relaxed md:max-w-[220px]">
                    {step.desc}
                  </p>
                </div>
              </motion.div>

              {/* Arrow connector — desktop only, between steps */}
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.12 + 0.2 }}
                  style={{ transformOrigin: "left center" }}
                  className="hidden md:flex items-center justify-center w-14 flex-shrink-0 text-white/20 mt-6"
                >
                  <ArrowRight />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
