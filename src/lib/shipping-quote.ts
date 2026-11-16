import { BACKEND_URL } from "./backend";

/**
 * Cotação de frete (PAC/SEDEX) e memória do CEP de entrega.
 *
 * O CEP salvo fica só no navegador do cliente (localStorage) e serve para
 * pré-preencher o checkout nas próximas compras.
 */

export interface ShippingQuoteItem {
  qty: number;
  weightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
}

export interface ShippingQuoteOption {
  id: string;
  label: string;
  price: number;
  deadlineDays?: number;
  freePromo?: boolean;
}

export interface ShippingQuoteResult {
  options: ShippingQuoteOption[];
  freePromo: boolean;
  freeMinimo: number;
}

const CEP_STORAGE_KEY = "viva:cep-entrega";

export function getSavedCep(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(CEP_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function saveCep(cep: string): void {
  if (typeof window === "undefined") return;
  try {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    localStorage.setItem(CEP_STORAGE_KEY, digits);
  } catch {
    // ignore
  }
}

export function clearSavedCep(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CEP_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export async function quoteShipping(
  cep: string,
  items: ShippingQuoteItem[],
  subtotal = 0,
): Promise<ShippingQuoteResult> {
  const cepDestino = cep.replace(/\D/g, "");
  if (cepDestino.length !== 8) {
    throw new Error("Digite o CEP com 8 dígitos para calcular o frete.");
  }
  if (items.length === 0) {
    throw new Error("Adicione um produto para calcular o frete.");
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/cotar-frete-correios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cepDestino,
        subtotal,
        items: items.map((item) => ({
          qty: item.qty,
          weightKg: item.weightKg || 0,
          lengthCm: item.lengthCm || 0,
          widthCm: item.widthCm || 0,
          heightCm: item.heightCm || 0,
        })),
      }),
    });
  } catch {
    throw new Error("Não foi possível calcular o frete agora. Tente de novo em instantes.");
  }

  const data = (await res.json().catch(() => ({}))) as {
    options?: ShippingQuoteOption[];
    freePromo?: boolean;
    freeMinimo?: number;
    error?: string;
  };

  if (!res.ok || !data.options?.length) {
    throw new Error(data.error || "Correios sem resposta para este CEP.");
  }

  return {
    options: data.options,
    freePromo: data.freePromo === true,
    freeMinimo: typeof data.freeMinimo === "number" ? data.freeMinimo : 0,
  };
}
