"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { track } from "@/lib/posthog";
import { Calendar, ImageIcon } from "lucide-react";
import { toast } from "sonner";

type RevealMode = "instant" | "after_event" | "next_day";

const REVEAL_OPTIONS: { value: RevealMode; label: string; desc: string }[] = [
  { value: "instant", label: "Instant", desc: "Gallery is visible immediately" },
  { value: "after_event", label: "After Event", desc: "Gallery reveals on event date" },
  { value: "next_day", label: "Next Day", desc: "Gallery reveals 24h after event" },
];

export function EventForm() {
  const router = useRouter();
  const createEvent = useMutation(api.events.createEvent);
  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [revealMode, setRevealMode] = useState<RevealMode>("instant");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;
    setSubmitting(true);

    try {
      let coverStorageId: Id<"_storage"> | null = null;

      if (coverFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": coverFile.type },
          body: coverFile,
        });
        if (!result.ok) throw new Error("Cover image upload failed");
        const { storageId } = (await result.json()) as { storageId: string };
        coverStorageId = storageId as Id<"_storage">;
      }

      const { eventId, slug } = await createEvent({
        title: title.trim(),
        eventDate: new Date(eventDate).getTime(),
        coverStorageId,
        revealMode,
      });

      track("event_created", { eventId, slug, revealMode });
      router.push(`/dashboard/${eventId}?created=1`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create event");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      {/* Title */}
      <div className="border border-black">
        <label className="block border-b border-black px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#888888]">
          Event Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 100))}
          placeholder="Wedding of Rahul & Priya"
          required
          className="w-full px-4 py-3 font-mono text-sm bg-white focus:outline-none focus:ring-0 border-0 h-12"
        />
      </div>

      {/* Date */}
      <div className="border border-black border-t-0">
        <label className="border-b border-black px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#888888] flex items-center gap-2">
          <Calendar size={12} strokeWidth={1.5} />
          Event Date *
        </label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
          className="w-full px-4 py-3 font-mono text-sm bg-white focus:outline-none focus:ring-0 border-0 h-12"
        />
      </div>

      {/* Reveal mode */}
      <div className="border border-black border-t-0">
        <div className="border-b border-black px-4 py-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
            Gallery Reveal
          </p>
        </div>
        <div className="flex flex-col">
          {REVEAL_OPTIONS.map((opt, i) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[#F5F5F5] transition-colors ${
                i < REVEAL_OPTIONS.length - 1 ? "border-b border-[#E5E5E5]" : ""
              }`}
            >
              <div className="mt-0.5 w-4 h-4 border border-black flex items-center justify-center flex-shrink-0">
                {revealMode === opt.value && <div className="w-2 h-2 bg-black" />}
              </div>
              <input
                type="radio"
                name="revealMode"
                value={opt.value}
                checked={revealMode === opt.value}
                onChange={() => setRevealMode(opt.value)}
                className="sr-only"
              />
              <div>
                <p className="font-mono text-xs uppercase tracking-widest">{opt.label}</p>
                <p className="font-mono text-xs text-[#888888] mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Cover image */}
      <div className="border border-black border-t-0">
        <label className="border-b border-black px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#888888] flex items-center gap-2">
          <ImageIcon size={12} strokeWidth={1.5} />
          Cover Image (optional)
        </label>
        <div className="p-4">
          {coverPreview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full aspect-video object-cover grayscale border border-[#E5E5E5]"
              />
              <button
                type="button"
                onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                className="mt-2 font-mono text-xs uppercase tracking-widest text-[#888888] hover:text-black"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border border-dashed border-black p-8 cursor-pointer hover:bg-[#F5F5F5] transition-colors">
              <ImageIcon size={24} strokeWidth={1.5} className="text-[#888888] mb-2" />
              <span className="font-mono text-xs uppercase tracking-widest">Choose image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !title.trim() || !eventDate}
        className="w-full bg-black text-white py-4 font-mono text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 min-h-11 border border-black"
      >
        {submitting ? "Creating…" : "Create Gallery"}
      </button>
    </form>
  );
}
