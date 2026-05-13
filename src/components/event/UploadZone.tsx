"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { track } from "@/lib/posthog";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

interface UploadZoneProps {
  eventId: Id<"events">;
  guestName: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

const ACCEPTED_TYPES: Record<string, string[]> = {
  "image/jpeg": [],
  "image/png": [],
  "image/webp": [],
  "image/heic": [],
  "video/mp4": [],
  "video/quicktime": [],
  "video/webm": [],
};

function uploadFileWithProgress(
  url: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<{ storageId: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as { storageId: string });
        } catch {
          reject(new Error("Invalid response from storage"));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

export function UploadZone({ eventId, guestName }: UploadZoneProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const addUpload = useMutation(api.uploads.addUpload);
  const trackEvent = useMutation(api.analytics.trackEvent);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setStatus("uploading");
      setProgress(0);
      setErrorMsg("");

      void trackEvent({ eventId, eventType: "upload_started", metadata: { uploadedBy: guestName } });
      track("upload_started", { eventId, uploadedBy: guestName });

      try {
        const deviceInfo = navigator.userAgent.slice(0, 200);
        let filesUploaded = 0;

        for (const file of acceptedFiles) {
          const uploadUrl = await generateUploadUrl();
          const { storageId } = await uploadFileWithProgress(
            uploadUrl,
            file,
            (pct) => {
              const overall = Math.round(
                ((filesUploaded + pct / 100) / acceptedFiles.length) * 100
              );
              setProgress(overall);
            }
          );

          const fileType = file.type.startsWith("video/") ? "video" : "image";
          await addUpload({
            eventId,
            storageId: storageId as Id<"_storage">,
            fileType,
            uploadedBy: guestName,
            size: file.size,
            deviceInfo,
          });

          filesUploaded++;
          setProgress(Math.round((filesUploaded / acceptedFiles.length) * 100));
        }

        setStatus("success");
        setProgress(0);
        void trackEvent({ eventId, eventType: "upload_completed", metadata: { uploadedBy: guestName } });
        track("upload_completed", { eventId, uploadedBy: guestName });
        setTimeout(() => setStatus("idle"), 3000);
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
        setProgress(0);
      }
    },
    [generateUploadUrl, addUpload, trackEvent, eventId, guestName]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 5,
    disabled: status === "uploading",
  });

  return (
    <div className="space-y-3">
      {/* Mobile tap button */}
      <div {...getRootProps()} className="md:hidden">
        <input {...getInputProps()} />
        <button
          disabled={status === "uploading"}
          className="w-full bg-black text-white h-16 font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 min-h-11 hover:bg-neutral-800 transition-colors"
        >
          <Upload size={18} strokeWidth={1.5} />
          Tap to Add Photos &amp; Videos
        </button>
      </div>

      {/* Desktop drop zone */}
      <div
        {...getRootProps()}
        className={`hidden md:flex flex-col items-center justify-center border-2 border-dashed border-black p-12 cursor-pointer transition-colors ${
          isDragActive ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
        } ${status === "uploading" ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload size={32} strokeWidth={1.5} className="mb-3 text-[#888888]" />
        <p className="font-mono text-sm uppercase tracking-widest text-center">
          {isDragActive ? "Drop files here" : "Drag & drop photos and videos"}
        </p>
        <p className="font-mono text-xs text-[#888888] mt-1">
          or click to browse · max 5 files · 50MB video / 10MB image
        </p>
      </div>

      {/* Progress bar */}
      <AnimatePresence>
        {status === "uploading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-1"
          >
            <div className="w-full bg-[#E5E5E5] h-0.5">
              <motion.div
                className="bg-black h-0.5"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" as const }}
              />
            </div>
            <p className="font-mono text-xs text-[#888888] uppercase tracking-widest">
              Uploading… {progress}%
            </p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 border border-black p-3 bg-white"
          >
            <CheckCircle size={16} strokeWidth={1.5} />
            <p className="font-mono text-xs uppercase tracking-widest">
              Uploaded successfully
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 border border-black p-3 bg-white"
          >
            <AlertCircle size={16} strokeWidth={1.5} />
            <p className="font-mono text-xs uppercase tracking-widest text-red-600">
              {errorMsg}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
