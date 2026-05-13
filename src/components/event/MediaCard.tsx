"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface MediaCardProps {
  fileUrl: string;
  fileType: "image" | "video";
  uploadedBy: string;
  index?: number;
}

export function MediaCard({ fileUrl, fileType, uploadedBy, index = 0 }: MediaCardProps) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut", delay: (index % 8) * 0.04 }}
      className="break-inside-avoid mb-3 border border-black group relative overflow-hidden"
    >
      {fileType === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fileUrl}
          alt={`Photo by ${uploadedBy}`}
          className="w-full h-auto block grayscale group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
      ) : (
        <div className="relative aspect-video bg-black">
          <video
            src={fileUrl}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            preload="metadata"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white border border-black p-3">
              <Play size={20} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="font-mono text-[10px] text-[#888888] truncate">{uploadedBy}</p>
      </div>
    </motion.div>
  );
}
