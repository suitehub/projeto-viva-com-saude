import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { SiteFooter, SiteHeader, TopBar, WhatsAppFab } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { useCart } from "@/data/cart";
import { useStoreProducts } from "@/data/all-store-products";

export const Route = createFileRoute("/pedido/erro")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Pagamento não concluído | Projeto Viva com Saúde" }, { name: "robots", content: "noindex" }],
  }),
  component: OrderErrorPage,
});

function OrderErrorPage() {
  const allProducts = useStoreProducts();
  const cart = useCart(allProducts);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <TopBar />
      <SiteHeader cartCount={cart.count} />
      <div className="mx-auto grid w-full max-w-xl flex-1 place-items-center px-4 py-16">
        <div className="w-full rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <XCircle className="mx-auto h-14 w-14 text-red-500" />
          <h1 className="mt-4 font-display text-3xl font-bold">Pagamento não concluído</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Algo interrompeu o pagamento. Seu carrinho foi mantido — tente novamente.
          </p>
          <div className="mt-6 grid gap-2">
            <Button asChild className="h-11 w-full">
              <Link to="/checkout">
                <RotateCcw className="mr-2 h-4 w-4" />
                Tentar novamente
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 w-full">
              <Link to="/">
                Voltar à loja
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <SiteFooter />
      <WhatsAppFab />
    </main>
  );
}
