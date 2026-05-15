import type { Metadata } from "next";
import { Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { Toaster } from "@/components/ui/sonner";
import { CreditInitializer } from "@/components/credits/CreditInitializer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Flick — Collect Event Photos Instantly",
  description:
    "Create a gallery in under 60 seconds. Share a QR code. Guests upload photos directly from their phone — no app required.",
  openGraph: {
    title: "Flick — Collect Event Photos Instantly",
    description: "No app. No signup. Just scan and share.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${playfair.variable} ${ibmPlexMono.variable} h-full`}
        suppressHydrationWarning
      >
        <body className="min-h-full bg-white text-black antialiased">
          <ConvexClientProvider>
            <PostHogProvider>
              <CreditInitializer />
              {children}
              <Toaster />
            </PostHogProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
