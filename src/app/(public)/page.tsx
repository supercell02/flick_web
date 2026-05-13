"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QrCode, Upload, ImageIcon, Zap, Lock, Share2 } from "lucide-react";

const transition: Transition = { duration: 0.4, ease: "easeOut" };

const fadeUp = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true as const },
  transition,
};

const STEPS = [
  {
    number: "01",
    title: "Create a Gallery",
    desc: "Set an event title, date, and reveal mode. Get a QR code in under 60 seconds.",
  },
  {
    number: "02",
    title: "Share the QR Code",
    desc: "Print it, project it, or share the link on WhatsApp. No app install required.",
  },
  {
    number: "03",
    title: "Guests Upload Instantly",
    desc: "Anyone with the link can upload photos directly from their phone browser.",
  },
];

const USE_CASES = [
  "Indian Weddings",
  "College Fests",
  "Birthday Parties",
  "Corporate Events",
  "Family Trips",
  "Graduation Parties",
  "Mehendi Ceremonies",
  "Farewell Parties",
];

const FEATURES = [
  {
    icon: Zap,
    title: "60-Second Setup",
    desc: "Create a full event gallery faster than you can write a WhatsApp message.",
  },
  {
    icon: Upload,
    title: "No App Required",
    desc: "Guests upload straight from their phone browser. No download, no signup.",
  },
  {
    icon: Lock,
    title: "Reveal Control",
    desc: "Show photos instantly, or reveal the gallery after the event ends.",
  },
  {
    icon: Share2,
    title: "WhatsApp Native",
    desc: "Share your event link or QR code directly on WhatsApp with one tap.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-4">
              Event Photo Collection
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6">
              Every guest.
              <br />
              Every photo.
              <br />
              One place.
            </h1>
            <p className="font-mono text-sm text-[#888888] leading-relaxed mb-8 max-w-md">
              Create a gallery in under 60 seconds. Share a QR code. Guests upload
              photos directly from their phone — no app install, no signup required.
            </p>
            <div className="flex flex-col sm:flex-row gap-0">
              <Link
                href="/sign-up"
                className="bg-black text-white px-6 py-4 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors text-center min-h-11 flex items-center justify-center"
              >
                Create Your Gallery
              </Link>
              <Link
                href="/sign-in"
                className="border border-black border-l-0 sm:border-l px-6 py-4 font-mono text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center min-h-11 flex items-center justify-center sm:border-l-0"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.1 }}
            className="hidden md:flex justify-center"
          >
            <div className="border-2 border-black w-56 bg-white relative">
              {/* Phone top bar */}
              <div className="border-b border-black px-4 py-2 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-widest">Flick</span>
                <QrCode size={12} strokeWidth={1.5} />
              </div>
              {/* Simulated gallery */}
              <div className="grid grid-cols-2 gap-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square bg-[#E5E5E5] border-b border-r border-black ${
                      i % 2 === 0 ? "" : "border-r-0"
                    }`}
                  />
                ))}
              </div>
              <div className="border-t border-black px-3 py-2">
                <div className="bg-black text-white text-center py-2 font-mono text-[9px] uppercase tracking-widest flex items-center justify-center gap-1">
                  <Upload size={8} strokeWidth={1.5} />
                  Tap to Upload
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <motion.p
            {...fadeUp}
            className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-8"
          >
            How It Works
          </motion.p>
          <div className="grid md:grid-cols-3 gap-0">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut" as const, delay: i * 0.08 }}
                className={`border border-black p-6 ${i > 0 ? "border-l-0" : ""}`}
              >
                <p className="font-mono text-3xl font-medium text-[#E5E5E5] mb-4">{step.number}</p>
                <h3 className="font-serif text-xl font-semibold mb-2">{step.title}</h3>
                <p className="font-mono text-xs text-[#888888] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases — infinite marquee */}
      <section className="border-b border-black overflow-hidden py-0">
        <div className="flex border-b border-black">
          <span className="flex-shrink-0 border-r border-black px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[#888888] flex items-center bg-white z-10">
            Perfect for
          </span>
          <div className="overflow-hidden flex-1 relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <motion.div
              className="flex gap-0 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 20,
                ease: "linear" as const,
                repeat: Infinity,
              }}
            >
              {[...USE_CASES, ...USE_CASES].map((uc, i) => (
                <span
                  key={i}
                  className="flex-shrink-0 border-r border-black px-5 py-3 font-mono text-xs uppercase tracking-widest whitespace-nowrap hover:bg-black hover:text-white transition-colors cursor-default"
                >
                  {uc}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <motion.p
            {...fadeUp}
            className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-8"
          >
            Features
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ y: 24, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: "easeOut" as const, delay: i * 0.06 }}
                  className={`border border-black p-6 flex gap-4 ${
                    i >= 2 ? "border-t-0" : ""
                  } ${i % 2 === 1 ? "border-l-0" : ""}`}
                >
                  <div className="flex-shrink-0 w-10 h-10 border border-black flex items-center justify-center">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold mb-1">{feat.title}</h3>
                    <p className="font-mono text-xs text-[#888888] leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-black text-white border-b border-black">
        <motion.div
          {...fadeUp}
          className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-4">
            Get Started Free
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-white">
            Your next event gallery
            <br />
            is 60 seconds away.
          </h2>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-mono text-xs uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors min-h-11"
          >
            <ImageIcon size={14} strokeWidth={1.5} />
            Create Your Gallery
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
