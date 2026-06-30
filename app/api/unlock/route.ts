import { NextResponse } from "next/server";

export const runtime = "nodejs";

// The unlock code you give customers AFTER you see their R$19 Pix land in Nubank.
// Set PRO_CODE in Vercel to change it. Default below is for testing.
const PRO_CODE = process.env.PRO_CODE || "VELOXPRO";

export async function POST(req: Request) {
  let code = "";
  try {
    const body = await req.json();
    code = String(body.code || "").trim().toUpperCase();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const ok = code.length > 0 && code === PRO_CODE.trim().toUpperCase();
  return NextResponse.json({ ok });
}
