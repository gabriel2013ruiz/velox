// Order storage with an Upstash/Vercel-KV REST backend when configured,
// falling back to an in-memory store (fine for local dev / demo).

export interface Order {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  method: string;
  lang: string;
  currency: string;
  total: number;
  items: { id: string; name: string; qty: number; units: number; price: number }[];
  status: "paid" | "pending";
}

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const LIST_KEY = "velox:orders";

export const kvEnabled = Boolean(KV_URL && KV_TOKEN);

// In-memory fallback (module-scoped; resets on cold start).
const memory: Order[] = [];

async function kv(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(KV_URL as string, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV error ${res.status}`);
  const data = await res.json();
  return data.result;
}

export async function saveOrder(order: Order): Promise<void> {
  if (kvEnabled) {
    // LPUSH newest-first, capped to 500 entries
    await kv(["LPUSH", LIST_KEY, JSON.stringify(order)]);
    await kv(["LTRIM", LIST_KEY, 0, 499]);
  } else {
    memory.unshift(order);
    if (memory.length > 500) memory.length = 500;
  }
}

export async function listOrders(): Promise<Order[]> {
  if (kvEnabled) {
    const raw = (await kv(["LRANGE", LIST_KEY, 0, 499])) as string[];
    return (raw || []).map((s) => JSON.parse(s) as Order);
  }
  return memory;
}
