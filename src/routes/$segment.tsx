import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getSegment } from "@/data/suitehub/segments";
import { HubFooter, HubNavbar, ConceptCard, Reveal } from "@/components/suitehub/hub-chrome";

export const Route = createFileRoute("/$segment")({
  head: ({ params }) => {
    const seg = getSegment(params.segment);
    return {
      meta: [
        { title: seg ? `${seg.pageTitle} — Suite Hub` : "Segmento — Suite Hub" },
        { name: "description", content: seg?.description ?? "" },
      ],
    };
  },
  component: SegmentPage,
});

function SegmentPage() {
  const { segment: slug } = Route.useParams();
  const seg = getSegment(slug);
  if (!seg) throw notFound();

  return (
    <div className="min-h-screen bg-[#070b16] font-sans text-white antialiased">
      <HubNavbar />
      <section className="relative overflow-hidden pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-b ${seg.gradient}`} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] font-bold text-white/70 transition hover:border-white/30 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> Todas as vitrines
            </Link>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-400">
              Vitrine · {seg.name}
            </p>
            <h1 className="mt-2 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              {seg.pageTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
              {seg.description}
            </p>
            <p className="mt-2 text-sm font-semibold text-white/40">{seg.tagline}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 pb-16 md:grid-cols-3">
            {seg.concepts.map((c, i) => (
              <Reveal key={c.id} delay={i * 100}>
                <ConceptCard segmentSlug={seg.slug} concept={c} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mb-16 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:p-8">
              <div>
                <h2 className="text-xl font-extrabold">Não decidiu entre os 3?</h2>
                <p className="mt-1 text-sm text-white/55">Abra cada um, navegue e compare. Depois chame a Suite Hub com o seu favorito.</p>
              </div>
              <Link
                to="/demo/$segment/$concept"
                params={{ segment: seg.slug, concept: seg.concepts[0].id }}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-extrabold transition hover:bg-blue-500"
              >
                Começar pelo Modelo 01 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <HubFooter />
    </div>
  );
}
