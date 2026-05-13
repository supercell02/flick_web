import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    title: v.string(),
    slug: v.string(),
    coverImage: v.union(v.string(), v.null()),
    eventDate: v.number(),
    revealAt: v.number(),
    hostId: v.string(),
    createdAt: v.number(),
    uploadCount: v.number(),
    isPublic: v.boolean(),
    revealMode: v.union(
      v.literal("instant"),
      v.literal("after_event"),
      v.literal("next_day")
    ),
  })
    .index("by_slug", ["slug"])
    .index("by_host", ["hostId"]),

  uploads: defineTable({
    eventId: v.id("events"),
    fileUrl: v.string(),
    fileType: v.union(v.literal("image"), v.literal("video")),
    uploadedBy: v.string(),
    uploadedAt: v.number(),
    size: v.number(),
    deviceInfo: v.string(),
    isVisible: v.boolean(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_time", ["eventId", "uploadedAt"]),

  analyticsEvents: defineTable({
    eventId: v.union(v.id("events"), v.null()),
    eventType: v.union(
      v.literal("event_created"),
      v.literal("qr_opened"),
      v.literal("upload_started"),
      v.literal("upload_completed"),
      v.literal("gallery_opened"),
      v.literal("revisit"),
      v.literal("download_gallery")
    ),
    timestamp: v.number(),
    metadata: v.any(),
  })
    .index("by_event", ["eventId"])
    .index("by_type", ["eventType"]),
});
