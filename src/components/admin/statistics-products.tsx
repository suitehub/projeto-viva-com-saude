import { useState, useEffect, useMemo } from "react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Info,
  MoreVertical,
  Search,
} from "lucide-react";
import {
  SaleOrder,
  getCachedOrders,
  subscribeAdminOrders,
} from "@/data/admin-orders-data";
import {
  AdminProductItem,
  getCachedAdminProducts,
  subscribeAdminProducts,
} from "@/data/admin-products-data";
import { normalizeSearchText } from "@/data/all-store-products";
import { formatBRL, last7DaysRevenue } from "@/lib/stats";

const PAGE_SIZE = 8;

type SortKey = "name" | "units" | "revenue" | "stock";

interface ProductRow {
  name: string;
  units: number;
  revenue: number;
  stock: string | number | undefined;
}

export function StatisticsProducts() {
  const [productSearch, setProductSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("units");
  const [sortAsc, setSortAsc] = useState(false);
  const [orders, setOrders] = useState<SaleOrder[]>(() => getCachedOrders());
  const [products, setProducts] = useState<AdminProductItem[]>(() => getCachedAdminProducts());

  useEffect(() => {
    const unsubOrders = subscribeAdminOrders(setOrders);
    const unsubProducts = subscribeAdminProducts(setProducts);
    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, []);

  const aggregated = useMemo(() => {
    const unitsByName = new Map<string, { units: number; revenue: number; name: string }>();
    for (const order of orders) {
      if (order.paymentStatus === "Recusado" || order.paymentStatus === "Estornado") continue;
      for (const item of order.products || []) {
        const key = (item.name || "").trim().toLowerCase();
        if (!key) continue;
        const entry = unitsByName.get(key) || { units: 0, revenue: 0, name: item.name };
        entry.units += Number(item.quantity) || 0;
        entry.revenue += (Number(item.quantity) || 0) * (Number(item.price) || 0);
        unitsByName.set(key, entry);
      }
    }
    const stockByName = new Map<string, string | number | undefined>();
    for (const p of products) {
      stockByName.set((p.name || "").trim().toLowerCase(), p.stock);
    }
    const rows: ProductRow[] = [];
    const seen = new Set<string>();
    for (const [key, entry] of unitsByName) {
      seen.add(key);
      rows.push({
        name: entry.name,
        units: entry.units,
        revenue: entry.revenue,
        stock: stockByName.get(key),
      });
    }
    for (const p of products) {
      const key = (p.name || "").trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      rows.push({ name: p.name, units: 0, revenue: 0, stock: p.stock });
    }
    return rows;
  }, [orders, products]);

  const totalUnits = useMemo(() => aggregated.reduce((sum, r) => sum + r.units, 0), [aggregated]);
  const totalRevenue = useMemo(
    () => aggregated.reduce((sum, r) => sum + r.revenue, 0),
    [aggregated],
  );

  const filteredProducts = useMemo(() => {
    const q = normalizeSearchText(productSearch.trim());
    const list = q
      ? aggregated.filter((p) => normalizeSearchText(p.name).includes(q))
      : [...aggregated];
    const dir = sortAsc ? 1 : -1;
    list.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      if (sortKey === "revenue") return (a.revenue - b.revenue) * dir;
      if (sortKey === "stock") {
        const sa = typeof a.stock === "number" ? a.stock : Number.MAX_SAFE_INTEGER;
        const sb = typeof b.stock === "number" ? b.stock : Number.MAX_SAFE_INTEGER;
        return (sa - sb) * dir;
      }
      return (a.units - b.units) * dir;
    });
    return list;
  }, [aggregated, productSearch, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageRows = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === "name");
    }
    setCurrentPage(1);
  };

  const weekBuckets = useMemo(
    () => last7DaysRevenue(orders.filter((o) => o.paymentStatus === "Recebido")),
    [orders],
  );
  const weekMax = Math.max(1, ...weekBuckets.map((b) => b.total));

  const lowStock = useMemo(
    () =>
      products
        .filter((p) => typeof p.stock === "number" && (p.stock as number) <= 5)
        .sort((a, b) => (a.stock as number) - (b.stock as number))
        .slice(0, 10),
    [products],
  );

  const scatterPoints = useMemo(() => {
    const pts = products
      .filter((p) => typeof p.stock === "number")
      .map((p) => {
        const key = (p.name || "").trim().toLowerCase();
        const sold = aggregated.find((r) => r.name.trim().toLowerCase() === key)?.units || 0;
        return { name: p.name, stock: p.stock as number, sold };
      });
    return {
      points: pts,
      maxStock: Math.max(10, ...pts.map((p) => p.stock)),
      maxSold: Math.max(2, ...pts.map((p) => p.sold)),
    };
  }, [products, aggregated]);

  return (
    <div className="space-y-6">
      {/* Top 2 Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <span>Unidades vendidas</span>
                <Info className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 text-3xl font-bold text-gray-900">{totalUnits}</div>
            <p className="mt-1 text-[11px] text-gray-500">Somando todos os pedidos</p>
          </div>
        </div>

        {/* Receita por dia (7 dias) */}
        <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs lg:col-span-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <span>Receita por dia (7 dias) — {formatBRL(totalRevenue)} no total</span>
              <Info className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 h-36 flex flex-col justify-end">
            <div className="flex-1 flex items-end justify-between px-6 border-b border-gray-200 gap-2">
              {weekBuckets.map((bucket) => (
                <div key={bucket.key} className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[10px] font-bold text-gray-700">
                    {bucket.total > 0 ? formatBRL(bucket.total) : ""}
                  </span>
                  <div
                    className="w-8 bg-[#0066d6] rounded-t"
                    style={{ height: `${Math.max(bucket.total > 0 ? 6 : 0, (bucket.total / weekMax) * 100)}%` }}
                    title={`${bucket.label}: ${formatBRL(bucket.total)} (${bucket.count} pedidos)`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between px-6 pt-2 text-[10px] text-gray-400">
              {weekBuckets.map((bucket) => (
                <span key={bucket.key} className="flex-1 text-center">
                  {bucket.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detalhe por produto */}
      <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
            <span>Detalhe por produto</span>
            <Info className="h-3.5 w-3.5 text-gray-400" />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Pesquisar ${filteredProducts.length} registros...`}
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 w-56 rounded-md border border-gray-200 bg-[#f9fafb] pl-8 pr-3 text-xs text-gray-700 placeholder-gray-400 focus:bg-white focus:border-[#0066d6] focus:outline-none"
              />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-500">
                <th className="py-2.5 pr-4">
                  <button
                    type="button"
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-800"
                  >
                    <span>Produtos</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-2.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => toggleSort("units")}
                    className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-800 mx-auto"
                  >
                    <span>Unidades vendidas</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-2.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => toggleSort("revenue")}
                    className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-800 mx-auto"
                  >
                    <span>Receita</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-2.5 pl-4 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort("stock")}
                    className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-800 ml-auto"
                  >
                    <span>Estoque atual</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-gray-500">
                    {aggregated.length === 0
                      ? "Sem dados ainda — vendas e produtos aparecem aqui."
                      : "Nenhum produto para esta busca."}
                  </td>
                </tr>
              ) : (
                pageRows.map((p) => (
                  <tr key={p.name} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-gray-800">{p.name}</td>
                    <td className="py-3 px-4 text-center text-gray-700 font-semibold">{p.units}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{formatBRL(p.revenue)}</td>
                    <td className="py-3 pl-4 text-right font-medium text-gray-800">
                      {typeof p.stock === "number" ? (
                        <span className={p.stock === 0 ? "text-red-600 font-bold" : ""}>
                          {p.stock} un.
                        </span>
                      ) : (
                        <span className="text-gray-400">∞</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-end gap-1 text-xs text-gray-600 border-t border-gray-100 pt-3">
            <button
              onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
              disabled={safePage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-7 w-7 rounded text-xs font-semibold ${
                  safePage === page ? "bg-[#0066d6] text-white" : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
              disabled={safePage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom 2 Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Estoque baixo */}
        <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs lg:col-span-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <span>Estoque baixo (5 un. ou menos)</span>
              <Info className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          {lowStock.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 mb-3 border border-emerald-100">
                <Info className="h-6 w-6 text-emerald-500" />
              </div>
              <p className="text-xs max-w-xs text-gray-500">
                Nenhum produto com estoque baixo no momento
              </p>
            </div>
          ) : (
            <div className="mt-2 divide-y divide-gray-100">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2.5 text-xs">
                  <span className="font-medium text-gray-800 truncate pr-2">{p.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 font-bold ${
                      p.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.stock === 0 ? "Esgotado" : `${p.stock} un.`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dispersão de vendas vs estoque */}
        <div className="rounded-lg border border-[#e6e8ee] bg-white p-5 shadow-xs lg:col-span-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <span>Dispersão de vendas vs estoque</span>
              <Info className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          <div className="pt-6">
            <div className="relative h-44 w-full border-l border-b border-gray-300">
              <div className="absolute -left-8 inset-y-0 flex flex-col justify-between text-[10px] text-gray-400">
                <span>{scatterPoints.maxSold}</span>
                <span>{Math.round(scatterPoints.maxSold / 2)}</span>
                <span>0</span>
              </div>

              <div className="absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-gray-400 font-medium">
                Quantidade vendida
              </div>

              <div className="absolute inset-0 flex flex-col justify-between border-t border-dashed border-gray-200 pointer-events-none">
                <div className="w-full border-b border-dashed border-gray-200" />
                <div className="w-full border-b border-dashed border-gray-200" />
              </div>

              {scatterPoints.points.length === 0 && (
                <span className="absolute inset-0 grid place-items-center text-[11px] text-gray-400">
                  Sem produtos com estoque numérico
                </span>
              )}
              {scatterPoints.points.map((pt) => (
                <div
                  key={pt.name}
                  className="absolute h-2.5 w-2.5 rounded-full bg-[#0066d6] ring-2 ring-blue-200"
                  style={{
                    left: `${Math.min(96, (pt.stock / scatterPoints.maxStock) * 100)}%`,
                    bottom: `calc(${(pt.sold / scatterPoints.maxSold) * 100}% - 2px)`,
                  }}
                  title={`${pt.name} — Estoque: ${pt.stock}, Vendas: ${pt.sold}`}
                />
              ))}
            </div>

            <div className="flex justify-between pl-4 pt-1 text-[10px] text-gray-400">
              <span>0</span>
              <span>{Math.round(scatterPoints.maxStock / 2)}</span>
              <span>{scatterPoints.maxStock}</span>
            </div>
            <div className="text-center text-[9px] text-gray-400 font-medium mt-1">Estoque</div>
          </div>
        </div>
      </div>
    </div>
  );
}
