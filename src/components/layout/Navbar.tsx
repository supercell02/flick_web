"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="border-b border-black bg-white sticky top-0 z-50">
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
                className="border border-black px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-black hover:text-white transition-colors rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded-lg"
              >
                Create Gallery
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="border border-black px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-black hover:text-white transition-colors rounded-lg"
              >
                Dashboard
              </Link>
              <div className="ml-2">
                <UserButton />
              </div>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 min-h-11 min-w-11 flex items-center justify-center rounded-lg"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
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
                  className="bg-black text-white px-4 py-3 text-xs font-mono uppercase tracking-widest text-center rounded-lg"
                >
                  Create Gallery
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="border border-black py-3 px-4 text-xs font-mono uppercase tracking-widest rounded-lg"
                >
                  Dashboard
                </Link>
                <div className="py-3">
                  <UserButton />
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
