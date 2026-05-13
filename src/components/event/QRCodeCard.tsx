"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Download, Copy, Share2, Check } from "lucide-react";
import { getEventUrl } from "@/lib/utils";
import { toast } from "sonner";
import QRCodeLib from "qrcode";

interface QRCodeCardProps {
  slug: string;
  title: string;
}

export function QRCodeCard({ slug, title }: QRCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const url = getEventUrl(slug);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownload() {
    const dataUrl = await QRCodeLib.toDataURL(url, {
      width: 1024,
      margin: 2,
      color: { dark: "#000000", light: "#FFFFFF" },
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `flick-qr-${slug}.png`;
    a.click();
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `${title} — share your photos here:\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="border border-black">
      <div className="border-b border-black px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#888888]">
          Event QR Code
        </p>
      </div>

      <div className="p-6 flex flex-col items-center gap-4">
        <div className="border border-black p-4 bg-white inline-block">
          <QRCode value={url} size={200} />
        </div>

        <div className="w-full border border-[#E5E5E5] px-3 py-2 bg-[#F5F5F5]">
          <p className="font-mono text-xs text-[#888888] truncate">{url}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-0 w-full">
          <button
            onClick={handleCopy}
            className="flex-1 border border-black px-4 py-3 font-mono text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 min-h-11"
          >
            {copied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
            {copied ? "Copied" : "Copy Link"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 border border-black border-l-0 sm:border-l-0 px-4 py-3 font-mono text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 min-h-11"
          >
            <Download size={14} strokeWidth={1.5} />
            Download QR
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-black text-white px-4 py-3 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 min-h-11 border border-black border-l-0 sm:border-l-0"
          >
            <Share2 size={14} strokeWidth={1.5} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
