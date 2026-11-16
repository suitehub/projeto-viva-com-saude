import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCep } from "@/data/cart";
import { formatPrice } from "@/data/products";
import {
  getSavedCep,
  quoteShipping,
  saveCep,
  type ShippingQuoteItem,
  type ShippingQuoteOption,
} from "@/lib/shipping-quote";

interface ShippingEstimatorProps {
  items: ShippingQuoteItem[];
  subtotal: number;
}

/**
 * Simulador de frete da página do produto: só mostra PAC/SEDEX e prazo.
 * A escolha e o valor final continuam sendo confirmados no checkout.
 */
export function ShippingEstimator({ items, subtotal }: ShippingEstimatorProps) {
  const [cep, setCep] = useState(() => formatCep(getSavedCep()));
  const [remember, setRemember] = useState(true);
  const [quoting, setQuoting] = useState(false);
  const [options, setOptions] = useState<ShippingQuoteOption[] | null>(null);
  const [freePromo, setFreePromo] = useState(false);
  const [error, setError] = useState("");

  const itemsKey = items.map((i) => `${i.qty}:${i.weightKg ?? 0}`).join("|");

  const calculate = async (value: string) => {
    setQuoting(true);
    setError("");
    try {
      const result = await quoteShipping(value, items, subtotal);
      setOptions(result.options);
      setFreePromo(result.freePromo);
      if (remember) saveCep(value);
    } catch (err) {
      setOptions(null);
      setError(err instanceof Error ? err.message : "Não foi possível calcular o frete.");
    } finally {
      setQuoting(false);
    }
  };

  // Se o cliente já salvou o CEP antes, calcula automaticamente ao abrir.
  useEffect(() => {
    const saved = getSavedCep();
    if (saved.length === 8) void calculate(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void calculate(cep);
  };

  return (
    <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Truck className="h-4 w-4 text-primary" />
        Calcular frete e prazo
      </p>

      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <Input
          value={cep}
          onChange={(event) => setCep(formatCep(event.target.value))}
          placeholder="00000-000"
          inputMode="numeric"
          aria-label="CEP para calcular o frete"
          className="h-10 max-w-40"
        />
        <Button type="submit" variant="outline" className="h-10" disabled={quoting}>
          {quoting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular"}
        </Button>
      </form>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {options && (
        <ul className="mt-3 space-y-1.5 text-sm">
          {options.map((option) => (
            <li key={option.id} className="flex items-baseline justify-between gap-3">
              <span className="font-medium">{option.label}</span>
              <span className="text-right text-muted-foreground">
                {option.freePromo || option.price === 0 ? "Grátis" : formatPrice(option.price)}
                {option.deadlineDays
                  ? ` · ${option.deadlineDays === 1 ? "1 dia útil" : `até ${option.deadlineDays} dias úteis`}`
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      )}

      {options && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          {freePromo
            ? "Frete grátis aplicado para este CEP."
            : "Valores estimados. O frete final é confirmado no checkout."}
        </p>
      )}

      <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        Salvar este CEP para as próximas compras (fica só neste navegador)
      </label>
    </div>
  );
}
