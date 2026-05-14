import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const trackEvent = mutation({
  args: {
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
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("analyticsEvents", {
      eventId: args.eventId,
      eventType: args.eventType,
      timestamp: Date.now(),
      metadata: args.metadata ?? null,
    });
  },
});

export const getAnalyticsByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const event = await ctx.db.get(args.eventId);
    if (!event) return null;
    if (event.hostId !== identity.subject) return null;

    const allEvents = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const counts = {
      event_created: 0,
      qr_opened: 0,
      upload_started: 0,
      upload_completed: 0,
      gallery_opened: 0,
      revisit: 0,
      download_gallery: 0,
    };

    for (const ev of allEvents) {
      counts[ev.eventType] = (counts[ev.eventType] ?? 0) + 1;
    }

    return counts;
  },
});
