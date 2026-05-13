"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImageIcon, Upload, QrCode } from "lucide-react";

interface MobileNavProps {
  slug: string;
}

export function MobileNav({ slug }: MobileNavProps) {
  const pathname = usePathname();

  const links = [
    { href: `/e/${slug}`, label: "Gallery", icon: ImageIcon },
    { href: `/e/${slug}/upload`, label: "Upload", icon: Upload },
    { href: `/e/${slug}?show=qr`, label: "QR Code", icon: QrCode },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-black flex md:hidden z-50">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href.split("?")[0];
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-3 min-h-14 text-xs font-mono uppercase tracking-widest gap-1 transition-colors ${
              active ? "bg-black text-white" : "text-black hover:bg-[#F5F5F5]"
            }`}
          >
            <Icon size={18} strokeWidth={1.5} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
