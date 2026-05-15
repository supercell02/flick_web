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

  subfolders: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    createdAt: v.number(),
  }).index("by_event", ["eventId"]),

  uploads: defineTable({
    eventId: v.id("events"),
    fileUrl: v.string(),
    fileType: v.union(v.literal("image"), v.literal("video")),
    uploadedBy: v.string(),
    uploadedAt: v.number(),
    size: v.number(),
    deviceInfo: v.string(),
    isVisible: v.boolean(),
    subfolderId: v.optional(v.id("subfolders")),
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

  userCredits: defineTable({
    userId: v.string(),
    balance: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  creditTransactions: defineTable({
    userId: v.string(),
    type: v.string(),
    amount: v.number(),
    description: v.string(),
    razorpayOrderId: v.optional(v.string()),
    razorpayPaymentId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  razorpayOrders: defineTable({
    userId: v.string(),
    orderId: v.string(),
    amount: v.number(),
    credits: v.number(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_orderId", ["orderId"])
    .index("by_userId", ["userId"]),
});
