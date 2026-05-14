"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate, isRevealed } from "@/lib/utils";
import { ImageIcon, Clock } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

interface EventCardProps {
  event: {
    _id: Id<"events">;
    title: string;
    slug: string;
    coverImage: string | null;
    eventDate: number;
    revealAt: number;
    uploadCount: number;
    createdAt: number;
  };
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const revealed = isRevealed(event.revealAt);

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
    >
      <Link href={`/dashboard/${event._id}`} className="block border border-black group rounded-xl overflow-hidden">
        {/* Cover image */}
        <div className="aspect-video w-full overflow-hidden border-b border-black bg-[#F5F5F5] relative">
          {event.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={32} strokeWidth={1.5} className="text-[#888888]" />
            </div>
          )}
          {!revealed && (
            <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 flex items-center gap-1 rounded-md">
              <Clock size={10} strokeWidth={1.5} />
              <span className="font-mono text-[10px] uppercase tracking-widest">Unrevealed</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-1">
            {formatDate(event.eventDate)}
          </p>
          <h3 className="font-serif text-lg font-semibold leading-tight truncate group-hover:underline">
            {event.title}
          </h3>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E5E5]">
            <span className="font-mono text-xs text-[#888888]">
              {event.uploadCount} photo{event.uploadCount !== 1 ? "s" : ""}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
              /{event.slug}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
