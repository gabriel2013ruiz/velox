import { NextResponse } from "next/server";
import { saveOrder, Order, kvEnabled } from "@/lib/orders";
import { sendOrderEmail, emailEnabled } from "@/lib/email";

export const runtime = "nodejs";

function id() {
  return (
    Date.now().toString(36).slice(-5).toUpperCase() +
    Math.random().toString(36).slice(2, 5).toUpperCase()
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const order: Order = {
      id: id(),
      createdAt: new Date().toISOString(),
      email: String(body.email || "").slice(0, 200),
      name: String(body.name || "").slice(0, 200),
      address: String(body.address || "").slice(0, 300),
      city: String(body.city || "").slice(0, 120),
      zip: String(body.zip || "").slice(0, 40),
      method: String(body.method || "demo").slice(0, 40),
      lang: body.lang === "en" ? "en" : "pt",
      currency: String(body.currency || "R$").slice(0, 8),
      total: Number(body.total) || 0,
      items: Array.isArray(body.items) ? body.items.slice(0, 20) : [],
      status: "paid",
    };

    await saveOrder(order);
    const emailed = await sendOrderEmail(order);

    return NextResponse.json({ ok: true, orderId: order.id, emailed, persisted: kvEnabled, emailEnabled });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
