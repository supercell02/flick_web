import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserCredits = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const record = await ctx.db
      .query("userCredits")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!record) return { balance: 0 };
    return { balance: record.balance };
  },
});

export const initializeUserCredits = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const existing = await ctx.db
      .query("userCredits")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!existing) {
      await ctx.db.insert("userCredits", {
        userId: identity.subject,
        balance: 0,
        updatedAt: Date.now(),
      });
    }
  },
});

export const consumeCredits = mutation({
  args: {
    amount: v.number(),
    description: v.string(),
    eventId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const record = await ctx.db
      .query("userCredits")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    const currentBalance = record?.balance ?? 0;
    if (currentBalance < args.amount) {
      throw new ConvexError("Insufficient credits");
    }

    if (record) {
      await ctx.db.patch(record._id, {
        balance: currentBalance - args.amount,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userCredits", {
        userId: identity.subject,
        balance: -args.amount,
        updatedAt: Date.now(),
      });
    }

    await ctx.db.insert("creditTransactions", {
      userId: identity.subject,
      type: "consume",
      amount: args.amount,
      description: args.description,
      createdAt: Date.now(),
    });

    return { balance: currentBalance - args.amount };
  },
});

export const awardCredits = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    description: v.string(),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("userCredits")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    let newBalance: number;
    if (record) {
      newBalance = record.balance + args.amount;
      await ctx.db.patch(record._id, {
        balance: newBalance,
        updatedAt: Date.now(),
      });
    } else {
      newBalance = args.amount;
      await ctx.db.insert("userCredits", {
        userId: args.userId,
        balance: newBalance,
        updatedAt: Date.now(),
      });
    }

    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "purchase",
      amount: args.amount,
      description: args.description,
      razorpayOrderId: args.razorpayOrderId,
      razorpayPaymentId: args.razorpayPaymentId,
      createdAt: Date.now(),
    });

    const order = await ctx.db
      .query("razorpayOrders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.razorpayOrderId))
      .first();

    if (order) {
      await ctx.db.patch(order._id, { status: "paid" });
    }

    return { balance: newBalance };
  },
});

export const storeRazorpayOrder = mutation({
  args: {
    userId: v.string(),
    orderId: v.string(),
    amount: v.number(),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("razorpayOrders", {
      userId: args.userId,
      orderId: args.orderId,
      amount: args.amount,
      credits: args.credits,
      status: "created",
      createdAt: Date.now(),
    });
  },
});

export const getRazorpayOrderByOrderId = query({
  args: { orderId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("razorpayOrders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .first();
  },
});

export const getCreditTransactions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const transactions = await ctx.db
      .query("creditTransactions")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(20);

    return transactions;
  },
});
