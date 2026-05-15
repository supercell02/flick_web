"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { CreditBalance } from "@/components/credits/CreditBalance";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <motion.header
      className="border-b border-black bg-white sticky top-0 z-50"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-xl font-bold tracking-tight uppercase">Flick</span>
          <span className="font-serif text-[10px] italic text-[#888888]">Flick it!!</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {!isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="border border-black px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-black hover:text-flick-yellow transition-colors rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-flick-yellow text-black px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-flick-yellow/80 transition-colors rounded-lg"
              >
                Create Gallery
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="border border-black px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-black hover:text-flick-yellow transition-colors rounded-lg"
              >
                Dashboard
              </Link>
              <CreditBalance />
              <div className="ml-2">
                <UserButton />
              </div>
            </>
          )}
        </nav>

        {/* Mobile: credit pill + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {isSignedIn && <CreditBalance />}
          <button
            className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded-lg"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-black bg-white">
          <nav className="flex flex-col p-4 gap-2">
            {!isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="border border-black py-3 px-4 text-xs font-mono uppercase tracking-widest rounded-lg text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="bg-flick-yellow text-black px-4 py-3 text-xs font-mono uppercase tracking-widest text-center rounded-lg"
                >
                  Create Gallery
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="border border-black py-3 px-4 text-xs font-mono uppercase tracking-widest rounded-lg hover:text-flick-yellow"
                >
                  Dashboard
                </Link>
                <div className="flex items-center justify-between border border-[#E5E5E5] rounded-lg px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">Credits</span>
                  <CreditBalance />
                </div>
                <div className="py-3">
                  <UserButton />
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </motion.header>
  );
}
