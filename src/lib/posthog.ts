import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    capture_pageview: false,
    persistence: "localStorage",
  });
}

type TrackableEvent =
  | "event_created"
  | "qr_opened"
  | "upload_started"
  | "upload_completed"
  | "gallery_opened"
  | "revisit"
  | "download_gallery";

export function track(event: TrackableEvent, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}
