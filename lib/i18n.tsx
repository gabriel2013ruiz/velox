"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "pt" | "en";

type Dict = Record<string, { pt: string; en: string }>;

// Central translation dictionary. PT is the default.
export const dict: Dict = {
  "nav.product": { pt: "Produto", en: "Product" },
  "nav.how": { pt: "Como funciona", en: "How it works" },
  "nav.reviews": { pt: "Avaliações", en: "Reviews" },
  "nav.faq": { pt: "Dúvidas", en: "FAQ" },
  "nav.studio": { pt: "App Studio", en: "Studio App" },
  "nav.buy": { pt: "Comprar", en: "Buy now" },

  "ann.1": { pt: "✦ Frete grátis para todo o Brasil", en: "✦ Free worldwide shipping" },
  "ann.2": { pt: "✦ Garantia de 30 dias ou seu dinheiro de volta", en: "✦ 30-day money-back guarantee" },
  "ann.3": { pt: "✦ +40.000 quartos transformados", en: "✦ 40,000+ rooms transformed" },
  "ann.4": { pt: "✦ Pague no Pix, cartão, Apple Pay ou PayPal", en: "✦ Pay with card, Apple Pay or PayPal" },
  "ann.5": { pt: "✦ NOVO: experimente o app Velox Studio grátis", en: "✦ NEW: try the Velox Studio app free" },

  "studiopromo.badge": { pt: "NOVO · APP GRÁTIS", en: "NEW · FREE APP" },
  "studiopromo.title": { pt: "Não quer esperar a entrega?", en: "Don't want to wait for delivery?" },
  "studiopromo.sub": { pt: "Transforme seu celular, tablet ou TV numa galáxia agora mesmo — direto no navegador, sem instalar nada. Escolha cores, temas, modo música e projete.", en: "Turn your phone, tablet or TV into a galaxy right now — in your browser, nothing to install. Pick colors, themes, music mode and project." },
  "studiopromo.cta": { pt: "Abrir o app grátis →", en: "Open the free app →" },
  "studiopromo.feat1": { pt: "🎨 Cores e temas", en: "🎨 Colors & themes" },
  "studiopromo.feat2": { pt: "🎵 Modo música", en: "🎵 Music mode" },
  "studiopromo.feat3": { pt: "📺 Espelhe na TV", en: "📺 Cast to TV" },

  "hero.badge": { pt: "Nº 1 em projetores de aurora no Brasil", en: "#1 aurora projector" },
  "hero.title1": { pt: "Transforme seu quarto", en: "Turn any room into" },
  "hero.title2": { pt: "numa galáxia", en: "a galaxy" },
  "hero.sub": {
    pt: "O Velox Aurora projeta a aurora boreal e um céu estrelado no seu teto em segundos. Controle por app, 16 milhões de cores e modo música.",
    en: "Velox Aurora projects the northern lights and a starry sky onto your ceiling in seconds. App control, 16M colors and music mode.",
  },
  "hero.cta": { pt: "Quero o meu Velox", en: "Get yours now" },
  "hero.cta2": { pt: "Ver em ação", en: "See it in action" },
  "hero.rating": { pt: "4,9/5 de 12.480 avaliações", en: "4.9/5 from 12,480 reviews" },
  "hero.ships": { pt: "Envio em 24h", en: "Ships in 24h" },
  "hero.studio": { pt: "Experimente o app grátis no navegador", en: "Try the free app in your browser" },

  "logos.title": { pt: "VISTO E AMADO EM", en: "AS SEEN ON" },

  "feat.title": { pt: "Por que todo mundo está obcecado", en: "Why everyone is obsessed" },
  "feat.sub": { pt: "Não é só uma luz. É uma experiência.", en: "It's not just a light. It's an experience." },
  "feat.1.t": { pt: "Aurora realista", en: "Realistic aurora" },
  "feat.1.d": { pt: "Ondas de luz que imitam a aurora boreal de verdade no seu teto e paredes.", en: "Light waves that mimic the real northern lights across your ceiling and walls." },
  "feat.2.t": { pt: "16 milhões de cores", en: "16 million colors" },
  "feat.2.d": { pt: "Escolha qualquer clima — do roxo galáxia ao pôr do sol quente.", en: "Pick any mood — from galaxy purple to warm sunset." },
  "feat.3.t": { pt: "Modo música", en: "Music mode" },
  "feat.3.d": { pt: "As luzes dançam no ritmo da sua playlist com o sensor embutido.", en: "The lights dance to your playlist with the built-in sensor." },
  "feat.4.t": { pt: "Controle pelo app", en: "App control" },
  "feat.4.d": { pt: "Ajuste cor, brilho e velocidade pelo celular ou controle remoto.", en: "Adjust color, brightness and speed from your phone or remote." },
  "feat.5.t": { pt: "Timer para dormir", en: "Sleep timer" },
  "feat.5.d": { pt: "Desliga sozinho enquanto você dorme. Perfeito pra relaxar.", en: "Auto-off while you sleep. Perfect to wind down." },
  "feat.6.t": { pt: "Instala em segundos", en: "Sets up in seconds" },
  "feat.6.d": { pt: "Só ligar na tomada e apontar. Sem instalação, sem complicação.", en: "Just plug in and point. No installation, no hassle." },

  "how.title": { pt: "Pronto em 3 passos", en: "Ready in 3 steps" },
  "how.1.t": { pt: "Ligue na tomada", en: "Plug it in" },
  "how.1.d": { pt: "Posicione onde quiser — mesa, chão ou estante.", en: "Place it anywhere — desk, floor or shelf." },
  "how.2.t": { pt: "Escolha seu clima", en: "Pick your mood" },
  "how.2.d": { pt: "Aurora, galáxia, festa ou relax — pelo app ou controle.", en: "Aurora, galaxy, party or chill — via app or remote." },
  "how.3.t": { pt: "Aproveite", en: "Enjoy" },
  "how.3.d": { pt: "Relaxe, grave aquele vídeo e impressione todo mundo.", en: "Relax, film that video and wow everyone." },

  "buy.title": { pt: "Escolha seu kit", en: "Choose your kit" },
  "buy.sub": { pt: "Quanto mais você leva, mais você economiza.", en: "The more you get, the more you save." },
  "buy.popular": { pt: "MAIS VENDIDO", en: "BEST SELLER" },
  "buy.best": { pt: "MELHOR CUSTO", en: "BEST VALUE" },
  "buy.save": { pt: "Economize", en: "Save" },
  "buy.each": { pt: "cada", en: "each" },
  "buy.add": { pt: "Adicionar ao carrinho", en: "Add to cart" },
  "buy.guarantee": { pt: "Garantia de 30 dias · Frete grátis · Envio em 24h", en: "30-day guarantee · Free shipping · Ships in 24h" },

  "gallery.title": { pt: "Veja a magia acontecer", en: "See the magic happen" },
  "gallery.sub": { pt: "Imagens reais do efeito Velox Aurora em ação.", en: "Real photos of the Velox Aurora effect in action." },
  "gallery.cta": { pt: "Quero esse efeito no meu quarto", en: "I want this in my room" },

  "demo.title": { pt: "Veja o efeito no seu quarto", en: "See the effect in your room" },
  "demo.sub": { pt: "Arraste para comparar: luz apagada × Velox Aurora ligado.", en: "Drag to compare: lights off × Velox Aurora on." },
  "demo.off": { pt: "Sem Velox", en: "Without Velox" },
  "demo.on": { pt: "Com Velox ✨", en: "With Velox ✨" },
  "demo.hint": { pt: "← arraste →", en: "← drag →" },
  "demo.cta": { pt: "Quero o meu agora", en: "I want mine now" },
  "demo.close": { pt: "Fechar", en: "Close" },

  "reviews.title": { pt: "+12.000 clientes apaixonados", en: "12,000+ happy customers" },
  "reviews.sub": { pt: "Avaliações reais de quem já transformou o quarto.", en: "Real reviews from people who transformed their rooms." },

  "faq.title": { pt: "Perguntas frequentes", en: "Frequently asked questions" },
  "faq.1.q": { pt: "Quanto tempo leva pra chegar?", en: "How long does shipping take?" },
  "faq.1.a": { pt: "Enviamos em até 24h. A entrega leva de 3 a 7 dias úteis para a maior parte do Brasil, com rastreio.", en: "We ship within 24h. Delivery takes 3–7 business days for most regions, with tracking." },
  "faq.2.q": { pt: "Funciona em qualquer quarto?", en: "Does it work in any room?" },
  "faq.2.a": { pt: "Sim! Cobre até 30m². Quanto mais escuro o ambiente, mais impressionante fica o efeito.", en: "Yes! It covers up to 30m². The darker the room, the more impressive the effect." },
  "faq.3.q": { pt: "Quais formas de pagamento vocês aceitam?", en: "Which payment methods do you accept?" },
  "faq.3.a": { pt: "Pix, cartão de crédito e débito, Apple Pay, Google Pay e PayPal. Tudo 100% seguro.", en: "Credit and debit card, Apple Pay, Google Pay and PayPal. 100% secure." },
  "faq.4.q": { pt: "E se eu não gostar?", en: "What if I don't like it?" },
  "faq.4.a": { pt: "Você tem 30 dias de garantia. Se não amar, devolvemos 100% do seu dinheiro.", en: "You get a 30-day guarantee. If you don't love it, we refund 100% of your money." },
  "faq.5.q": { pt: "Tem controle e garantia?", en: "Does it include a remote and warranty?" },
  "faq.5.a": { pt: "Sim, todos os kits vêm com controle remoto e 12 meses de garantia contra defeitos.", en: "Yes, every kit comes with a remote control and a 12-month defect warranty." },

  "final.title": { pt: "Seu quarto nunca mais vai ser o mesmo", en: "Your room will never be the same" },
  "final.sub": { pt: "Junte-se a milhares de pessoas que dormem sob a aurora todas as noites.", en: "Join thousands of people who sleep under the aurora every night." },
  "final.cta": { pt: "Comprar agora", en: "Buy now" },

  "footer.tag": { pt: "Leve o universo para o seu quarto.", en: "Bring the universe into your room." },
  "footer.shop": { pt: "Loja", en: "Shop" },
  "footer.help": { pt: "Ajuda", en: "Help" },
  "footer.rights": { pt: "Todos os direitos reservados.", en: "All rights reserved." },
  "footer.secure": { pt: "Pagamento 100% seguro", en: "100% secure checkout" },

  "cart.title": { pt: "Seu carrinho", en: "Your cart" },
  "cart.empty": { pt: "Seu carrinho está vazio", en: "Your cart is empty" },
  "cart.emptycta": { pt: "Ver produtos", en: "Browse products" },
  "cart.subtotal": { pt: "Subtotal", en: "Subtotal" },
  "cart.shipping": { pt: "Frete", en: "Shipping" },
  "cart.free": { pt: "GRÁTIS", en: "FREE" },
  "cart.checkout": { pt: "Finalizar compra", en: "Checkout" },
  "cart.continue": { pt: "Continuar comprando", en: "Continue shopping" },
  "cart.remove": { pt: "Remover", en: "Remove" },

  "co.title": { pt: "Finalizar compra", en: "Checkout" },
  "co.contact": { pt: "Contato", en: "Contact" },
  "co.email": { pt: "E-mail", en: "Email" },
  "co.delivery": { pt: "Entrega", en: "Delivery" },
  "co.name": { pt: "Nome completo", en: "Full name" },
  "co.address": { pt: "Endereço", en: "Address" },
  "co.city": { pt: "Cidade", en: "City" },
  "co.zip": { pt: "CEP", en: "ZIP / Postal code" },
  "co.payment": { pt: "Pagamento", en: "Payment" },
  "co.paysub": { pt: "Todas as transações são seguras e criptografadas.", en: "All transactions are secure and encrypted." },
  "co.card": { pt: "Cartão de crédito / débito", en: "Credit / debit card" },
  "co.cardnum": { pt: "Número do cartão", en: "Card number" },
  "co.exp": { pt: "Validade (MM/AA)", en: "Expiry (MM/YY)" },
  "co.cvc": { pt: "CVV", en: "CVC" },
  "co.summary": { pt: "Resumo do pedido", en: "Order summary" },
  "co.total": { pt: "Total", en: "Total" },
  "co.pay": { pt: "Pagar", en: "Pay" },
  "co.back": { pt: "← Voltar à loja", en: "← Back to store" },
  "co.empty": { pt: "Seu carrinho está vazio.", en: "Your cart is empty." },
  "co.demo": { pt: "Loja demonstrativa — nenhum pagamento real será cobrado.", en: "Demo store — no real payment will be charged." },

  "toast.added": { pt: "Adicionado ao carrinho!", en: "Added to cart!" },
  "toast.success": { pt: "Pedido confirmado! 🎉", en: "Order confirmed! 🎉" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("velox_lang")) as Lang | null;
    if (saved === "pt" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("velox_lang", l);
  };

  const t = (key: string) => {
    const entry = dict[key];
    if (!entry) return key;
    return entry[lang];
  };

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
