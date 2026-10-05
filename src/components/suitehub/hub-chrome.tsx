import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Building2,
  Car,
  Droplets,
  Flame,
  Menu,
  MessageCircle,
  Scale,
  Scissors,
  Sparkles,
  UtensilsCrossed,
  X,
  Zap,
} from "lucide-react";
import { SITE } from "@/data/suitehub/site";
import type { DemoConcept, Segment } from "@/data/suitehub/segments";

export const ICONS: Record<string, typeof UtensilsCrossed> = {
  utensils: UtensilsCrossed,
  scissors: Scissors,
  sparkles: Sparkles,
  brain: Brain,
  building: Building2,
  car: Car,
  droplets: Droplets,
  scale: Scale,
  flame: Flame,
};

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function HubNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "border-b border-white/10 bg-[#070b16]/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-[0_8px_24px_rgba(37,99,235,.45)]">
            <Zap className="h-5 w-5" />
          </span>
          <span className="leading-none">
            <span className="block text-[15px] font-extrabold tracking-tight text-white">
              Suite Hub
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300/80">
              Showroom digital
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-[13px] font-semibold text-white/70 md:flex">
          <Link to="/" className="transition hover:text-white">
            Vitrine
          </Link>
          <a href="/#segmentos" className="transition hover:text-white">
            Segmentos
          </a>
          <a href="/#como-funciona" className="transition hover:text-white">
            Como funciona
          </a>
          <a href="/#contato" className="transition hover:text-white">
            Contato
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={SITE.waLink()}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-[13px] font-bold text-white transition hover:bg-blue-500 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" /> Quero meu site
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white md:hidden"
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-white/10 bg-[#070b16]/95 px-4 py-4 backdrop-blur-xl md:hidden">
          {[
            ["Vitrine", "/"],
            ["Segmentos", "/#segmentos"],
            ["Como funciona", "/#como-funciona"],
            ["Contato", "/#contato"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-3 text-sm font-semibold text-white/85 last:border-0"
            >
              {label}
            </a>
          ))}
          <a
            href={SITE.waLink()}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-bold text-white"
          >
            <MessageCircle className="h-4 w-4" /> Quero meu site
          </a>
        </nav>
      )}
    </header>
  );
}

export function HubFooter() {
  return (
    <footer id="contato" className="border-t border-white/10 bg-[#05080f]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
              <Zap className="h-5 w-5" />
            </span>
            <span className="text-[15px] font-extrabold text-white">Suite Hub</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            Criamos sites, landing pages, sistemas e e-commerces que transmitem valor e geram
            contato. Esta vitrine é uma demonstração do que podemos fazer pela sua empresa.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
            Vitrine
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><a href="/#segmentos" className="hover:text-white">Segmentos</a></li>
            <li><a href="/#como-funciona" className="hover:text-white">Como funciona</a></li>
            <li><a href="/restaurante" className="hover:text-white">Exemplo: Restaurantes</a></li>
            <li><a href="/imobiliaria" className="hover:text-white">Exemplo: Imobiliárias</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Serviços</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>Sites institucionais</li>
            <li>Landing pages</li>
            <li>E-commerce & SaaS</li>
            <li>Sistemas sob medida</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h4 className="text-sm font-bold text-white">Fale com a Suite Hub</h4>
          <p className="mt-1 text-[13px] text-white/55">
            Resposta rápida no WhatsApp. {SITE.whatsappDisplay} · {SITE.email}
          </p>
          <a
            href={SITE.waLink()}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-400"
          >
            <MessageCircle className="h-4 w-4" /> Chamar no WhatsApp
          </a>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-1 text-[12px] font-semibold text-white/50 hover:text-white"
          >
            Instagram {SITE.instagramLabel} <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 Suite Hub — Vitrine conceitual. Marcas das demos são fictícias.</span>
          <span>Demonstrações navegáveis. Nenhum dado real é coletado.</span>
        </div>
      </div>
    </footer>
  );
}

export function SegmentCard({ segment, index }: { segment: Segment; index: number }) {
  const Icon = ICONS[segment.icon] ?? Sparkles;
  return (
    <Reveal delay={(index % 3) * 90}>
      <Link
        to="/$segment"
        params={{ segment: segment.slug }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/40 hover:shadow-[0_24px_60px_rgba(37,99,235,.25)]"
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={segment.image}
            alt={segment.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/30 to-transparent" />
          <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-black/45 text-white backdrop-blur">
            <Icon className="h-5 w-5" />
          </span>
          <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
            3 modelos
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-extrabold tracking-tight text-white">{segment.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-white/55">
            {segment.tagline}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-400 transition group-hover:gap-2.5 group-hover:text-blue-300">
            Explorar <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function ConceptCard({
  segmentSlug,
  concept,
}: {
  segmentSlug: string;
  concept: DemoConcept;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-white/25">
      <div className="relative h-56 overflow-hidden sm:h-64">
        <img
          src={concept.image}
          alt={concept.brand}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-transparent to-transparent" />
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white"
          style={{ background: concept.accent }}
        >
          Modelo {concept.id}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300/80">
          {concept.strategy}
        </p>
        <h3 className="mt-1 text-xl font-extrabold tracking-tight text-white">
          {concept.name} — {concept.brand}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{concept.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {concept.features.map((f) => (
            <li
              key={f}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-white/70"
            >
              {f}
            </li>
          ))}
        </ul>
        <Link
          to="/demo/$segment/$concept"
          params={{ segment: segmentSlug, concept: concept.id }}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#070b16] transition hover:bg-blue-500 hover:text-white"
        >
          Ver demonstração <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function FinalCTA({ context }: { context: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/25 via-[#0a1226] to-[#070b16] p-8 text-center sm:p-14">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-blue-600/25 blur-[100px]" />
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-300">
            Demonstração conceitual
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Gostou dessa ideia? Podemos criar uma experiência assim para a sua empresa.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60">
            Isso é apenas uma amostra. Cada projeto Suite Hub é personalizado: marca, fotos,
            textos, integrações e identidade próprias.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={SITE.waLink(context)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_40px_rgba(37,99,235,.45)] transition hover:bg-blue-500"
            >
              <MessageCircle className="h-4 w-4" /> Quero meu site
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Voltar para a vitrine
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
