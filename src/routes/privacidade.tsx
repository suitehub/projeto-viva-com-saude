import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SiteFooter, SiteHeader, TopBar, WhatsAppFab } from "@/components/site-chrome";
import { useStoreSettings } from "@/hooks/use-store-settings";
import { useCart } from "@/data/cart";
import { useStoreProducts } from "@/data/all-store-products";

export const Route = createFileRoute("/privacidade")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Projeto Viva com Saúde" },
      {
        name: "description",
        content:
          "Como o Projeto Viva com Saúde coleta, usa e protege seus dados pessoais conforme a LGPD.",
      },
    ],
  }),
  component: PrivacyPage,
});

function DataRow({ data, why }: { data: string; why: string }) {
  return (
    <div className="grid gap-1 border-b border-border/60 py-3 last:border-0 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-4">
      <strong className="text-sm text-foreground">{data}</strong>
      <p className="text-sm text-muted-foreground">{why}</p>
    </div>
  );
}

function PrivacyPage() {
  const settings = useStoreSettings();
  const allProducts = useStoreProducts();
  const cart = useCart(allProducts);
  const contactEmail = settings.contactEmail || "contato@projetovivacomsaude.com.br";

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <TopBar />
      <SiteHeader cartCount={cart.count} onCartClick={() => {}} />

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar à loja
        </Link>

        <div className="mt-4 flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-primary">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Política de Privacidade
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Última atualização: outubro de 2026 • Em conformidade com a LGPD (Lei nº
              13.709/2018)
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold">1. Quem cuida dos seus dados</h2>
            <p className="mt-2 text-muted-foreground">
              O <strong className="text-foreground">Projeto Viva com Saúde</strong> é o
              controlador dos seus dados pessoais nesta loja. Isso significa que decidimos
              quais dados são coletados e para que eles servem, sempre seguindo a Lei Geral
              de Proteção de Dados (LGPD). Fale conosco pelo e-mail{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-semibold text-primary hover:underline"
              >
                {contactEmail}
              </a>{" "}
              para qualquer assunto de privacidade.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">
              2. Quais dados coletamos e por quê
            </h2>
            <p className="mt-2 text-muted-foreground">
              Coletamos apenas o necessário para vender, entregar e atender você:
            </p>
            <div className="mt-3 rounded-xl border border-border bg-card p-4">
              <DataRow
                data="Nome completo"
                why="Identificar você no pedido, na conta e no atendimento."
              />
              <DataRow
                data="E-mail"
                why="Login da conta, confirmação de pedidos, recuperação de senha e respostas às suas mensagens."
              />
              <DataRow
                data="Telefone / WhatsApp"
                why="Contato sobre pedidos, entregas e respostas às mensagens. O WhatsApp é obrigatório porque respondemos por lá."
              />
              <DataRow
                data="CPF"
                why="Exigido para emitir a cobrança no checkout e prevenir fraudes."
              />
              <DataRow
                data="Endereço (rua, número, complemento, cidade, estado, CEP)"
                why="Calcular o frete e entregar seu pedido no endereço certo."
              />
              <DataRow
                data="Dados do pedido (itens, valores, frete, pagamento)"
                why="Processar a venda, gerar a cobrança e prestar contas da compra."
              />
              <DataRow
                data="Mensagens e newsletter"
                why="Responder dúvidas e enviar ofertas quando você se cadastra."
              />
              <DataRow
                data="Carrinho e favoritos"
                why="Lembrar seus itens entre visitas e aparelhos (salvos no seu navegador e, logado, na sua conta)."
              />
              <DataRow
                data="Dados de pagamento"
                why="Processados diretamente pelo Mercado Pago. Não armazenamos número de cartão em nossos sistemas."
              />
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">3. Com quem compartilhamos</h2>
            <p className="mt-2 text-muted-foreground">
              Seus dados são compartilhados apenas com quem faz a loja funcionar:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>
                <strong className="text-foreground">Mercado Pago</strong> — processa o
                pagamento (cartão, Pix, boleto).
              </li>
              <li>
                <strong className="text-foreground">Google Firebase</strong> — autenticação,
                banco de dados e hospedagem técnica.
              </li>
              <li>
                <strong className="text-foreground">Cloudinary</strong> — hospeda as fotos
                dos produtos.
              </li>
              <li>
                <strong className="text-foreground">Transportadoras/Correios</strong> — nome,
                endereço e telefone para realizar a entrega.
              </li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              Nunca vendemos seus dados. Autoridades só recebem dados mediante obrigação
              legal.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">4. Cookies e armazenamento</h2>
            <p className="mt-2 text-muted-foreground">
              Usamos armazenamento local do navegador (sessão de login, carrinho e
              favoritos) e cookies estritamente necessários para a loja funcionar. Não
              usamos cookies de publicidade próprios.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">5. Seus direitos (LGPD)</h2>
            <p className="mt-2 text-muted-foreground">
              Você pode pedir a qualquer momento pelo e-mail {contactEmail}:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Confirmação de que tratamos seus dados e acesso a eles;</li>
              <li>Correção de dados incompletos ou errados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Portabilidade para outro fornecedor, quando aplicável;</li>
              <li>Revogação do consentimento (ex.: sair da newsletter);</li>
              <li>Informação sobre com quem compartilhamos seus dados.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">6. Segurança e retenção</h2>
            <p className="mt-2 text-muted-foreground">
              Protegemos os dados com acesso restrito (área administrativa com login),
              conexão criptografada (HTTPS/SSL) e regras de acesso no banco de dados.
              Mantemos cadastros e pedidos pelo tempo necessário às obrigações fiscais e
              à garantia dos seus direitos; depois, eliminamos ou anonimizamos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">7. Menores de idade</h2>
            <p className="mt-2 text-muted-foreground">
              A loja é destinada a maiores de 18 anos. Compras para menores devem ser
              feitas pelos responsáveis.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">8. Mudanças nesta política</h2>
            <p className="mt-2 text-muted-foreground">
              Podemos atualizar este texto quando a loja mudar; a data no topo sempre
              indica a versão vigente. Mudanças relevantes serão avisadas pelos nossos
              canais.
            </p>
          </section>
        </div>
      </div>

      <SiteFooter />
      <WhatsAppFab />
    </main>
  );
}
