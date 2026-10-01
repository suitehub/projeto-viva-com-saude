import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import { SiteFooter, SiteHeader, TopBar, WhatsAppFab } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/data/products";
import { useStoreProducts } from "@/data/all-store-products";
import { useCurrentUser } from "@/data/user-auth";
import {
  FREIGHT_OPTIONS,
  formatCep,
  formatCpf,
  isValidCpf,
  isValidEmail,
  useCart,
} from "@/data/cart";
import { createMercadoPagoPreference } from "@/lib/backend";
import productsImage from "@/assets/viva-products.jpg";

export const Route = createFileRoute("/checkout")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Finalizar Compra | Projeto Viva com Saúde" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

export interface CheckoutPayload {
  items: Array<{ id: string; name: string; qty: number; unitPrice: number }>;
  customer: {
    fullName: string;
    email: string;
    cpf: string;
    phone: string;
    cep: string;
    address: string;
    number: string;
    complement: string;
    city: string;
    state: string;
  };
  freightId: string;
  freightPrice: number;
  subtotal: number;
  total: number;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useCurrentUser();
  const allProducts = useStoreProducts();
  const { items, count, subtotal, setQty } = useCart(allProducts);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [freightId, setFreightId] = useState(FREIGHT_OPTIONS[0].id);
  const [formError, setFormError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const freight = useMemo(
    () => FREIGHT_OPTIONS.find((f) => f.id === freightId) || FREIGHT_OPTIONS[0],
    [freightId],
  );
  const total = subtotal + freight.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (items.length === 0) {
      setFormError("Seu carrinho está vazio.");
      return;
    }
    if (fullName.trim().length < 5) {
      setFormError("Informe seu nome completo.");
      return;
    }
    if (!isValidEmail(email)) {
      setFormError("Informe um e-mail válido.");
      return;
    }
    if (!isValidCpf(cpf)) {
      setFormError("Informe um CPF válido.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setFormError("Informe um WhatsApp válido com DDD.");
      return;
    }
    if (cep.replace(/\D/g, "").length !== 8) {
      setFormError("Informe um CEP válido com 8 dígitos.");
      return;
    }
    if (!address.trim() || !number.trim() || !city.trim() || !state.trim()) {
      setFormError("Complete o endereço de entrega (rua, número, cidade e estado).");
      return;
    }

    const payload: CheckoutPayload = {
      items: items.map(({ product, qty }) => ({
        id: String(product.id),
        name: product.name,
        qty,
        unitPrice: product.price,
      })),
      customer: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        cpf: cpf.replace(/\D/g, ""),
        phone: phone.trim(),
        cep: cep.replace(/\D/g, ""),
        address: address.trim(),
        number: number.trim(),
        complement: complement.trim(),
        city: city.trim(),
        state: state.trim(),
      },
      freightId: freight.id,
      freightPrice: freight.price,
      subtotal,
      total,
    };

    // Cria a preferência do Checkout Pro e redireciona ao Mercado Pago.
    setIsPaying(true);
    try {
      const paymentUrl = await createMercadoPagoPreference({
        items: payload.items.map((item) => {
          const full = items.find((i) => String(i.product.id) === item.id);
          return { ...item, imageUrl: full?.product.imageUrl };
        }),
        freightPrice: payload.freightPrice,
        freightLabel: freight.label,
        email: payload.customer.email,
      });
      window.location.href = paymentUrl;
    } catch (err) {
      console.error("Erro ao iniciar pagamento:", err);
      setFormError(
        err instanceof Error ? err.message : "Não foi possível iniciar o pagamento.",
      );
      setIsPaying(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <TopBar />
      <SiteHeader cartCount={count} />

      <div className="border-b border-border bg-card/60">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Finalizar compra</h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Revise os itens, informe a entrega e conclua seu pedido.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {!isLoggedIn ? (
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <Lock className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 font-display text-2xl font-bold">Entre para continuar</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Você precisa estar logado para finalizar a compra.
            </p>
            <Button
              className="mt-6 h-11 w-full"
              onClick={() => navigate({ to: "/conta", search: { tab: "entrar" } })}
            >
              Entrar na minha conta
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-3 font-display text-2xl font-bold">Carrinho vazio</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Adicione produtos para finalizar sua compra.
            </p>
            <Button asChild className="mt-6 h-11 w-full">
              <Link to="/produtos">Ver produtos</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-8">
              {/* Itens */}
              <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
                <h2 className="flex items-center gap-2 text-base font-bold">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Seus itens ({count})
                </h2>
                <div className="mt-4 space-y-4">
                  {items.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-20 w-full rounded-md object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div
                          className="product-crop h-20 rounded-md"
                          style={{
                            backgroundImage: `url(${productsImage})`,
                            backgroundPosition: product.imagePosition,
                          }}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                        <p className="mt-0.5 text-sm font-bold text-primary">
                          {formatPrice(product.price)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center rounded-md border border-border">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setQty(product.id, qty - 1)}
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setQty(product.id, qty + 1)}
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setQty(product.id, 0)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remover
                          </button>
                          <strong className="ml-auto text-sm">
                            {formatPrice(product.price * qty)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Dados */}
              <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
                <h2 className="flex items-center gap-2 text-base font-bold">
                  <User className="h-5 w-5 text-primary" />
                  Seus dados
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label className="text-xs font-semibold">Nome completo *</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Maria Silva Santos"
                      className="mt-1 h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">E-mail *</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@exemplo.com"
                      className="mt-1 h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">CPF *</Label>
                    <Input
                      value={cpf}
                      onChange={(e) => setCpf(formatCpf(e.target.value))}
                      placeholder="000.000.000-00"
                      inputMode="numeric"
                      className="mt-1 h-11"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs font-semibold">WhatsApp *</Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="mt-1 h-11"
                    />
                  </div>
                </div>
              </section>

              {/* Entrega */}
              <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
                <h2 className="flex items-center gap-2 text-base font-bold">
                  <MapPin className="h-5 w-5 text-primary" />
                  Entrega
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <Label className="text-xs font-semibold">CEP *</Label>
                    <Input
                      value={cep}
                      onChange={(e) => setCep(formatCep(e.target.value))}
                      placeholder="00000-000"
                      inputMode="numeric"
                      className="mt-1 h-11"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <Label className="text-xs font-semibold">Rua / Avenida *</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rua, avenida..."
                      className="mt-1 h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Número *</Label>
                    <Input
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="123"
                      className="mt-1 h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Complemento</Label>
                    <Input
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto, bloco..."
                      className="mt-1 h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Cidade *</Label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="São Paulo"
                      className="mt-1 h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Estado *</Label>
                    <Input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                      className="mt-1 h-11"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {FREIGHT_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors ${
                        freightId === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="frete"
                          checked={freightId === option.id}
                          onChange={() => setFreightId(option.id)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span>
                          <Truck className="mr-2 inline h-4 w-4 text-primary" />
                          <strong className="text-sm">{option.label}</strong>
                          <small className="ml-2 text-xs text-muted-foreground">
                            {option.detail}
                          </small>
                        </span>
                      </span>
                      <strong className="text-sm">
                        {option.price === 0 ? "Grátis" : formatPrice(option.price)}
                      </strong>
                    </label>
                  ))}
                </div>
              </section>

              {formError && (
                <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {formError}
                </p>
              )}
            </div>

            {/* Resumo */}
            <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-base font-bold">Resumo do pedido</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Subtotal ({count} {count === 1 ? "item" : "itens"})
                  </dt>
                  <dd className="font-semibold">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Frete ({freight.label})</dt>
                  <dd className="font-semibold">
                    {freight.price === 0 ? "Grátis" : formatPrice(freight.price)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-extrabold text-primary">{formatPrice(total)}</dd>
                </div>
              </dl>
              <Button type="submit" className="mt-5 h-12 w-full text-sm font-bold" disabled={isPaying}>
                {isPaying ? "Abrindo pagamento..." : "Finalizar compra"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Pagamento seguro na próxima etapa
              </p>
              <Button asChild variant="outline" className="mt-3 h-10 w-full text-xs">
                <Link to="/produtos">
                  <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                  Continuar comprando
                </Link>
              </Button>
            </aside>
          </form>
        )}
      </div>

      <SiteFooter />
      <WhatsAppFab />
    </main>
  );
}
