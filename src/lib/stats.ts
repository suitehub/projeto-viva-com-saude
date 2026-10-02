/**
 * Utilitários das telas de estatística: tudo calculado de dados reais
 * (pedidos, produtos, clientes). Sem métricas inventadas.
 */

/** Entende "dd/mm/yyyy" (pt-BR) e ISO. */
export function parseBrDate(value?: string): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.includes("/")) {
    const [d, m, y] = trimmed.split("/").map(Number);
    if (!d || !m || !y) return null;
    const date = new Date(y, m - 1, d);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

export type StatsPeriod = "hoje" | "ontem" | "7dias" | "30dias" | "este-mes" | "tudo";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Intervalo [início, fim] do período (fim = agora). */
export function getPeriodRange(period: string): { start: Date; end: Date } {
  const now = new Date();
  const today = startOfDay(now);
  switch (period) {
    case "hoje":
      return { start: today, end: now };
    case "ontem": {
      const start = new Date(today);
      start.setDate(start.getDate() - 1);
      return { start, end: today };
    }
    case "7dias": {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return { start, end: now };
    }
    case "este-mes": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start, end: now };
    }
    case "tudo":
      return { start: new Date(2000, 0, 1), end: now };
    case "30dias":
    default: {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { start, end: now };
    }
  }
}

export function inPeriod(dateValue: string | undefined, period: string): boolean {
  const parsed = parseBrDate(dateValue);
  if (!parsed) return period === "tudo";
  const { start, end } = getPeriodRange(period);
  return parsed >= start && parsed <= end;
}

export function formatBRL(value: number): string {
  return `R$ ${(Number(value) || 0).toFixed(2).replace(".", ",")}`;
}

export function formatPercent(part: number, total: number): string {
  if (!total) return "0,0%";
  return `${((part / total) * 100).toFixed(1).replace(".", ",")}%`;
}

/** 7 marcas de eixo 0..max para os gráficos de barra. */
export function axisTicks(max: number): number[] {
  const top = Math.max(1, Math.ceil(max));
  const step = Math.max(1, Math.ceil(top / 6));
  return [0, 1, 2, 3, 4, 5, 6].map((i) => Math.min(i * step, top));
}

export interface DayBucket {
  key: string;
  label: string;
  total: number;
  count: number;
}

/** Receita e nº de pedidos dos últimos 7 dias (índice 0 = 6 dias atrás). */
export function last7DaysRevenue<T extends { date?: string; total?: number }>(
  orders: T[],
): DayBucket[] {
  const buckets: DayBucket[] = [];
  const today = startOfDay(new Date());
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    let total = 0;
    let count = 0;
    for (const order of orders) {
      const parsed = parseBrDate(order.date);
      if (parsed && parsed >= day && parsed < next) {
        total += Number(order.total) || 0;
        count += 1;
      }
    }
    buckets.push({
      key: day.toISOString().slice(0, 10),
      label: day.toLocaleDateString("pt-BR", { day: "2-digit" }),
      total,
      count,
    });
  }
  return buckets;
}
