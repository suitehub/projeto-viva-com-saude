export type SegmentSlug =
  | "restaurante"
  | "barbeiro"
  | "cabeleireira"
  | "psicologo"
  | "imobiliaria"
  | "veiculos"
  | "lava-car"
  | "advocacia"
  | "distribuidora-gas";

export interface DemoConcept {
  id: "01" | "02" | "03";
  name: string;
  brand: string;
  strategy: string;
  description: string;
  features: string[];
  accent: string;
  image: string;
}

export interface Segment {
  slug: SegmentSlug;
  name: string;
  pageTitle: string;
  tagline: string;
  description: string;
  icon: string;
  gradient: string;
  image: string;
  concepts: DemoConcept[];
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const SEGMENTS: Segment[] = [
  {
    slug: "restaurante",
    name: "Restaurantes",
    pageTitle: "Sites para Restaurantes",
    tagline: "Transforme visitantes em pedidos — sem depender de apps de delivery.",
    description:
      "Três formas diferentes de transformar seu restaurante em uma experiência digital: premium, conversão rápida e marca afetiva.",
    icon: "utensils",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    image: img("photo-1414235077428-338989a2e8c0", 900),
    concepts: [
      {
        id: "01",
        name: "Premium Gastronômico",
        brand: "Casa Nostra",
        strategy: "Experiência premium",
        description:
          "Fotografia grande, tipografia elegante e reserva sofisticada. Para restaurantes que vendem atmosfera.",
        features: ["Cardápio editorial", "Reserva de mesa", "Menu degustação"],
        accent: "#c9a24b",
        image: img("photo-1414235077428-338989a2e8c0", 900),
      },
      {
        id: "02",
        name: "Urbano / Moderno",
        brand: "Brasa & Rua",
        strategy: "Conversão e pedidos",
        description:
          "Pedido em poucos cliques, delivery próprio e cardápio rápido. Para vender muito no almoço e no jantar.",
        features: ["Pedido online", "Delivery próprio", "Combos e promoções"],
        accent: "#ff3d00",
        image: img("photo-1565299624946-b28f40a0ae38", 900),
      },
      {
        id: "03",
        name: "Familiar / Acolhedor",
        brand: "Cantina da Vó",
        strategy: "Marca e relacionamento",
        description:
          "Clima afetivo, história da família e avaliações. Para casas que fidelizam pelo coração.",
        features: ["História da casa", "Pratos da família", "Avaliações e localização"],
        accent: "#2f7d4f",
        image: img("photo-1517248135467-4c7edcad34c4", 900),
      },
    ],
  },
  {
    slug: "barbeiro",
    name: "Barbearias",
    pageTitle: "Sites para Barbearias",
    tagline: "Agenda cheia, sem depender de telefone e direct.",
    description:
      "Três estratégias: autoridade premium, cultura street e minimalismo focado no profissional.",
    icon: "scissors",
    gradient: "from-zinc-500/20 via-neutral-500/10 to-transparent",
    image: img("photo-1585747860715-2ba37e788b70", 900),
    concepts: [
      {
        id: "01",
        name: "Barber Shop Premium",
        brand: "Barber Club 91",
        strategy: "Autoridade e ticket alto",
        description: "Masculino, sofisticado, com agendamento por barbeiro e planos de assinatura.",
        features: ["Agendamento por barbeiro", "Planos mensais", "Galeria de cortes"],
        accent: "#b08d3e",
        image: img("photo-1585747860715-2ba37e788b70", 900),
      },
      {
        id: "02",
        name: "Street / Urbano",
        brand: "CORTE FIRME",
        strategy: "Movimento e comunidade",
        description: "Jovem, ousado, com marquee, drops e agendamento relâmpago.",
        features: ["Agendamento rápido", "Drops e eventos", "Feed estilo Instagram"],
        accent: "#d4ff3f",
        image: img("photo-1503951914875-452dadb0f02f", 900),
      },
      {
        id: "03",
        name: "Minimalista",
        brand: "Rafa Prates",
        strategy: "Profissional autoral",
        description: "Extremamente limpo, focado no barbeiro, preço claro e WhatsApp direto.",
        features: ["Perfil do profissional", "Tabela de preços", "Agendar no WhatsApp"],
        accent: "#111111",
        image: img("photo-1621605815971-fbc98d665033", 900),
      },
    ],
  },
  {
    slug: "cabeleireira",
    name: "Beleza & Salão",
    pageTitle: "Sites para Salões",
    tagline: "Beleza que se vê no site e se prova na cadeira.",
    description: "Luxo editorial, modernidade feminina e boutique intimista.",
    icon: "sparkles",
    gradient: "from-rose-400/20 via-pink-500/10 to-transparent",
    image: img("photo-1560066984-138dadb4c035", 900),
    concepts: [
      {
        id: "01",
        name: "Luxury Beauty",
        brand: "Maison Lumière",
        strategy: "Premium e sofisticado",
        description: "Editorial de moda, antes/depois e concierge de agendamento.",
        features: ["Portfólio editorial", "Antes e depois", "Concierge de agenda"],
        accent: "#a67c52",
        image: img("photo-1560066984-138dadb4c035", 900),
      },
      {
        id: "02",
        name: "Modern Beauty",
        brand: "Studio Glow",
        strategy: "Moderno e editorial",
        description: "Colorido leve, serviços por categoria e agendamento por horário livre.",
        features: ["Catálogo de serviços", "Horários livres", "Depoimentos"],
        accent: "#ec4899",
        image: img("photo-1522337660859-02fbefca4702", 900),
      },
      {
        id: "03",
        name: "Boutique",
        brand: "Ateliê Marina",
        strategy: "Delicado e intimista",
        description: "Atendimento intimista, poucas vagas por dia e conversa no WhatsApp.",
        features: ["Atendimento intimista", "Poucas vagas/dia", "Contato direto"],
        accent: "#7c6a5a",
        image: img("photo-1487412947147-5cebf100ffc2", 900),
      },
    ],
  },
  {
    slug: "psicologo",
    name: "Psicologia",
    pageTitle: "Sites para Psicólogos",
    tagline: "Confiança e acolhimento antes da primeira sessão.",
    description: "Clínico premium, humanizado leve e moderno tecnológico. Nada de cara de template médico.",
    icon: "brain",
    gradient: "from-teal-400/20 via-emerald-500/10 to-transparent",
    image: img("photo-1506126613408-eca07ce68773", 900),
    concepts: [
      {
        id: "01",
        name: "Clínico Premium",
        brand: "Dra. Helena Prado",
        strategy: "Credibilidade e ética",
        description: "Sofisticado, com abordagem, CRP, especialidades e agendamento de primeira conversa.",
        features: ["Abordagem e CRP", "Especialidades", "Presencial + online"],
        accent: "#0e4d4a",
        image: img("photo-1573497019940-1c28c88b4f3e", 900),
      },
      {
        id: "02",
        name: "Humanizado",
        brand: "Espaço Acolher",
        strategy: "Acolhimento e leveza",
        description: "Tons suaves, linguagem simples, FAQ que abraça e CTA gentil.",
        features: ["Para quem é", "Como funciona", "Perguntas frequentes"],
        accent: "#d9a679",
        image: img("photo-1493836512294-502baa1986e2", 900),
      },
      {
        id: "03",
        name: "Moderno",
        brand: "mente.livre",
        strategy: "Minimalista e digital",
        description: "Terapia online-first, agendamento em 3 passos e design tecnológico calmo.",
        features: ["Online-first", "Agendar em 3 passos", "Planos e valores"],
        accent: "#4f46e5",
        image: img("photo-1506126613408-eca07ce68773", 900),
      },
    ],
  },
  {
    slug: "imobiliaria",
    name: "Imobiliárias",
    pageTitle: "Sites para Imobiliárias",
    tagline: "O imóvel é o protagonista. O site vende a visita.",
    description: "Luxo editorial, marketplace funcional e regional confiável.",
    icon: "building",
    gradient: "from-sky-500/20 via-blue-600/10 to-transparent",
    image: img("photo-1600596542815-ffad4c1539a9", 900),
    concepts: [
      {
        id: "01",
        name: "Luxury",
        brand: "Alto Vale",
        strategy: "Alto padrão editorial",
        description: "Casas de alto padrão com galeria imersiva e atendimento private.",
        features: ["Curadoria alto padrão", "Galeria imersiva", "Atendimento private"],
        accent: "#0a0a0a",
        image: img("photo-1600596542815-ffad4c1539a9", 900),
      },
      {
        id: "02",
        name: "Marketplace",
        brand: "LarGO",
        strategy: "Busca e conversão",
        description: "Busca com filtros, cards de imóveis e página individual com agendar visita.",
        features: ["Busca + filtros", "Página do imóvel", "Agendar visita"],
        accent: "#2563eb",
        image: img("photo-1568605114967-8130f3a36994", 900),
      },
      {
        id: "03",
        name: "Regional",
        brand: "Casa & Terra",
        strategy: "Proximidade e confiança",
        description: "Imobiliária de bairro, corretor com nome e WhatsApp, linguagem próxima.",
        features: ["Time local", "Bairros atendidos", "Falar com corretor"],
        accent: "#15803d",
        image: img("photo-1600585154340-be6161a56a0c", 900),
      },
    ],
  },
  {
    slug: "veiculos",
    name: "Automóveis",
    pageTitle: "Sites para Lojas de Carros",
    tagline: "Estoque que parece concessionária grande.",
    description: "Premium, performance agressiva e seminovos focados em conversão.",
    icon: "car",
    gradient: "from-red-500/20 via-orange-600/10 to-transparent",
    image: img("photo-1492144534655-ae79c964c9d7", 900),
    concepts: [
      {
        id: "01",
        name: "Premium",
        brand: "Prime Motors",
        strategy: "Concessionária alto padrão",
        description: "Estoque premium, detalhes técnicos e simulação de financiamento elegante.",
        features: ["Estoque premium", "Ficha técnica", "Simular financiamento"],
        accent: "#0b0b0c",
        image: img("photo-1503376780353-7e6692767b70", 900),
      },
      {
        id: "02",
        name: "Performance",
        brand: "APEX GARAGE",
        strategy: "Agressivo e tecnológico",
        description: "Visual dark neon, 0-100, potência e CTA de proposta imediata.",
        features: ["Foco em performance", "Comparar modelos", "Proposta imediata"],
        accent: "#ff2d20",
        image: img("photo-1492144534655-ae79c964c9d7", 900),
      },
      {
        id: "03",
        name: "Seminovos",
        brand: "Bom Negócio",
        strategy: "Confiança e conversão",
        description: "Preço claro, histórico, troca com troco e WhatsApp sempre visível.",
        features: ["Aprovado na perícia", "Troca com troco", "Parcelas claras"],
        accent: "#0e76bc",
        image: img("photo-1555215695-3004980ad54e", 900),
      },
    ],
  },
  {
    slug: "lava-car",
    name: "Lava-Car",
    pageTitle: "Sites para Lava-Car",
    tagline: "Reserva moderna para um serviço clássico.",
    description: "Detailing premium, speed wash jovem e clean tecnológico.",
    icon: "droplets",
    gradient: "from-cyan-400/20 via-sky-500/10 to-transparent",
    image: img("photo-1607860108855-64acf2078b60", 900),
    concepts: [
      {
        id: "01",
        name: "Premium Detailing",
        brand: "Studio Detail",
        strategy: "Sofisticação técnica",
        description: "Detailing como estética automotiva, com pacotes por nível e antes/depois.",
        features: ["Pacotes por nível", "Antes e depois", "Agendar avaliação"],
        accent: "#0a0f1e",
        image: img("photo-1607860108855-64acf2078b60", 900),
      },
      {
        id: "02",
        name: "Speed Wash",
        brand: "LAVA FLASH",
        strategy: "Rápido e jovem",
        description: "Lavagem express, fila em tempo real (simulada) e combos mensais.",
        features: ["Lavagem express", "Combos mensais", "Reserva em 30s"],
        accent: "#facc15",
        image: img("photo-1558618666-fcd25c85cd64", 900),
      },
      {
        id: "03",
        name: "Clean Minimal",
        brand: "puro.lava",
        strategy: "Limpo e tecnológico",
        description: "Reserva por serviço → horário → placa. Extremamente simples.",
        features: ["Escolha o serviço", "Escolha o horário", "Pagamento na retirada"],
        accent: "#06b6d4",
        image: img("photo-1605559424843-9e4c228bf1c2", 900),
      },
    ],
  },
  {
    slug: "advocacia",
    name: "Advocacia",
    pageTitle: "Sites para Advocacia",
    tagline: "Autoridade que se lê em 5 segundos.",
    description: "Tradicional premium, boutique elegante e digital law tecnológica — sem perder seriedade.",
    icon: "scale",
    gradient: "from-amber-600/20 via-yellow-700/10 to-transparent",
    image: img("photo-1589829545856-d10d557cf95f", 900),
    concepts: [
      {
        id: "01",
        name: "Tradicional Premium",
        brand: "Moretti & Salles",
        strategy: "Institucional sofisticado",
        description: "Escritório clássico, áreas de atuação, sócios e artigos.",
        features: ["Áreas de atuação", "Sócios", "Artigos e FAQ"],
        accent: "#1a2340",
        image: img("photo-1505664194779-8beaceb93744", 900),
      },
      {
        id: "02",
        name: "Boutique Jurídica",
        brand: "Lina Duarte",
        strategy: "Moderno e elegante",
        description: "Advocacia boutique, atendimento personalizado e agendar conversa.",
        features: ["Atendimento boutique", "Casos e resultados", "Agendar conversa"],
        accent: "#5b4a3a",
        image: img("photo-1521791136064-7986c2920216", 900),
      },
      {
        id: "03",
        name: "Digital Law",
        brand: "lex.digital",
        strategy: "Tecnológico e direto",
        description: "Diagnóstico online, WhatsApp jurídico e conteúdo que converte.",
        features: ["Diagnóstico online", "Atendimento remoto", "Conteúdo direto"],
        accent: "#00c2a8",
        image: img("photo-1589829545856-d10d557cf95f", 900),
      },
    ],
  },
  {
    slug: "distribuidora-gas",
    name: "Gás & Delivery",
    pageTitle: "Sites para Distribuidoras de Gás",
    tagline: "Pedido em 30 segundos. Conversão acima de tudo.",
    description: "Pedido ultrarrápido, delivery moderno e regional confiável.",
    icon: "flame",
    gradient: "from-orange-500/25 via-red-600/10 to-transparent",
    image: img("photo-1556911220-bff31c812dba", 900),
    concepts: [
      {
        id: "01",
        name: "Pedido em 30s",
        brand: "Gás Já",
        strategy: "Velocidade extrema",
        description: "Um produto, um botão, endereço e pagamento. Sem fricção.",
        features: ["Botão pedir agora", "Entrega + retirada", "Pagamento na entrega"],
        accent: "#e8590c",
        image: img("photo-1556911220-bff31c812dba", 900),
      },
      {
        id: "02",
        name: "Delivery Moderno",
        brand: "fogão.em.casa",
        strategy: "App-like e moderno",
        description: "Visual de delivery moderno, combos (gás + água), acompanhamento simulado.",
        features: ["Cardápio de produtos", "Combos", "Acompanhar pedido"],
        accent: "#7c3aed",
        image: img("photo-1600320254374-ce2d293c324e", 900),
      },
      {
        id: "03",
        name: "Regional",
        brand: "Gás da Família",
        strategy: "Comercial e familiar",
        description: "Distribuidora de bairro, preço do dia, horário e WhatsApp gigante.",
        features: ["Preço do dia", "Horário de entrega", "WhatsApp gigante"],
        accent: "#1971c2",
        image: img("photo-1587293852726-70cdb56c2866", 900),
      },
    ],
  },
];

export function getSegment(slug: string): Segment | undefined {
  return SEGMENTS.find((s) => s.slug === slug);
}

export function getConcept(slug: string, concept: string): DemoConcept | undefined {
  return getSegment(slug)?.concepts.find((c) => c.id === concept);
}
