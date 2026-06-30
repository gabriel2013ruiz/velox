"use client";

import { useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  city: string;
  zip: string;
  address: string;
  method: string;
  currency: string;
  total: number;
  items: { name: string; qty: number }[];
  status: string;
}

export default function Admin() {
  const [pw, setPw] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ persisted: boolean; usingDefaultPassword: boolean } | null>(null);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", { headers: { "x-admin-password": pw } });
      if (res.status === 401) {
        setError("Senha incorreta / Wrong password");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrders(data.orders);
      setMeta({ persisted: data.persisted, usingDefaultPassword: data.usingDefaultPassword });
    } catch {
      setError("Erro ao carregar / Failed to load");
    }
    setLoading(false);
  };

  const revenue = (orders || []).reduce((a, o) => a + o.total, 0);

  if (!orders) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-border bg-card p-7">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
            <span className="text-aurora">◐</span> VELOX
          </Link>
          <h1 className="mt-5 text-xl font-bold">Painel de pedidos</h1>
          <p className="mt-1 text-sm text-muted">Admin · orders dashboard</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Senha / Password"
            className="mt-5 w-full rounded-xl border border-border bg-card-2/40 px-4 py-3 text-sm outline-none focus:border-violet/60"
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-pink">{error}</p>}
          <button disabled={loading} className="btn-primary mt-4 w-full rounded-full py-3 text-sm disabled:opacity-70">
            {loading ? "..." : "Entrar / Sign in"}
          </button>
          <p className="mt-4 text-center text-xs text-muted">
            Padrão / default: <code className="text-foreground">velox-admin</code><br />
            (defina <code>ADMIN_PASSWORD</code> no Vercel)
          </p>
          <Link href="/guia" className="mt-4 block text-center text-xs font-semibold text-aurora hover:underline">
            📘 Como a loja funciona — Guia do lojista
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="text-aurora">◐</span> VELOX <span className="text-muted">/ admin</span>
        </Link>
        <button onClick={() => setOrders(null)} className="rounded-full border border-border px-4 py-2 text-sm hover:border-white/40">
          Sair / Log out
        </button>
      </div>

      {meta && !meta.persisted && (
        <div className="mt-6 rounded-xl border border-pink/30 bg-pink/5 px-4 py-3 text-sm text-muted">
          ⚠️ Armazenamento não configurado — os pedidos ficam só em memória e somem ao reiniciar.
          Conecte um banco (Vercel KV / Upstash) para persistir. <span className="opacity-70">Storage not configured — orders are in-memory only.</span>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Pedidos / Orders</p>
          <p className="mt-1 text-3xl font-extrabold">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Receita / Revenue</p>
          <p className="mt-1 text-3xl font-extrabold text-aurora">
            {orders[0]?.currency || "R$"} {revenue.toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Itens vendidos / Units</p>
          <p className="mt-1 text-3xl font-extrabold">
            {orders.reduce((a, o) => a + o.items.reduce((s, i) => s + i.qty, 0), 0)}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card-2/40 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Itens</th>
              <th className="px-4 py-3">Pagamento</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">Nenhum pedido ainda / No orders yet</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{o.name}</div>
                  <div className="text-xs text-muted">{o.email}</div>
                  <div className="text-xs text-muted">{o.city} · {o.zip}</div>
                </td>
                <td className="px-4 py-3 text-xs">
                  {o.items.map((i) => <div key={i.name}>{i.qty}× {i.name}</div>)}
                </td>
                <td className="px-4 py-3"><span className="rounded-full bg-card-2 px-2 py-0.5 text-xs uppercase">{o.method}</span></td>
                <td className="px-4 py-3 text-right font-bold">{o.currency} {o.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-xs text-muted">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
