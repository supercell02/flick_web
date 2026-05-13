"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
import { UploadZone } from "@/components/event/UploadZone";
import { MobileNav } from "@/components/layout/MobileNav";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const GUEST_NAME_KEY = "flick_guest_name";

export default function UploadPage() {
  const params = useParams();
  const slug = params.slug as string;
  const event = useQuery(api.events.getEventBySlug, { slug });
  const [guestName, setGuestName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(GUEST_NAME_KEY);
    if (saved) {
      setGuestName(saved);
      setNameSubmitted(true);
    }
  }, []);

  if (event === null) notFound();

  if (event === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-widest text-[#888888] animate-pulse">
          Loading…
        </div>
      </div>
    );
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = guestName.trim();
    if (!trimmed) return;
    localStorage.setItem(GUEST_NAME_KEY, trimmed);
    setGuestName(trimmed);
    setNameSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <div className="border-b border-black">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <Link
            href={`/e/${slug}`}
            className="font-mono text-[10px] uppercase tracking-widest text-[#888888] flex items-center gap-1 hover:text-black"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Back
          </Link>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
              {formatDate(event.eventDate)}
            </p>
            <h1 className="font-serif text-lg font-semibold">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-6">
          Upload Photos &amp; Videos
        </p>

        {!nameSubmitted ? (
          <div className="border border-black mb-6">
            <div className="border-b border-black px-4 py-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
                Your Name (required)
              </p>
            </div>
            <form onSubmit={handleNameSubmit} className="flex">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value.slice(0, 50))}
                placeholder="Enter your name"
                className="flex-1 px-4 py-3 font-mono text-sm focus:outline-none border-0 h-12"
                autoFocus
              />
              <button
                type="submit"
                disabled={!guestName.trim()}
                className="bg-black text-white px-4 py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 min-h-11 border-l border-black"
              >
                Done
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#E5E5E5] mb-4 pb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
                Uploading as <span className="text-black">{guestName}</span>
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem(GUEST_NAME_KEY);
                  setGuestName("");
                  setNameSubmitted(false);
                }}
                className="font-mono text-[10px] uppercase tracking-widest text-[#888888] hover:text-black"
              >
                Change
              </button>
            </div>
            <UploadZone eventId={event._id} guestName={guestName} />
          </div>
        )}
      </div>

      <MobileNav slug={slug} />
    </div>
  );
}
