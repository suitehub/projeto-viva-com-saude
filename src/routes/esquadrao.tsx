import { createFileRoute } from "@tanstack/react-router";
import EsquadraoApp from "@/esquadrao/app";

export const Route = createFileRoute("/esquadrao")({
  head: () => ({
    meta: [
      { title: "Esquadrão do Céu — Sistema do Clube" },
      { name: "description", content: "Protótipo navegável do sistema de gestão do Clube Esquadrão do Céu: unidades Águias, Fênix e Stelar." },
    ],
  }),
  component: EsquadraoApp,
});
