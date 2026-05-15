"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { track } from "@/lib/posthog";
import { Calendar, ImageIcon, Users } from "lucide-react";
import { toast } from "sonner";
import { BuyCreditsModal } from "@/components/credits/BuyCreditsModal";

type RevealMode = "instant" | "after_event" | "next_day";

const REVEAL_OPTIONS: { value: RevealMode; label: string; desc: string }[] = [
  { value: "instant", label: "Instant", desc: "Gallery is visible immediately" },
  { value: "after_event", label: "After Event", desc: "Gallery reveals on event date" },
  { value: "next_day", label: "Next Day", desc: "Gallery reveals 24h after event" },
];

type GuestTier = "10" | "25" | "50" | "100" | "400";

const GUEST_TIERS: { value: GuestTier; label: string; cost: number }[] = [
  { value: "10", label: "Up to 10 guests", cost: 0 },
  { value: "25", label: "Up to 25 guests", cost: 50 },
  { value: "50", label: "Up to 50 guests", cost: 100 },
  { value: "100", label: "Up to 100 guests", cost: 200 },
  { value: "400", label: "Up to 400 guests", cost: 400 },
];

export function EventForm() {
  const router = useRouter();
  const createEvent = useMutation(api.events.createEvent);
  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const consumeCredits = useMutation(api.credits.consumeCredits);
  const creditsData = useQuery(api.credits.getUserCredits);

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [revealMode, setRevealMode] = useState<RevealMode>("instant");
  const [guestTier, setGuestTier] = useState<GuestTier>("10");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const selectedTier = GUEST_TIERS.find((t) => t.value === guestTier)!;
  const creditCost = selectedTier.cost;
  const balance = creditsData?.balance ?? 0;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function doCreateEvent() {
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

      if (creditCost > 0) {
        await consumeCredits({
          amount: creditCost,
          description: `Event created: ${title.trim()} (${selectedTier.label})`,
          eventId: "pending",
        });
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;

    if (creditCost === 0) {
      void doCreateEvent();
      return;
    }

    if (balance < creditCost) {
      return;
    }

    setShowConfirm(true);
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* All fields in one rounded card */}
      <div className="border border-black rounded-xl overflow-hidden divide-y divide-black">
        {/* Title */}
        <div>
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
        <div>
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
        <div>
          <div className="border-b border-black px-4 py-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
              Gallery Reveal
            </p>
          </div>
          <div className="flex flex-col divide-y divide-[#E5E5E5]">
            {REVEAL_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[#F5F5F5] transition-colors"
              >
                <div className="mt-0.5 w-4 h-4 border border-black flex items-center justify-center flex-shrink-0 rounded-sm">
                  {revealMode === opt.value && <div className="w-2 h-2 bg-black rounded-[2px]" />}
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

        {/* Guest count tier */}
        <div>
          <div className="border-b border-black px-4 py-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] flex items-center gap-2">
              <Users size={12} strokeWidth={1.5} />
              Expected Guests
            </p>
          </div>
          <div className="flex flex-col divide-y divide-[#E5E5E5]">
            {GUEST_TIERS.map((tier) => (
              <label
                key={tier.value}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#F5F5F5] transition-colors"
              >
                <div className="w-4 h-4 border border-black flex items-center justify-center flex-shrink-0 rounded-sm">
                  {guestTier === tier.value && <div className="w-2 h-2 bg-black rounded-[2px]" />}
                </div>
                <input
                  type="radio"
                  name="guestTier"
                  value={tier.value}
                  checked={guestTier === tier.value}
                  onChange={() => setGuestTier(tier.value)}
                  className="sr-only"
                />
                <span className="flex-1 font-mono text-xs uppercase tracking-widest">
                  {tier.label}
                </span>
                <span className="font-mono text-xs text-[#888888]">
                  {tier.cost === 0 ? "Free" : `${tier.cost} credits`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cover image */}
        <div>
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
                  className="w-full aspect-video object-cover border border-[#E5E5E5] rounded-lg"
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
              <label className="flex flex-col items-center justify-center border border-dashed border-black p-8 cursor-pointer hover:bg-[#F5F5F5] transition-colors rounded-lg">
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
      </div>

      {/* Insufficient credits warning */}
      {creditCost > 0 && balance < creditCost && (
        <div className="border border-black p-4 space-y-3">
          <p className="font-mono text-xs text-black">
            You need{" "}
            <span className="font-semibold">{creditCost} credits</span> for this
            event. You have{" "}
            <span className="font-semibold">{balance} credits</span>.
          </p>
          <button
            type="button"
            onClick={() => setShowBuyModal(true)}
            className="w-full border border-black py-3 font-mono text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors min-h-11"
          >
            Buy Credits
          </button>
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="border border-black p-4 space-y-3 bg-[#F5F5F5]">
          <p className="font-mono text-xs">
            This event costs{" "}
            <span className="font-semibold">{creditCost} credits</span>. You
            have <span className="font-semibold">{balance} credits</span>.
            Confirm?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowConfirm(false);
                void doCreateEvent();
              }}
              className="flex-1 bg-black text-white py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors min-h-11 border border-black"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="flex-1 border border-black py-3 font-mono text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors min-h-11"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !title.trim() || !eventDate || showConfirm || (creditCost > 0 && balance < creditCost)}
        className="w-full bg-black text-white py-4 font-mono text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-11 border border-black rounded-xl"
      >
        {submitting
          ? "Creating…"
          : creditCost > 0
          ? `Create Gallery · ${creditCost} credits`
          : "Create Gallery"}
      </button>
    </form>

    <BuyCreditsModal open={showBuyModal} onClose={() => setShowBuyModal(false)} />
    </>
  );
}
