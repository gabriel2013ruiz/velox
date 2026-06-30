# VELOX — Aurora Light Projector Store 🌌

A premium, fully bilingual (🇧🇷 Português / 🇺🇸 English) single-product e‑commerce storefront for the **Velox Aurora** — a viral aurora/galaxy light projector. Built to convert and to scale on social.

**Live demo:** _deployed on Vercel_

---

## ✨ Features

- **Single hero product** sold in 3 bundle tiers (1 / 2 / 3 units) with savings, "best seller" and "best value" badges — classic high-converting dropshipping layout.
- **Fully bilingual** with an instant PT/EN toggle (Portuguese default), persisted to `localStorage`.
- **Real shopping cart** — slide-out drawer, quantity controls, persistence across reloads.
- **Full checkout** with every payment method: **Pix** (with QR), credit/debit card, **Apple Pay**, **Google Pay** and **PayPal**.
- **Premium cosmic UI** — animated aurora backdrop, CSS-art projector (zero external image dependencies, nothing can break), marquee announcement bar, reviews, FAQ accordion.
- Localized currency: **R$ (BRL)** in Portuguese, **$ (USD)** in English.
- SEO metadata + Open Graph, mobile-first responsive design.

## 🧱 Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Deployed on [Vercel](https://vercel.com/)

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## 🗂️ Project structure

```
app/
  layout.tsx        # providers (i18n + cart), SEO metadata
  page.tsx          # storefront (hero, features, bundles, reviews, FAQ…)
  checkout/page.tsx # checkout + payment methods
components/         # Nav, CartDrawer, ProjectorVisual, PaymentIcons, Stars
lib/
  i18n.tsx          # bilingual dictionary + language context
  products.ts       # bundles, pricing, reviews
  cart.tsx          # cart context (localStorage-backed)
```

## 🖼️ Product imagery

Real galaxy-projection photos (royalty-free, Pexels license) are self-hosted in
`public/products/` and shown in the hero, the bundle cards, the cart/checkout, and a
lightbox **gallery**. Self-hosting means there are no external image dependencies that
can break.

## 💳 Payments, email & admin — already wired, key-gated

The whole backend is built and **works in demo mode with no setup**. Add an
environment variable (see `.env.example`) and that piece switches from demo to live —
no code changes:

| Feature | Provider | Env var | Without it |
|---|---|---|---|
| Card / Apple Pay / Google Pay | **Stripe** | `STRIPE_SECRET_KEY` | Demo success screen |
| **Pix** | **Mercado Pago** | `MP_ACCESS_TOKEN` | Demo success screen |
| Order confirmation email | **Resend** | `RESEND_API_KEY` | Skipped silently |
| Order storage for `/admin` | **Vercel KV / Upstash** | `KV_REST_API_URL` + `KV_REST_API_TOKEN` | In-memory (resets) |
| Admin password | — | `ADMIN_PASSWORD` | Defaults to `velox-admin` |

**API routes**

- `POST /api/checkout` — returns a hosted Stripe/Mercado Pago payment URL when keys are set, otherwise `{ demo: true }`.
- `POST /api/order` — records the order and sends the confirmation email.
- `GET /api/orders` — lists orders for the admin (requires `x-admin-password` header).

**Admin dashboard:** visit **`/admin`**, sign in (default password `velox-admin`), and see
orders, revenue and units sold.

### Go fully live in 5 minutes
1. Create accounts: [Stripe](https://dashboard.stripe.com), [Mercado Pago](https://www.mercadopago.com.br/developers) (Pix), [Resend](https://resend.com) (email).
2. In **Vercel → Settings → Environment Variables**, paste the keys from `.env.example`.
3. Add a **Vercel KV** store (Storage tab) so orders persist.
4. Redeploy. Done — real money, real emails, real order history.

---

Built with [Claude Code](https://claude.com/claude-code).
