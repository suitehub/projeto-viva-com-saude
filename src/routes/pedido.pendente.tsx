import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader, TopBar, WhatsAppFab } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { useCart } from "@/data/cart";
import { useStoreProducts } from "@/data/all-store-products";
import { BACKEND_URL } from "@/lib/backend";
import { auth } from "@/lib/firebase";

export const Route = createFileRoute("/pedido/pendente")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Pagamento pendente | Projeto Viva com Saúde" }, { name: "robots", content: "noindex" }],
  }),
  component: OrderPendingPage,
});

function OrderPendingPage() {
  const allProducts = useStoreProducts();
  const cart = useCart(allProducts);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Registra o pedido como pendente (não limpa o carrinho aqui).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId =
      params.get("payment_id") || params.get("collection_id") || params.get("collectionId");
    if (!paymentId) return;
    auth.currentUser
      ?.getIdToken()
      .catch(() => null)
      .then((idToken) =>
        fetch(`${BACKEND_URL}/api/confirmar-pedido?payment_id=${encodeURIComponent(paymentId)}`, {
          headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
        }),
      )
      .then((res) => (res ? res.json().catch(() => ({})) : {}))
      .then((data: { orderNumber?: string }) => {
        if (data.orderNumber) setOrderNumber(data.orderNumber);
      })
      .catch((err) => console.error("Erro ao registrar pedido pendente:", err));
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <TopBar />
      <SiteHeader cartCount={cart.count} />
      <div className="mx-auto grid w-full max-w-xl flex-1 place-items-center px-4 py-16">
        <div className="w-full rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <Clock className="mx-auto h-14 w-14 text-amber-500" />
          <h1 className="mt-4 font-display text-3xl font-bold">Pagamento pendente</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Estamos aguardando a confirmação do pagamento (Pix ou boleto). Assim que compensar,
            seu pedido entra em preparação automaticamente.
          </p>
          {orderNumber && (
            <p className="mt-3 inline-block rounded-full bg-amber-50 px-4 py-1.5 text-sm font-bold text-amber-700">
              Pedido {orderNumber} registrado
            </p>
          )}
          <Button asChild className="mt-6 h-11 w-full">
            <Link to="/">
              Voltar à loja
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <SiteFooter />
      <WhatsAppFab />
    </main>
  );
}
