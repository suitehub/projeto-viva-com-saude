import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle, MousePointerClick, Search, Sparkles, Zap } from "lucide-react";
import { SEGMENTS } from "@/data/suitehub/segments";
import { SITE } from "@/data/suitehub/site";
import { HubFooter, HubNavbar, Reveal, SegmentCard } from "@/components/suitehub/hub-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Suite Hub — Vitrine de Sites | Encontre o site ideal" },
      { name: "description", content: "Explore experiências criadas pela Suite Hub para diferentes tipos de empresas. 9 segmentos, 27 conceitos navegáveis." },
    ],
  }),
  component: HubHome,
});

function HubHome() {
  return (
    <div className="min-h-screen bg-[#070b16] font-sans text-white antialiased">
      <HubNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-28 sm:pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />
          <div className="absolute right-[-10rem] top-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300">
              <Sparkles className="h-3.5 w-3.5" /> 9 segmentos · 27 experiências reais
            </span>
            <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.2rem]">
              Seu negócio merece mais do que <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">um site.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-base">
              Explore algumas das experiências digitais que a Suite Hub pode criar para a sua
              empresa. Escolha seu segmento, navegue por 3 conceitos e imagine sua marca ali.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#segmentos" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-extrabold shadow-[0_16px_40px_rgba(37,99,235,.45)] transition hover:bg-blue-500">
                <Search className="h-4 w-4" /> Encontrar meu segmento
              </a>
              <Link to="/esquadrao" className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-7 py-3.5 text-sm font-extrabold text-cyan-200 transition hover:bg-cyan-500/20">
                🛡 Protótipo Esquadrão do Céu
              </Link>
              <a href={SITE.waLink()} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white/85 transition hover:border-white/30 hover:text-white">
                <MessageCircle className="h-4 w-4" /> Falar com a Suite Hub
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-semibold text-white/45">
              {[ "Sites personalizados", "Agendamento e pedidos", "WhatsApp e conversão" ].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" />{t}</span>
              ))}
            </div>
          </Reveal>

          {/* MOCKUPS */}
          <Reveal delay={150} className="relative hidden lg:block">
            <div className="relative h-[480px]">
              <div className="absolute left-0 top-6 w-64 rotate-[-6deg] overflow-hidden rounded-2xl border border-white/15 bg-[#0d1428] shadow-2xl transition-transform duration-500 hover:rotate-0">
                <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80" alt="Restaurante premium" className="h-40 w-full object-cover" />
                <div className="p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Restaurante</p><p className="text-sm font-extrabold">Casa Nostra</p><p className="mt-1 text-[11px] text-white/50">Reserva · Cardápio · Delivery</p></div>
              </div>
              <div className="absolute right-0 top-0 w-64 rotate-[5deg] overflow-hidden rounded-2xl border border-white/15 bg-[#0d1428] shadow-2xl transition-transform duration-500 hover:rotate-0">
                <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=500&q=80" alt="Barbearia" className="h-40 w-full object-cover" />
                <div className="p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-yellow-300">Barbearia</p><p className="text-sm font-extrabold">Barber Club 91</p><p className="mt-1 text-[11px] text-white/50">Agenda · Planos · Galeria</p></div>
              </div>
              <div className="absolute bottom-0 left-1/2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-blue-500/30 bg-[#0d1428] shadow-[0_30px_80px_rgba(37,99,235,.35)]">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" alt="Imobiliária" className="h-44 w-full object-cover" />
                <div className="p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Imobiliária</p><p className="text-sm font-extrabold">Alto Vale — R$ 2,8M</p><div className="mt-2 flex gap-2"><span className="rounded-full bg-blue-600 px-4 py-1.5 text-[11px] font-bold">Agendar visita</span><span className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-bold">Detalhes</span></div></div>
              </div>
              <div className="absolute bottom-16 right-2 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-[11px] font-bold backdrop-blur">
                <MousePointerClick className="h-3.5 w-3.5 text-blue-400" /> 100% navegável
              </div>
            </div>
          </Reveal>
        </div>

        {/* marquee segmentos */}
        <div className="relative mt-14 border-y border-white/5 bg-white/[0.015] py-3">
          <p className="animate-marquee whitespace-nowrap text-center text-[12px] font-bold uppercase tracking-[0.24em] text-white/35">
            Restaurantes · Barbearias · Salões · Psicologia · Imobiliárias · Automotivo · Lava-Car · Advocacia · Gás & Delivery ·
          </p>
        </div>
      </section>

      {/* SEGMENTOS */}
      <section id="segmentos" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-400">Encontre o site ideal para o seu negócio</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">Explore experiências criadas para cada tipo de empresa.</h2>
            <p className="max-w-sm text-sm text-white/50">Cada segmento tem 3 conceitos com estratégias diferentes — não são cores diferentes do mesmo template.</p>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTS.map((s, i) => (<SegmentCard key={s.slug} segment={s} index={i} />))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
          <Reveal>
            <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Do clique ao contato em 4 passos</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Escolha seu segmento", "Restaurante, barbearia, imobiliária... ache o seu."],
              ["02", "Compare 3 conceitos", "Premium, moderno, acolhedor — estratégias reais."],
              ["03", "Navegue na demo", "Clique, agende, filtre, simule. Como um site de verdade."],
              ["04", "Peça o seu", "Chame no WhatsApp e receba proposta personalizada."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 90}>
                <div className="h-full rounded-3xl border border-white/10 bg-[#0b1120] p-6">
                  <span className="text-4xl font-black text-blue-600/60">{n}</span>
                  <h3 className="mt-3 font-extrabold">{t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA DE VALOR */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div className="h-full rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/20 to-transparent p-8 sm:p-10">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600"><Zap className="h-5 w-5" /></span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Não vendemos templates. Criamos experiências sob medida.</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">Cada demonstração aqui parece uma empresa diferente — porque é assim que trabalhamos: marca, fotos, textos e fluxos pensados para o seu negócio, não um tema genérico.</p>
              <ul className="mt-5 space-y-2 text-[13px] font-semibold text-white/75">
                {["Identidade própria por projeto", "Agendamento, pedidos e filtros funcionais", "WhatsApp e conversão no centro", "Rápido, responsivo e otimizado"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" />{t}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex h-full flex-col justify-center rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 sm:p-10">
              <h3 className="text-xl font-extrabold">Sites · Landing Pages · Sistemas · SaaS · E-commerce</h3>
              <p className="mt-2 text-sm text-white/55">Nesta vitrine o foco é <b className="text-white">sites</b>. Mas a Suite Hub entrega o ecossistema completo.</p>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[["27", "demos navegáveis"], ["9", "segmentos"], ["3", "conceitos por segmento"]].map(([n, l]) => (
                  <div key={l} className="rounded-2xl border border-white/10 bg-[#0b1120] p-4"><p className="text-3xl font-black text-blue-400">{n}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/45">{l}</p></div>
                ))}
              </div>
              <Link to="/$segment" params={{ segment: "restaurante" }} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-[#070b16] transition hover:bg-blue-500 hover:text-white">
                Começar por Restaurantes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/25 via-[#0a1226] to-[#070b16] p-8 text-center sm:p-14">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-blue-600/25 blur-[100px]" />
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">Pronto para ter um site que vende por você?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">Mande uma mensagem agora e receba uma proposta com conceito personalizado para o seu segmento.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={SITE.waLink()} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-extrabold shadow-[0_16px_40px_rgba(37,99,235,.45)] transition hover:bg-blue-500">
                <MessageCircle className="h-4 w-4" /> Quero meu site — chamar no WhatsApp
              </a>
            </div>
            <p className="mt-4 text-[11px] text-white/35">{SITE.whatsappDisplay} · {SITE.email} · {SITE.instagramLabel}</p>
          </div>
        </Reveal>
      </section>

      <HubFooter />
    </div>
  );
}
