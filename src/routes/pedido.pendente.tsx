import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader, TopBar, WhatsAppFab } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { useCart } from "@/data/cart";
import { useStoreProducts } from "@/data/all-store-products";
import { BACKEND_URL } from "@/lib/backend";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

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
  // Espera a sessão restaurar e tenta com espera antes de desistir.
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const paymentId =
      params.get("payment_id") || params.get("collection_id") || params.get("collectionId");
    if (!paymentId) return;

    const waitForAuthUser = (): Promise<unknown> => {
      if (auth.currentUser) return Promise.resolve(auth.currentUser);
      return new Promise((resolve) => {
        let done = false;
        const timer = setTimeout(() => {
          if (!done) {
            done = true;
            unsubscribe();
            resolve(auth.currentUser || null);
          }
        }, 10000);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!done) {
            done = true;
            clearTimeout(timer);
            unsubscribe();
            resolve(user);
          }
        });
      });
    };

    const attempt = async (retriesLeft: number, delayMs: number): Promise<void> => {
      if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
      if (cancelled) return;
      try {
        await waitForAuthUser();
        if (cancelled) return;
        let storedAddr = "";
        try {
          storedAddr = localStorage.getItem("pvcs_checkout_address") || "";
        } catch {
          // ignore (só apaga após sucesso)
        }
        const query = new URLSearchParams({ payment_id: paymentId });
        if (storedAddr) query.set("addr", storedAddr);
        const idToken = await auth.currentUser?.getIdToken().catch(() => null);
        const res = await fetch(
          `${BACKEND_URL}/api/confirmar-pedido?${query.toString()}`,
          { headers: idToken ? { Authorization: `Bearer ${idToken}` } : {} },
        );
        const data = (await res.json().catch(() => ({}))) as { orderNumber?: string };
        if (!res.ok) throw new Error("Falha ao registrar");
        if (cancelled) return;
        if (data.orderNumber) {
          setOrderNumber(data.orderNumber);
          try {
            localStorage.removeItem("pvcs_checkout_address");
          } catch {
            // ignore
          }
        } else if (retriesLeft > 0) {
          await attempt(retriesLeft - 1, 5000);
        }
      } catch (err) {
        console.error("Erro ao registrar pedido pendente:", err);
        if (!cancelled && retriesLeft > 0) {
          await attempt(retriesLeft - 1, 5000);
        }
      }
    };

    void attempt(2, 0);
    return () => {
      cancelled = true;
    };
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
