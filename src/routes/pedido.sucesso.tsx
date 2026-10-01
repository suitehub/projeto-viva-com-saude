import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader, TopBar, WhatsAppFab } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { clearCart } from "@/data/cart";

export const Route = createFileRoute("/pedido/sucesso")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Pagamento aprovado | Projeto Viva com Saúde" }, { name: "robots", content: "noindex" }],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  useEffect(() => {
    clearCart();
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
