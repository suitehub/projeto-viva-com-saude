import { useState, useEffect, useMemo } from "react";
import { Clock, Info, MoreVertical } from "lucide-react";
import {
  SaleOrder,
  getCachedOrders,
  subscribeAdminOrders,
  getFulfillment,
} from "@/data/admin-orders-data";
import {
  getCachedAdminCustomers,
  subscribeAdminCustomers,
} from "@/data/admin-customers-data";
import {
  inPeriod,
  formatBRL,
  formatPercent,
  axisTicks,
  type StatsPeriod,
} from "@/lib/stats";

// SVG Smooth Wave Generator for sparklines matching Nuvemshop exactly
function SparklineWave({ type = "wave" }: { type?: "wave" | "peak" }) {
  if (type === "peak") {
    return (
      <div className="h-16 w-full pt-2">
        <svg
          viewBox="0 0 200 60"
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0066d6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0066d6" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 55 L 40 55 C 55 55 60 5 75 5 C 90 5 95 55 110 55 L 200 55"
            fill="none"
            stroke="#0066d6"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M 0 55 L 40 55 C 55 55 60 5 75 5 C 90 5 95 55 110 55 L 200 55 L 200 60 L 0 60 Z"
            fill="url(#peakGradient)"
          />
        </svg>
      </div>
    );
  }

  // Wave style for visits
  return (
    <div className="h-16 w-full pt-2">
      <svg
        viewBox="0 0 200 60"
        className="h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0066d6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0066d6" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d="M 0 20 C 30 25 50 35 70 42 C 90 48 110 45 125 30 C 140 15 150 18 160 45 L 200 48"
          fill="none"
          stroke="#0066d6"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 0 20 C 30 25 50 35 70 42 C 90 48 110 45 125 30 C 140 15 150 18 160 45 L 200 48 L 200 60 L 0 60 Z"
          fill="url(#waveGradient)"
        />
      </svg>
    </div>
  );
}

function FunnelBar({ label, count, max }: { label: string; count: number; max: number }) {
  const percent = max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0;
  return (
    <div className="grid grid-cols-12 items-center gap-3 text-xs">
      <div className="col-span-5 text-right text-gray-600 font-medium truncate">{label}</div>
      <div className="col-span-6">
        <div className="h-6 w-full rounded-xs bg-gray-100 relative overflow-hidden">
          <div
            className="h-full bg-[#0066d6] transition-all duration-500 rounded-xs"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="col-span-1 text-left font-bold text-gray-800">{count}</div>
    </div>
  );
}

export function StatisticsOverview() {
  const [period, setPeriod] = useState<StatsPeriod>("30dias");
  const [orders, setOrders] = useState<SaleOrder[]>(() => getCachedOrders());
  const [customerCount, setCustomerCount] = useState(
    () => getCachedAdminCustomers().length,
  );

  useEffect(() => {
    const unsubOrders = subscribeAdminOrders(setOrders);
    const unsubCust = subscribeAdminCustomers((loaded) => setCustomerCount(loaded.length));
    return () => {
      unsubOrders();
      unsubCust();
    };
  }, []);

  const periodOrders = useMemo(
    () => orders.filter((o) => inPeriod(o.date, period)),
    [orders, period],
  );

  const paidOrders = useMemo(
    () => periodOrders.filter((o) => o.paymentStatus === "Recebido"),
    [periodOrders],
  );

  const totalSalesCount = periodOrders.length;
  const totalRevenue = useMemo(
    () => paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [paidOrders],
  );
  const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const approvalRate = formatPercent(paidOrders.length, totalSalesCount);

  const paymentSplit = useMemo(() => {
    const counts = { Recebido: 0, Pendente: 0, Recusado: 0 };
    for (const o of periodOrders) {
      if (o.paymentStatus === "Recebido") counts.Recebido += 1;
      else if (o.paymentStatus === "Pendente") counts.Pendente += 1;
      else counts.Recusado += 1;
    }
    return [
      { label: "Pagos", count: counts.Recebido },
      { label: "Pendentes", count: counts.Pendente },
      { label: "Recusados", count: counts.Recusado },
    ];
  }, [periodOrders]);
  const paymentMax = Math.max(1, ...paymentSplit.map((s) => s.count));

  const fulfillmentSplit = useMemo(() => {
    const counts: Record<string, number> = {
      recebido: 0,
      preparando: 0,
      enviado: 0,
      entregue: 0,
      cancelado: 0,
    };
    for (const o of periodOrders) {
      const stage = getFulfillment(o);
      counts[stage] = (counts[stage] || 0) + 1;
    }
    return [
      { label: "Pedido recebido", count: counts.recebido },
      { label: "Preparando envio", count: counts.preparando },
      { label: "Enviado", count: counts.enviado },
      { label: "Entregue", count: counts.entregue },
      { label: "Cancelado", count: counts.cancelado },
    ];
  }, [periodOrders]);
  const fulfillmentMax = Math.max(1, ...fulfillmentSplit.map((s) => s.count));

  const avgItems =
    totalSalesCount > 0
      ? periodOrders.reduce((sum, o) => sum + (Number(o.itemsCount) || 0), 0) / totalSalesCount
      : 0;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">
              Visão geral
            </h1>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Acompanhe o desempenho da sua loja em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Tempo real ativo</span>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as StatsPeriod)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs focus:border-[#0066d6] focus:outline-none"
          >
            <option value="hoje">Hoje</option>
            <option value="ontem">Ontem</option>
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="este-mes">Este mês</option>
            <option value="tudo">Tudo</option>
          </select>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Pedidos */}
        <div className="rounded-lg border border-[#e6e8ee] bg-white p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <span>Pedidos</span>
              <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-gray-900">{totalSalesCount}</div>
          </div>
          <SparklineWave type="wave" />
        </div>

        {/* Card 2: Receita paga */}
        <div className="rounded-lg border border-[#e6e8ee] bg-white p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <span>Receita (pagos)</span>
              <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-gray-900">{formatBRL(totalRevenue)}</div>
          </div>
          <SparklineWave type="peak" />
        </div>

        {/* Card 3: Ticket médio */}
        <div className="rounded-lg border border-[#e6e8ee] bg-white p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <span>Ticket médio</span>
              <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-gray-900">{formatBRL(averageTicket)}</div>
          </div>
          <SparklineWave type="peak" />
        </div>

        {/* Card 4: Clientes */}
        <div className="rounded-lg border border-[#e6e8ee] bg-white p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <span>Clientes</span>
              <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-gray-900">{customerCount}</div>
          </div>
          <SparklineWave type="peak" />
        </div>
      </div>

      {/* Funnel and Conversion Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Funnels (8 cols on lg) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Card: Pedidos por pagamento */}
          <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                <span>Pedidos por pagamento</span>
                <Info className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {paymentSplit.map((item) => (
                <FunnelBar key={item.label} label={item.label} count={item.count} max={paymentMax} />
              ))}

              <div className="grid grid-cols-12 items-center gap-3 pt-2 text-[10px] text-gray-400 border-t border-gray-100">
                <div className="col-span-5"></div>
                <div className="col-span-7 flex justify-between pr-4">
                  {axisTicks(paymentMax).map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Etapas de atendimento */}
          <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                <span>Etapas de atendimento</span>
                <Info className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {fulfillmentSplit.map((item) => (
                <FunnelBar key={item.label} label={item.label} count={item.count} max={fulfillmentMax} />
              ))}

              <div className="grid grid-cols-12 items-center gap-3 pt-2 text-[10px] text-gray-400 border-t border-gray-100">
                <div className="col-span-5"></div>
                <div className="col-span-7 flex justify-between pr-4">
                  {axisTicks(fulfillmentMax).map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Conversion Metrics (4 cols on lg) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Card: Taxa de aprovação */}
          <div className="rounded-lg border border-[#e6e8ee] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <span>Taxa de aprovação</span>
                <Info className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{approvalRate}</div>
            <SparklineWave type="peak" />
          </div>

          {/* Card: Itens por pedido */}
          <div className="rounded-lg border border-[#e6e8ee] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <span>Itens por pedido</span>
                <Info className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">
              {avgItems.toFixed(1).replace(".", ",")}
            </div>
            <SparklineWave type="peak" />
          </div>

          {/* Card: Pedidos pagos */}
          <div className="rounded-lg border border-[#e6e8ee] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <span>Pedidos pagos</span>
                <Info className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{paidOrders.length}</div>
            <SparklineWave type="peak" />
          </div>
        </div>
      </div>
    </div>
  );
}
