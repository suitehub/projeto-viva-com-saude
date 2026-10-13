import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Package, Star, Truck } from "lucide-react";
import { formatPrice } from "@/data/products";
import {
  SaleOrder,
  FULFILLMENT_STAGES,
  FULFILLMENT_LABELS,
  getFulfillment,
  subscribeUserOrders,
} from "@/data/admin-orders-data";
import { getAllStoreProducts } from "@/data/all-store-products";
import { useCurrentUser } from "@/data/user-auth";
import {
  ProductReview,
  orderItemMatchesProduct,
  saveProductReview,
  subscribeReviewsByEmail,
} from "@/data/product-reviews";
import { StarRatingInput, ReviewStars } from "@/components/products/product-reviews-section";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const STAGE_STYLES: Record<string, string> = {
  recebido: "bg-blue-100 text-[#0066d6]",
  preparando: "bg-amber-100 text-amber-800",
  enviado: "bg-violet-100 text-violet-800",
  entregue: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-red-100 text-red-600",
};

/**
 * "Minhas compras" — pedidos do cliente logado (por e-mail),
 * com o status registrado no admin.
 */
export function UserOrders({ email }: { email: string }) {
  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { user } = useCurrentUser();
  const [myReviews, setMyReviews] = useState<ProductReview[]>([]);
  const [reviewingKey, setReviewingKey] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    let cancelled = false;
    const unsubscribe = subscribeUserOrders(
      email,
      (loaded) => {
        if (cancelled) return;
        setOrders(loaded);
        setLoading(false);
      },
      () => {
        if (cancelled) return;
        setLoadError(true);
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [email]);

  useEffect(() => {
    const unsubscribe = subscribeReviewsByEmail(email, setMyReviews);
    return () => unsubscribe();
  }, [email]);

  const storeProducts = useMemo(() => getAllStoreProducts(), [orders.length]);

  const reviewedProductIds = useMemo(
    () => new Set(myReviews.map((r) => String(r.productId))),
    [myReviews],
  );

  const resolveStoreProduct = (itemName: string) =>
    storeProducts.find((p) => orderItemMatchesProduct(itemName, p.name));

  return (
    <div id="minhas-compras" className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-8 scroll-mt-24">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900">
          <Package className="h-5 w-5 text-primary" />
          Minhas compras
        </h2>
        {orders.length > 0 && (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">
            {orders.length}
          </span>
        )}
      </div>

      {loading ? (
        <p className="py-6 text-center text-xs text-gray-500">Carregando seus pedidos...</p>
      ) : loadError ? (
        <p className="py-6 text-center text-xs text-red-600">
          Não consegui carregar seus pedidos (sem permissão de leitura). Confira se as regras do
          Firestore foram publicadas no banco correto.
        </p>
      ) : orders.length === 0 ? (
        <p className="py-6 text-center text-xs text-gray-500">
          Você ainda não tem pedidos. Quando comprar, o status aparece aqui.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => {
            const stage = getFulfillment(order);
            const stageIndex = FULFILLMENT_STAGES.indexOf(stage);
            return (
              <div
                key={order.id}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{order.orderNumber}</p>
                    <p className="text-[11px] text-gray-500">
                      {order.date} • {order.itemsCount}{" "}
                      {order.itemsCount === 1 ? "item" : "itens"} •{" "}
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${STAGE_STYLES[stage]}`}
                  >
                    <Truck className="h-3 w-3" />
                    {FULFILLMENT_LABELS[stage]}
                  </span>
                  {order.paymentStatus === "Estornado" && (
                    <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-1 text-[11px] font-bold text-gray-700">
                      Pagamento estornado
                    </span>
                  )}
                </div>

                {/* Linha de progresso (preenche até a etapa atual; a atual pulsa) */}
                {stage !== "cancelado" && (
                  <div className="mt-3 flex items-center gap-1">
                    {FULFILLMENT_STAGES.map((s, index) => (
                      <div key={s} className="flex flex-1 items-center gap-1 last:flex-none">
                        <div
                          className={`h-1.5 flex-1 rounded-full ${
                            index < stageIndex
                              ? "bg-primary"
                              : index === stageIndex
                                ? "animate-pulse bg-primary/60"
                                : "bg-gray-200"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {stage !== "cancelado" && (
                  <div className="mt-1 flex justify-between text-[10px] font-semibold text-gray-500">
                    {FULFILLMENT_STAGES.map((s) => (
                      <span key={s}>{FULFILLMENT_LABELS[s].split(" ")[0]}</span>
                    ))}
                  </div>
                )}

                {order.trackingCode && (
                  <p className="mt-2 font-mono text-xs font-bold text-[#0066d6]">
                    Rastreio: {order.trackingCode}
                  </p>
                )}

                <div className="mt-2 space-y-2 border-t border-gray-200 pt-2 text-xs text-gray-600">
                  {order.products.map((item, idx) => {
                    const isDelivered = stage === "entregue";
                    const storeProduct = resolveStoreProduct(item.name);
                    const reviewKey = storeProduct ? `${order.id}_${storeProduct.id}` : null;
                    const alreadyReviewed = storeProduct
                      ? reviewedProductIds.has(String(storeProduct.id))
                      : false;
                    const myReview = storeProduct
                      ? myReviews.find((r) => String(r.productId) === String(storeProduct.id))
                      : undefined;
                    const isReviewing = reviewKey !== null && reviewingKey === reviewKey;
                    return (
                      <div key={idx} className="rounded-lg bg-white/60 py-1">
                        <p className="flex justify-between py-0.5">
                          <span className="truncate pr-2">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="shrink-0 font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </p>
                        {isDelivered && storeProduct && reviewKey && (
                          <div className="mt-1.5">
                            {alreadyReviewed && myReview ? (
                              <p className="flex flex-wrap items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Você avaliou com {myReview.rating}{" "}
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {myReview.comment?.trim() ? ` — “${myReview.comment}”` : " (só estrelas)"}{" "}
                                <Link
                                  to="/produto/$slug"
                                  params={{ slug: storeProduct.slug }}
                                  className="font-bold text-primary hover:underline"
                                >
                                  Ver avaliação
                                </Link>
                              </p>
                            ) : isReviewing ? (
                              <ReviewForm
                                productId={storeProduct.id}
                                productSlug={storeProduct.slug}
                                productName={storeProduct.name}
                                orderId={order.id}
                                userId={user?.id || ""}
                                userName={user?.fullName || order.customer || "Cliente"}
                                email={email}
                                onDone={() => setReviewingKey(null)}
                                onCancel={() => setReviewingKey(null)}
                              />
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1.5 rounded-full px-3 text-[11px] font-bold"
                                onClick={() => setReviewingKey(reviewKey)}
                              >
                                <Star className="h-3.5 w-3.5 text-amber-500" />
                                Avaliar produto
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {stage === "entregue" && (
                  <p className="mt-2 text-[11px] text-gray-500">
                    Produto entregue? Avalie com 1 a 5 estrelas e conte o que achou — sua avaliação
                    aparece na página do produto com seu nome.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReviewForm({
  productId,
  productSlug,
  productName,
  orderId,
  userId,
  userName,
  email,
  onDone,
  onCancel,
}: {
  productId: string | number;
  productSlug: string;
  productName: string;
  orderId: string;
  userId: string;
  userName: string;
  email: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!userId) {
      toast.info("Faça login para avaliar.");
      return;
    }
    setSaving(true);
    try {
      await saveProductReview({
        productId,
        productSlug,
        productName,
        userId,
        userName,
        email,
        rating,
        comment,
        orderId,
      });
      toast.success("Avaliação publicada! Obrigado pelo feedback.");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar a avaliação.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
      <p className="text-[11px] font-bold text-gray-800">Avaliar {productName}</p>
      <div className="mt-2">
        <StarRatingInput value={rating} onChange={setRating} />
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Conte o que achou do produto (opcional — pode avaliar só com estrelas)"
        maxLength={1000}
        rows={3}
        className="mt-2 bg-white text-xs"
      />
      <div className="mt-2 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="h-8 rounded-full px-4 text-[11px] font-bold"
          disabled={saving}
          onClick={handleSubmit}
        >
          {saving ? "Publicando..." : "Publicar avaliação"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 rounded-full px-3 text-[11px]"
          disabled={saving}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500">
        Prévia: <ReviewStars value={rating} className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
