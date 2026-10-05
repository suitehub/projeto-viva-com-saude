import { useMemo, useState } from "react";
import { Clock, MapPin, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { DemoBar, DemoCTA, Modal, Stars } from "@/components/suitehub/demo-ui";

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const DISHES = [
  { name: "Risotto al Tartufo", cat: "Principais", price: 89, desc: "Arroz carnaroli, trufa negra, parmesão 24 meses.", img: img("photo-1476124369491-e7addf5db371", 600) },
  { name: "Filé Rossini", cat: "Principais", price: 129, desc: "Filé mignon, foie gras, demi-glace de vinho.", img: img("photo-1544025162-d76694265947", 600) },
  { name: "Burrata e Tomates", cat: "Entradas", price: 54, desc: "Burrata cremosa, tomates confit, pesto de manjericão.", img: img("photo-1546069901-ba9599a7e63c", 600) },
  { name: "Crostini di Mare", cat: "Entradas", price: 48, desc: "Pão de fermentação natural, frutos do mar, limão siciliano.", img: img("photo-1504674900247-0877df9cc836", 600) },
  { name: "Tiramisù Clássico", cat: "Sobremesas", price: 32, desc: "Receita da casa desde 1987, café e mascarpone.", img: img("photo-1571877227200-a0d98ea607e9", 600) },
  { name: "Panna Cotta", cat: "Sobremesas", price: 28, desc: "Baunilha do cerrado, calda de frutas vermelhas.", img: img("photo-1488477181946-6428a0291777", 600) },
];

/* ============ 01 — CASA NOSTRA (premium gastronômico) ============ */
function CasaNostra() {
  const [cat, setCat] = useState("Principais");
  const [dish, setDish] = useState<(typeof DISHES)[number] | null>(null);
  const [reserve, setReserve] = useState(false);
  const [guests, setGuests] = useState("2 pessoas");
  const [date, setDate] = useState("Hoje à noite");
  const [confirmed, setConfirmed] = useState(false);
  const list = useMemo(() => DISHES.filter((d) => d.cat === cat), [cat]);
  return (
    <div className="min-h-screen bg-[#0e0c09] text-[#f3ead9]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <DemoBar segmentName="Restaurante" brand="Casa Nostra" conceptId="01" siblings={["01", "02", "03"]} segmentSlug="restaurante" context="Restaurante — Casa Nostra (Premium)" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="text-2xl font-bold tracking-[0.28em]">CASA NOSTRA</span>
        <div className="hidden items-center gap-8 text-[13px] font-sans font-semibold uppercase tracking-[0.2em] text-[#f3ead9]/60 md:flex">
          <a href="#menu" className="hover:text-white">Menu</a>
          <a href="#casa" className="hover:text-white">A casa</a>
          <a href="#avaliacoes" className="hover:text-white">Avaliações</a>
        </div>
        <button onClick={() => setReserve(true)} className="rounded-full border border-[#c9a24b] px-5 py-2 font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-[#c9a24b] transition hover:bg-[#c9a24b] hover:text-black">
          Reservar mesa
        </button>
      </nav>
      <header className="relative overflow-hidden">
        <img src={img("photo-1414235077428-338989a2e8c0")} alt="Salão Casa Nostra" className="h-[78vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c09] via-black/30 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-5 pb-14 text-center">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-[#c9a24b]">Desde 1987 · Cozinha italiana</p>
          <h1 className="mt-3 text-5xl leading-[1.02] sm:text-7xl">O jantar como<br />obra de arte.</h1>
          <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-white/70">Salão à luz de velas, adega premiada e menu degustação de 7 tempos. Reserve sua noite.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => setReserve(true)} className="rounded-full bg-[#c9a24b] px-8 py-3.5 font-sans text-[13px] font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-[#dbb95e]">Reservar mesa</button>
            <a href="#menu" className="rounded-full border border-white/25 px-8 py-3.5 font-sans text-[13px] font-bold uppercase tracking-[0.16em] transition hover:border-white/60">Ver cardápio</a>
          </div>
        </div>
      </header>
      <section id="menu" className="mx-auto max-w-6xl px-5 py-16">
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.35em] text-[#c9a24b]">Cardápio</p>
        <h2 className="mt-2 text-4xl sm:text-5xl">Capítulos da noite</h2>
        <div className="mt-6 flex gap-2 font-sans">
          {["Entradas", "Principais", "Sobremesas"].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] transition ${cat === c ? "bg-[#c9a24b] text-black" : "border border-white/15 text-white/60 hover:border-white/40"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <button key={d.name} onClick={() => setDish(d)} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition hover:border-[#c9a24b]/50">
              <img src={d.img} alt={d.name} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-2xl leading-tight">{d.name}</h3>
                  <span className="font-sans text-sm font-extrabold text-[#c9a24b]">R$ {d.price}</span>
                </div>
                <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-white/55">{d.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section id="casa" className="grid gap-0 md:grid-cols-2">
        <img src={img("photo-1517248135467-4c7edcad34c4")} alt="Interior" className="h-96 w-full object-cover" />
        <div className="flex flex-col justify-center bg-[#151009] p-8 sm:p-14">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.35em] text-[#c9a24b]">A casa</p>
          <h2 className="mt-2 text-4xl">Três gerações na mesma cozinha.</h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-white/60">Ter–Dom · 19h–23h · Rua das Figueiras, 214 — Jardins, São Paulo. Valet na porta e adega com 180 rótulos.</p>
          <div className="mt-6 flex items-center gap-4 font-sans text-[13px] text-white/70">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#c9a24b]" /> Hoje até 23h</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#c9a24b]" /> Jardins, SP</span>
          </div>
        </div>
      </section>
      <section id="avaliacoes" className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[{ n: "Mariana C.", t: "O melhor risotto que já comi fora da Itália. Atendimento impecável." }, { n: "Ricardo A.", t: "Pedi em casa pelo site e chegou perfeito. Virou nosso ritual de sexta." }, { n: "Fernanda L.", t: "Ambiente lindo, carta de vinhos honesta. Vale cada real." }].map((r) => (
            <figure key={r.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <Stars /><blockquote className="mt-3 text-xl leading-snug">“{r.t}”</blockquote>
              <figcaption className="mt-3 font-sans text-[12px] font-bold uppercase tracking-widest text-white/50">{r.n}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <Modal open={!!dish} onClose={() => setDish(null)} title={dish?.name ?? ""}>
        {dish && (<div><img src={dish.img} alt={dish.name} className="h-56 w-full rounded-2xl object-cover" /><p className="mt-3 text-sm text-neutral-500">{dish.desc}</p><p className="mt-2 text-xl font-extrabold">R$ {dish.price}</p><button onClick={() => { setDish(null); setReserve(true); }} className="mt-4 w-full rounded-full bg-neutral-900 py-3 text-sm font-bold text-white">Reservar para provar este prato</button></div>)}
      </Modal>
      <Modal open={reserve} onClose={() => { setReserve(false); setConfirmed(false); }} title="Reservar mesa">
        {!confirmed ? (<div className="grid gap-2.5">
          {["Hoje à noite", "Amanhã", "Sábado"].map((d) => (<button key={d} onClick={() => setDate(d)} className={`rounded-2xl border p-3.5 text-sm font-bold ${date === d ? "border-neutral-900 bg-neutral-50" : "border-neutral-200"}`}>{d}</button>))}
          {["2 pessoas", "4 pessoas", "6+ pessoas"].map((g) => (<button key={g} onClick={() => setGuests(g)} className={`rounded-2xl border p-3.5 text-sm font-bold ${guests === g ? "border-neutral-900 bg-neutral-50" : "border-neutral-200"}`}>{g}</button>))}
          <button onClick={() => setConfirmed(true)} className="mt-1 w-full rounded-full bg-neutral-900 py-3.5 text-sm font-extrabold text-white">Confirmar reserva — {date} · {guests}</button>
        </div>) : (<div className="py-4 text-center"><p className="text-lg font-extrabold">Mesa reservada! 🍷</p><p className="mt-1 text-sm text-neutral-500">{date} · {guests}. Demonstração — em um site real, você receberia confirmação no WhatsApp.</p><button onClick={() => { setReserve(false); setConfirmed(false); }} className="mt-4 w-full rounded-full bg-neutral-900 py-3 text-sm font-bold text-white">Fechar</button></div>)}
      </Modal>
      <DemoCTA context="Restaurante — Casa Nostra (Premium)" dark />
    </div>
  );
}

/* ============ 02 — BRASA & RUA (urbano conversão) ============ */
function BrasaRua() {
  const [mode, setMode] = useState<"Delivery" | "Retirada">("Delivery");
  const [cart, setCart] = useState<Record<string, number>>({ "Smash duplo": 1 });
  const [open, setOpen] = useState(false);
  const [placed, setPlaced] = useState(false);
  const items = [
    { name: "Smash duplo", price: 27.9, tag: "Mais pedido", img: img("photo-1568901346375-23c9450c58cd", 600) },
    { name: "Burger da casa", price: 32.9, tag: "Novo", img: img("photo-1553979459-d2229ba7433b", 600) },
    { name: "Pizza pepperoni", price: 49.9, tag: "Forno a lenha", img: img("photo-1565299624946-b28f40a0ae38", 600) },
    { name: "Batata trufada", price: 19.9, tag: "Acompanha", img: img("photo-1573080496219-bb080dd4f877", 600) },
    { name: "Combo 2 pessoas", price: 79.9, tag: "-20%", img: img("photo-1550317138-10000687a72b", 600) },
    { name: "Milkshake", price: 16.9, tag: "Sobremesa", img: img("photo-1571877227200-a0d98ea607e9", 600) },
  ];
  const total = Object.entries(cart).reduce((s, [n, q]) => s + (items.find((i) => i.name === n)?.price ?? 0) * q, 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <div className="min-h-screen bg-[#0c0c0d] font-sans text-white">
      <DemoBar segmentName="Restaurante" brand="Brasa & Rua" conceptId="02" siblings={["01", "02", "03"]} segmentSlug="restaurante" context="Restaurante — Brasa & Rua (Urbano)" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <span className="bg-[#d4ff3f] px-3 py-1 text-xl font-black uppercase italic tracking-tight text-black">Brasa&Rua</span>
        <div className="hidden gap-6 text-[13px] font-bold uppercase md:flex"><a href="#cardapio" className="text-white/70 hover:text-white">Cardápio</a><a href="#combos" className="text-white/70 hover:text-white">Combos</a><span className="text-white/70">Aberto até 23h ●</span></div>
        <button onClick={() => setOpen(true)} className="relative rounded-full bg-[#ff3d00] px-5 py-2.5 text-[13px] font-black uppercase transition hover:bg-[#ff5a26]">Pedir ({count})</button>
      </nav>
      <div className="overflow-hidden border-y border-white/10 bg-[#d4ff3f] py-2 text-black">
        <p className="animate-marquee whitespace-nowrap text-[13px] font-black uppercase tracking-widest">Entrega em 30 min ● Cupom BRASA10 ● Sem taxa acima de R$ 60 ● Entrega em 30 min ● Cupom BRASA10 ●</p>
      </div>
      <header className="relative">
        <img src={img("photo-1504674900247-0877df9cc836")} alt="Comida" className="h-[62vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0d] via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-10">
          <h1 className="max-w-2xl text-5xl font-black uppercase leading-[0.95] sm:text-7xl">Fome de verdade se resolve aqui.</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex rounded-full bg-white/10 p-1 backdrop-blur">
              {(["Delivery", "Retirada"] as const).map((m) => (<button key={m} onClick={() => setMode(m)} className={`rounded-full px-5 py-2 text-[13px] font-black uppercase transition ${mode === m ? "bg-white text-black" : "text-white/70"}`}>{m}</button>))}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-4 py-2 text-[12px] font-bold backdrop-blur"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9 · 12 mil avaliações</span>
          </div>
        </div>
      </header>
      <main id="cardapio" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-black uppercase">Peça em 3 cliques</h2>
        <div id="combos" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <article key={it.name} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
              <div className="relative"><img src={it.img} alt={it.name} loading="lazy" className="h-48 w-full object-cover" /><span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-black uppercase backdrop-blur">{it.tag}</span></div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div><h3 className="font-extrabold">{it.name}</h3><p className="text-lg font-black text-[#d4ff3f]">R$ {it.price.toFixed(2).replace(".", ",")}</p></div>
                <div className="flex items-center gap-2">
                  <button aria-label="Remover" onClick={() => setCart((c) => ({ ...c, [it.name]: Math.max(0, (c[it.name] ?? 0) - 1) }))} className="grid h-9 w-9 place-items-center rounded-full border border-white/15"><Minus className="h-4 w-4" /></button>
                  <span className="w-5 text-center font-black">{cart[it.name] ?? 0}</span>
                  <button aria-label="Adicionar" onClick={() => setCart((c) => ({ ...c, [it.name]: (c[it.name] ?? 0) + 1 }))} className="grid h-9 w-9 place-items-center rounded-full bg-white text-black"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Modal open={open} onClose={() => { setOpen(false); setPlaced(false); }} title={placed ? "Pedido confirmado" : `Seu pedido · ${mode}`}>
        {!placed ? (<div>
          {Object.entries(cart).filter(([, q]) => q > 0).map(([n, q]) => (<div key={n} className="flex items-center justify-between border-b border-neutral-100 py-2.5 text-sm"><span className="font-bold text-neutral-800">{q}x {n}</span><span className="font-extrabold">R$ {(((items.find((i) => i.name === n)?.price ?? 0) * q).toFixed(2)).replace(".", ",")}</span></div>))}
          <p className="mt-3 flex justify-between text-base font-black">Total <span>R$ {total.toFixed(2).replace(".", ",")}</span></p>
          <button onClick={() => setPlaced(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff3d00] py-3.5 text-sm font-black uppercase text-white"><ShoppingBag className="h-4 w-4" /> Finalizar · {mode}</button>
          <p className="mt-2 text-center text-[11px] text-neutral-400">Demonstração — pagamento e entrega simulados.</p>
        </div>) : (<div className="py-4 text-center"><p className="text-4xl">🛵</p><p className="mt-2 text-lg font-extrabold">Chegando em ~30 min!</p><p className="mt-1 text-sm text-neutral-500">Pedido demonstrativo. Em produção: Pix, cartão, acompanhamento e cupom automático.</p><button onClick={() => { setOpen(false); setPlaced(false); }} className="mt-4 w-full rounded-full bg-neutral-900 py-3 text-sm font-bold text-white">Fechar</button></div>)}
      </Modal>
      <DemoCTA context="Restaurante — Brasa & Rua (Urbano)" />
    </div>
  );
}

/* ============ 03 — CANTINA DA VÓ (familiar) ============ */
function CantinaVo() {
  const [order, setOrder] = useState(false);
  return (
    <div className="min-h-screen bg-[#faf4e8] font-sans text-[#3d2b1f]">
      <DemoBar segmentName="Restaurante" brand="Cantina da Vó" conceptId="03" siblings={["01", "02", "03"]} segmentSlug="restaurante" context="Restaurante — Cantina da Vó (Familiar)" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <span className="text-xl font-extrabold">🍝 Cantina da Vó Lúcia</span>
        <div className="hidden gap-6 text-[13px] font-bold md:flex"><a href="#pratos">Pratos</a><a href="#historia">História</a><a href="#visite">Visite</a></div>
        <button onClick={() => setOrder(true)} className="rounded-full bg-[#2f7d4f] px-5 py-2.5 text-[13px] font-extrabold text-white transition hover:bg-[#35925c]">Pedir agora</button>
      </nav>
      <header className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2f7d4f]/10 px-4 py-1.5 text-[12px] font-bold text-[#2f7d4f]"><Star className="h-3.5 w-3.5 fill-current" /> 4.8 · o restaurante mais amado do bairro</span>
          <h1 className="mt-4 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">Comida de vó, feita com amor de verdade.</h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#3d2b1f]/70">Receitas passadas de geração em geração, porções generosas e aquele cheirinho de domingo. Peça direto pelo site, sem app e sem taxa absurda.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setOrder(true)} className="rounded-full bg-[#2f7d4f] px-7 py-3.5 text-sm font-extrabold text-white">Ver pratos do dia</button>
            <a href="#historia" className="rounded-full border border-[#3d2b1f]/20 px-7 py-3.5 text-sm font-bold">Nossa história</a>
          </div>
        </div>
        <img src={img("photo-1556910103-1c02745aae4d")} alt="Cozinha familiar" className="h-96 w-full rounded-[2rem] object-cover shadow-xl" />
      </header>
      <section id="pratos" className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-3xl font-extrabold tracking-tight">Os queridinhos da casa</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[{ n: "Lasanha da Vó", p: "R$ 42", d: "6 camadas, molho da casa, queijo gratinado.", i: "photo-1619894991209-9f9694be045a" }, { n: "Feijoada de domingo", p: "R$ 38", d: "Serve 2, com couve, farofa e torresmo.", i: "photo-1547592180-85f173990554" }, { n: "Frango caipira", p: "R$ 36", d: "Com polenta cremosa e quiabo.", i: "photo-1598103442097-8b74394b95c6" }].map((p) => (
            <article key={p.n} className="overflow-hidden rounded-3xl border border-[#3d2b1f]/10 bg-white">
              <img src={img(p.i, 700)} alt={p.n} loading="lazy" className="h-52 w-full object-cover" />
              <div className="p-5"><h3 className="text-lg font-extrabold">{p.n}</h3><p className="mt-1 text-[13px] text-[#3d2b1f]/60">{p.d}</p><div className="mt-3 flex items-center justify-between"><span className="text-lg font-black text-[#2f7d4f]">{p.p}</span><button onClick={() => setOrder(true)} className="rounded-full bg-[#3d2b1f] px-4 py-2 text-[12px] font-bold text-white">Adicionar</button></div></div>
            </article>
          ))}
        </div>
      </section>
      <section id="historia" className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#3d2b1f] text-[#faf4e8] md:grid-cols-2">
          <div className="p-8 sm:p-12"><h2 className="text-3xl font-extrabold">Desde 1974, a mesma panela.</h2><p className="mt-4 text-sm leading-relaxed text-white/70">Tudo começou com a Vó Lúcia vendendo marmitas na porta de casa. Hoje os netos tocam a cantina, mas o tempero continua o mesmo — e a foto dela segue na parede da entrada.</p><Stars /></div>
          <img src={img("photo-1517248135467-4c7edcad34c4", 800)} alt="Salão" className="h-72 w-full object-cover md:h-full" />
        </div>
      </section>
      <section id="visite" className="mx-auto max-w-6xl px-5 pb-14">
        <div className="rounded-[2rem] border border-[#3d2b1f]/10 bg-white p-8 text-center">
          <p className="inline-flex items-center gap-1.5 text-[13px] font-bold"><MapPin className="h-4 w-4" /> Rua do Comércio, 88 — Centro · Seg–Sáb 11h–15h / 18h–22h</p>
          <p className="mt-2 text-sm text-[#3d2b1f]/60">Retirada no balcão ou delivery no bairro. Peça direto e economize a taxa do app.</p>
        </div>
      </section>
      <Modal open={order} onClose={() => setOrder(false)} title="Pedir — Cantina da Vó">
        <p className="text-sm text-neutral-500">Escolha e chame no WhatsApp — demonstração de pedido direto, sem intermediário.</p>
        <div className="mt-3 grid gap-2">{["Lasanha da Vó — R$ 42", "Feijoada — R$ 38", "Frango caipira — R$ 36"].map((o) => (<a key={o} href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="rounded-2xl border border-neutral-200 p-3.5 text-sm font-bold transition hover:border-neutral-900">{o}</a>))}</div>
      </Modal>
      <DemoCTA context="Restaurante — Cantina da Vó (Familiar)" />
    </div>
  );
}

export default function RestauranteDemo({ concept }: { concept: string }) {
  if (concept === "02") return <BrasaRua />;
  if (concept === "03") return <CantinaVo />;
  return <CasaNostra />;
}
