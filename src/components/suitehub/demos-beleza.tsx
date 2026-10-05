import { useState, type ReactNode } from "react";
import { Clock, Instagram, MapPin, MessageCircle } from "lucide-react";
import { BookingSimulator, DemoBar, DemoCTA, Faq, Stars } from "@/components/suitehub/demo-ui";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ================= BARBEIRO ================= */
function BarberPremium() {
  const [book, setBook] = useState(false);
  return (
    <div className="min-h-screen bg-[#0d0d0f] font-sans text-[#ece7dd]">
      <DemoBar segmentName="Barbearia" brand="Barber Club 91" conceptId="01" siblings={["01","02","03"]} segmentSlug="barbeiro" context="Barbearia — Barber Club 91" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="text-lg font-black tracking-[0.24em]">BARBER CLUB 91</span>
        <button onClick={() => setBook(true)} className="rounded-none border border-[#b08d3e] px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.2em] text-[#d8b96a] hover:bg-[#b08d3e] hover:text-black">Agendar</button>
      </nav>
      <header className="relative"><img src={img("photo-1585747860715-2ba37e788b70")} alt="Barbearia" className="h-[70vh] w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-black/50" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-5 pb-12 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#d8b96a]">Corte · Barba · Ritual</p>
          <h1 className="mt-2 text-5xl font-black tracking-tight sm:text-6xl">Onde homem vira cavalheiro.</h1>
          <button onClick={() => setBook(true)} className="mt-6 bg-[#b08d3e] px-8 py-3.5 text-[13px] font-black uppercase tracking-[0.16em] text-black hover:bg-[#c9a65a]">Agendar horário</button>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-12 sm:grid-cols-3">
        {[["Corte executivo", "R$ 80", "Tesoura + máquina, finalização com navalha."], ["Barba ritual", "R$ 70", "Toalha quente, óleos essenciais."], ["Plano mensal", "R$ 199", "2 cortes + barba + sobrancelha."]].map(([n, p, d]) => (
          <div key={n} className="border border-white/10 bg-white/[0.04] p-6"><h3 className="text-lg font-extrabold">{n}</h3><p className="mt-1 text-xl font-black text-[#d8b96a]">{p}</p><p className="mt-2 text-[13px] text-white/55">{d}</p><button onClick={() => setBook(true)} className="mt-4 text-[12px] font-bold uppercase tracking-widest text-white underline underline-offset-4">Agendar</button></div>
        ))}
      </section>
      <section className="mx-auto grid max-w-6xl gap-3 px-5 pb-12 sm:grid-cols-4">
        {["photo-1503951914875-452dadb0f02f","photo-1599351431202-1e0f0137899a","photo-1621605815971-fbc98d665033","photo-1622286342621-4bd786c2447c"].map((id) => (<img key={id} src={img(id, 500)} alt="Corte" loading="lazy" className="h-64 w-full object-cover" />))}
      </section>
      <section className="mx-auto max-w-3xl px-5 pb-14 text-center"><Stars /><p className="mt-2 text-sm text-white/60">4.9 · 2.300 avaliações · Rua Augusta, 1200 · Seg–Sáb 9h–20h</p></section>
      <BookingSimulator open={book} onClose={() => setBook(false)} brand="Barber Club 91" services={[{name:"Corte executivo",price:"R$ 80"},{name:"Barba ritual",price:"R$ 70"},{name:"Corte + barba",price:"R$ 130"}]} professionals={["Rafa","Diego","Thiago"]} />
      <DemoCTA context="Barbearia — Barber Club 91" dark />
    </div>
  );
}
function BarberStreet() {
  const [book, setBook] = useState(false);
  return (
    <div className="min-h-screen bg-[#101010] font-sans text-white">
      <DemoBar segmentName="Barbearia" brand="CORTE FIRME" conceptId="02" siblings={["01","02","03"]} segmentSlug="barbeiro" context="Barbearia — Corte Firme (Street)" />
      <nav className="flex items-center justify-between bg-[#d4ff3f] px-4 py-3 text-black"><span className="text-xl font-black italic">CORTE FIRME ⚡</span><button onClick={() => setBook(true)} className="bg-black px-5 py-2 text-[12px] font-black uppercase text-[#d4ff3f]">Agendar</button></nav>
      <div className="overflow-hidden border-b border-white/10 py-2"><p className="animate-marquee whitespace-nowrap text-[13px] font-black uppercase">Fade ● Freestyle ● Navalhado ● Pigmentação ● Corte Firme ●</p></div>
      <header className="mx-auto max-w-6xl px-4 py-10"><h1 className="text-6xl font-black uppercase leading-[0.9] sm:text-8xl">Seu corte.<br /><span className="text-[#d4ff3f]">Sua atitude.</span></h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">{[["Degradê navalhado","R$ 60"],["Freestyle + desenho","R$ 75"],["Corte + barba","R$ 100"]].map(([n,p]) => (<button key={n} onClick={() => setBook(true)} className="rounded-2xl border border-white/15 bg-white/[0.05] p-5 text-left hover:border-[#d4ff3f]"><span className="font-black">{n}</span><span className="block text-[#d4ff3f] font-black">{p}</span></button>))}</div></header>
      <section className="mx-auto grid max-w-6xl gap-3 px-4 pb-14 sm:grid-cols-3">{["photo-1503951914875-452dadb0f02f","photo-1585747860715-2ba37e788b70","photo-1599351431202-1e0f0137899a"].map((id) => (<img key={id} src={img(id,600)} alt="Street" loading="lazy" className="h-80 w-full rounded-2xl object-cover" />))}</section>
      <BookingSimulator open={book} onClose={() => setBook(false)} brand="Corte Firme" services={[{name:"Degradê",price:"R$ 60"},{name:"Freestyle",price:"R$ 75"}]} professionals={["LK","Menor","JP"]} />
      <DemoCTA context="Barbearia — Corte Firme" dark />
    </div>
  );
}
function BarberMinimal() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      <DemoBar segmentName="Barbearia" brand="Rafa Prates" conceptId="03" siblings={["01","02","03"]} segmentSlug="barbeiro" context="Barbeiro — Rafa Prates (Minimalista)" />
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6"><span className="font-extrabold tracking-tight">rafa.prates</span><a href="https://wa.me/5511999999999" className="rounded-full bg-neutral-900 px-5 py-2.5 text-[13px] font-bold text-white">Agendar no WhatsApp</a></nav>
      <header className="mx-auto max-w-3xl px-5 py-8 text-center"><img src={img("photo-1621605815971-fbc98d665033",700)} alt="Rafa" className="mx-auto h-40 w-40 rounded-full object-cover" /><h1 className="mt-4 text-4xl font-extrabold tracking-tight">Rafa Prates</h1><p className="mt-1 text-sm text-neutral-500">Barbeiro · 8 anos · 12 mil cortes · Vila Madalena, SP</p>
        <div className="mx-auto mt-6 max-w-md divide-y divide-neutral-100 rounded-3xl border border-neutral-200">{[["Corte","R$ 70"],["Barba","R$ 50"],["Sobrancelha","R$ 25"],["Corte + barba","R$ 110"]].map(([n,p]) => (<div key={n} className="flex items-center justify-between px-5 py-4 text-sm"><span className="font-bold">{n}</span><span className="font-extrabold">{p}</span></div>))}</div>
        <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-extrabold text-white"><MessageCircle className="h-4 w-4" /> Agendar horário</a>
        <p className="mt-4 flex items-center justify-center gap-3 text-[12px] text-neutral-400"><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Ter–Sáb</span><span className="inline-flex items-center gap-1"><Instagram className="h-3.5 w-3.5" /> @rafa.prates</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Vila Madalena</span></p></header>
      <DemoCTA context="Barbeiro — Rafa Prates" />
    </div>
  );
}

/* ================= SALÃO ================= */
function SalaoLux() {
  const [book, setBook] = useState(false);
  return (
    <div className="min-h-screen bg-[#121110] text-[#f0e8dc]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <DemoBar segmentName="Salão" brand="Maison Lumière" conceptId="01" siblings={["01","02","03"]} segmentSlug="cabeleireira" context="Salão — Maison Lumière" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 font-sans"><span className="tracking-[0.3em] text-sm font-bold">MAISON LUMIÈRE</span><button onClick={() => setBook(true)} className="rounded-full bg-[#a67c52] px-6 py-2.5 text-[12px] font-bold uppercase tracking-widest text-white">Concierge</button></nav>
      <header className="relative"><img src={img("photo-1560066984-138dadb4c035")} alt="Salão luxo" className="h-[68vh] w-full object-cover" /><div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center"><h1 className="max-w-3xl text-5xl sm:text-7xl">Beleza como alta-costura.</h1><button onClick={() => setBook(true)} className="mt-6 rounded-full bg-[#ece2d2] px-8 py-3.5 font-sans text-[13px] font-extrabold uppercase tracking-widest text-black">Agendar avaliação</button></div></header>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-12 font-sans sm:grid-cols-3">{[["Coloração autoral","a partir de R$ 390"],["Corte editorial","R$ 280"],["Manicure spa","R$ 120"]].map(([n,p]) => (<div key={n} className="rounded-2xl border border-white/10 p-6"><h3 className="font-bold">{n}</h3><p className="text-[#d8bd98] font-extrabold">{p}</p></div>))}</section>
      <section className="mx-auto max-w-6xl px-5 pb-12"><h2 className="text-4xl">Antes & depois</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><img src={img("photo-1522337660859-02fbefca4702",800)} alt="Antes" className="h-80 w-full rounded-2xl object-cover" /><img src={img("photo-1487412947147-5cebf100ffc2",800)} alt="Depois" className="h-80 w-full rounded-2xl object-cover" /></div></section>
      <BookingSimulator open={book} onClose={() => setBook(false)} brand="Maison Lumière" services={[{name:"Coloração",price:"R$ 390"},{name:"Corte",price:"R$ 280"}]} professionals={["Camille","Sofia"]} />
      <DemoCTA context="Salão — Maison Lumière" dark />
    </div>
  );
}
function SalaoModern() {
  const [book, setBook] = useState(false);
  return (
    <div className="min-h-screen bg-[#fff5f7] font-sans text-neutral-900">
      <DemoBar segmentName="Salão" brand="Studio Glow" conceptId="02" siblings={["01","02","03"]} segmentSlug="cabeleireira" context="Salão — Studio Glow" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><span className="text-xl font-black text-pink-600">✦ studio glow</span><button onClick={() => setBook(true)} className="rounded-full bg-neutral-900 px-5 py-2.5 text-[13px] font-bold text-white">Agendar</button></nav>
      <header className="mx-auto grid max-w-6xl items-center gap-6 px-5 py-8 md:grid-cols-2"><div><h1 className="text-5xl font-black tracking-tight">Cabelo feliz, agenda cheia.</h1><p className="mt-3 text-neutral-500">Escova, coloração, manicure e tudo que realça você — com horários livres hoje.</p><button onClick={() => setBook(true)} className="mt-5 rounded-full bg-pink-600 px-7 py-3.5 text-sm font-extrabold text-white">Ver horários livres</button></div><img src={img("photo-1522337660859-02fbefca4702",800)} alt="Studio" className="h-96 w-full rounded-[2rem] object-cover" /></header>
      <section className="mx-auto grid max-w-6xl gap-3 px-5 pb-14 sm:grid-cols-4">{[["Corte","R$ 120"],["Escova","R$ 80"],["Coloração","R$ 290"],["Manicure","R$ 70"]].map(([n,p]) => (<button key={n} onClick={() => setBook(true)} className="rounded-3xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1"><span className="font-extrabold">{n}</span><span className="block font-black text-pink-600">{p}</span></button>))}</section>
      <BookingSimulator open={book} onClose={() => setBook(false)} brand="Studio Glow" services={[{name:"Escova",price:"R$ 80"},{name:"Coloração",price:"R$ 290"}]} professionals={["Ju","Pri","Lê"]} />
      <DemoCTA context="Salão — Studio Glow" />
    </div>
  );
}
function SalaoBoutique() {
  return (
    <div className="min-h-screen bg-[#f7f2ec] font-sans text-[#4a3f35]">
      <DemoBar segmentName="Salão" brand="Ateliê Marina" conceptId="03" siblings={["01","02","03"]} segmentSlug="cabeleireira" context="Salão — Ateliê Marina" />
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-5 py-6"><span className="tracking-[0.24em] text-sm font-bold">ATELIÊ MARINA</span><a href="https://wa.me/5511999999999" className="rounded-full border border-[#4a3f35] px-5 py-2 text-[12px] font-bold">Conversar</a></nav>
      <header className="mx-auto max-w-4xl px-5 py-8 text-center"><h1 className="text-4xl font-extrabold sm:text-5xl">Um horário só seu, sem pressa.</h1><p className="mx-auto mt-3 max-w-md text-sm text-[#4a3f35]/60">Atendimento individual, 4 vagas por dia, chá e conversa boa. Me chama no WhatsApp e escolhemos juntas.</p><img src={img("photo-1487412947147-5cebf100ffc2",900)} alt="Ateliê" className="mt-6 h-96 w-full rounded-[2rem] object-cover" /><a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4a3f35] px-7 py-3.5 text-sm font-bold text-white"><MessageCircle className="h-4 w-4" /> Chamar a Marina</a></header>
      <DemoCTA context="Salão — Ateliê Marina" />
    </div>
  );
}

/* ================= PSICÓLOGO ================= */
function PsiBase({ brand, conceptId, children, context, tone }: { brand: string; conceptId: string; children: ReactNode; context: string; tone: "dark" | "light" }) {
  return (
    <div>
      <DemoBar segmentName="Psicologia" brand={brand} conceptId={conceptId} siblings={["01","02","03"]} segmentSlug="psicologo" context={context} />
      {children}
      <DemoCTA context={context} dark={tone === "dark"} />
    </div>
  );
}
function PsiPremium() {
  const [book, setBook] = useState(false);
  return (
    <PsiBase brand="Dra. Helena Prado" conceptId="01" context="Psicóloga — Helena Prado" tone="light">
      <div className="min-h-screen bg-[#f4f1ea] font-sans text-[#14201f]">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6"><span className="font-extrabold">Dra. Helena Prado · CRP 06/123456</span><button onClick={() => setBook(true)} className="rounded-full bg-[#0e4d4a] px-6 py-2.5 text-[13px] font-bold text-white">Primeira conversa</button></nav>
        <header className="mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-2"><div><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#0e4d4a]">Psicoterapia · Adultos</p><h1 className="mt-2 text-5xl font-extrabold tracking-tight">Clareza para atravessar fases difíceis.</h1><p className="mt-4 text-neutral-600">Ansiedade, burnout, luto e transições de carreira. Atendimento presencial e online, com ética e sigilo absoluto.</p><button onClick={() => setBook(true)} className="mt-6 rounded-full bg-[#0e4d4a] px-7 py-3.5 text-sm font-extrabold text-white">Agendar primeira conversa</button></div><img src={img("photo-1573497019940-1c28c88b4f3e",800)} alt="Dra Helena" className="h-[30rem] w-full rounded-[2rem] object-cover" /></header>
        <section className="mx-auto max-w-5xl px-5 pb-8"><h2 className="text-2xl font-extrabold">Especialidades</h2><div className="mt-3 grid gap-2.5 sm:grid-cols-3">{[["Ansiedade","Crises, preocupação constante, insônia."],["Burnout","Exaustão profissional e limites."],["Luto e perdas","Elaboração com cuidado e tempo."]].map(([t,d]) => (<div key={t} className="rounded-2xl border border-neutral-200 bg-white p-5"><h3 className="font-bold">{t}</h3><p className="mt-1 text-[13px] text-neutral-500">{d}</p></div>))}</div></section>
        <section className="mx-auto max-w-3xl px-5 pb-14"><h2 className="text-2xl font-extrabold">Perguntas frequentes</h2><div className="mt-4"><Faq items={[{q:"Como funciona a primeira sessão?",a:"É uma conversa de 50 minutos para entender seu momento e ver se faz sentido seguirmos. Sem compromisso."},{q:"Presencial ou online?",a:"Ambos. Online com a mesma qualidade e sigilo, pela plataforma que você preferir."},{q:"Qual o valor?",a:"Sessões a partir de R$ 220. Pacotes mensais com condição especial."}]} /></div></section>
        <BookingSimulator open={book} onClose={() => setBook(false)} brand="Dra. Helena Prado" services={[{name:"Primeira conversa — 50min",price:"R$ 220"},{name:"Sessão avulsa",price:"R$ 250"}]} professionals={["Segunda — online","Quarta — presencial"]} />
      </div>
    </PsiBase>
  );
}
function PsiHuman() {
  return (
    <PsiBase brand="Espaço Acolher" conceptId="02" context="Psicologia — Espaço Acolher" tone="light">
      <div className="min-h-screen bg-[#fdf8f1] font-sans text-[#5b4a3a]">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6"><span className="text-xl font-extrabold">🌿 Espaço Acolher</span><a href="https://wa.me/5511999999999" className="rounded-full bg-[#c98a4b] px-6 py-2.5 text-[13px] font-bold text-white">Quero conversar</a></nav>
        <header className="mx-auto max-w-3xl px-5 py-10 text-center"><h1 className="text-5xl font-extrabold">Aqui você pode ser você, sem pressa.</h1><p className="mx-auto mt-4 max-w-md text-[15px] text-[#5b4a3a]/70">Um espaço calmo para falar de ansiedade, autoestima, relacionamentos e recomeços.</p><img src={img("photo-1493836512294-502baa1986e2",900)} alt="Acolhimento" className="mt-6 h-96 w-full rounded-[2rem] object-cover" /></header>
        <section className="mx-auto max-w-3xl px-5 pb-14"><h2 className="text-center text-2xl font-extrabold">Como funciona?</h2><div className="mt-4 grid gap-2.5 sm:grid-cols-3">{[["1. Chame no WhatsApp","Conte um pouco do seu momento."],["2. Escolha o formato","Online ou presencial."],["3. Primeira conversa","50 min, no seu ritmo."]].map(([t,d]) => (<div key={t} className="rounded-2xl bg-white p-5 shadow-sm"><h3 className="font-bold">{t}</h3><p className="mt-1 text-[13px] text-[#5b4a3a]/60">{d}</p></div>))}</div>
          <div className="mt-6"><Faq items={[{q:"Preciso estar em crise para procurar terapia?",a:"Não. Terapia também é autoconhecimento, prevenção e espaço de escuta."},{q:"Tudo é sigiloso?",a:"Sim. Tudo segue o Código de Ética Profissional do Psicólogo."}]} /></div></section>
      </div>
    </PsiBase>
  );
}
function PsiModern() {
  const [step, setStep] = useState(0);
  return (
    <PsiBase brand="mente.livre" conceptId="03" context="Psicologia — mente.livre" tone="dark">
      <div className="min-h-screen bg-[#08070d] font-sans text-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5"><span className="font-black lowercase">mente.livre</span><button onClick={() => setStep(1)} className="rounded-full bg-indigo-500 px-5 py-2.5 text-[13px] font-bold">Agendar em 3 passos</button></nav>
        <header className="mx-auto max-w-5xl px-5 py-12 text-center"><h1 className="mx-auto max-w-2xl text-5xl font-black tracking-tight sm:text-6xl">Terapia online, do seu jeito.</h1><p className="mx-auto mt-4 max-w-md text-sm text-white/55">Escolha o foco → escolha o horário → receba o link. Simples assim.</p>
          {step === 0 ? (<button onClick={() => setStep(1)} className="mt-6 rounded-full bg-white px-8 py-3.5 text-sm font-extrabold text-black">Começar agora</button>) : (
            <div className="mx-auto mt-6 max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left">
              {step === 1 && (<div><p className="text-[12px] font-bold uppercase text-white/40">Passo 1 — seu foco</p><div className="mt-2 grid gap-2">{["Ansiedade","Foco e carreira","Relacionamentos"].map((f) => (<button key={f} onClick={() => setStep(2)} className="rounded-2xl border border-white/10 p-3.5 text-sm font-bold hover:border-indigo-400">{f}</button>))}</div></div>)}
              {step === 2 && (<div><p className="text-[12px] font-bold uppercase text-white/40">Passo 2 — horário</p><div className="mt-2 grid grid-cols-3 gap-2">{["Seg 18h","Qua 10h","Sex 14h"].map((t) => (<button key={t} onClick={() => setStep(3)} className="rounded-xl border border-white/10 p-3 text-sm font-bold hover:border-indigo-400">{t}</button>))}</div></div>)}
              {step === 3 && (<div className="text-center"><p className="text-lg font-extrabold">Pronto! 🎉</p><p className="mt-1 text-sm text-white/55">Demonstração — em produção você receberia o link e o lembrete automático.</p><button onClick={() => setStep(0)} className="mt-4 w-full rounded-full bg-indigo-500 py-3 text-sm font-bold">Recomeçar</button></div>)}
            </div>)}
        </header>
      </div>
    </PsiBase>
  );
}

export function BarbeiroDemo({ concept }: { concept: string }) {
  if (concept === "02") return <BarberStreet />;
  if (concept === "03") return <BarberMinimal />;
  return <BarberPremium />;
}
export function SalaoDemo({ concept }: { concept: string }) {
  if (concept === "02") return <SalaoModern />;
  if (concept === "03") return <SalaoBoutique />;
  return <SalaoLux();
}
export function PsicologoDemo({ concept }: { concept: string }) {
  if (concept === "02") return <PsiHuman />;
  if (concept === "03") return <PsiModern />;
  return <PsiPremium />;
}
