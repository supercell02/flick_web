"use client";

import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { QRCodeCard } from "@/components/event/QRCodeCard";
import { formatDate, isRevealed } from "@/lib/utils";
import { Eye, EyeOff, Trash2, ArrowLeft, Plus, FolderPlus, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function EventManagePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params.eventId as Id<"events">;

  const event = useQuery(api.events.getEventByIdForHost, { eventId });
  const uploads = useQuery(api.uploads.getAllUploadsByEvent, { eventId });
  const analytics = useQuery(api.analytics.getAnalyticsByEvent, { eventId });
  const subfolders = useQuery(api.subfolders.getSubfoldersByEvent, { eventId });
  const toggleVisibility = useMutation(api.uploads.toggleUploadVisibility);
  const deleteUpload = useMutation(api.uploads.deleteUpload);
  const deleteEvent = useMutation(api.events.deleteEvent);
  const createSubfolder = useMutation(api.subfolders.createSubfolder);
  const deleteSubfolder = useMutation(api.subfolders.deleteSubfolder);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmUploadDeleteId, setConfirmUploadDeleteId] = useState<Id<"uploads"> | null>(null);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [creatingAlbum, setCreatingAlbum] = useState(false);

  useEffect(() => {
    if (searchParams?.get("created") === "1") {
      toast.success("Gallery created! Share your QR code with guests.");
    }
  }, [searchParams]);

  if (event === undefined || uploads === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E5E5E5] w-1/3" />
          <div className="h-48 bg-[#E5E5E5]" />
        </div>
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <p className="font-mono text-sm text-[#888888]">Event not found or unauthorized.</p>
      </div>
    );
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteEvent({ eventId });
      toast.success("Gallery deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to delete gallery");
    }
  }

  async function handleDeleteUpload(uploadId: Id<"uploads">) {
    if (confirmUploadDeleteId !== uploadId) {
      setConfirmUploadDeleteId(uploadId);
      setTimeout(() => setConfirmUploadDeleteId(null), 3000);
      return;
    }
    setConfirmUploadDeleteId(null);
    try {
      await deleteUpload({ uploadId });
      toast.success("Upload deleted");
    } catch {
      toast.error("Failed to delete upload");
    }
  }

  async function handleCreateAlbum(e: React.FormEvent) {
    e.preventDefault();
    const name = newAlbumName.trim();
    if (!name) return;
    setCreatingAlbum(true);
    try {
      await createSubfolder({ eventId, name });
      setNewAlbumName("");
      toast.success(`Album "${name}" created`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create album");
    } finally {
      setCreatingAlbum(false);
    }
  }

  async function handleDeleteAlbum(subfolderId: Id<"subfolders">, name: string) {
    try {
      await deleteSubfolder({ subfolderId });
      toast.success(`Album "${name}" deleted — photos moved to general`);
    } catch {
      toast.error("Failed to delete album");
    }
  }

  const revealed = isRevealed(event.revealAt);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="border-b border-black pb-6 mb-8">
        <Link
          href="/dashboard"
          className="font-mono text-[10px] uppercase tracking-widest text-[#888888] flex items-center gap-1 hover:text-black mb-4"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          Dashboard
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-1">
          {formatDate(event.eventDate)}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold">{event.title}</h1>
        <p className="font-mono text-xs text-[#888888] mt-2">
          /{event.slug} · {event.uploadCount} uploads · {revealed ? "Revealed" : "Not yet revealed"}
        </p>
      </div>

      {/* Analytics */}
      {analytics && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: "Uploads", value: analytics.upload_completed },
            { label: "QR Scans", value: analytics.qr_opened },
            { label: "Gallery Views", value: analytics.gallery_opened },
            { label: "Revisits", value: analytics.revisit },
          ].map((stat) => (
            <div key={stat.label} className="border border-black p-4 rounded-xl">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-1">
                {stat.label}
              </p>
              <p className="font-mono text-2xl font-medium">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* QR Code */}
      <div className="mb-8">
        <QRCodeCard slug={event.slug} title={event.title} />
      </div>

      {/* Guest view link */}
      <div className="border border-black mb-8 flex items-center justify-between px-4 py-3 rounded-xl">
        <p className="font-mono text-xs text-[#888888]">Guest view</p>
        <Link
          href={`/e/${event.slug}`}
          target="_blank"
          className="font-mono text-xs uppercase tracking-widest flex items-center gap-1 hover:underline"
        >
          <Plus size={10} strokeWidth={1.5} />
          Open
        </Link>
      </div>

      {/* Albums */}
      <div className="border border-black mb-8 rounded-xl overflow-hidden">
        <div className="border-b border-black px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
              Albums
            </p>
            <span className="font-mono text-[10px] text-[#888888]">
              ({subfolders?.length ?? 0}/20) · optional
            </span>
          </div>
        </div>

        {/* Existing albums */}
        {subfolders && subfolders.length > 0 && (
          <div className="divide-y divide-[#E5E5E5]">
            {subfolders.map((sf) => {
              const count = (uploads ?? []).filter((u) => u.subfolderId === sf._id).length;
              return (
                <div key={sf._id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FolderPlus size={14} strokeWidth={1.5} className="text-[#888888]" />
                    <div>
                      <p className="font-mono text-xs">{sf.name}</p>
                      <p className="font-mono text-[10px] text-[#888888]">
                        {count} {count === 1 ? "photo" : "photos"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAlbum(sf._id, sf.name)}
                    className="p-2 hover:bg-[#F5F5F5] min-h-9 min-w-9 flex items-center justify-center rounded-lg text-[#888888] hover:text-black transition-colors"
                    title="Delete album"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Create new album */}
        {(subfolders?.length ?? 0) < 20 && (
          <form onSubmit={handleCreateAlbum} className="flex border-t border-[#E5E5E5]">
            <input
              type="text"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value.slice(0, 50))}
              placeholder="New album name…"
              className="flex-1 px-4 py-3 font-mono text-sm focus:outline-none border-0 bg-white h-12"
            />
            <button
              type="submit"
              disabled={!newAlbumName.trim() || creatingAlbum}
              className="bg-black text-white px-4 py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 min-h-11 border-l border-black"
            >
              {creatingAlbum ? "…" : "Add"}
            </button>
          </form>
        )}

        {subfolders?.length === 0 && (
          <div className="px-4 py-3 border-t border-[#E5E5E5]">
            <p className="font-mono text-[10px] text-[#888888]">
              No albums yet. Create one above — guests will be able to choose which album their photos go into.
            </p>
          </div>
        )}
      </div>

      {/* Uploads table */}
      <div className="mb-8">
        <div className="border border-black rounded-xl overflow-hidden">
          <div className="border-b border-black px-4 py-3 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
              All Uploads ({uploads.length})
            </p>
          </div>
          {uploads.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-xs text-[#888888]">No uploads yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E5]">
              {uploads.map((upload) => {
                const albumName = upload.subfolderId
                  ? (subfolders ?? []).find((sf) => sf._id === upload.subfolderId)?.name
                  : null;
                return (
                  <div
                    key={upload._id}
                    className={`flex items-center gap-3 px-4 py-3 ${!upload.isVisible ? "opacity-50" : ""}`}
                  >
                    {upload.fileType === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={upload.fileUrl}
                        alt=""
                        className="w-12 h-12 object-cover border border-[#E5E5E5] rounded-md flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#E5E5E5] border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 rounded-md">
                        <span className="font-mono text-[9px] uppercase text-[#888888]">Video</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs truncate">{upload.uploadedBy}</p>
                      <p className="font-mono text-[10px] text-[#888888]">
                        {upload.fileType} · {(upload.size / 1024 / 1024).toFixed(1)} MB
                        {albumName && (
                          <span className="ml-1 text-black">· {albumName}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleVisibility({ uploadId: upload._id })}
                        className="p-2 hover:bg-[#F5F5F5] min-h-11 min-w-11 flex items-center justify-center rounded-lg"
                        title={upload.isVisible ? "Hide" : "Show"}
                      >
                        {upload.isVisible ? (
                          <Eye size={14} strokeWidth={1.5} />
                        ) : (
                          <EyeOff size={14} strokeWidth={1.5} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUpload(upload._id)}
                        className={`p-2 min-h-11 min-w-11 flex items-center justify-center rounded-lg transition-colors ${
                          confirmUploadDeleteId === upload._id
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "hover:bg-[#F5F5F5] text-[#888888] hover:text-black"
                        }`}
                        title={confirmUploadDeleteId === upload._id ? "Click again to confirm" : "Delete"}
                      >
                        {confirmUploadDeleteId === upload._id ? (
                          <AlertTriangle size={14} strokeWidth={1.5} />
                        ) : (
                          <Trash2 size={14} strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete event */}
      <div className="border border-black p-4 rounded-xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888] mb-3">
          Danger Zone
        </p>
        <button
          onClick={handleDelete}
          className={`flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-widest min-h-11 border border-black transition-colors rounded-lg ${
            confirmDelete
              ? "bg-black text-white"
              : "hover:bg-black hover:text-white"
          }`}
        >
          <Trash2 size={14} strokeWidth={1.5} />
          {confirmDelete ? "Confirm Delete" : "Delete Gallery"}
        </button>
        {confirmDelete && (
          <p className="font-mono text-xs text-[#888888] mt-2">
            This will permanently delete all uploads. Click again to confirm.
          </p>
        )}
      </div>
    </div>
  );
}
