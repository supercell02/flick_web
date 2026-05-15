import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event: string;
    payload: {
      payment: {
        entity: {
          order_id: string;
          id: string;
        };
      };
    };
  };

  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "payment.captured") {
    return NextResponse.json({ ok: true });
  }

  const razorpayOrderId = event.payload.payment.entity.order_id;
  const razorpayPaymentId = event.payload.payment.entity.id;

  const order = await convex.query(api.credits.getRazorpayOrderByOrderId, {
    orderId: razorpayOrderId,
  });

  if (!order || order.status !== "created") {
    return NextResponse.json({ ok: true });
  }

  await convex.mutation(api.credits.awardCredits, {
    userId: order.userId,
    amount: order.credits,
    description: `Credit pack purchase (${order.credits} credits)`,
    razorpayOrderId,
    razorpayPaymentId,
  });

  return NextResponse.json({ ok: true });
}
