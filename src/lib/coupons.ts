import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import type { DiscountCoupon } from "./admin-discounts-data";

export interface CouponCartItem {
  id: number | string;
  price: number;
  qty: number;
  discount?: number;
  categoriesList?: string[];
}

export interface CouponCheck {
  coupon: DiscountCoupon;
  /** Desconto em R$ sobre os produtos. */
  discount: number;
  /** Zera o frete. */
  freeShipping: boolean;
}

/** Busca o cupom pelo código (leitura pública) para validar no checkout. */
export async function fetchCouponByCode(code: string): Promise<DiscountCoupon | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  const snap = await getDocs(query(collection(db, "coupons"), where("code", "==", normalized)));
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { ...(docSnap.data() as DiscountCoupon), id: docSnap.id };
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Valida o cupom contra o carrinho e calcula o desconto.
 * Lança Error com mensagem amigável quando inválido.
 */
export function computeCouponDiscount(
  coupon: DiscountCoupon,
  items: CouponCartItem[],
  subtotal: number,
): CouponCheck {
  if (!coupon.active) {
    throw new Error("Este cupom está desativado.");
  }
  if (coupon.dateLimit === "periodo") {
    const today = todayISO();
    if (coupon.startDate && today < coupon.startDate) {
      throw new Error("Este cupom ainda não está valendo.");
    }
    if (coupon.endDate && today > coupon.endDate) {
      throw new Error("Este cupom expirou.");
    }
  }
  if (coupon.cartValueType === "acima_de" && subtotal < (coupon.minCartValue || 0)) {
    throw new Error(
      `Este cupom exige compra acima de R$ ${(coupon.minCartValue || 0).toFixed(2).replace(".", ",")}.`,
    );
  }

  // Base do desconto conforme o escopo do cupom
  let baseItems = items;
  if (!coupon.allowCombineWithPromotions) {
    baseItems = baseItems.filter((item) => !item.discount || item.discount <= 0);
  }
  if (coupon.appliesTo === "categorias" && coupon.selectedCategories?.length) {
    const wanted = coupon.selectedCategories.map((c) => c.toLowerCase());
    baseItems = baseItems.filter((item) =>
      (item.categoriesList || []).some((c) => wanted.includes(c.toLowerCase())),
    );
  }
  if (coupon.appliesTo === "produtos" && coupon.selectedProductIds?.length) {
    const wanted = new Set(coupon.selectedProductIds.map((id) => String(id)));
    baseItems = baseItems.filter((item) => wanted.has(String(item.id)));
  }

  const base = baseItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (base <= 0) {
    throw new Error("Este cupom não se aplica aos itens do carrinho.");
  }

  if (coupon.type === "frete_gratis") {
    return { coupon, discount: 0, freeShipping: true };
  }

  let discount = 0;
  if (coupon.type === "porcentagem") {
    discount = (base * coupon.value) / 100;
  } else {
    discount = Math.min(coupon.value, base);
  }
  if (coupon.maxDiscountLimit === "ate" && coupon.maxDiscountValue) {
    discount = Math.min(discount, coupon.maxDiscountValue);
  }

  discount = Math.max(0, Math.round(discount * 100) / 100);
  if (discount <= 0) {
    throw new Error("Este cupom não gerou desconto para este carrinho.");
  }
  return { coupon, discount, freeShipping: false };
}
