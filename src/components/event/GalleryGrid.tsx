"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { MediaCard } from "./MediaCard";
import { MediaLightbox } from "./MediaLightbox";
import { Skeleton } from "@/components/ui/skeleton";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState, useEffect } from "react";
import JSZip from "jszip";
import { Download, Loader } from "lucide-react";
import { track } from "@/lib/posthog";

interface GalleryGridProps {
  eventId: Id<"events">;
  eventTitle?: string;
  guestName?: string;
}

export function GalleryGrid({ eventId, eventTitle = "gallery", guestName }: GalleryGridProps) {
  const uploads = useQuery(api.uploads.getUploadsByEvent, { eventId });
  const subfolders = useQuery(api.subfolders.getSubfoldersByEvent, { eventId });
  const deleteOwnUpload = useMutation(api.uploads.deleteOwnUpload);

  const [activeTab, setActiveTab] = useState<Id<"subfolders"> | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const subfolderMap = Object.fromEntries(
    (subfolders ?? []).map((sf) => [sf._id, sf.name])
  );

  const visibleUploads =
    uploads === undefined
      ? undefined
      : activeTab === "all"
      ? uploads
      : uploads.filter((u) => u.subfolderId === activeTab);

  // Keep lightbox index in bounds if uploads are deleted reactively
  useEffect(() => {
    if (lightboxIndex === null || !visibleUploads) return;
    if (visibleUploads.length === 0) {
      setLightboxIndex(null);
    } else if (lightboxIndex >= visibleUploads.length) {
      setLightboxIndex(visibleUploads.length - 1);
    }
  }, [visibleUploads, lightboxIndex]);

  async function handleDeleteOwn(uploadId: Id<"uploads">) {
    await deleteOwnUpload({ uploadId, uploadedBy: guestName! });
  }

  async function handleDownloadAll() {
    if (!uploads || uploads.length === 0 || downloading) return;
    setDownloading(true);
    setProgress(0);
    track("download_gallery", { eventId, count: uploads.length });

    try {
      const zip = new JSZip();
      let completed = 0;
      await Promise.all(
        uploads.map(async (upload) => {
          try {
            const res = await fetch(upload.fileUrl);
            const blob = await res.blob();
            const ext = upload.fileType === "video" ? "mp4" : "jpg";
            const filename = `${upload.uploadedBy}_${upload._id}.${ext}`;
            const folderName = upload.subfolderId
              ? subfolderMap[upload.subfolderId] ?? "Uncategorised"
              : null;
            const zipPath = folderName
              ? `${eventTitle}/${folderName}/${filename}`
              : `${eventTitle}/${filename}`;
            zip.file(zipPath, blob);
          } catch {
            // skip
          } finally {
            completed += 1;
            setProgress(Math.round((completed / uploads.length) * 100));
          }
        })
      );

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${eventTitle.toLowerCase().replace(/\s+/g, "-")}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  }

  if (uploads === undefined || subfolders === undefined) {
    return (
      <div className="columns-2 md:columns-3 xl:columns-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-3">
            <Skeleton
              className="w-full bg-[#E5E5E5]"
              style={{ aspectRatio: [1, 1.3, 0.75, 1.2, 1, 0.9, 1.4, 1.1][i] }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="border border-[#E5E5E5] p-12 text-center rounded-xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[#888888]">No photos yet</p>
        <p className="font-mono text-xs text-[#888888] mt-1">Be the first to upload</p>
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Gallery header */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
            {(visibleUploads ?? []).length}{" "}
            {(visibleUploads ?? []).length === 1 ? "item" : "items"}
          </p>
          <button
            onClick={handleDownloadAll}
            disabled={downloading}
            className="flex items-center gap-2 border border-black bg-white text-black px-3 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50 min-h-9 rounded-lg"
          >
            {downloading ? (
              <><Loader size={12} strokeWidth={1.5} className="animate-spin" />{progress}%</>
            ) : (
              <><Download size={12} strokeWidth={1.5} />Download all</>
            )}
          </button>
        </div>

        {/* Subfolder tabs */}
        {subfolders.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-colors rounded-lg ${
                activeTab === "all"
                  ? "bg-black text-white border-black"
                  : "border-black text-black hover:bg-[#F5F5F5]"
              }`}
            >
              All ({uploads.length})
            </button>
            {subfolders.map((sf) => {
              const count = uploads.filter((u) => u.subfolderId === sf._id).length;
              return (
                <button
                  key={sf._id}
                  onClick={() => setActiveTab(sf._id)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-colors rounded-lg ${
                    activeTab === sf._id
                      ? "bg-black text-white border-black"
                      : "border-black text-black hover:bg-[#F5F5F5]"
                  }`}
                >
                  {sf.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Masonry grid */}
        {visibleUploads && visibleUploads.length > 0 ? (
          <div className="columns-2 md:columns-3 xl:columns-4 gap-3">
            {visibleUploads.map((upload, i) => (
              <MediaCard
                key={upload._id}
                fileUrl={upload.fileUrl}
                fileType={upload.fileType}
                uploadedBy={upload.uploadedBy}
                index={i}
                onClick={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        ) : (
          <div className="border border-[#E5E5E5] p-12 text-center rounded-xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#888888]">
              No photos in this album
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && visibleUploads && visibleUploads.length > 0 && (
        <MediaLightbox
          uploads={visibleUploads}
          initialIndex={lightboxIndex}
          eventTitle={eventTitle}
          guestName={guestName}
          onDeleteOwn={guestName ? handleDeleteOwn : undefined}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
