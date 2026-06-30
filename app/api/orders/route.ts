import { NextResponse } from "next/server";
import { listOrders, kvEnabled } from "@/lib/orders";

export const runtime = "nodejs";

// Demo password used only when ADMIN_PASSWORD is not set.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "velox-admin";

export async function GET(req: Request) {
  const auth = req.headers.get("x-admin-password") || "";
  if (auth !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders, persisted: kvEnabled, usingDefaultPassword: !process.env.ADMIN_PASSWORD });
}
