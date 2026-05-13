"use client";

import { useQuery, useMutation } from "convex/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { GalleryGrid } from "@/components/event/GalleryGrid";
import { UploadZone } from "@/components/event/UploadZone";
import { RevealTimer } from "@/components/event/RevealTimer";
import { MobileNav } from "@/components/layout/MobileNav";
import { isRevealed, formatDate } from "@/lib/utils";
import { track } from "@/lib/posthog";
import { Calendar, Users } from "lucide-react";

const GUEST_NAME_KEY = "flick_guest_name";

export default function EventPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const trackEvent = useMutation(api.analytics.trackEvent);

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

  useEffect(() => {
    if (!event?._id) return;
    const isQr = searchParams?.get("src") === "qr";
    const hasVisited = localStorage.getItem(`flick_visited_${slug}`);

    void trackEvent({ eventId: event._id, eventType: "gallery_opened", metadata: { slug } });
    track("gallery_opened", { slug });

    if (isQr) {
      void trackEvent({ eventId: event._id, eventType: "qr_opened", metadata: { slug } });
      track("qr_opened", { slug });
    }

    if (hasVisited) {
      void trackEvent({ eventId: event._id, eventType: "revisit", metadata: { slug } });
      track("revisit", { slug });
    } else {
      localStorage.setItem(`flick_visited_${slug}`, "1");
    }
  }, [event?._id, slug, searchParams, trackEvent]);

  if (event === null) {
    notFound();
  }

  if (event === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-widest text-[#888888] animate-pulse">
          Loading…
        </div>
      </div>
    );
  }

  const revealed = isRevealed(event.revealAt);

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
      {/* Cover image */}
      {event.coverImage && (
        <div className="w-full h-[40vh] overflow-hidden border-b border-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover grayscale"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Event header */}
        <div className="border-b border-black pb-6 mb-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-2 flex items-center gap-2">
            <Calendar size={10} strokeWidth={1.5} />
            {formatDate(event.eventDate)}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-2">
            {event.title}
          </h1>
          <p className="font-mono text-xs text-[#888888] flex items-center gap-1">
            <Users size={10} strokeWidth={1.5} />
            {event.uploadCount} photo{event.uploadCount !== 1 ? "s" : ""} shared
          </p>
        </div>

        {/* Guest name input */}
        {!nameSubmitted && (
          <div className="border border-black mb-6">
            <div className="border-b border-black px-4 py-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
                Your Name (required to upload)
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
        )}

        {/* Upload zone */}
        {nameSubmitted && (
          <div className="mb-6">
            <div className="border-b border-black mb-4 pb-2 flex items-center justify-between">
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

        {/* Reveal timer or gallery */}
        <div className="border-t border-black pt-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-4">
            Gallery
          </p>
          {!revealed ? (
            <RevealTimer revealAt={event.revealAt} />
          ) : (
            <GalleryGrid eventId={event._id} />
          )}
        </div>
      </div>

      <MobileNav slug={slug} />
    </div>
  );
}
