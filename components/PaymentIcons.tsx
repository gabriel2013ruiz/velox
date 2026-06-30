import { Lang } from "@/lib/i18n";

const wrap = "inline-flex items-center justify-center rounded-md bg-white h-7 w-11 shadow-sm";

export function Visa() {
  return (
    <span className={wrap} title="Visa">
      <svg viewBox="0 0 48 16" className="h-3.5"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontStyle="italic" fontSize="15" fill="#1a1f71">VISA</text></svg>
    </span>
  );
}
export function Mastercard() {
  return (
    <span className={wrap} title="Mastercard">
      <svg viewBox="0 0 40 24" className="h-5"><circle cx="15" cy="12" r="9" fill="#eb001b" /><circle cx="25" cy="12" r="9" fill="#f79e1b" fillOpacity="0.9" /></svg>
    </span>
  );
}
export function Pix() {
  return (
    <span className={wrap} title="Pix">
      <svg viewBox="0 0 24 24" className="h-5"><path d="M12 2.6 8.1 6.5h2.2l1.7 1.7 1.7-1.7h2.2L12 2.6Zm-5.5 5.5L2.6 12l3.9 3.9V13.7l1.7-1.7-1.7-1.7V8.1Zm11 0v2.2l1.7 1.7-1.7 1.7v2.2L21.4 12l-3.9-3.9ZM10.3 17.5 12 19.2l1.7-1.7H15.9l-1.9 1.9a2.8 2.8 0 0 1-4 0l-1.9-1.9h2.2Z" fill="#32bcad"/></svg>
    </span>
  );
}
export function ApplePay() {
  return (
    <span className={wrap} title="Apple Pay">
      <svg viewBox="0 0 48 20" className="h-3.5"><path d="M9 4.2c.5-.6.8-1.4.7-2.2-.7 0-1.5.5-2 1-.4.5-.8 1.3-.7 2 .8.1 1.6-.4 2-.8Z" fill="#000"/><path d="M9.7 5.4c-1.1-.1-2 .6-2.5.6s-1.3-.6-2.1-.6c-1.1 0-2.1.6-2.7 1.6-1.1 2-.3 5 .8 6.6.5.8 1.2 1.7 2 1.7s1.1-.5 2-.5 1.2.5 2 .5 1.4-.8 1.9-1.6c.6-.9.9-1.7.9-1.8-.1 0-1.7-.6-1.7-2.5 0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.1-2.2-1.2l.3-.5Z" fill="#000"/><text x="15" y="14" fontFamily="Arial" fontWeight="600" fontSize="11" fill="#000">Pay</text></svg>
    </span>
  );
}
export function GooglePay() {
  return (
    <span className={wrap} title="Google Pay">
      <svg viewBox="0 0 56 20" className="h-3.5"><text x="0" y="14" fontFamily="Arial" fontWeight="700" fontSize="12"><tspan fill="#4285f4">G</tspan><tspan fill="#ea4335">o</tspan><tspan fill="#fbbc05">o</tspan><tspan fill="#4285f4">g</tspan><tspan fill="#34a853">l</tspan><tspan fill="#ea4335">e</tspan></text><text x="40" y="14" fontFamily="Arial" fontWeight="500" fontSize="12" fill="#5f6368">Pay</text></svg>
    </span>
  );
}
export function PayPal() {
  return (
    <span className={wrap} title="PayPal">
      <svg viewBox="0 0 60 16" className="h-3"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontStyle="italic" fontSize="14"><tspan fill="#003087">Pay</tspan><tspan fill="#009cde">Pal</tspan></text></svg>
    </span>
  );
}

export function PaymentRow({ lang, includePix = true }: { lang: Lang; includePix?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {lang === "pt" && includePix && <Pix />}
      <Visa />
      <Mastercard />
      <ApplePay />
      <GooglePay />
      <PayPal />
    </div>
  );
}
