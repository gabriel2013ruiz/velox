// Generates a standard Brazilian "Pix Copia e Cola" (BR Code / EMV MPM) string.
// When you set your Nubank Pix key, customers can pay you directly — no gateway, no fees.

function emv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Remove accents and clamp length (name max 25, city max 15 per spec).
function sanitize(s: string, max: number): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toUpperCase()
    .slice(0, max)
    .trim();
}

export interface PixParams {
  key: string; // Nubank Pix key: CPF, phone, email, or random key
  name: string; // merchant name
  city: string; // merchant city
  amount: number; // BRL
  txid?: string; // reference (alphanumeric, max 25)
}

export function buildPixPayload({ key, name, city, amount, txid = "***" }: PixParams): string {
  const gui = emv("00", "br.gov.bcb.pix") + emv("01", key.trim());
  const merchantAccount = emv("26", gui);
  const additional = emv("62", emv("05", sanitize(txid, 25) || "***"));

  let payload =
    emv("00", "01") + // payload format indicator
    merchantAccount +
    emv("52", "0000") + // merchant category code
    emv("53", "986") + // currency = BRL
    emv("54", amount.toFixed(2)) + // amount
    emv("58", "BR") + // country
    emv("59", sanitize(name, 25) || "VELOX") + // merchant name
    emv("60", sanitize(city, 15) || "SAO PAULO") + // merchant city
    additional +
    "6304"; // CRC placeholder

  payload += crc16(payload);
  return payload;
}

// Config from env (public, since the code is rendered client-side for the customer).
export const pixConfig = {
  key: process.env.NEXT_PUBLIC_PIX_KEY || "",
  name: process.env.NEXT_PUBLIC_PIX_NAME || "Velox",
  city: process.env.NEXT_PUBLIC_PIX_CITY || "Sao Paulo",
};
export const pixDirectEnabled = Boolean(pixConfig.key);
