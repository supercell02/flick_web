import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const addUpload = mutation({
  args: {
    eventId: v.id("events"),
    storageId: v.id("_storage"),
    fileType: v.union(v.literal("image"), v.literal("video")),
    uploadedBy: v.string(),
    size: v.number(),
    deviceInfo: v.string(),
  },
  handler: async (ctx, args) => {
    const uploadedBy = args.uploadedBy.trim().slice(0, 50);
    if (!uploadedBy) throw new ConvexError("uploadedBy is required");

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new ConvexError("Event not found");
    if (event.uploadCount >= 500) throw new ConvexError("Upload limit reached");

    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) throw new ConvexError("File not found in storage");

    await ctx.db.insert("uploads", {
      eventId: args.eventId,
      fileUrl,
      fileType: args.fileType,
      uploadedBy,
      uploadedAt: Date.now(),
      size: args.size,
      deviceInfo: args.deviceInfo.slice(0, 200),
      isVisible: true,
    });

    await ctx.db.patch(args.eventId, {
      uploadCount: event.uploadCount + 1,
    });
  },
});

export const getUploadsByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("uploads")
      .withIndex("by_event_time", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .filter((q) => q.eq(q.field("isVisible"), true))
      .collect();
  },
});

export const getAllUploadsByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new ConvexError("Event not found");
    if (event.hostId !== identity.subject) throw new ConvexError("Unauthorized");

    return await ctx.db
      .query("uploads")
      .withIndex("by_event_time", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .collect();
  },
});

export const deleteUpload = mutation({
  args: { uploadId: v.id("uploads") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const upload = await ctx.db.get(args.uploadId);
    if (!upload) throw new ConvexError("Upload not found");

    const event = await ctx.db.get(upload.eventId);
    if (!event) throw new ConvexError("Event not found");
    if (event.hostId !== identity.subject) throw new ConvexError("Unauthorized");

    await ctx.db.delete(args.uploadId);
  },
});

export const toggleUploadVisibility = mutation({
  args: { uploadId: v.id("uploads") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const upload = await ctx.db.get(args.uploadId);
    if (!upload) throw new ConvexError("Upload not found");

    const event = await ctx.db.get(upload.eventId);
    if (!event) throw new ConvexError("Event not found");
    if (event.hostId !== identity.subject) throw new ConvexError("Unauthorized");

    await ctx.db.patch(args.uploadId, { isVisible: !upload.isVisible });
  },
});
