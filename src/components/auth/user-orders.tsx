import { useEffect, useState } from "react";
import { Package, Truck } from "lucide-react";
import { formatPrice } from "@/data/products";
import {
  SaleOrder,
  FULFILLMENT_STAGES,
  FULFILLMENT_LABELS,
  getFulfillment,
  subscribeUserOrders,
} from "@/data/admin-orders-data";

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

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeUserOrders(email, (loaded) => {
      setOrders(loaded);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [email]);

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-xs sm:p-8">
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
                </div>

                {/* Linha de progresso */}
                {stage !== "cancelado" && (
                  <div className="mt-3 flex items-center gap-1">
                    {FULFILLMENT_STAGES.map((s, index) => (
                      <div key={s} className="flex flex-1 items-center gap-1 last:flex-none">
                        <div
                          className={`h-1.5 flex-1 rounded-full ${
                            index <= stageIndex ? "bg-primary" : "bg-gray-200"
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

                <div className="mt-2 border-t border-gray-200 pt-2 text-xs text-gray-600">
                  {order.products.map((item, idx) => (
                    <p key={idx} className="flex justify-between py-0.5">
                      <span className="truncate pr-2">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="shrink-0 font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
