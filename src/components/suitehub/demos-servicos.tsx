import { useState } from "react";
import { Check, Clock, Flame, MessageCircle } from "lucide-react";
import { BookingSimulator, DemoBar, DemoCTA, Faq } from "@/components/suitehub/demo-ui";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ================= LAVA-CAR ================= */
export function LavaCarDemo({ concept }: { concept: string }) {
  const [book, setBook] = useState(false);
  const services = [{ name: "Lavagem completa", price: "R$ 69" }, { name: "Enceramento", price: "R$ 129" }, { name: "Detailing interno", price: "R$ 249" }];

  if (concept === "02")
    return (
      <div className="min-h-screen bg-[#111] font-sans text-white">
        <DemoBar segmentName="Lava-Car" brand="LAVA FLASH" conceptId="02" siblings={["01","02","03"]} segmentSlug="lava-car" context="Lava-car — Lava Flash" />
        <nav className="flex items-center justify-between bg-yellow-400 px-4 py-3 text-black"><span className="text-xl font-black italic">LAVA FLASH ⚡</span><button onClick={() => setBook(true)} className="bg-black px-5 py-2 text-[12px] font-black uppercase text-yellow-400">Reservar 30s</button></nav>
        <header className="mx-auto max-w-5xl px-4 py-10 text-center"><h1 className="text-6xl font-black uppercase sm:text-7xl">Limpo em <span className="text-yellow-400">30 min.</span></h1><p className="mt-2 text-white/60">Express sem sair do carro · combo mensal R$ 149.</p><button onClick={() => setBook(true)} className="mt-5 rounded-full bg-yellow-400 px-8 py-3.5 text-sm font-black uppercase text-black">Reservar agora</button></header>
        <section className="mx-auto grid max-w-5xl gap-3 px-4 pb-14 sm:grid-cols-3">{services.map((s) => (<button key={s.name} onClick={() => setBook(true)} className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-left"><h3 className="font-black">{s.name}</h3><p className="text-yellow-400 font-black">{s.price}</p></button>))}</section>
        <BookingSimulator open={book} onClose={() => setBook(false)} brand="Lava Flash" services={services} professionals={["Box 1", "Box 2", "Delivery"]} />
        <DemoCTA context="Lava-car — Lava Flash" dark />
      </div>
    );

  if (concept === "03")
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-900">
        <DemoBar segmentName="Lava-Car" brand="puro.lava" conceptId="03" siblings={["01","02","03"]} segmentSlug="lava-car" context="Lava-car — puro.lava" />
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5"><span className="font-black lowercase text-cyan-600">puro.lava</span><button onClick={() => setBook(true)} className="rounded-full bg-neutral-900 px-5 py-2.5 text-[13px] font-bold text-white">Agendar</button></nav>
        <header className="mx-auto max-w-2xl px-5 py-10 text-center"><h1 className="text-5xl font-extrabold tracking-tight">Escolha. Agende. Pronto.</h1><p className="mt-3 text-neutral-500">Reserva em 3 toques, pagamento na retirada.</p><button onClick={() => setBook(true)} className="mt-6 w-full rounded-full bg-cyan-500 py-4 text-sm font-extrabold text-white">Agendar lavagem</button><img src={img("photo-1605559424843-9e4c228bf1c2",900)} alt="Carro limpo" className="mt-6 h-80 w-full rounded-[2rem] object-cover" /></header>
        <BookingSimulator open={book} onClose={() => setBook(false)} brand="puro.lava" services={services} professionals={["Manhã", "Tarde", "Noite"]} />
        <DemoCTA context="Lava-car — puro.lava" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0f1e] font-sans text-white">
      <DemoBar segmentName="Lava-Car" brand="Studio Detail" conceptId="01" siblings={["01","02","03"]} segmentSlug="lava-car" context="Lava-car — Studio Detail" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><span className="tracking-[0.3em] text-sm font-bold">STUDIO DETAIL</span><button onClick={() => setBook(true)} className="border border-white/25 px-5 py-2 text-[12px] font-bold uppercase">Agendar avaliação</button></nav>
      <header className="relative"><img src={img("photo-1607860108855-64acf2078b60",1600)} alt="Detailing" className="h-[64vh] w-full object-cover" /><div className="absolute inset-0 bg-black/55" /><div className="absolute inset-0 flex flex-col items-center justify-center text-center"><h1 className="max-w-2xl text-5xl font-extrabold sm:text-6xl">Estética automotiva de alto nível.</h1><button onClick={() => setBook(true)} className="mt-6 bg-white px-8 py-3.5 text-[13px] font-extrabold uppercase text-black">Agendar avaliação</button></div></header>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-12 sm:grid-cols-3">{[["Nível 1 — Essencial","R$ 349","Higienização + cera."],["Nível 2 — Avançado","R$ 690","+ polimento técnico."],["Nível 3 — Signature","R$ 1.290","+ vitrificação 3 anos."]].map(([n,p,d]) => (<div key={n} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h3 className="font-bold">{n}</h3><p className="text-xl font-black">{p}</p><p className="mt-1 text-[13px] text-white/55">{d}</p></div>))}</section>
      <BookingSimulator open={book} onClose={() => setBook(false)} brand="Studio Detail" services={services} professionals={["Especialista Rafa", "Especialista Leo"]} />
      <DemoCTA context="Lava-car — Studio Detail" dark />
    </div>
  );
}

/* ================= ADVOCACIA ================= */
export function AdvocaciaDemo({ concept }: { concept: string }) {
  const [modal, setModal] = useState(false);
  const faq = [{ q: "Quanto custa a primeira análise?", a: "A primeira análise é gratuita e sem compromisso. Você conta o caso e recebe um parecer inicial." }, { q: "Atendem online?", a: "Sim, todo o Brasil, com assinatura eletrônica e acompanhamento por WhatsApp." }, { q: "Quanto tempo dura um processo?", a: "Depende da área. Na primeira conversa damos uma estimativa honesta." }];

  if (concept === "02")
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-sans text-[#2e2620]">
        <DemoBar segmentName="Advocacia" brand="Lina Duarte" conceptId="02" siblings={["01","02","03"]} segmentSlug="advocacia" context="Advocacia — Lina Duarte" />
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6"><span className="font-extrabold">Lina Duarte · Advocacia boutique</span><button onClick={() => setModal(true)} className="rounded-full bg-[#2e2620] px-6 py-2.5 text-[13px] font-bold text-white">Agendar conversa</button></nav>
        <header className="mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-2"><div><h1 className="text-5xl font-extrabold">Advocacia próxima, sem juridiquês.</h1><p className="mt-4 text-[#2e2620]/65">Família, inventário e contratos — com atendimento individual e explicação clara.</p><button onClick={() => setModal(true)} className="mt-6 rounded-full bg-[#2e2620] px-7 py-3.5 text-sm font-bold text-white">Agendar conversa</button></div><img src={img("photo-1521791136064-7986c2920216",800)} alt="Acordo" className="h-96 w-full rounded-[2rem] object-cover" /></header>
        <section className="mx-auto max-w-3xl px-5 pb-14"><Faq items={faq} /></section>
        <Modal open={modal} onClose={() => setModal(false)} title="Agendar conversa"><p className="text-sm text-neutral-500">Demonstração — escolha o tema:</p><div className="mt-3 grid gap-2">{["Inventário", "Divórcio consensual", "Contrato"].map((t) => (<a key={t} href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="rounded-2xl border border-neutral-200 p-3.5 text-sm font-bold hover:border-neutral-900">{t}</a>))}</div></Modal>
        <DemoCTA context="Advocacia — Lina Duarte" />
      </div>
    );

  if (concept === "03")
    return (
      <div className="min-h-screen bg-[#060b0a] font-sans text-white">
        <DemoBar segmentName="Advocacia" brand="lex.digital" conceptId="03" siblings={["01","02","03"]} segmentSlug="advocacia" context="Advocacia — lex.digital" />
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5"><span className="font-black text-[#00c2a8]">lex.digital_</span><button onClick={() => setModal(true)} className="rounded-full bg-[#00c2a8] px-5 py-2.5 text-[13px] font-black text-black">Diagnóstico gratuito</button></nav>
        <header className="mx-auto max-w-3xl px-5 py-12 text-center"><h1 className="text-5xl font-black sm:text-6xl">Resolveu no WhatsApp, acompanhou no painel.</h1><p className="mt-4 text-sm text-white/55">Trabalhista, consumidor e contratos digitais. Diagnóstico em 2 minutos.</p><button onClick={() => setModal(true)} className="mt-6 rounded-full bg-[#00c2a8] px-8 py-3.5 text-sm font-black text-black">Fazer diagnóstico</button></header>
        <section className="mx-auto max-w-3xl px-5 pb-14"><Faq items={faq} dark /></section>
        <Modal open={modal} onClose={() => setModal(false)} title="Diagnóstico em 2 min"><p className="text-sm text-neutral-500">Demonstração interativa.</p><div className="mt-3 grid gap-2">{["Fui demitido sem justa causa", "Compra com defeito", "Contrato para revisar"].map((t) => (<button key={t} onClick={() => setModal(false)} className="rounded-2xl border border-neutral-200 p-3.5 text-left text-sm font-bold hover:border-neutral-900">{t}</button>))}</div></Modal>
        <DemoCTA context="Advocacia — lex.digital" dark />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans text-[#1a2340]">
      <DemoBar segmentName="Advocacia" brand="Moretti & Salles" conceptId="01" siblings={["01","02","03"]} segmentSlug="advocacia" context="Advocacia — Moretti & Salles" />
      <div className="bg-[#1a2340] text-white"><nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><span className="tracking-[0.26em] text-sm font-bold">MORETTI & SALLES · 1989</span><button onClick={() => setModal(true)} className="border border-amber-200/40 px-5 py-2 text-[12px] font-bold uppercase tracking-widest text-amber-100">Falar com o escritório</button></nav>
      <header className="mx-auto max-w-6xl px-5 py-14"><p className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-200/70">Empresarial · Tributário · Cível</p><h1 className="mt-3 max-w-3xl text-5xl font-extrabold sm:text-6xl">Tradição que protege o futuro da sua empresa.</h1></header></div>
      <section className="mx-auto grid max-w-6xl gap-3 px-5 py-10 sm:grid-cols-3">{[["Direito empresarial","Contratos, societário, M&A."],["Tributário","Planejamento e contencioso."],["Cível estratégico","Disputas complexas."]].map(([t,d]) => (<div key={t} className="rounded-2xl border border-neutral-200 bg-white p-6"><h3 className="font-extrabold">{t}</h3><p className="mt-1 text-[13px] text-neutral-500">{d}</p></div>))}</section>
      <section className="mx-auto max-w-3xl px-5 pb-14"><h2 className="text-2xl font-extrabold">Sócios</h2><div className="mt-3 grid gap-2.5 sm:grid-cols-2">{[["Dr. Moretti","Empresarial · OAB/SP 45.210"],["Dra. Salles","Tributário · OAB/SP 52.884"]].map(([n,o]) => (<div key={n} className="rounded-2xl bg-white p-5 shadow-sm"><h3 className="font-bold">{n}</h3><p className="text-[13px] text-neutral-500">{o}</p></div>))}</div><div className="mt-6"><Faq items={faq} /></div></section>
      <Modal open={modal} onClose={() => setModal(false)} title="Falar com o escritório"><div className="grid gap-2"><a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="rounded-2xl bg-neutral-900 p-4 text-center text-sm font-bold text-white">Chamar no WhatsApp</a></div></Modal>
      <DemoCTA context="Advocacia — Moretti & Salles" />
    </div>
  );
}

/* ================= GÁS ================= */
export function GasDemo({ concept }: { concept: string }) {
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState(0);
  const price = 109.9;

  if (concept === "02")
    return (
      <div className="min-h-screen bg-[#0f0b1e] font-sans text-white">
        <DemoBar segmentName="Gás" brand="fogão.em.casa" conceptId="02" siblings={["01","02","03"]} segmentSlug="distribuidora-gas" context="Gás — fogão.em.casa" />
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4"><span className="text-lg font-black">🔥 fogão.em.casa</span><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[12px] font-bold text-emerald-300">Entrega ~35 min</span></nav>
        <main className="mx-auto max-w-5xl px-5 py-8">
          {step < 2 ? (<div><h1 className="text-4xl font-black">O que vai hoje?</h1><div className="mt-4 grid gap-3 sm:grid-cols-3">{[{ n: "Gás P13", p: "R$ 109,90" }, { n: "Água 20L", p: "R$ 14,90" }, { n: "Combo Gás + Água", p: "R$ 119,90" }].map((o) => (<button key={o.n} onClick={() => setStep(1)} className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-left hover:border-violet-400"><span className="font-extrabold">{o.n}</span><span className="block font-black text-violet-300">{o.p}</span></button>))}</div>
            {step === 1 && (<div className="mt-4 rounded-3xl bg-white p-6 text-neutral-900"><p className="font-extrabold">Endereço de entrega</p><input placeholder="Rua, número, complemento..." className="mt-2 h-12 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-violet-600" /><button onClick={() => setStep(2)} className="mt-3 w-full rounded-full bg-violet-600 py-3.5 text-sm font-extrabold text-white">Acompanhar pedido →</button></div>)}</div>)
          : (<div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center"><p className="text-5xl">🛵</p><h2 className="mt-2 text-2xl font-black">Pedido a caminho!</h2><div className="mx-auto mt-4 max-w-sm"><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-violet-500" /></div><p className="mt-2 text-[12px] text-white/50">Saiu para entrega · chega em ~20 min (demonstração)</p></div><button onClick={() => setStep(0)} className="mt-5 text-[13px] font-bold text-white/60 underline">Fazer outro pedido</button></div>)}
        </main>
        <DemoCTA context="Gás — fogão.em.casa" dark />
      </div>
    );

  if (concept === "03")
    return (
      <div className="min-h-screen bg-[#eef4fa] font-sans text-neutral-900">
        <DemoBar segmentName="Gás" brand="Gás da Família" conceptId="03" siblings={["01","02","03"]} segmentSlug="distribuidora-gas" context="Gás — Gás da Família" />
        <nav className="bg-[#1971c2] px-5 py-3 text-white"><div className="mx-auto flex max-w-5xl items-center justify-between"><span className="font-black">Gás da Família · desde 1998</span><span className="text-[12px]">Seg–Sáb 7h–20h</span></div></nav>
        <header className="mx-auto max-w-5xl px-5 py-8 text-center"><span className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-[13px] font-extrabold text-amber-800">Preço do dia: Gás P13 por R$ 109,90</span><h1 className="mx-auto mt-3 max-w-xl text-4xl font-black">Aqui do bairro, entrega rapidinho.</h1><div className="mx-auto mt-4 flex max-w-md items-center justify-center gap-3 rounded-3xl bg-white p-4 shadow-sm"><button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-xl font-black">−</button><span className="font-black">{qty} botijão(ões)</span><button onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-xl font-black">+</button></div><p className="mt-2 text-xl font-black text-[#1971c2]">Total: R$ {(price * qty).toFixed(2).replace(".", ",")}</p><a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-black text-white"><MessageCircle className="h-4 w-4" /> Pedir no WhatsApp</a><p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-neutral-500"><Clock className="h-3.5 w-3.5" /> Aceitamos Pix, cartão e dinheiro</p></header>
        <DemoCTA context="Gás — Gás da Família" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fff7ed] font-sans text-neutral-900">
      <DemoBar segmentName="Gás" brand="Gás Já" conceptId="01" siblings={["01","02","03"]} segmentSlug="distribuidora-gas" context="Gás — Gás Já (30s)" />
      <main className="mx-auto max-w-md px-5 py-10">
        <p className="flex items-center justify-center gap-1.5 text-center text-[12px] font-bold uppercase tracking-widest text-orange-600"><Flame className="h-4 w-4" /> Pedido em 30 segundos</p>
        <h1 className="mt-2 text-center text-5xl font-black tracking-tight">Gás em casa rapidinho.</h1>
        <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-xl">
          {step === 0 && (<div><div className="flex items-center justify-between rounded-2xl bg-orange-50 p-4"><span className="font-extrabold">Botijão P13</span><span className="font-black text-orange-600">R$ 109,90</span></div><div className="mt-3 flex items-center justify-between"><span className="text-sm font-bold">Quantidade</span><span className="flex items-center gap-2"><button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 font-black">−</button><b>{qty}</b><button onClick={() => setQty(qty + 1)} className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 font-black">+</button></span></div><button onClick={() => setStep(1)} className="mt-4 w-full rounded-full bg-orange-600 py-4 text-sm font-black uppercase text-white">Continuar →</button></div>)}
          {step === 1 && (<div><p className="font-extrabold">Onde entregar?</p><div className="mt-2 grid gap-2">{["Minha casa", "Retirar na loja"].map((o) => (<button key={o} onClick={() => setStep(2)} className="rounded-2xl border border-neutral-200 p-4 text-left text-sm font-bold hover:border-orange-600">{o}</button>))}</div></div>)}
          {step === 2 && (<div className="py-2 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-7 w-7" /></span><h2 className="mt-3 text-xl font-black">Pedido feito!</h2><p className="mt-1 text-sm text-neutral-500">{qty}x P13 · R$ {(price * qty).toFixed(2).replace(".", ",")} · Demonstração.</p><button onClick={() => { setStep(0); setQty(1); }} className="mt-4 w-full rounded-full bg-neutral-900 py-3 text-sm font-bold text-white">Novo pedido</button></div>)}
        </div>
        <p className="mt-4 text-center text-[12px] text-neutral-400">Sem cadastro · Sem app · Pix, cartão ou dinheiro</p>
      </main>
      <DemoCTA context="Gás — Gás Já" />
    </div>
  );
}
