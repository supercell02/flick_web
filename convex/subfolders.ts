import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSubfoldersByEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subfolders")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("asc")
      .collect();
  },
});

export const createSubfolder = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new ConvexError("Event not found");
    if (event.hostId !== identity.subject) throw new ConvexError("Unauthorized");

    const name = args.name.trim().slice(0, 50);
    if (!name) throw new ConvexError("Subfolder name is required");

    const existing = await ctx.db
      .query("subfolders")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    if (existing.length >= 20) throw new ConvexError("Maximum 20 albums per event");

    const duplicate = existing.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) throw new ConvexError("An album with that name already exists");

    return await ctx.db.insert("subfolders", {
      eventId: args.eventId,
      name,
      createdAt: Date.now(),
    });
  },
});

export const deleteSubfolder = mutation({
  args: { subfolderId: v.id("subfolders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const subfolder = await ctx.db.get(args.subfolderId);
    if (!subfolder) throw new ConvexError("Album not found");

    const event = await ctx.db.get(subfolder.eventId);
    if (!event) throw new ConvexError("Event not found");
    if (event.hostId !== identity.subject) throw new ConvexError("Unauthorized");

    // Move uploads in this subfolder back to uncategorised
    const affected = await ctx.db
      .query("uploads")
      .withIndex("by_event", (q) => q.eq("eventId", subfolder.eventId))
      .filter((q) => q.eq(q.field("subfolderId"), args.subfolderId))
      .collect();

    for (const upload of affected) {
      await ctx.db.patch(upload._id, { subfolderId: undefined });
    }

    await ctx.db.delete(args.subfolderId);
  },
});
