import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Velox Aurora — Transforme seu quarto numa galáxia",
  description:
    "O projetor de aurora boreal nº 1. Projeta a aurora e um céu estrelado no seu teto em segundos. 16 milhões de cores, modo música e controle por app. Frete grátis.",
  keywords: [
    "projetor aurora", "aurora boreal", "luz galáxia", "projetor estrelas",
    "aurora projector", "galaxy light", "star projector", "velox",
  ],
  openGraph: {
    title: "Velox Aurora — Transforme seu quarto numa galáxia",
    description: "O projetor de aurora boreal nº 1. 16M de cores, modo música e controle por app.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <CartProvider>{children}</CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
