import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronDown, MessageCircle, Star, X, Zap } from "lucide-react";
import { SITE } from "@/data/suitehub/site";

/** Barra discreta de demonstração */
export function DemoBar({
  segmentName,
  brand,
  conceptId,
  siblings,
  segmentSlug,
  context,
}: {
  segmentName: string;
  brand: string;
  conceptId: string;
  siblings: string[];
  segmentSlug: string;
  context: string;
}) {
  return (
    <div className="sticky top-0 z-50 border-b border-black/10 bg-[#070b16]/95 text-white backdrop-blur">
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/$segment"
            params={{ segment: segmentSlug }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-bold text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Modelos</span>
            <span className="sm:hidden">Voltar</span>
          </Link>
          <span className="hidden truncate text-[11px] text-white/50 md:inline">
            DEMONSTRAÇÃO — SITE CONCEITUAL · {segmentName} · {brand}
          </span>
          <span className="truncate text-[11px] text-white/50 md:hidden">{brand}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1 sm:flex">
            {siblings.map((id) => (
              <Link
                key={id}
                to="/demo/$segment/$concept"
                params={{ segment: segmentSlug, concept: id }}
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                  id === conceptId
                    ? "bg-white text-black"
                    : "text-white/55 hover:bg-white/10 hover:text-white"
                }`}
              >
                {id}
              </Link>
            ))}
          </div>
          <span className="hidden items-center gap-1 text-[10px] font-semibold text-white/40 lg:inline-flex">
            <Zap className="h-3 w-3" /> Criado pela Suite Hub
          </span>
          <a
            href={SITE.waLink(context)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-blue-500"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Quero um assim
          </a>
        </div>
      </div>
    </div>
  );
}

export function DemoCTA({ context, dark = false }: { context: string; dark?: boolean }) {
  return (
    <section className={dark ? "bg-black px-4 py-14 text-center" : "bg-white px-4 py-14 text-center"}>
      <p className={`text-[11px] font-bold uppercase tracking-[0.22em] ${dark ? "text-white/40" : "text-black/40"}`}>
        Gostou dessa ideia?
      </p>
      <h3 className={`mx-auto mt-2 max-w-xl text-2xl font-extrabold tracking-tight sm:text-3xl ${dark ? "text-white" : "text-black"}`}>
        Podemos criar uma experiência como essa para a sua empresa.
      </h3>
      <a
        href={SITE.waLink(context)}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-extrabold text-white transition hover:bg-blue-500"
      >
        <MessageCircle className="h-4 w-4" /> Quero meu site
      </a>
    </section>
  );
}

export function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold tracking-tight text-neutral-900">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-neutral-600 transition hover:bg-neutral-200"
            aria-label="Fechar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-current" />
      ))}
    </span>
  );
}

/** Simulador de agendamento: Serviço → Profissional → Horário → Confirmação */
export function BookingSimulator({
  open,
  onClose,
  services,
  professionals,
  brand,
}: {
  open: boolean;
  onClose: () => void;
  services: { name: string; price: string }[];
  professionals: string[];
  brand: string;
}) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(services[0]?.name ?? "");
  const [pro, setPro] = useState(professionals[0] ?? "");
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);
  const times = ["09:00", "10:30", "13:00", "14:30", "16:00", "18:00", "19:30"];

  const reset = () => {
    setStep(0);
    setDone(false);
    setTime("");
    onClose();
  };

  return (
    <Modal open={open} onClose={reset} title={`Agendar — ${brand}`}>
      {!done ? (
        <div>
          <div className="mb-4 flex gap-1.5">
            {["Serviço", "Profissional", "Horário"].map((s, i) => (
              <span
                key={s}
                className={`flex-1 rounded-full px-2 py-1.5 text-center text-[11px] font-bold ${
                  step >= i ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
          {step === 0 && (
            <div className="grid gap-2">
              {services.map((s) => (
                <button
                  key={s.name}
                  onClick={() => {
                    setService(s.name);
                    setStep(1);
                  }}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                    service === s.name
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <span className="text-sm font-bold text-neutral-900">{s.name}</span>
                  <span className="text-sm font-extrabold text-neutral-600">{s.price}</span>
                </button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-2">
              {professionals.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPro(p);
                    setStep(2);
                  }}
                  className="rounded-2xl border border-neutral-200 p-4 text-left text-sm font-bold text-neutral-900 transition hover:border-neutral-900 hover:bg-neutral-50"
                >
                  {p}
                </button>
              ))}
              <button onClick={() => setStep(0)} className="mt-1 text-xs font-bold text-neutral-400">
                ← Voltar
              </button>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="grid grid-cols-3 gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`rounded-xl border py-3 text-sm font-extrabold transition ${
                      time === t
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-500"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                disabled={!time}
                onClick={() => setDone(true)}
                className="mt-4 w-full rounded-full bg-neutral-900 py-3.5 text-sm font-extrabold text-white transition disabled:opacity-30"
              >
                Confirmar agendamento
              </button>
              <button onClick={() => setStep(1)} className="mt-2 w-full text-xs font-bold text-neutral-400">
                ← Voltar
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-4 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="h-7 w-7" />
          </span>
          <h4 className="mt-3 text-lg font-extrabold text-neutral-900">
            Agendamento demonstrativo realizado!
          </h4>
          <p className="mt-1 text-sm text-neutral-500">
            {service} com {pro} às {time}. Em um site real, isso salvaria no sistema e enviaria
            confirmação no WhatsApp.
          </p>
          <button
            onClick={reset}
            className="mt-5 w-full rounded-full bg-neutral-900 py-3 text-sm font-bold text-white"
          >
            Fechar
          </button>
        </div>
      )}
    </Modal>
  );
}

export function Faq({ items, dark = false }: { items: { q: string; a: string }[]; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="grid gap-2.5">
      {items.map((f, i) => (
        <div
          key={f.q}
          className={`overflow-hidden rounded-2xl border transition ${
            dark ? "border-white/10 bg-white/[0.03]" : "border-neutral-200 bg-white"
          }`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className={`flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-bold ${
              dark ? "text-white" : "text-neutral-900"
            }`}
          >
            {f.q}
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <p className={`px-4 pb-4 text-[13px] leading-relaxed ${dark ? "text-white/60" : "text-neutral-500"}`}>
              {f.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
