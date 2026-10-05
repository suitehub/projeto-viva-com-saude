import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Check,
  Mail,
  MessageCircle,
  Package,
  Search,
  Truck,
  X,
} from "lucide-react";
import {
  SaleOrder,
  FulfillmentStatus,
  FULFILLMENT_STAGES,
  FULFILLMENT_LABELS,
  getFulfillment,
  fulfillmentToStatusFilter,
  getCachedOrders,
  subscribeAdminOrders,
  updateAdminOrderStatusInFirestore,
} from "@/data/admin-orders-data";
import { mapAdminWriteError } from "@/lib/admin-errors";

const STAGE_STYLES: Record<FulfillmentStatus, string> = {
  recebido: "bg-blue-100 text-[#0066d6]",
  preparando: "bg-amber-100 text-amber-800",
  enviado: "bg-violet-100 text-violet-800",
  entregue: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-red-100 text-red-600",
};

type StageFilter = "todas" | "aguardando" | FulfillmentStatus;

/**
 * Aba Correios: central de entregas — etapa de cada pedido, código de
 * rastreio editável e contato do cliente (WhatsApp/e-mail).
 */
export function ShippingTracker() {
  const [orders, setOrders] = useState<SaleOrder[]>(() => getCachedOrders());
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<StageFilter>("aguardando");
  const [trackingDrafts, setTrackingDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = subscribeAdminOrders(setOrders);
    return () => unsubscribe();
  }, []);

  const counts = useMemo(() => {
    let waiting = 0;
    let shipped = 0;
    let delivered = 0;
    for (const order of orders) {
      const stage = getFulfillment(order);
      if (stage === "recebido" || stage === "preparando") waiting += 1;
      else if (stage === "enviado") shipped += 1;
      else if (stage === "entregue") delivered += 1;
    }
    return { waiting, shipped, delivered, total: orders.length };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      const stage = getFulfillment(order);
      if (stageFilter === "aguardando" && stage !== "recebido" && stage !== "preparando") {
        return false;
      }
      if (
        stageFilter !== "todas" &&
        stageFilter !== "aguardando" &&
        stage !== stageFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.email.toLowerCase().includes(q) ||
        (order.trackingCode || "").toLowerCase().includes(q)
      );
    });
  }, [orders, search, stageFilter]);

  const handleStageChange = (order: SaleOrder, stage: FulfillmentStatus) => {
    const updates: Partial<SaleOrder> = {
      fulfillmentStatus: stage,
      statusFilter: fulfillmentToStatusFilter(stage),
      shippingStatus:
        stage === "enviado" ? "Enviada" : stage === "cancelado" ? "Cancelada" : "Pendente",
    };
    updateAdminOrderStatusInFirestore(order.id, updates)
      .then(() => toast.success(`"${order.orderNumber}" → ${FULFILLMENT_LABELS[stage]}`))
      .catch((err) => toast.error(mapAdminWriteError(err, "a etapa da entrega")));
  };

  const handleSaveTracking = (order: SaleOrder) => {
    const code = (trackingDrafts[order.id] ?? order.trackingCode ?? "").trim();
    if (!code) {
      toast.error("Digite o código de rastreio antes de salvar.");
      return;
    }
    updateAdminOrderStatusInFirestore(order.id, {
      trackingCode: code,
      fulfillmentStatus: "enviado",
      statusFilter: fulfillmentToStatusFilter("enviado"),
      shippingStatus: "Enviada",
    })
      .then(() => {
        toast.success("Código de rastreio salvo e pedido marcado como enviado!");
        setTrackingDrafts((prev) => {
          const next = { ...prev };
          delete next[order.id];
          return next;
        });
      })
      .catch((err) => toast.error(mapAdminWriteError(err, "o código de rastreio")));
  };

  const whatsappLink = (order: SaleOrder) => {
    const digits = (order.phone || "").replace(/\D/g, "");
    if (!digits) return null;
    const text = `Olá ${order.customer}! Aqui é do Projeto Viva com Saúde, sobre seu pedido ${order.orderNumber}.`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] pb-16 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf1fb] text-[#0066d6]">
            <Truck className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Correios</h1>
            <p className="text-xs text-gray-500">
              Acompanhe cada entrega: etapa, rastreio e contato do cliente.
            </p>
          </div>
        </div>

        {/* Resumo */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Aguardando envio", value: counts.waiting, style: "text-[#0066d6]" },
            { label: "Enviados", value: counts.shipped, style: "text-violet-700" },
            { label: "Entregues", value: counts.delivered, style: "text-emerald-700" },
            { label: "Total de pedidos", value: counts.total, style: "text-gray-900" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs"
            >
              <p className="text-xs font-semibold text-gray-500">{card.label}</p>
              <p className={`mt-1 text-3xl font-extrabold ${card.style}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por pedido, cliente, e-mail ou rastreio..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#0066d6] focus:outline-hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as StageFilter)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-[#0066d6] focus:outline-hidden"
          >
            <option value="aguardando">Aguardando envio</option>
            <option value="todas">Todas as etapas</option>
            <option value="recebido">Pedido recebido</option>
            <option value="preparando">Preparando</option>
            <option value="enviado">Enviado</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Package className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-3 text-sm font-bold text-gray-700">Nenhuma entrega aqui</p>
            <p className="mt-1 text-xs text-gray-500">
              Novos pedidos pagos aparecem automaticamente para envio.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const stage = getFulfillment(order);
              const wa = whatsappLink(order);
              const draft = trackingDrafts[order.id] ?? order.trackingCode ?? "";
              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-[#0066d6]">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">
                        {order.date} • {order.itemsCount}{" "}
                        {order.itemsCount === 1 ? "item" : "itens"} •{" "}
                        <strong className="text-gray-800">{order.totalFormatted}</strong>
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${STAGE_STYLES[stage]}`}
                    >
                      <Truck className="h-3 w-3" />
                      {FULFILLMENT_LABELS[stage]}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 border-t border-gray-100 pt-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    {/* Cliente + contato */}
                    <div>
                      <p className="text-xs font-bold text-gray-800">{order.customer}</p>
                      <p className="truncate text-[11px] text-gray-500">{order.email}</p>
                      {order.phone && (
                        <p className="text-[11px] text-gray-500">{order.phone}</p>
                      )}
                      {order.address && (
                        <p className="mt-0.5 text-[11px] text-gray-600">
                          {order.address.street}
                          {order.address.number ? `, ${order.address.number}` : ""} —{" "}
                          {order.address.city}/{order.address.state} {order.address.cep}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {wa ? (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            WhatsApp
                          </a>
                        ) : (
                          <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-semibold text-gray-400">
                            Sem WhatsApp
                          </span>
                        )}
                        {order.email && (
                          <a
                            href={`mailto:${order.email}?subject=${encodeURIComponent(`Seu pedido ${order.orderNumber} — Projeto Viva com Saúde`)}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-50"
                          >
                            <Mail className="h-3.5 w-3.5 text-[#0066d6]" />
                            E-mail
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Etapa + rastreio */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {FULFILLMENT_STAGES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleStageChange(order, s)}
                            className={`rounded-lg border px-2 py-1 text-[11px] font-bold transition-colors ${
                              stage === s
                                ? "border-[#0066d6] bg-[#0066d6] text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            {FULFILLMENT_LABELS[s]}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={draft}
                          onChange={(e) =>
                            setTrackingDrafts((prev) => ({ ...prev, [order.id]: e.target.value }))
                          }
                          placeholder="Código de rastreio (ex: BR123...BR)"
                          className="w-full rounded-lg border border-gray-300 px-2.5 py-1.5 font-mono text-xs text-gray-900 focus:border-[#0066d6] focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveTracking(order)}
                          className="flex shrink-0 items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-gray-700"
                          title="Salvar rastreio e marcar como enviado"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Salvar
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Transportadora: {order.shippingCarrier || "A combinar"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
