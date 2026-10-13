import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cleanFirestorePayload } from "@/lib/firestore-utils";

export interface ProductReview {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  userId: string;
  userName: string;
  email: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: string;
  orderId?: string;
}

function sanitizeIdPart(value: string): string {
  return (value || "")
    .toString()
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 64);
}

export function buildReviewId(productId: string, userId: string): string {
  const safeProduct = sanitizeIdPart(String(productId)) || "produto";
  const safeUser = sanitizeIdPart(userId) || "user";
  return `${safeProduct}_${safeUser}_${Date.now()}`;
}

function normalizeName(value?: string | null): string {
  return (value || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function sortReviewsNewestFirst(list: ProductReview[]): ProductReview[] {
  return [...list].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export function reviewStats(list: ProductReview[]): { average: number; count: number } {
  const valid = list.filter((r) => Number(r.rating) >= 1 && Number(r.rating) <= 5);
  if (valid.length === 0) return { average: 0, count: 0 };
  const sum = valid.reduce((acc, r) => acc + Number(r.rating), 0);
  return { average: sum / valid.length, count: valid.length };
}

/**
 * Escuta avaliações de um produto em tempo real (leitura pública).
 */
export function subscribeProductReviews(
  productId: string | number,
  callback: (reviews: ProductReview[]) => void,
): () => void {
  const pid = String(productId);
  if (!pid) {
    callback([]);
    return () => {};
  }
  try {
    const q = query(collection(db, "reviews"), where("productId", "==", pid));
    return onSnapshot(
      q,
      (snapshot) => {
        const loaded: ProductReview[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ ...(docSnap.data() as ProductReview), id: docSnap.id });
        });
        callback(sortReviewsNewestFirst(loaded));
      },
      (err) => {
        console.warn("Aviso ao carregar avaliações do produto:", err);
        callback([]);
      },
    );
  } catch (err) {
    console.warn("Erro ao assinar avaliações:", err);
    callback([]);
    return () => {};
  }
}

export function useProductReviews(productId: string | number): {
  reviews: ProductReview[];
  average: number;
  count: number;
} {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  useEffect(() => {
    const unsubscribe = subscribeProductReviews(productId, setReviews);
    return () => unsubscribe();
  }, [productId]);
  const { average, count } = reviewStats(reviews);
  return { reviews, average, count };
}

export interface SaveReviewInput {
  productId: string | number;
  productSlug: string;
  productName: string;
  userId: string;
  userName: string;
  email: string;
  rating: number;
  comment: string;
  orderId?: string;
}

/**
 * Salva avaliação (criação). A permissão real está nas rules:
 * só logado, rating 1-5, userId == auth.uid.
 * A elegibilidade (pedido entregue) é verificada na UI em Minhas compras.
 */
export async function saveProductReview(input: SaveReviewInput): Promise<ProductReview> {
  const rating = Math.round(Number(input.rating));
  if (!input.userId) throw new Error("Faça login para avaliar.");
  if (!(rating >= 1 && rating <= 5)) throw new Error("Escolha de 1 a 5 estrelas.");
  const comment = (input.comment || "").trim().slice(0, 1000);
  const now = new Date().toISOString();
  const review: ProductReview = {
    id: buildReviewId(input.productId, input.userId),
    productId: String(input.productId),
    productSlug: input.productSlug || "",
    productName: input.productName || "",
    userId: input.userId,
    userName: input.userName || "Cliente",
    email: (input.email || "").trim().toLowerCase(),
    rating,
    comment,
    date: new Date().toLocaleDateString("pt-BR"),
    createdAt: now,
    ...(input.orderId ? { orderId: input.orderId } : {}),
  };
  const payload = cleanFirestorePayload({ ...review });
  await setDoc(doc(db, "reviews", review.id), payload);
  return review;
}

/**
 * Escuta avaliações feitas por um e-mail (para "já avaliou" em Minhas compras).
 */
export function subscribeReviewsByEmail(
  email: string,
  callback: (reviews: ProductReview[]) => void,
): () => void {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) {
    callback([]);
    return () => {};
  }
  try {
    const q = query(collection(db, "reviews"), where("email", "==", normalized));
    return onSnapshot(
      q,
      (snapshot) => {
        const loaded: ProductReview[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ ...(docSnap.data() as ProductReview), id: docSnap.id });
        });
        callback(sortReviewsNewestFirst(loaded));
      },
      (err) => {
        console.warn("Aviso ao carregar minhas avaliações:", err);
        callback([]);
      },
    );
  } catch (err) {
    console.warn("Erro ao assinar minhas avaliações:", err);
    callback([]);
    return () => {};
  }
}

/**
 * Verifica se um item do pedido corresponde ao produto da loja (por nome).
 */
export function orderItemMatchesProduct(orderItemName: string, productName: string): boolean {
  const a = normalizeName(orderItemName);
  const b = normalizeName(productName);
  if (!a || !b) return false;
  return a === b || a.includes(b) || b.includes(a);
}
