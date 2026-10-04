export type UnitId = "aguias" | "fenix" | "stelar";

export interface Unit {
  id: UnitId;
  name: string;
  short: string;
  warcry: string;
  warcryFull: string;
  counselor: string;
  founded: string;
  history: string;
  color: string;
  glow: string;
  gradient: string;
  border: string;
  cover: string;
  icon: string;
  stats: { req: number; freq: number; events: number; uniform: number; points: number };
  rank: number;
}

export const UNITS: Unit[] = [
  {
    id: "aguias",
    name: "ÁGUIAS",
    short: "Águias",
    warcry: "Sempre prontos!",
    warcryFull: "ÁGUIAS VOAM ALTO!\nÁGUIAS NÃO TEMEM!",
    counselor: "João Silva",
    founded: "2022",
    history:
      "A Unidade Águias nasceu em 2022 com 6 desbravadores sonhadores e um conselheiro que acreditava que excelência é hábito. Desde a primeira reunião, adotamos o lema “Sempre prontos!” — prontos para servir, para aprender e para voar mais alto. Fomos a primeira unidade a completar 100% de presença em um trimestre, lideramos o acampamento de 2024 e mantemos até hoje a tradição do “Voo da Semana”, onde cada membro ensina algo novo para a unidade.",
    color: "#F5B82E",
    glow: "rgba(245,184,46,.35)",
    gradient: "from-[#3a2a08] via-[#1a130a] to-[#0a0f1a]",
    border: "border-amber-400/30",
    cover:
      "https://images.unsplash.com/photo-1611685434378-4f6b3b3b3b3b?auto=format&fit=crop&w=800&q=80",
    icon: "eagle",
    stats: { req: 91, freq: 94, events: 100, uniform: 90, points: 3016 },
    rank: 1,
  },
  {
    id: "fenix",
    name: "FÊNIX",
    short: "Fênix",
    warcry: "Renascer para servir",
    warcryFull: "DAS CINZAS, RENASCEMOS!\nFÊNIX PARA SERVIR!",
    counselor: "Maria Fernanda",
    founded: "2022",
    history:
      "A Unidade Fênix surgiu das cinzas de um pequeno grupo que quase fechou em 2022. Com resiliência e fé, renascemos mais fortes. Nosso símbolo é a fênix porque acreditamos que todo desafio é uma chance de recomeçar. Somos conhecidos pela criatividade nas missões, pela força nos acampamentos e pelo apoio incondicional entre membros. Ninguém fica para trás na Fênix.",
    color: "#FF6B35",
    glow: "rgba(255,90,40,.35)",
    gradient: "from-[#3d1208] via-[#1a0d0a] to-[#0a0f1a]",
    border: "border-orange-500/30",
    cover:
      "https://images.unsplash.com/photo-1547235001-d703406d3f17?auto=format&fit=crop&w=800&q=80",
    icon: "fenix",
    stats: { req: 82, freq: 87, events: 90, uniform: 84, points: 2810 },
    rank: 2,
  },
  {
    id: "stelar",
    name: "STELAR",
    short: "Stelar",
    warcry: "Brilhe por outros",
    warcryFull: "OLHE PARA O CÉU!\nSTELAR VAI BRILHAR!",
    counselor: "Carlos Oliveira",
    founded: "2023",
    history:
      "A Unidade Stelar é a mais jovem do Esquadrão do Céu, fundada em 2023. Inspirados nas estrelas, acreditamos que cada desbravador tem uma luz única. Nosso foco é astronomia, nós e especialidades de céu e natureza. Mesmo sendo a caçula, já conquistamos o prêmio de unidade mais unida em 2025 e seguimos subindo no ranking com dedicação e brilho próprio.",
    color: "#38BDF8",
    glow: "rgba(56,189,248,.35)",
    gradient: "from-[#0a1e3a] via-[#0a1226] to-[#050B11]",
    border: "border-sky-400/30",
    cover:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80",
    icon: "stelar",
    stats: { req: 74, freq: 80, events: 85, uniform: 78, points: 2255 },
    rank: 3,
  },
];

export interface Member {
  id: string;
  name: string;
  age: number;
  role: string;
  unit: UnitId;
  classe: string;
  progress: number;
  freq: number;
  events: number;
  uniform: number;
  points: number;
  award: "Ouro" | "Prata" | "Bronze";
  avatar: string;
  reqDone: number;
  reqTotal: number;
}

const faces = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&q=80",
];

export const MEMBERS: Member[] = [
  { id: "pedro", name: "Pedro Henrique", age: 13, role: "Desbravador", unit: "aguias", classe: "Pioneiro", progress: 86, freq: 92, events: 90, uniform: 95, points: 1240, award: "Ouro", avatar: faces[3], reqDone: 18, reqTotal: 21 },
  { id: "ana", name: "Ana Clara", age: 12, role: "Desbravadora", unit: "aguias", classe: "Pioneiro", progress: 78, freq: 88, events: 95, uniform: 90, points: 1080, award: "Prata", avatar: faces[1], reqDone: 16, reqTotal: 21 },
  { id: "joao", name: "João Pedro", age: 14, role: "Desbravador", unit: "aguias", classe: "Excursionista", progress: 73, freq: 85, events: 88, uniform: 70, points: 990, award: "Prata", avatar: faces[2], reqDone: 15, reqTotal: 21 },
  { id: "lucas", name: "Lucas Gabriel", age: 11, role: "Desbravador", unit: "aguias", classe: "Amigo", progress: 65, freq: 78, events: 80, uniform: 82, points: 840, award: "Bronze", avatar: faces[0], reqDone: 13, reqTotal: 21 },
  { id: "mari", name: "Mariana Santos", age: 13, role: "Desbravadora", unit: "aguias", classe: "Pioneiro", progress: 92, freq: 96, events: 100, uniform: 98, points: 1310, award: "Ouro", avatar: faces[4], reqDone: 19, reqTotal: 21 },
  { id: "rafa", name: "Rafael Lima", age: 15, role: "Capitão", unit: "aguias", classe: "Guia", progress: 95, freq: 98, events: 100, uniform: 100, points: 1420, award: "Ouro", avatar: faces[5], reqDone: 20, reqTotal: 21 },
  { id: "bia", name: "Beatriz Costa", age: 12, role: "Desbravadora", unit: "aguias", classe: "Companheiro", progress: 81, freq: 90, events: 92, uniform: 88, points: 1120, award: "Prata", avatar: faces[6], reqDone: 17, reqTotal: 21 },
  { id: "gui", name: "Guilherme Alves", age: 14, role: "Desbravador", unit: "aguias", classe: "Excursionista", progress: 69, freq: 82, events: 85, uniform: 75, points: 910, award: "Bronze", avatar: faces[8], reqDone: 14, reqTotal: 21 },
  { id: "f1", name: "Camila Rocha", age: 13, role: "Desbravadora", unit: "fenix", classe: "Pioneiro", progress: 84, freq: 89, events: 92, uniform: 86, points: 1180, award: "Prata", avatar: faces[7], reqDone: 17, reqTotal: 21 },
  { id: "f2", name: "Thiago Martins", age: 14, role: "Capitão", unit: "fenix", classe: "Excursionista", progress: 88, freq: 91, events: 94, uniform: 90, points: 1250, award: "Ouro", avatar: faces[10], reqDone: 18, reqTotal: 21 },
  { id: "f3", name: "Larissa Melo", age: 12, role: "Desbravadora", unit: "fenix", classe: "Companheiro", progress: 76, freq: 84, events: 86, uniform: 80, points: 1020, award: "Prata", avatar: faces[9], reqDone: 16, reqTotal: 21 },
  { id: "f4", name: "Felipe Santos", age: 11, role: "Desbravador", unit: "fenix", classe: "Amigo", progress: 62, freq: 76, events: 78, uniform: 72, points: 800, award: "Bronze", avatar: faces[11], reqDone: 13, reqTotal: 21 },
  { id: "f5", name: "Julia Pereira", age: 13, role: "Desbravadora", unit: "fenix", classe: "Pioneiro", progress: 79, freq: 86, events: 88, uniform: 84, points: 1090, award: "Prata", avatar: faces[4], reqDone: 16, reqTotal: 21 },
  { id: "f6", name: "Matheus Souza", age: 15, role: "Desbravador", unit: "fenix", classe: "Guia", progress: 90, freq: 93, events: 95, uniform: 92, points: 1300, award: "Ouro", avatar: faces[5], reqDone: 19, reqTotal: 21 },
  { id: "f7", name: "Sofia Lima", age: 12, role: "Desbravadora", unit: "fenix", classe: "Companheiro", progress: 71, freq: 82, events: 84, uniform: 78, points: 960, award: "Bronze", avatar: faces[1], reqDone: 15, reqTotal: 21 },
  { id: "f8", name: "Enzo Ferrari", age: 14, role: "Desbravador", unit: "fenix", classe: "Excursionista", progress: 68, freq: 80, events: 82, uniform: 76, points: 900, award: "Bronze", avatar: faces[0], reqDone: 14, reqTotal: 21 },
  { id: "s1", name: "Helena Dias", age: 12, role: "Desbravadora", unit: "stelar", classe: "Companheiro", progress: 77, freq: 82, events: 86, uniform: 80, points: 1040, award: "Prata", avatar: faces[6], reqDone: 16, reqTotal: 21 },
  { id: "s2", name: "Davi Oliveira", age: 13, role: "Capitão", unit: "stelar", classe: "Pioneiro", progress: 82, freq: 86, events: 88, uniform: 84, points: 1140, award: "Prata", avatar: faces[2], reqDone: 17, reqTotal: 21 },
  { id: "s3", name: "Alice Barbosa", age: 11, role: "Desbravadora", unit: "stelar", classe: "Amigo", progress: 64, freq: 74, events: 78, uniform: 70, points: 820, award: "Bronze", avatar: faces[7], reqDone: 13, reqTotal: 21 },
  { id: "s4", name: "Miguel Torres", age: 14, role: "Desbravador", unit: "stelar", classe: "Excursionista", progress: 70, freq: 79, events: 82, uniform: 74, points: 940, award: "Bronze", avatar: faces[3], reqDone: 14, reqTotal: 21 },
  { id: "s5", name: "Laura Mendes", age: 13, role: "Desbravadora", unit: "stelar", classe: "Pioneiro", progress: 75, freq: 81, events: 84, uniform: 79, points: 1010, award: "Prata", avatar: faces[9], reqDone: 15, reqTotal: 21 },
  { id: "s6", name: "Gabriel Reis", age: 15, role: "Desbravador", unit: "stelar", classe: "Guia", progress: 87, freq: 89, events: 90, uniform: 88, points: 1210, award: "Ouro", avatar: faces[8], reqDone: 18, reqTotal: 21 },
  { id: "s7", name: "Valentina Cruz", age: 12, role: "Desbravadora", unit: "stelar", classe: "Companheiro", progress: 66, freq: 77, events: 80, uniform: 72, points: 860, award: "Bronze", avatar: faces[4], reqDone: 13, reqTotal: 21 },
  { id: "s8", name: "Nicolas Prado", age: 11, role: "Desbravador", unit: "stelar", classe: "Amigo", progress: 60, freq: 72, events: 75, uniform: 68, points: 780, award: "Bronze", avatar: faces[11], reqDone: 12, reqTotal: 21 },
];

export const REQ_INDIVIDUAIS = [
  "Conhecer o voto e a lei",
  "Estudar os ideais dos Desbravadores",
  "Completar atividades de companheirismo",
  "Completar especialidade de nós e amarras",
  "Participar de 5 reuniões",
  "Ler 3 livros espirituais",
  "Completar especialidade de Primeiros Socorros",
  "Participar de um acampamento",
  "Decore 10 versículos",
  "Completar especialidade de arte de acampar",
  "Participar de caminhada ecológica",
  "Apresentar relatório de leitura bíblica",
  "Completar especialidade de astronomia",
  "Participar de investidura",
  "Ajudar em ação solidária",
  "Completar especialidade de culinária",
  "Passar em inspeção de fardamento",
  "Participar de olimpíadas do clube",
  "Completar especialidade de primeiros socorros II",
  "Liderar um momento devocional",
  "Completar classe Pioneiro",
];

export const REQ_UNIDADE = [
  "Todos presentes em reunião mensal",
  "Unidade completa uniformizada",
  "Completar missão da temporada",
  "Participar de acampamento com 100%",
  "Apresentar grito de guerra",
  "Organizar ação comunitária",
  "Manter frequência acima de 85%",
  "Completar especialidade em grupo",
  "Atualizar história da unidade",
  "Enviar fotos para galeria",
];

export const REQ_CONSELHEIRO = [
  "Plano trimestral entregue",
  "Chamada registrada em todas reuniões",
  "Reunião com pais realizada",
  "Relatório de progresso mensal",
  "Participar de capacitação",
  "Acompanhar especialidades",
];

export interface ClubEvent {
  id: string;
  name: string;
  date: string;
  day: string;
  month: string;
  time: string;
  place: string;
  type: string;
  color: string;
  points: number;
  units: UnitId[];
}

export const EVENTS: ClubEvent[] = [
  { id: "e1", name: "Reunião regular", date: "05 OUT 2026", day: "05", month: "OUT", time: "19:00 - 21:00", place: "IASD Central", type: "Reunião", color: "#38BDF8", points: 100, units: ["aguias", "fenix", "stelar"] },
  { id: "e2", name: "Acampamento", date: "10 OUT 2026", day: "10", month: "OUT", time: "08:00 - Parque Municipal", place: "Parque Municipal", type: "Acampamento", color: "#35D07F", points: 300, units: ["aguias", "fenix", "stelar"] },
  { id: "e3", name: "Investidura", date: "17 OUT 2026", day: "17", month: "OUT", time: "19:00 - IASD Central", place: "IASD Central", type: "Investidura", color: "#A78BFA", points: 200, units: ["aguias", "fenix", "stelar"] },
  { id: "e4", name: "Caminhada", date: "24 OUT 2026", day: "24", month: "OUT", time: "07:00 - Trilha da Serra", place: "Trilha da Serra", type: "Caminhada", color: "#94A3B8", points: 150, units: ["aguias", "fenix"] },
  { id: "e5", name: "Ação solidária", date: "31 OUT 2026", day: "31", month: "OUT", time: "09:00 - Praça Central", place: "Praça Central", type: "Evento externo", color: "#F5B82E", points: 250, units: ["fenix", "stelar"] },
];

export interface Mission {
  id: string;
  title: string;
  desc: string;
  reward: number;
  status: "Em andamento" | "Concluída" | "Nova";
  scope: "Unidade" | "Individual";
  unit?: UnitId;
  progress: number;
}

export const MISSIONS: Mission[] = [
  { id: "m1", title: "Unidade completa", desc: "Todos os membros presentes na próxima reunião.", reward: 150, status: "Em andamento", scope: "Unidade", unit: "aguias", progress: 80 },
  { id: "m2", title: "Todos uniformizados", desc: "100% da unidade com fardamento completo no próximo evento.", reward: 200, status: "Em andamento", scope: "Unidade", unit: "fenix", progress: 60 },
  { id: "m3", title: "Concluir especialidade", desc: "Concluir especialidade de Primeiros Socorros.", reward: 50, status: "Nova", scope: "Individual", progress: 30 },
  { id: "m4", title: "Grito de guerra perfeito", desc: "Apresentar o grito de guerra sem erros na investidura.", reward: 120, status: "Concluída", scope: "Unidade", unit: "stelar", progress: 100 },
  { id: "m5", title: "Frequência máxima", desc: "Manter 95% de frequência no mês.", reward: 180, status: "Em andamento", scope: "Unidade", unit: "aguias", progress: 70 },
];

export const GALLERY = [
  { id: "g1", url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80", tag: "Acampamento", unit: "Clube" },
  { id: "g2", url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80", tag: "Acampamento", unit: "Águias" },
  { id: "g3", url: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=600&q=80", tag: "Caminhada", unit: "Fênix" },
  { id: "g4", url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80", tag: "Investidura", unit: "Stelar" },
  { id: "g5", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80", tag: "Caminhada", unit: "Clube" },
  { id: "g6", url: "https://images.unsplash.com/photo-1501554728187-ce583db33af7?auto=format&fit=crop&w=600&q=80", tag: "Reunião", unit: "Águias" },
  { id: "g7", url: "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?auto=format&fit=crop&w=600&q=80", tag: "Acampamento", unit: "Fênix" },
  { id: "g8", url: "https://images.unsplash.com/photo-1478827536114-da961b7f86d2?auto=format&fit=crop&w=600&q=80", tag: "Investidura", unit: "Clube" },
];

export const FREQ_HISTORY = [
  { d: "01/09", v: 82 },
  { d: "08/09", v: 76 },
  { d: "15/09", v: 91 },
  { d: "22/09", v: 87 },
  { d: "29/09", v: 94 },
];
