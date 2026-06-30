import { NextResponse } from "next/server";

export const runtime = "nodejs";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const MP_TOKEN = process.env.MP_ACCESS_TOKEN;

interface Line { name: string; qty: number; price: number; }

function origin(req: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
}

export async function POST(req: Request) {
  const body = await req.json();
  const method: string = body.method || "card";
  const items: Line[] = Array.isArray(body.items) ? body.items : [];
  const lang: string = body.lang === "en" ? "en" : "pt";
  const currency = lang === "pt" ? "brl" : "usd";
  const base = origin(req);

  // ---- Pix via Mercado Pago (Checkout Pro) ----
  if (method === "pix" && MP_TOKEN) {
    try {
      const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: { Authorization: `Bearer ${MP_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            title: i.name,
            quantity: i.qty,
            unit_price: i.price,
            currency_id: "BRL",
          })),
          payment_methods: { excluded_payment_types: [{ id: "ticket" }] },
          back_urls: { success: `${base}/checkout?status=success`, failure: `${base}/checkout` },
          auto_return: "approved",
        }),
      });
      const data = await res.json();
      if (data.init_point) return NextResponse.json({ url: data.init_point });
      return NextResponse.json({ error: "mp_failed", detail: data }, { status: 502 });
    } catch (e) {
      return NextResponse.json({ error: "mp_error", detail: String(e) }, { status: 502 });
    }
  }

  // ---- Card / Apple Pay / Google Pay / PayPal via Stripe Checkout ----
  if (STRIPE_KEY) {
    try {
      const params = new URLSearchParams();
      params.append("mode", "payment");
      params.append("success_url", `${base}/checkout?status=success`);
      params.append("cancel_url", `${base}/checkout`);
      items.forEach((i, idx) => {
        params.append(`line_items[${idx}][price_data][currency]`, currency);
        params.append(`line_items[${idx}][price_data][product_data][name]`, i.name);
        params.append(`line_items[${idx}][price_data][unit_amount]`, String(Math.round(i.price * 100)));
        params.append(`line_items[${idx}][quantity]`, String(i.qty));
      });
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
      const data = await res.json();
      if (data.url) return NextResponse.json({ url: data.url });
      return NextResponse.json({ error: "stripe_failed", detail: data.error?.message }, { status: 502 });
    } catch (e) {
      return NextResponse.json({ error: "stripe_error", detail: String(e) }, { status: 502 });
    }
  }

  // ---- No gateway configured: demo mode ----
  return NextResponse.json({ demo: true });
}
