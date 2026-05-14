"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  Share2,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { toast } from "sonner";
import type { Id } from "../../../convex/_generated/dataModel";

interface LightboxUpload {
  _id: Id<"uploads">;
  fileUrl: string;
  fileType: "image" | "video";
  uploadedBy: string;
}

interface MediaLightboxProps {
  uploads: LightboxUpload[];
  initialIndex: number;
  eventTitle?: string;
  guestName?: string;
  onDeleteOwn?: (uploadId: Id<"uploads">) => Promise<void>;
  onClose: () => void;
}

export function MediaLightbox({
  uploads,
  initialIndex,
  eventTitle = "Flick",
  guestName,
  onDeleteOwn,
  onClose,
}: MediaLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const current = uploads[index];
  const canDelete = !!guestName && !!onDeleteOwn && current?.uploadedBy === guestName;

  const prev = useCallback(() => {
    setConfirmDelete(false);
    setIndex((i) => (i > 0 ? i - 1 : uploads.length - 1));
  }, [uploads.length]);

  const next = useCallback(() => {
    setConfirmDelete(false);
    setIndex((i) => (i < uploads.length - 1 ? i + 1 : 0));
  }, [uploads.length]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Reset confirm state when navigating
  useEffect(() => {
    setConfirmDelete(false);
  }, [index]);

  // Auto-reset confirm after 3 s
  useEffect(() => {
    if (!confirmDelete) return;
    const t = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(t);
  }, [confirmDelete]);

  if (!current) return null;

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch(current.fileUrl);
      const blob = await res.blob();
      const ext = current.fileType === "video" ? "mp4" : "jpg";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${current.uploadedBy}_flick.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloading(false);
    }
  }

  async function handleDelete() {
    if (!canDelete || !onDeleteOwn) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await onDeleteOwn(current._id);
      toast.success("Photo deleted");
      // Navigate to adjacent item or close
      if (uploads.length <= 1) {
        onClose();
      } else {
        setIndex((i) => (i >= uploads.length - 1 ? i - 1 : i));
      }
    } catch {
      toast.error("Could not delete photo");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: eventTitle, url: current.fileUrl });
      } else {
        await navigator.clipboard.writeText(current.fileUrl);
        toast.success("Link copied!");
      }
    } catch {
      // user cancelled share — no-op
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex flex-col bg-black"
        onClick={onClose}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">
            {current.uploadedBy} · {index + 1}/{uploads.length}
          </p>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Media */}
        <div
          className="flex-1 flex items-center justify-center relative overflow-hidden px-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Prev */}
          {uploads.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="max-h-full max-w-full flex items-center justify-center"
            >
              {current.fileType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.fileUrl}
                  alt={`Photo by ${current.uploadedBy}`}
                  className="max-h-[75vh] max-w-full object-contain rounded-lg"
                  draggable={false}
                />
              ) : (
                <video
                  src={current.fileUrl}
                  className="max-h-[75vh] max-w-full rounded-lg"
                  autoPlay
                  controls
                  playsInline
                  loop
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Next */}
          {uploads.length > 1 && (
            <button
              onClick={next}
              className="absolute right-2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
            >
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Bottom action bar */}
        <div
          className="flex items-center justify-center gap-3 px-4 pt-4 pb-6 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white disabled:opacity-50 min-w-16"
          >
            {downloading
              ? <Loader size={18} strokeWidth={1.5} className="animate-spin" />
              : <Download size={18} strokeWidth={1.5} />}
            <span className="font-mono text-[9px] uppercase tracking-widest">Save</span>
          </button>

          {/* Delete — own photos only */}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition-colors min-w-16 ${
                confirmDelete
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              } disabled:opacity-50`}
            >
              {deleting ? (
                <Loader size={18} strokeWidth={1.5} className="animate-spin" />
              ) : confirmDelete ? (
                <AlertTriangle size={18} strokeWidth={1.5} />
              ) : (
                <Trash2 size={18} strokeWidth={1.5} />
              )}
              <span className="font-mono text-[9px] uppercase tracking-widest">
                {confirmDelete ? "Confirm?" : "Delete"}
              </span>
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white min-w-16"
          >
            <Share2 size={18} strokeWidth={1.5} />
            <span className="font-mono text-[9px] uppercase tracking-widest">Share</span>
          </button>
        </div>

        {/* Dot indicators */}
        {uploads.length > 1 && uploads.length <= 20 && (
          <div className="flex justify-center gap-1.5 pb-4 flex-shrink-0">
            {uploads.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
