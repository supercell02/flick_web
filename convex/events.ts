import { ConvexError, v } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
} from "./_generated/server";
import { nanoid } from "nanoid";

function generateSlug(): string {
  return nanoid(8).toLowerCase().replace(/[^a-z0-9]/g, "x");
}

export const createEvent = mutation({
  args: {
    title: v.string(),
    eventDate: v.number(),
    coverStorageId: v.union(v.id("_storage"), v.null()),
    revealMode: v.union(
      v.literal("instant"),
      v.literal("after_event"),
      v.literal("next_day")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const title = args.title.trim().slice(0, 100);
    if (!title) throw new ConvexError("Title is required");

    const revealAt = computeRevealAt(args.eventDate, args.revealMode);

    let coverImage: string | null = null;
    if (args.coverStorageId) {
      coverImage = await ctx.storage.getUrl(args.coverStorageId);
    }

    let slug = "";
    let attempts = 0;
    while (attempts < 5) {
      const candidate = generateSlug();
      const existing = await ctx.db
        .query("events")
        .withIndex("by_slug", (q) => q.eq("slug", candidate))
        .first();
      if (!existing) {
        slug = candidate;
        break;
      }
      attempts++;
    }
    if (!slug) throw new ConvexError("Failed to generate unique slug");

    const eventId = await ctx.db.insert("events", {
      title,
      slug,
      coverImage,
      eventDate: args.eventDate,
      revealAt,
      hostId: identity.subject,
      createdAt: Date.now(),
      uploadCount: 0,
      isPublic: true,
      revealMode: args.revealMode,
    });

    return { eventId, slug };
  },
});

function computeRevealAt(eventDate: number, revealMode: string): number {
  if (revealMode === "instant") return Date.now();
  if (revealMode === "after_event") return eventDate;
  if (revealMode === "next_day") return eventDate + 24 * 60 * 60 * 1000;
  return eventDate;
}

export const getEventBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!event) return null;
    const { hostId: _hostId, ...safeEvent } = event;
    return safeEvent;
  },
});

export const getEventsByHost = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    return await ctx.db
      .query("events")
      .withIndex("by_host", (q) => q.eq("hostId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const getEventByIdForHost = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const event = await ctx.db.get(args.eventId);
    if (!event) return null;
    if (event.hostId !== identity.subject) return null;

    return event;
  },
});

export const updateUploadCount = internalMutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return;
    await ctx.db.patch(args.eventId, {
      uploadCount: event.uploadCount + 1,
    });
  },
});

export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new ConvexError("Event not found");
    if (event.hostId !== identity.subject) throw new ConvexError("Unauthorized");

    const uploads = await ctx.db
      .query("uploads")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    for (const upload of uploads) {
      await ctx.db.delete(upload._id);
    }

    const subfolders = await ctx.db
      .query("subfolders")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    for (const subfolder of subfolders) {
      await ctx.db.delete(subfolder._id);
    }

    const analytics = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    for (const ev of analytics) {
      await ctx.db.delete(ev._id);
    }

    await ctx.db.delete(args.eventId);
  },
});
