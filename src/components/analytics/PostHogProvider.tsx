"use client";

import { useEffect, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, track } from "@/lib/posthog";

export function PostHogProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (pathname) {
      let url = pathname;
      if (searchParams?.toString()) {
        url += `?${searchParams.toString()}`;
      }
      track("gallery_opened" as never, { url });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
