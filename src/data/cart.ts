import { useState, useEffect, useCallback, useRef } from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import type { Product } from "./products";

export type CartMap = Record<string, number>;

const STORAGE_KEY = "pvcs_cart";
const CART_EVENT = "pvcs_cart_change";
const CART_DOC_ID = "active";
const MAX_QTY_PER_ITEM = 99;

export interface FreightOption {
  id: string;
  label: string;
  detail: string;
  price: number;
}

/** Tabela de frete fixa (Fase 1 — vira configuração do admin depois). */
export const FREIGHT_OPTIONS: FreightOption[] = [
  { id: "padrao", label: "Padrão", detail: "5 a 8 dias úteis", price: 19.9 },
  { id: "expressa", label: "Expressa", detail: "2 a 4 dias úteis", price: 29.9 },
  { id: "retirada", label: "Retirar na loja", detail: "Combinar pelo WhatsApp", price: 0 },
];

function readCart(): CartMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const clean: CartMap = {};
      for (const [key, value] of Object.entries(parsed)) {
        const qty = Number(value);
        if (key && Number.isFinite(qty) && qty > 0) clean[String(key)] = Math.floor(qty);
      }
      return clean;
    }
  } catch {
    // ignore
  }
  return {};
}

function writeCart(cart: CartMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT));
  } catch {
    // ignore
  }
}

export function getCart(): CartMap {
  return readCart();
}

export function setCartItem(productId: number | string, qty: number): CartMap {
  const cart = readCart();
  const key = String(productId);
  if (qty <= 0) {
    delete cart[key];
  } else {
    cart[key] = Math.floor(qty);
  }
  writeCart(cart);
  return cart;
}

export function addCartItem(productId: number | string, qty = 1): CartMap {
  const cart = readCart();
  const key = String(productId);
  cart[key] = (cart[key] ?? 0) + Math.max(1, Math.floor(qty));
  writeCart(cart);
  return cart;
}

export function clearCart(): void {
  writeCart({});
}

/** Apaga o carrinho da nuvem (usado no logout). */
export async function clearRemoteCart(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "users", uid, "carts", CART_DOC_ID));
  } catch {
    // segue o logout mesmo offline
  }
}

interface RemoteCartItem {
  productId: string;
  qty: number;
}

function cartToRemoteItems(cart: CartMap): RemoteCartItem[] {
  return Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .slice(0, 100)
    .map(([productId, qty]) => ({
      productId: String(productId).slice(0, 128),
      qty: Math.min(MAX_QTY_PER_ITEM, Math.floor(qty)),
    }));
}

function remoteItemsToCart(items: unknown): CartMap {
  const cart: CartMap = {};
  if (!Array.isArray(items)) return cart;
  for (const entry of items) {
    const e = entry as Partial<RemoteCartItem>;
    const qty = Math.floor(Number(e.qty));
    if (typeof e.productId === "string" && e.productId && Number.isFinite(qty) && qty > 0) {
      cart[e.productId] = Math.min(MAX_QTY_PER_ITEM, qty);
    }
  }
  return cart;
}

/** Envia o carrinho local para a nuvem (só logado). */
export async function pushCartToFirestore(uid: string, cart: CartMap): Promise<void> {
  await setDoc(
    doc(db, "users", uid, "carts", CART_DOC_ID),
    { items: cartToRemoteItems(cart), updatedAt: new Date().toISOString() },
    { merge: true },
  );
}

/** Baixa o carrinho da nuvem (só logado). */
export async function pullCartFromFirestore(uid: string): Promise<CartMap> {
  const snap = await getDoc(doc(db, "users", uid, "carts", CART_DOC_ID));
  if (!snap.exists()) return {};
  const data = snap.data() as { items?: unknown };
  return remoteItemsToCart(data.items);
}

export function getCartCount(cart?: CartMap): number {
  const c = cart ?? readCart();
  return Object.values(c).reduce((sum, qty) => sum + qty, 0);
}

export function getCartSubtotal(products: Product[], cart?: CartMap): number {
  const c = cart ?? readCart();
  return products.reduce((sum, p) => sum + p.price * (c[String(p.id)] ?? 0), 0);
}

export function getCartItems(products: Product[], cart?: CartMap): Array<{
  product: Product;
  qty: number;
}> {
  const c = cart ?? readCart();
  return products
    .filter((p) => (c[String(p.id)] ?? 0) > 0)
    .map((p) => ({ product: p, qty: c[String(p.id)] }));
}

/**
 * Hook do carrinho compartilhado: persiste em localStorage e, logado,
 * sincroniza com o Firestore (mesmo carrinho em outro navegador).
 */
export function useCart(products: Product[] = []) {
  const [cart, setCartState] = useState<CartMap>(() => readCart());
  const [uid, setUid] = useState<string | null>(() => auth.currentUser?.uid || null);
  const syncedUid = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCartState(readCart());
    const handleChange = () => setCartState(readCart());
    window.addEventListener(CART_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUid(fbUser?.uid || null);
    });
    return () => {
      window.removeEventListener(CART_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
      unsubscribe();
    };
  }, []);

  // Ao logar: junta carrinho local + nuvem (soma quantidades) e sincroniza.
  useEffect(() => {
    if (!uid || syncedUid.current === uid) return;
    syncedUid.current = uid;
    pullCartFromFirestore(uid)
      .then((remote) => {
        const local = readCart();
        const merged: CartMap = { ...remote };
        for (const [key, qty] of Object.entries(local)) {
          merged[key] = Math.min(MAX_QTY_PER_ITEM, (merged[key] ?? 0) + qty);
        }
        setCartState(merged);
        writeCart(merged);
        return pushCartToFirestore(uid, merged).catch(() => {});
      })
      .catch(() => {});
  }, [uid]);

  // A cada mudança (logado e sincronizado): envia à nuvem com debounce.
  useEffect(() => {
    if (!uid || syncedUid.current !== uid) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      pushCartToFirestore(uid, readCart()).catch(() => {});
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [cart, uid]);

  const add = useCallback((productId: number | string, qty = 1) => {
    setCartState(addCartItem(productId, qty));
  }, []);

  const setQty = useCallback((productId: number | string, qty: number) => {
    setCartState(setCartItem(productId, qty));
  }, []);

  const clear = useCallback(() => {
    setCartState({});
    clearCart();
  }, []);

  const count = getCartCount(cart);
  const subtotal = getCartSubtotal(products, cart);
  const items = getCartItems(products, cart);

  return { cart, items, count, subtotal, add, setQty, clear };
}

/** Valida CPF com dígitos verificadores. */
export function isValidCpf(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== Number(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  return check === Number(digits[10]);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function formatCpf(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function formatCep(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}
