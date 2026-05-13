"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { EventCard } from "@/components/event/EventCard";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const events = useQuery(api.events.getEventsByHost);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-black pb-6 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-1">
            Host Dashboard
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">Your Galleries</h1>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-black text-white px-4 py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2 min-h-11"
        >
          <Plus size={14} strokeWidth={1.5} />
          New Gallery
        </Link>
      </div>

      {/* Events grid */}
      {events === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`border border-black ${i > 0 ? "border-l-0" : ""} h-64 bg-[#F5F5F5] animate-pulse`} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="border border-black p-12 text-center"
        >
          <p className="font-serif text-2xl font-semibold mb-2">No galleries yet</p>
          <p className="font-mono text-sm text-[#888888] mb-6">
            Create your first event gallery in under 60 seconds.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors min-h-11"
          >
            <Plus size={14} strokeWidth={1.5} />
            Create Gallery
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0">
          {events.map((event, i) => (
            <div key={event._id} className={i % 3 !== 0 ? "border-l-0" : ""}>
              <EventCard event={event} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
