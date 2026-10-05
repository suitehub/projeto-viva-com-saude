import { createFileRoute, notFound } from "@tanstack/react-router";
import { getConcept, getSegment } from "@/data/suitehub/segments";
import RestauranteDemo from "@/components/suitehub/demos-restaurante";
import { BarbeiroDemo, PsicologoDemo, SalaoDemo } from "@/components/suitehub/demos-beleza";
import { ImobiliariaDemo, VeiculosDemo } from "@/components/suitehub/demos-imoveis-auto";
import { AdvocaciaDemo, GasDemo, LavaCarDemo } from "@/components/suitehub/demos-servicos";

export const Route = createFileRoute("/demo/$segment/$concept")({
  head: ({ params }) => {
    const c = getConcept(params.segment, params.concept);
    const s = getSegment(params.segment);
    return {
      meta: [
        { title: c && s ? `${c.brand} — ${s.name} (Demo) · Suite Hub` : "Demonstração · Suite Hub" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: DemoPage,
});

function DemoPage() {
  const { segment, concept } = Route.useParams();
  const seg = getSegment(segment);
  const c = getConcept(segment, concept);
  if (!seg || !c) throw notFound();

  switch (segment) {
    case "restaurante":
      return <RestauranteDemo concept={concept} />;
    case "barbeiro":
      return <BarbeiroDemo concept={concept} />;
    case "cabeleireira":
      return <SalaoDemo concept={concept} />;
    case "psicologo":
      return <PsicologoDemo concept={concept} />;
    case "imobiliaria":
      return <ImobiliariaDemo concept={concept} />;
    case "veiculos":
      return <VeiculosDemo concept={concept} />;
    case "lava-car":
      return <LavaCarDemo concept={concept} />;
    case "advocacia":
      return <AdvocaciaDemo concept={concept} />;
    case "distribuidora-gas":
      return <GasDemo concept={concept} />;
    default:
      throw notFound();
  }
}
