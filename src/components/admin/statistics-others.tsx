import { useEffect, useMemo, useState } from "react";
import {
  Info,
  MoreVertical,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
  Percent,
} from "lucide-react";
import type { StatSubTab } from "./admin-layout";
import {
  SaleOrder,
  getCachedOrders,
  subscribeAdminOrders,
} from "@/data/admin-orders-data";
import {
  AdminCustomerItem,
  getCachedAdminCustomers,
  subscribeAdminCustomers,
  CustomerMessageItem,
  getCachedCustomerMessages,
  subscribeCustomerMessages,
} from "@/data/admin-customers-data";
import {
  DiscountCoupon,
  subscribeAdminCoupons,
} from "@/data/admin-discounts-data";
import { inPeriod, formatBRL, formatPercent, type StatsPeriod } from "@/lib/stats";

function useLiveData() {
  const [orders, setOrders] = useState<SaleOrder[]>(() => getCachedOrders());
  const [customers, setCustomers] = useState<AdminCustomerItem[]>(() => getCachedAdminCustomers());
  const [messages, setMessages] = useState<CustomerMessageItem[]>(() => getCachedCustomerMessages());
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);

  useEffect(() => {
    const unsubOrders = subscribeAdminOrders(setOrders);
    const unsubCustomers = subscribeAdminCustomers(setCustomers);
    const unsubMessages = subscribeCustomerMessages(setMessages);
    const unsubCoupons = subscribeAdminCoupons(setCoupons);
    return () => {
      unsubOrders();
      unsubCustomers();
      unsubMessages();
      unsubCoupons();
    };
  }, []);

  return { orders, customers, messages, coupons };
}

export function StatisticsOthers({ tab }: { tab: StatSubTab }) {
  const { orders, customers, messages, coupons } = useLiveData();
  const [period, setPeriod] = useState<StatsPeriod>("30dias");

  const periodOrders = useMemo(
    () => orders.filter((o) => inPeriod(o.date, period)),
    [orders, period],
  );
  const paidOrders = useMemo(
    () => periodOrders.filter((o) => o.paymentStatus === "Recebido"),
    [periodOrders],
  );

  if (tab === "vendas-e-clientes") {
    const newCustomers = customers.length;
    const recurring = customers.filter((c) => (Number(c.purchasesCount) || 0) > 1).length;
    const ticket = paidOrders.length
      ? paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0) / paidOrders.length
      : 0;

    const channelCounts = new Map<string, number>();
    for (const o of periodOrders) {
      const label = o.paymentMethod || "Não informado";
      channelCounts.set(label, (channelCounts.get(label) || 0) + 1);
    }
    const channels = Array.from(channelCounts.entries()).sort((a, b) => b[1] - a[1]);
    const channelColors = ["bg-[#0066d6]", "bg-emerald-500", "bg-violet-500", "bg-amber-500"];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vendas e clientes</h1>
            <p className="mt-1 text-xs text-gray-500">
              Acompanhe o comportamento de compras e a fidelização da sua base de clientes.
            </p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as StatsPeriod)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs focus:border-[#0066d6] focus:outline-none w-fit"
          >
            <option value="hoje">Hoje</option>
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="este-mes">Este mês</option>
            <option value="tudo">Tudo</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Clientes cadastrados</span>
              <Users className="h-4 w-4 text-[#0066d6]" />
            </div>
            <div className="mt-3 text-3xl font-bold text-gray-900">{newCustomers}</div>
            <p className="mt-2 text-[11px] text-gray-400 font-medium">
              {newCustomers === 0 ? "Nenhum cliente ainda" : "Base total no CRM"}
            </p>
          </div>

          <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Clientes recorrentes</span>
              <UserCheck className="h-4 w-4 text-[#0066d6]" />
            </div>
            <div className="mt-3 text-3xl font-bold text-gray-900">{recurring}</div>
            <p className="mt-2 text-[11px] text-gray-400">Com 2 ou mais compras</p>
          </div>

          <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Ticket médio geral</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-3 text-3xl font-bold text-gray-900">{formatBRL(ticket)}</div>
            <p className="mt-2 text-[11px] text-gray-500">Média por pedido aprovado</p>
          </div>
        </div>

        <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-sm font-semibold text-gray-800">
              Canais de pagamento utilizados
            </span>
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-4 space-y-4 text-xs">
            {channels.length === 0 && (
              <p className="text-gray-500">Nenhum pedido no período.</p>
            )}
            {channels.map(([label, count], index) => (
              <div key={label}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{label}</span>
                  <span className="font-bold text-gray-900">
                    {count} ({formatPercent(count, periodOrders.length)})
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full ${channelColors[index % channelColors.length]}`}
                    style={{
                      width: `${periodOrders.length ? (count / periodOrders.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "tempo-real") {
    const today = new Date().toLocaleDateString("pt-BR");
    const todayOrders = orders.filter((o) => o.date === today);
    const todayRevenue = todayOrders
      .filter((o) => o.paymentStatus === "Recebido")
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const unreadMessages = messages.filter((m) => m.status === "Não respondida").length;
    const pendingShipments = orders.filter((o) => {
      const stage = (o.fulfillmentStatus as string) || "";
      return stage === "recebido" || stage === "preparando" || (!stage && o.shippingStatus !== "Enviada");
    }).length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Tempo real
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Atividade da sua loja hoje, atualizada na hora.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-gray-700">Pedidos de hoje</span>
            <div className="mt-3 text-4xl font-black text-gray-900">{todayOrders.length}</div>
            <p className="mt-1 text-[11px] text-gray-500">
              {formatBRL(todayRevenue)} em pagos hoje
            </p>
          </div>
          <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-gray-700">Aguardando envio</span>
            <div className="mt-3 text-4xl font-black text-gray-900">{pendingShipments}</div>
            <p className="mt-1 text-[11px] text-gray-500">Pedidos recebidos/preparando</p>
          </div>
          <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold text-gray-700">Mensagens sem resposta</span>
            <div className="mt-3 text-4xl font-black text-gray-900">{unreadMessages}</div>
            <p className="mt-1 text-[11px] text-gray-500">Na aba Mensagens</p>
          </div>
        </div>
      </div>
    );
  }

  // Relatório de cupons (dados ao vivo do Firestore)
  const totalUses = coupons.reduce((sum, c) => sum + (Number(c.usedCount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Relatório de cupons</h1>
          <p className="mt-1 text-xs text-gray-500">
            Acompanhe o uso e a efetividade dos cupons de desconto criados para a sua loja.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Cupons cadastrados</span>
            <Tag className="h-4 w-4 text-[#0066d6]" />
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">{coupons.length}</div>
          <p className="mt-1 text-xs text-emerald-600 font-medium">
            {coupons.filter((c) => c.active).length} ativos no momento
          </p>
        </div>

        <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Total de resgates</span>
            <Percent className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">{totalUses} usos</div>
          <p className="mt-1 text-xs text-gray-500">Acumulado em pedidos finalizados</p>
        </div>

        <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Cupom mais utilizado</span>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">
            {coupons.slice().sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0))[0]?.code || "—"}
          </div>
          <p className="mt-1 text-xs text-gray-500">Maior taxa de conversão</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e6e8ee] bg-white shadow-xs">
        <div className="border-b border-[#e6e8ee] bg-[#f9fafb] px-4 py-3">
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Desempenho por cupom
          </h2>
        </div>
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="border-b border-[#e6e8ee] bg-[#f9fafb] text-[11px] font-semibold text-gray-500">
            <tr>
              <th className="px-4 py-2.5">Código</th>
              <th className="px-4 py-2.5">Tipo</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Utilizações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f5]">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-xs text-gray-500">
                  Nenhum cupom cadastrado.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">{coupon.code}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {coupon.type === "porcentagem" && `${coupon.value}% de desconto`}
                    {coupon.type === "valor_fixo" && `R$ ${coupon.value.toFixed(2)}`}
                    {coupon.type === "frete_gratis" && "Frete grátis"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        coupon.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {coupon.active ? "Ativo" : "Pausado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {coupon.usedCount || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
