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

## 💳 Going live with real payments

The checkout is a working UI demo (no real charge). To accept real money, wire the
"Pay" action to a provider — e.g. **Stripe** (cards / Apple Pay / Google Pay), **PayPal**,
and a Brazilian gateway such as **Mercado Pago** or **Pagar.me** for **Pix**. Add your
API keys as environment variables in the Vercel dashboard.

---

Built with [Claude Code](https://claude.com/claude-code).
