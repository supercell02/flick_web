"use client";

import { useQuery, useMutation } from "convex/react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

import { GalleryGrid } from "@/components/event/GalleryGrid";
import { UploadZone } from "@/components/event/UploadZone";
import { RevealTimer } from "@/components/event/RevealTimer";
import { MobileNav } from "@/components/layout/MobileNav";
import { isRevealed, formatDate, getEventUrl } from "@/lib/utils";
import { track } from "@/lib/posthog";
import { Calendar, Users, Copy, Share2, Check, X } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

const GUEST_NAME_KEY = "flick_guest_name";

export default function EventPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const trackEvent = useMutation(api.analytics.trackEvent);

  const showQr = searchParams?.get("show") === "qr";

  const event = useQuery(api.events.getEventBySlug, { slug });
  const subfolders = useQuery(
    api.subfolders.getSubfoldersByEvent,
    event?._id ? { eventId: event._id as Id<"events"> } : "skip"
  );

  const [guestName, setGuestName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const revealed = isRevealed(event.revealAt);
  const eventUrl = getEventUrl(slug);

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = guestName.trim();
    if (!trimmed) return;
    localStorage.setItem(GUEST_NAME_KEY, trimmed);
    setGuestName(trimmed);
    setNameSubmitted(true);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(`${event.title} — share your photos here:\n${eventUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Cover image */}
      {event.coverImage && (
        <div className="w-full aspect-[4/1] overflow-hidden border-b border-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
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

        {/* Desktop-only upload section */}
        <div className="hidden md:block mb-8">
          {!nameSubmitted ? (
            <div className="border border-black rounded-xl overflow-hidden">
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
          ) : (
            <div>
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
              <UploadZone
                eventId={event._id}
                guestName={guestName}
                subfolders={subfolders ?? []}
              />
            </div>
          )}
        </div>

        {/* Reveal timer or gallery */}
        <div id="gallery" className="border-t border-black pt-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-4">
            Gallery
          </p>
          {!revealed ? (
            <RevealTimer revealAt={event.revealAt} />
          ) : (
            <GalleryGrid eventId={event._id} eventTitle={event.title} guestName={guestName || undefined} />
          )}
        </div>
      </div>

      {/* QR Share sheet — shown when ?show=qr */}
      <AnimatePresence>
        {showQr && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => router.replace(`/e/${slug}`)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black pb-20 md:hidden rounded-t-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-black">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
                  Share this event
                </p>
                <button
                  onClick={() => router.replace(`/e/${slug}`)}
                  className="p-1 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
              <div className="px-4 py-5 flex flex-col items-center gap-4">
                <div className="border border-black p-4 bg-white rounded-xl inline-block">
                  <QRCode value={eventUrl} size={160} />
                </div>
                <div className="w-full border border-[#E5E5E5] px-3 py-2 bg-[#F5F5F5] rounded-lg">
                  <p className="font-mono text-xs text-[#888888] truncate">{eventUrl}</p>
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 border border-black px-4 py-3 font-mono text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 min-h-11 rounded-lg"
                  >
                    {copied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
                    {copied ? "Copied" : "Copy Link"}
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 bg-black text-white px-4 py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 min-h-11 rounded-lg"
                  >
                    <Share2 size={14} strokeWidth={1.5} />
                    WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <MobileNav slug={slug} />
    </div>
  );
}
