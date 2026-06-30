"use client";

import Link from "next/link";
import { useI18n, Lang } from "@/lib/i18n";

type T = { pt: string; en: string };
const tx = (o: T, l: Lang) => o[l];

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center rounded-full border border-border p-0.5 text-xs font-semibold">
      {(["pt", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-full transition ${lang === l ? "bg-white text-[#060611]" : "text-muted hover:text-white"}`}
        >
          {l === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
        </button>
      ))}
    </div>
  );
}

const steps: { icon: string; title: T; body: T }[] = [
  {
    icon: "🛒",
    title: { pt: "1. O cliente compra", en: "1. The customer buys" },
    body: {
      pt: "A pessoa entra no site, escolhe um kit (1, 2 ou 3 unidades), vai pro checkout e paga com Pix, cartão, Apple Pay ou PayPal.",
      en: "A visitor opens the site, picks a kit (1, 2 or 3 units), goes to checkout and pays with Pix, card, Apple Pay or PayPal.",
    },
  },
  {
    icon: "💸",
    title: { pt: "2. O dinheiro cai no seu Nubank", en: "2. Money lands in your Nubank" },
    body: {
      pt: "No Pix, o cliente escaneia o QR Code (ou copia o código) e o valor cai DIRETO na sua conta Nubank — sem taxas, na hora.",
      en: "With Pix, the customer scans the QR (or copies the code) and the money lands DIRECTLY in your Nubank — no fees, instantly.",
    },
  },
  {
    icon: "📋",
    title: { pt: "3. Você vê o pedido", en: "3. You see the order" },
    body: {
      pt: "Cada pedido aparece no seu painel em /admin (senha padrão: velox-admin) com nome, endereço e o que a pessoa comprou.",
      en: "Every order shows up in your dashboard at /admin (default password: velox-admin) with name, address and what they bought.",
    },
  },
  {
    icon: "📦",
    title: { pt: "4. Você manda enviar", en: "4. You fulfill it" },
    body: {
      pt: "Você copia o endereço do cliente e faz o pedido no seu fornecedor (dropshipping), que envia o produto direto pra casa da pessoa. Você nunca toca no produto.",
      en: "You copy the customer's address and place the order with your supplier (dropshipping), who ships straight to the customer. You never touch the product.",
    },
  },
  {
    icon: "🤑",
    title: { pt: "5. Você fica com o lucro", en: "5. You keep the profit" },
    body: {
      pt: "Recebeu R$149, pagou ~R$40 ao fornecedor. O resto (~R$109) é seu. Repita em escala.",
      en: "You received R$149, paid ~R$40 to the supplier. The rest (~R$109) is yours. Repeat at scale.",
    },
  },
];

const todo: { icon: string; title: T; body: T; done?: boolean }[] = [
  {
    icon: "✅",
    title: { pt: "Site no ar", en: "Store is live" },
    body: { pt: "Pronto! Seu site já está online e recebendo Pix no seu Nubank.", en: "Done! Your store is online and already takes Pix into your Nubank." },
    done: true,
  },
  {
    icon: "🧪",
    title: { pt: "Teste o seu Pix", en: "Test your own Pix" },
    body: {
      pt: "Vá no checkout, escolha Pix e escaneie o QR com o SEU app do Nubank. Confirme que aparece o seu nome. (Não pague de verdade — só confira.)",
      en: "Go to checkout, pick Pix and scan the QR with YOUR Nubank app. Confirm it shows your name. (Don't actually pay — just check.)",
    },
  },
  {
    icon: "🏭",
    title: { pt: "Arrume um fornecedor", en: "Get a supplier" },
    body: {
      pt: "Procure 'fornecedor dropshipping projetor aurora' (nacional é melhor: entrega rápida). É de onde o produto sai.",
      en: "Search 'aurora projector dropshipping supplier' (national = faster delivery). That's where the product ships from.",
    },
  },
  {
    icon: "📱",
    title: { pt: "Poste vídeos (TikTok / Reels)", en: "Post videos (TikTok / Reels)" },
    body: {
      pt: "Grave o efeito da luz num quarto escuro. 1–3 posts por dia. Um vídeo viral = muitas vendas. É daqui que vêm os clientes.",
      en: "Film the light effect in a dark room. 1–3 posts a day. One viral video = lots of sales. This is where customers come from.",
    },
  },
  {
    icon: "⚡",
    title: { pt: "(Opcional) Pix automático", en: "(Optional) Automatic Pix" },
    body: {
      pt: "Hoje você confirma o pagamento na mão (olhando o Nubank). Pra ficar automático, crie uma conta no Mercado Pago e me mande o token.",
      en: "Today you confirm payments manually (checking Nubank). To make it automatic, create a Mercado Pago account and send me the token.",
    },
  },
];

export default function Guia() {
  const { lang } = useI18n();
  const L = (o: T) => tx(o, lang);

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      {/* header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="text-aurora">◐</span> VELOX
        </Link>
        <div className="flex items-center gap-3">
          <LangToggle />
          <Link href="/" className="text-sm text-muted hover:text-white">{lang === "pt" ? "← Loja" : "← Store"}</Link>
        </div>
      </div>

      {/* intro */}
      <div className="aurora relative mt-8 rounded-3xl border border-border bg-card p-7">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card-2 px-3 py-1 text-xs font-medium text-muted">
          📘 {lang === "pt" ? "Guia do lojista (só você vê isto)" : "Owner guide (just for you)"}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl text-balance">
          {lang === "pt" ? "Como a sua loja funciona" : "How your store works"}
        </h1>
        <p className="mt-3 text-muted">
          {lang === "pt"
            ? "Em 5 passos simples — do clique do cliente até o dinheiro no seu bolso."
            : "In 5 simple steps — from the customer's click to money in your pocket."}
        </p>
      </div>

      {/* money flow */}
      <div className="mt-6 rounded-2xl border border-border bg-card-2/40 p-5 text-center text-sm">
        <div className="flex flex-wrap items-center justify-center gap-2 font-semibold">
          <span className="rounded-full bg-card px-3 py-1.5">{lang === "pt" ? "Cliente paga R$149" : "Customer pays R$149"}</span>
          <span className="text-aurora">→</span>
          <span className="rounded-full bg-card px-3 py-1.5">{lang === "pt" ? "Cai no seu Nubank" : "Lands in your Nubank"}</span>
          <span className="text-aurora">→</span>
          <span className="rounded-full bg-card px-3 py-1.5">{lang === "pt" ? "Fornecedor envia (~R$40)" : "Supplier ships (~R$40)"}</span>
          <span className="text-aurora">→</span>
          <span className="rounded-full bg-gradient-to-r from-teal to-violet px-3 py-1.5 text-[#060611]">{lang === "pt" ? "Lucro ~R$109 🤑" : "Profit ~R$109 🤑"}</span>
        </div>
      </div>

      {/* where the product comes from */}
      <div className="mt-8 rounded-2xl border border-violet/40 bg-card p-6">
        <h2 className="text-xl font-bold">📦 {lang === "pt" ? "De onde vem o produto?" : "Where does the product come from?"}</h2>
        <p className="mt-2 text-sm text-muted">
          {lang === "pt"
            ? "O Velox Aurora é um produto FÍSICO de verdade (um projetor de luz) — não é app, não é digital. Você NÃO fabrica e NÃO guarda nada em casa. Quem tem o produto pronto é um FORNECEDOR (geralmente fábricas na China ou distribuidores no Brasil)."
            : "The Velox Aurora is a REAL physical product (a light projector) — not an app, not digital. You do NOT manufacture it and do NOT keep any stock at home. A SUPPLIER already has it (usually factories in China or distributors in Brazil)."}
        </p>
        <p className="mt-3 text-sm font-semibold">{lang === "pt" ? "Como funciona na prática:" : "How it works in practice:"}</p>
        <ol className="mt-2 space-y-2 text-sm text-muted">
          <li>1. {lang === "pt" ? "Você acha o produto num app/site de fornecedor (lista abaixo)." : "You find the product on a supplier app/site (list below)."}</li>
          <li>2. {lang === "pt" ? "Cliente compra no SEU site e paga você (Pix no Nubank)." : "A customer buys on YOUR site and pays you (Pix to Nubank)."}</li>
          <li>3. {lang === "pt" ? "Você compra do fornecedor pelo preço baixo e coloca o ENDEREÇO DO CLIENTE." : "You buy from the supplier at the low price and put the CUSTOMER'S ADDRESS."}</li>
          <li>4. {lang === "pt" ? "O fornecedor envia direto pra casa do cliente. Você nunca toca no produto." : "The supplier ships straight to the customer. You never touch the product."}</li>
        </ol>
        <p className="mt-4 text-sm font-semibold">{lang === "pt" ? "Onde achar fornecedor (apps/sites):" : "Where to find a supplier (apps/sites):"}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { n: "AliExpress", u: "https://pt.aliexpress.com/wholesale?SearchText=galaxy+aurora+projector" },
            { n: "CJ Dropshipping", u: "https://cjdropshipping.com" },
            { n: "Zendrop", u: "https://zendrop.com" },
            { n: "Dropi (BR)", u: "https://dropi.com.br" },
          ].map((s) => (
            <a key={s.n} href={s.u} target="_blank" rel="noopener" className="rounded-full border border-border bg-card-2 px-3 py-1.5 text-xs font-semibold hover:border-violet/60">
              {s.n} ↗
            </a>
          ))}
        </div>
        <p className="mt-4 rounded-xl bg-card-2/50 p-3 text-xs text-muted">
          💡 {lang === "pt"
            ? "Dica: fornecedor NACIONAL (Brasil) entrega em poucos dias = clientes felizes. AliExpress é mais barato mas demora 15–40 dias."
            : "Tip: a NATIONAL (Brazil) supplier delivers in a few days = happy customers. AliExpress is cheaper but takes 15–40 days."}
        </p>
      </div>

      {/* steps */}
      <h2 className="mt-10 text-xl font-bold">{lang === "pt" ? "Passo a passo" : "Step by step"}</h2>
      <div className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card-2 text-xl">{s.icon}</div>
            <div>
              <h3 className="font-bold">{L(s.title)}</h3>
              <p className="mt-1 text-sm text-muted">{L(s.body)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* your checklist */}
      <h2 className="mt-10 text-xl font-bold">{lang === "pt" ? "Sua lista pra começar a vender" : "Your checklist to start selling"}</h2>
      <div className="mt-4 space-y-3">
        {todo.map((s, i) => (
          <div key={i} className={`flex gap-4 rounded-2xl border p-5 ${s.done ? "border-teal/40 bg-teal/5" : "border-border bg-card"}`}>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card-2 text-xl">{s.icon}</div>
            <div>
              <h3 className="font-bold">{L(s.title)}</h3>
              <p className="mt-1 text-sm text-muted">{L(s.body)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* quick links */}
      <h2 className="mt-10 text-xl font-bold">{lang === "pt" ? "Links rápidos" : "Quick links"}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href="/admin" className="rounded-2xl border border-border bg-card p-5 card-hover">
          <p className="font-bold">📋 {lang === "pt" ? "Ver meus pedidos" : "See my orders"}</p>
          <p className="mt-1 text-sm text-muted">/admin · {lang === "pt" ? "senha" : "password"}: velox-admin</p>
        </Link>
        <Link href="/checkout" className="rounded-2xl border border-border bg-card p-5 card-hover">
          <p className="font-bold">🧪 {lang === "pt" ? "Testar o checkout / Pix" : "Test checkout / Pix"}</p>
          <p className="mt-1 text-sm text-muted">{lang === "pt" ? "Escaneie o QR com seu Nubank" : "Scan the QR with your Nubank"}</p>
        </Link>
        <a href="https://www.mercadopago.com.br/developers/panel/app" target="_blank" rel="noopener" className="rounded-2xl border border-border bg-card p-5 card-hover">
          <p className="font-bold">⚡ Mercado Pago</p>
          <p className="mt-1 text-sm text-muted">{lang === "pt" ? "Pra Pix automático (opcional)" : "For automatic Pix (optional)"}</p>
        </a>
        <a href="https://www.tiktok.com/upload" target="_blank" rel="noopener" className="rounded-2xl border border-border bg-card p-5 card-hover">
          <p className="font-bold">📱 TikTok</p>
          <p className="mt-1 text-sm text-muted">{lang === "pt" ? "Poste o vídeo do efeito" : "Post the effect video"}</p>
        </a>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card-2/40 p-5 text-sm text-muted">
        ⚠️ {lang === "pt"
          ? "Importante: o pagamento via Pix é confirmado por você (olhando o app do Nubank) antes de enviar. Para confirmação automática, conecte o Mercado Pago."
          : "Important: Pix payments are confirmed by you (checking the Nubank app) before shipping. For automatic confirmation, connect Mercado Pago."}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        {lang === "pt" ? "Esta página é só pra você. Os clientes não a veem no menu." : "This page is just for you. Customers don't see it in the menu."}
      </p>
    </main>
  );
}
