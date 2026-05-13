import { EventForm } from "@/components/event/EventForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <div className="border-b border-black pb-6 mb-8">
        <Link
          href="/dashboard"
          className="font-mono text-[10px] uppercase tracking-widest text-[#888888] flex items-center gap-1 hover:text-black mb-4"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          Dashboard
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-1">
          New Gallery
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold">Create Event</h1>
      </div>

      <EventForm />
    </div>
  );
}
