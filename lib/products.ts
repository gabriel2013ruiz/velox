import { Lang } from "./i18n";

export interface Bundle {
  id: string;
  qty: number;
  name: { pt: string; en: string };
  blurb: { pt: string; en: string };
  price: { pt: number; en: number }; // BRL for pt, USD for en
  compareAt: { pt: number; en: number };
  badge?: "popular" | "best";
}

// Single hero product (Velox Aurora projector) sold in quantity bundles.
export const bundles: Bundle[] = [
  {
    id: "aurora-1",
    qty: 1,
    name: { pt: "1 Velox Aurora", en: "1 Velox Aurora" },
    blurb: { pt: "Perfeito para experimentar", en: "Perfect to try it out" },
    price: { pt: 149, en: 34 },
    compareAt: { pt: 249, en: 59 },
  },
  {
    id: "aurora-2",
    qty: 2,
    name: { pt: "2 Velox Aurora", en: "2 Velox Aurora" },
    blurb: { pt: "Um pra você, um pra presentear", en: "One for you, one to gift" },
    price: { pt: 249, en: 56 },
    compareAt: { pt: 498, en: 118 },
    badge: "popular",
  },
  {
    id: "aurora-3",
    qty: 3,
    name: { pt: "Kit Galáxia (3 unidades)", en: "Galaxy Kit (3 units)" },
    blurb: { pt: "O favorito das famílias e criadores", en: "The favorite of families & creators" },
    price: { pt: 329, en: 75 },
    compareAt: { pt: 747, en: 177 },
    badge: "best",
  },
];

export function priceFor(b: Bundle, lang: Lang): number {
  return lang === "pt" ? b.price.pt : b.price.en;
}
export function compareFor(b: Bundle, lang: Lang): number {
  return lang === "pt" ? b.compareAt.pt : b.compareAt.en;
}

export function currency(lang: Lang): string {
  return lang === "pt" ? "R$" : "$";
}

export function formatMoney(value: number, lang: Lang): string {
  if (lang === "pt") {
    return "R$ " + value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export interface Review {
  name: string;
  location: { pt: string; en: string };
  text: { pt: string; en: string };
  stars: number;
}

export const reviews: Review[] = [
  {
    name: "Mariana S.",
    location: { pt: "São Paulo, SP", en: "São Paulo, BR" },
    stars: 5,
    text: {
      pt: "Melhor compra do ano! Meu quarto virou outra coisa, todo mundo que entra fica de boca aberta.",
      en: "Best buy of the year! My room became something else, everyone who walks in is amazed.",
    },
  },
  {
    name: "Lucas R.",
    location: { pt: "Rio de Janeiro, RJ", en: "Rio de Janeiro, BR" },
    stars: 5,
    text: {
      pt: "Comprei pra fazer vídeos no TikTok e viralizei. Vale cada centavo, qualidade absurda.",
      en: "Bought it to make TikToks and went viral. Worth every penny, insane quality.",
    },
  },
  {
    name: "Ana Clara",
    location: { pt: "Belo Horizonte, MG", en: "Belo Horizonte, BR" },
    stars: 5,
    text: {
      pt: "O modo música é viciante. Durmo todas as noites com a aurora ligada, relaxa demais.",
      en: "The music mode is addictive. I sleep every night with the aurora on, so relaxing.",
    },
  },
  {
    name: "Pedro H.",
    location: { pt: "Curitiba, PR", en: "Curitiba, BR" },
    stars: 5,
    text: {
      pt: "Chegou em 4 dias, super fácil de usar. Já comprei o segundo pra dar de presente.",
      en: "Arrived in 4 days, super easy to use. Already bought a second one as a gift.",
    },
  },
  {
    name: "Júlia M.",
    location: { pt: "Porto Alegre, RS", en: "Porto Alegre, BR" },
    stars: 5,
    text: {
      pt: "Minha filha amou! As cores são lindas e o controle pelo app é muito prático.",
      en: "My daughter loved it! The colors are gorgeous and the app control is so handy.",
    },
  },
  {
    name: "Gabriel T.",
    location: { pt: "Salvador, BA", en: "Salvador, BR" },
    stars: 5,
    text: {
      pt: "Achei que seria mais fraco, mas ilumina o quarto inteiro. Recomendo demais!",
      en: "Thought it would be weak, but it lights up the whole room. Highly recommend!",
    },
  },
];
