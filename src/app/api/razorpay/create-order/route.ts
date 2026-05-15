import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type Pack = "starter" | "party" | "host";

const PACK_MAP: Record<Pack, { amount: number; credits: number }> = {
  starter: { amount: 9900, credits: 100 },
  party: { amount: 24900, credits: 300 },
  host: { amount: 49900, credits: 700 },
};

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let pack: Pack;
  try {
    const body = (await request.json()) as { pack: string };
    if (!["starter", "party", "host"].includes(body.pack)) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }
    pack = body.pack as Pack;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { amount, credits } = PACK_MAP[pack];

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `flick_${userId}_${Date.now()}`,
  });

  await convex.mutation(api.credits.storeRazorpayOrder, {
    userId,
    orderId: order.id,
    amount,
    credits,
  });

  return NextResponse.json({
    orderId: order.id,
    amount,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
