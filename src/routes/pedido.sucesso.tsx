import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, AlertTriangle } from "lucide-react";
import { SiteFooter, SiteHeader, TopBar, WhatsAppFab } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { clearCart } from "@/data/cart";
import { BACKEND_URL } from "@/lib/backend";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

/** Aguarda a sessão restaurar (o Auth pode chegar nulo no 1º render). */
function waitForAuthUser(timeoutMs = 10000): Promise<unknown> {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  return new Promise((resolve) => {
    let done = false;
    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        unsubscribe();
        resolve(auth.currentUser || null);
      }
    }, timeoutMs);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        unsubscribe();
        resolve(user);
      }
    });
  });
}

function readStoredAddress(): string {
  try {
    return localStorage.getItem("pvcs_checkout_address") || "";
  } catch {
    return "";
  }
}

function clearStoredAddress(): void {
  try {
    localStorage.removeItem("pvcs_checkout_address");
  } catch {
    // ignore
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Route = createFileRoute("/pedido/sucesso")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Pagamento aprovado | Projeto Viva com Saúde" }, { name: "robots", content: "noindex" }],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState("");
  const [confirming, setConfirming] = useState(true);

  const confirmOrder = async (isRetry = false) => {
    const params = new URLSearchParams(window.location.search);
    const paymentId =
      params.get("payment_id") || params.get("collection_id") || params.get("collectionId");
    if (!paymentId) {
      setOrderNumber(null);
      setConfirming(false);
      clearCart();
      return;
    }
    // Espera a sessão (evita 401 com Auth ainda restaurando)
    await waitForAuthUser();
    const storedAddr = readStoredAddress();
    const query = new URLSearchParams({ payment_id: paymentId });
    if (storedAddr) query.set("addr", storedAddr);

    // Tentativas automáticas com espera crescente antes de mostrar erro
    const delays = isRetry ? [0] : [0, 2500, 6000];
    let lastError: unknown = null;
    for (let attempt = 0; attempt < delays.length; attempt++) {
      if (delays[attempt] > 0) await sleep(delays[attempt]);
      try {
        const idToken = await auth.currentUser?.getIdToken().catch(() => null);
        const res = await fetch(
          `${BACKEND_URL}/api/confirmar-pedido?${query.toString()}`,
          idToken ? { headers: { Authorization: `Bearer ${idToken}` } } : undefined,
        );
        const data = (await res.json().catch(() => ({}))) as {
          orderNumber?: string;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error || "Falha ao registrar pedido.");
        if (data.orderNumber) setOrderNumber(data.orderNumber);
        clearStoredAddress();
        clearCart();
        setConfirmError("");
        setConfirming(false);
        return;
      } catch (err) {
        lastError = err;
        console.error(`Erro ao confirmar pedido (tentativa ${attempt + 1}):`, err);
      }
    }
    console.error("Erro ao confirmar pedido:", lastError);
    setConfirming(false);
    setConfirmError(
      "Pagamento aprovado, mas não consegui registrar o pedido. Toque abaixo para tentar de novo.",
    );
  };

  useEffect(() => {
    void confirmOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <TopBar />
      <SiteHeader cartCount={0} />
      <div className="mx-auto grid w-full max-w-xl flex-1 place-items-center px-4 py-16">
        <div className="w-full rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
          <h1 className="mt-4 font-display text-3xl font-bold">Pagamento aprovado!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Obrigado pela compra! Enviamos os detalhes para o seu e-mail e já estamos preparando
            seu pedido.
          </p>
          {orderNumber && (
            <p className="mt-3 inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700">
              Pedido {orderNumber} registrado
            </p>
          )}
          {confirmError && (
            <div className="mt-3 space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="flex items-start gap-2 text-xs text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {confirmError}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setConfirmError("");
                  setConfirming(true);
                  void confirmOrder(true);
                }}
              >
                Tentar registrar de novo
              </Button>
            </div>
          )}
          {confirming && !orderNumber && !confirmError && (
            <p className="mt-3 text-xs text-muted-foreground">Registrando seu pedido...</p>
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
