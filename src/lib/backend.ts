/**
 * URL do backend serverless (Vercel) que fala com o Mercado Pago.
 * Configure VITE_BACKEND_URL no .env; o fallback é o deploy atual.
 */
export const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL as string | undefined
)?.replace(/\/$/, "") || "https://loja-backend-beta.vercel.app";

export interface BackendCartItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  imageUrl?: string;
  categoriesList?: string[];
  discount?: number;
}

export interface CreatePreferenceResponse {
  id: string;
  init_point?: string;
  sandbox_init_point?: string;
  appliedDiscount?: number;
  freeShipping?: boolean;
}

/**
 * Cria a preferência do Checkout Pro e devolve a URL de pagamento.
 */
export async function createMercadoPagoPreference(input: {
  items: BackendCartItem[];
  freightPrice: number;
  freightLabel: string;
  email: string;
  couponCode?: string;
}): Promise<CreatePreferenceResponse> {
  const res = await fetch(`${BACKEND_URL}/api/criar-preferencia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await res.json().catch(() => ({}))) as Partial<CreatePreferenceResponse> & {
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || "Falha ao criar cobrança no Mercado Pago.");
  }

  const url = data.init_point || data.sandbox_init_point;
  if (!url) {
    throw new Error("Resposta inválida do servidor de pagamento.");
  }
  return { ...data, init_point: url };
}
