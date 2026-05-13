"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { MediaCard } from "./MediaCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Id } from "../../../convex/_generated/dataModel";

interface GalleryGridProps {
  eventId: Id<"events">;
}

export function GalleryGrid({ eventId }: GalleryGridProps) {
  const uploads = useQuery(api.uploads.getUploadsByEvent, { eventId });

  if (uploads === undefined) {
    return (
      <div className="columns-2 md:columns-3 xl:columns-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-3">
            <Skeleton className="w-full aspect-square bg-[#E5E5E5]" />
          </div>
        ))}
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="border border-[#E5E5E5] p-12 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-[#888888]">
          No photos yet
        </p>
        <p className="font-mono text-xs text-[#888888] mt-1">
          Be the first to upload
        </p>
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 xl:columns-4 gap-3">
      {uploads.map((upload, i) => (
        <MediaCard
          key={upload._id}
          fileUrl={upload.fileUrl}
          fileType={upload.fileType}
          uploadedBy={upload.uploadedBy}
          index={i}
        />
      ))}
    </div>
  );
}
