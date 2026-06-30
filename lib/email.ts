import { Order } from "./orders";

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.ORDER_FROM_EMAIL || "Velox <onboarding@resend.dev>";

export const emailEnabled = Boolean(RESEND_KEY);

function money(v: number, currency: string) {
  return `${currency} ${v.toFixed(2)}`;
}

export async function sendOrderEmail(order: Order): Promise<boolean> {
  if (!emailEnabled) return false;

  const pt = order.lang === "pt";
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;color:#ddd">${i.name} (×${i.units})</td><td style="padding:8px 0;text-align:right;color:#fff">${money(i.price * i.qty, order.currency)}</td></tr>`
    )
    .join("");

  const html = `
  <div style="background:#060611;color:#f2f2f7;font-family:Arial,sans-serif;padding:32px">
    <div style="max-width:520px;margin:0 auto">
      <h1 style="font-size:22px">◐ VELOX</h1>
      <h2 style="font-size:18px">${pt ? "Pedido confirmado! 🎉" : "Order confirmed! 🎉"}</h2>
      <p style="color:#9b9bb4">${pt ? `Olá ${order.name}, recebemos seu pedido` : `Hi ${order.name}, we received your order`} <b>#${order.id}</b>.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">${rows}
        <tr><td style="padding-top:14px;border-top:1px solid #232340;font-weight:bold">${pt ? "Total" : "Total"}</td>
        <td style="padding-top:14px;border-top:1px solid #232340;text-align:right;font-weight:bold">${money(order.total, order.currency)}</td></tr>
      </table>
      <p style="color:#9b9bb4;margin-top:20px">${pt ? "Seu Velox Aurora será enviado em até 24h. Obrigado!" : "Your Velox Aurora ships within 24h. Thank you!"}</p>
    </div>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [order.email],
        subject: pt ? `Pedido Velox #${order.id} confirmado 🎉` : `Velox order #${order.id} confirmed 🎉`,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
