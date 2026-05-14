"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { UploadZone } from "@/components/event/UploadZone";
import { MobileNav } from "@/components/layout/MobileNav";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, FolderOpen, ChevronDown, Check, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const GUEST_NAME_KEY = "flick_guest_name";

export default function UploadPage() {
  const params = useParams();
  const slug = params.slug as string;
  const event = useQuery(api.events.getEventBySlug, { slug });
  const subfolders = useQuery(
    api.subfolders.getSubfoldersByEvent,
    event?._id ? { eventId: event._id as Id<"events"> } : "skip"
  );

  const [guestName, setGuestName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [selectedSubfolderId, setSelectedSubfolderId] = useState<Id<"subfolders"> | "">("");
  const [showAlbumPicker, setShowAlbumPicker] = useState(false);

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

  const selectedAlbum = (subfolders ?? []).find((sf) => sf._id === selectedSubfolderId);

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = guestName.trim();
    if (!trimmed) return;
    localStorage.setItem(GUEST_NAME_KEY, trimmed);
    setGuestName(trimmed);
    setNameSubmitted(true);
  }

  function selectAlbum(id: Id<"subfolders"> | "") {
    setSelectedSubfolderId(id);
    setShowAlbumPicker(false);
  }

  const hasAlbums = (subfolders ?? []).length > 0;

  // Build subfolders list for UploadZone (which expects the full objects)
  const subfoldersForZone = selectedSubfolderId && selectedAlbum
    ? [selectedAlbum]   // pass only selected so UploadZone shows it pre-selected
    : [];

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
          <div className="border border-black mb-6 rounded-xl overflow-hidden">
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
          <div className="space-y-4">
            {/* Name row */}
            <div className="border-b border-[#E5E5E5] pb-3 flex items-center justify-between">
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

            {/* Album picker trigger — only when albums exist */}
            {hasAlbums && (
              <button
                onClick={() => setShowAlbumPicker(true)}
                className="w-full border border-black rounded-xl px-4 py-3 flex items-center justify-between hover:bg-[#F5F5F5] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen size={14} strokeWidth={1.5} className="text-[#888888]" />
                  <span className="font-mono text-sm">
                    {selectedAlbum ? selectedAlbum.name : "No album"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
                    {selectedAlbum ? "Change" : "Choose album"}
                  </span>
                  <ChevronDown size={12} strokeWidth={1.5} className="text-[#888888]" />
                </div>
              </button>
            )}

            {/* Upload zone — pass only the selected album so it stays pre-selected */}
            <UploadZone
              eventId={event._id}
              guestName={guestName}
              subfolders={subfoldersForZone}
              preselectedSubfolderId={selectedSubfolderId || undefined}
            />
          </div>
        )}
      </div>

      {/* Album picker bottom sheet */}
      <AnimatePresence>
        {showAlbumPicker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowAlbumPicker(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black pb-24 rounded-t-2xl max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-black sticky top-0 bg-white">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
                  Choose Album
                </p>
                <button
                  onClick={() => setShowAlbumPicker(false)}
                  className="p-1 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              <div className="divide-y divide-[#E5E5E5]">
                {/* No album option */}
                <button
                  onClick={() => selectAlbum("")}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#F5F5F5] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen size={16} strokeWidth={1.5} className="text-[#888888]" />
                    <span className="font-mono text-sm">No album</span>
                  </div>
                  {selectedSubfolderId === "" && (
                    <Check size={14} strokeWidth={1.5} />
                  )}
                </button>

                {/* Albums */}
                {(subfolders ?? []).map((sf) => (
                  <button
                    key={sf._id}
                    onClick={() => selectAlbum(sf._id)}
                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#F5F5F5] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen size={16} strokeWidth={1.5} />
                      <span className="font-mono text-sm">{sf.name}</span>
                    </div>
                    {selectedSubfolderId === sf._id && (
                      <Check size={14} strokeWidth={1.5} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <MobileNav slug={slug} />
    </div>
  );
}
