"use client";

import { motion } from "framer-motion";

interface MediaCardProps {
  fileUrl: string;
  fileType: "image" | "video";
  uploadedBy: string;
  index?: number;
  onClick?: () => void;
}

export function MediaCard({ fileUrl, fileType, uploadedBy, index = 0, onClick }: MediaCardProps) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut", delay: (index % 8) * 0.04 }}
      onClick={onClick}
      className="break-inside-avoid mb-3 border border-black group relative overflow-hidden rounded-xl cursor-pointer"
    >
      {fileType === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fileUrl}
          alt={`Photo by ${uploadedBy}`}
          className="w-full h-auto block transition-all duration-500"
          loading="lazy"
        />
      ) : (
        <video
          src={fileUrl}
          className="w-full h-auto block"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}

      {/* Hover overlay: uploader name */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="font-mono text-[10px] text-[#888888] truncate">{uploadedBy}</p>
      </div>
    </motion.div>
  );
}
