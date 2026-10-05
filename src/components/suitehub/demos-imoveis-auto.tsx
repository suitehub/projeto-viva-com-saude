import { useMemo, useState } from "react";
import { Bath, BedDouble, CalendarCheck, Car as CarIcon, Fuel, Gauge, MapPin, Ruler, Settings2 } from "lucide-react";
import { DemoBar, DemoCTA, Modal } from "@/components/suitehub/demo-ui";

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const PROPS = [
  { id: 1, title: "Casa Horizonte — 420m²", price: "R$ 2.850.000", beds: 4, baths: 5, area: 420, loc: "Alphaville, SP", img: img("photo-1600596542815-ffad4c1539a9", 700), tag: "Alto padrão" },
  { id: 2, title: "Residencial Parque", price: "R$ 780.000", beds: 3, baths: 2, area: 96, loc: "Campinas, SP", img: img("photo-1568605114967-8130f3a36994", 700), tag: "Novo" },
  { id: 3, title: "Loft Central", price: "R$ 540.000", beds: 1, baths: 1, area: 58, loc: "Pinheiros, SP", img: img("photo-1502672260266-1c1ef2d93688", 700), tag: "Investidor" },
  { id: 4, title: "Casa Jardim", price: "R$ 1.240.000", beds: 3, baths: 3, area: 180, loc: "Curitiba, PR", img: img("photo-1600585154340-be6161a56a0c", 700), tag: "Família" },
  { id: 5, title: "Cobertura Vista", price: "R$ 1.980.000", beds: 3, baths: 4, area: 210, loc: "Vila Nova, SP", img: img("photo-1600607687939-ce8a6c25118c", 700), tag: "Cobertura" },
  { id: 6, title: "Casa Lago", price: "R$ 3.400.000", beds: 5, baths: 6, area: 520, loc: "Bragança, SP", img: img("photo-1512917774080-9991f1c4c750", 700), tag: "Exclusivo" },
];

function PropCard({ p, onOpen, accent = "bg-neutral-900" }: { p: (typeof PROPS)[number]; onOpen: () => void; accent?: string }) {
  return (
    <button onClick={onOpen} className="overflow-hidden rounded-3xl border border-neutral-200 bg-white text-left transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative"><img src={p.img} alt={p.title} loading="lazy" className="h-56 w-full object-cover" /><span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold text-white ${accent}`}>{p.tag}</span></div>
      <div className="p-5"><p className="text-xl font-black">{p.price}</p><h3 className="mt-0.5 font-bold">{p.title}</h3><p className="flex items-center gap-1 text-[12px] text-neutral-500"><MapPin className="h-3.5 w-3.5" />{p.loc}</p>
        <div className="mt-3 flex gap-4 text-[12px] font-semibold text-neutral-600"><span className="inline-flex items-center gap-1"><BedDouble className="h-4 w-4" />{p.beds}</span><span className="inline-flex items-center gap-1"><Bath className="h-4 w-4" />{p.baths}</span><span className="inline-flex items-center gap-1"><Ruler className="h-4 w-4" />{p.area}m²</span></div></div>
    </button>
  );
}

function PropModal({ p, onClose, brand }: { p: (typeof PROPS)[number] | null; onClose: () => void; brand: string }) {
  const [visit, setVisit] = useState(false);
  return (
    <Modal open={!!p} onClose={() => { onClose(); setVisit(false); }} title={p?.title ?? ""}>
      {p && (!visit ? (
        <div><img src={p.img} alt={p.title} className="h-60 w-full rounded-2xl object-cover" />
          <p className="mt-3 text-2xl font-black">{p.price}</p><p className="text-sm text-neutral-500">{p.loc} · {p.beds} quartos · {p.baths} banheiros · {p.area}m²</p>
          <p className="mt-2 text-sm text-neutral-600">Demonstração de página do imóvel — galeria, descrição, mapa e corretor responsável ({brand}).</p>
          <button onClick={() => setVisit(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-sm font-extrabold text-white"><CalendarCheck className="h-4 w-4" /> Agendar visita</button></div>
      ) : (
        <div className="py-4 text-center"><p className="text-lg font-extrabold">Visita solicitada! 🏡</p><p className="mt-1 text-sm text-neutral-500">O corretor confirmaria no WhatsApp. Demonstração.</p><button onClick={() => { onClose(); setVisit(false); }} className="mt-4 w-full rounded-full bg-neutral-900 py-3 text-sm font-bold text-white">Fechar</button></div>
      ))}
    </Modal>
  );
}

export function ImobiliariaDemo({ concept }: { concept: string }) {
  const [q, setQ] = useState("");
  const [beds, setBeds] = useState(0);
  const [sel, setSel] = useState<(typeof PROPS)[number] | null>(null);
  const list = useMemo(() => PROPS.filter((p) => (beds === 0 || p.beds >= beds) && (p.title + p.loc).toLowerCase().includes(q.toLowerCase())), [q, beds]);

  if (concept === "01")
    return (
      <div className="min-h-screen bg-[#0c0b09] font-sans text-[#efe9dc]">
        <DemoBar segmentName="Imobiliária" brand="Alto Vale" conceptId="01" siblings={["01","02","03"]} segmentSlug="imobiliaria" context="Imobiliária — Alto Vale (Luxury)" />
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><span className="tracking-[0.3em] text-sm font-bold">ALTO VALE · PRIVATE</span><button className="border border-white/30 px-5 py-2 text-[12px] font-bold uppercase tracking-widest">Falar com especialista</button></nav>
        <header className="relative"><img src={img("photo-1600596542815-ffad4c1539a9",1600)} alt="Mansão" className="h-[72vh] w-full object-cover" /><div className="absolute inset-0 bg-black/45" /><div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center"><p className="text-[11px] font-bold uppercase tracking-[0.4em] text-amber-200">Curadoria private · 12 casas</p><h1 className="mt-2 max-w-3xl text-5xl font-extrabold sm:text-7xl">Residências extraordinárias.</h1></div></header>
        <section className="mx-auto grid max-w-6xl gap-5 px-5 py-12 sm:grid-cols-2">{PROPS.slice(0,4).map((p) => (<PropCard key={p.id} p={p} onOpen={() => setSel(p)} accent="bg-black/70" />))}</section>
        <PropModal p={sel} onClose={() => setSel(null)} brand="Alto Vale" />
        <DemoCTA context="Imobiliária — Alto Vale" dark />
      </div>
    );

  if (concept === "03")
    return (
      <div className="min-h-screen bg-[#f3f7f2] font-sans text-neutral-900">
        <DemoBar segmentName="Imobiliária" brand="Casa & Terra" conceptId="03" siblings={["01","02","03"]} segmentSlug="imobiliaria" context="Imobiliária — Casa & Terra" />
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><span className="text-xl font-black text-emerald-800">🏡 Casa & Terra</span><a href="https://wa.me/5511999999999" className="rounded-full bg-emerald-700 px-5 py-2.5 text-[13px] font-bold text-white">Falar com corretor</a></nav>
        <header className="mx-auto max-w-6xl px-5 py-8"><h1 className="max-w-xl text-4xl font-black sm:text-5xl">Aqui no bairro, quem entende é a gente.</h1><p className="mt-2 text-neutral-500">12 anos vendendo e alugando na região. Pode chamar: (11) 3456-7890.</p></header>
        <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-14 sm:grid-cols-2 lg:grid-cols-3">{PROPS.map((p) => (<PropCard key={p.id} p={p} onOpen={() => setSel(p)} accent="bg-emerald-700" />))}</section>
        <PropModal p={sel} onClose={() => setSel(null)} brand="Casa & Terra" />
        <DemoCTA context="Imobiliária — Casa & Terra" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans text-neutral-900">
      <DemoBar segmentName="Imobiliária" brand="LarGO" conceptId="02" siblings={["01","02","03"]} segmentSlug="imobiliaria" context="Imobiliária — LarGO (Marketplace)" />
      <nav className="border-b border-neutral-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5"><span className="text-xl font-black text-blue-700">largo<span className="text-neutral-900">.imob</span></span><span className="hidden text-[13px] text-neutral-500 sm:block">2.400 imóveis · 18 cidades</span></div>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 pb-4 sm:flex-row"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por bairro, cidade ou nome..." className="h-11 flex-1 rounded-full border border-neutral-300 bg-white px-5 text-sm outline-none focus:border-blue-600" /><div className="flex gap-1.5">{[0,1,2,3,4].map((b) => (<button key={b} onClick={() => setBeds(b)} className={`rounded-full px-4 py-2 text-[12px] font-bold ${beds === b ? "bg-blue-700 text-white" : "bg-neutral-100"}`}>{b === 0 ? "Todos" : `${b}+ q`}</button>))}</div></div></nav>
      <main className="mx-auto grid max-w-6xl gap-4 px-5 py-8 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => (<PropCard key={p.id} p={p} onOpen={() => setSel(p)} accent="bg-blue-700" />))}{list.length === 0 && <p className="col-span-full py-10 text-center text-sm text-neutral-400">Nenhum imóvel com esse filtro. Tente outro termo.</p>}</main>
      <PropModal p={sel} onClose={() => setSel(null)} brand="LarGO" />
      <DemoCTA context="Imobiliária — LarGO" />
    </div>
  );
}

/* ================= VEÍCULOS ================= */
const CARS = [
  { id: 1, name: "Porsche 911 Carrera", price: "R$ 789.000", year: 2023, km: "8.000 km", gear: "PDK", fuel: "Gasolina", img: img("photo-1503376780353-7e6692767b70", 700) },
  { id: 2, name: "BMW M4 Competition", price: "R$ 549.000", year: 2022, km: "15.000 km", gear: "Automático", fuel: "Gasolina", img: img("photo-1555215695-3004980ad54e", 700) },
  { id: 3, name: "Mustang GT500", price: "R$ 629.000", year: 2023, km: "5.000 km", gear: "Automático", fuel: "Gasolina", img: img("photo-1492144534655-ae79c964c9d7", 700) },
  { id: 4, name: "Audi RS6", price: "R$ 699.000", year: 2022, km: "20.000 km", gear: "Automático", fuel: "Gasolina", img: img("photo-1603584173870-7f23fdae1b7a", 700) },
  { id: 5, name: "Civic Touring", price: "R$ 189.900", year: 2021, km: "38.000 km", gear: "CVT", fuel: "Flex", img: img("photo-1606664515524-ed2f786a0bd6", 700) },
  { id: 6, name: "Corolla Altis", price: "R$ 159.900", year: 2020, km: "52.000 km", gear: "CVT", fuel: "Híbrido", img: img("photo-1621007947382-bb3c3994e3fb", 700) },
];

function CarModal({ c, onClose }: { c: (typeof CARS)[number] | null; onClose: () => void }) {
  const [sim, setSim] = useState(false);
  return (
    <Modal open={!!c} onClose={() => { onClose(); setSim(false); }} title={c?.name ?? ""}>
      {c && (!sim ? (
        <div><img src={c.img} alt={c.name} className="h-56 w-full rounded-2xl object-cover" />
          <p className="mt-3 text-2xl font-black">{c.price}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[13px] font-semibold text-neutral-600"><span className="inline-flex items-center gap-1.5"><Gauge className="h-4 w-4" />{c.km}</span><span>📅 {c.year}</span><span className="inline-flex items-center gap-1.5"><Settings2 className="h-4 w-4" />{c.gear}</span><span className="inline-flex items-center gap-1.5"><Fuel className="h-4 w-4" />{c.fuel}</span></div>
          <button onClick={() => setSim(true)} className="mt-4 w-full rounded-full bg-neutral-900 py-3.5 text-sm font-extrabold text-white">Simular financiamento</button></div>
      ) : (
        <div className="py-2"><p className="font-extrabold">Simulação demonstrativa</p><p className="mt-1 text-sm text-neutral-500">{c.name} · entrada R$ 60 mil + 48x de R$ 4.890. Aprovação em minutos, troca com troco.</p><button onClick={() => { onClose(); setSim(false); }} className="mt-4 w-full rounded-full bg-neutral-900 py-3 text-sm font-bold text-white">Quero proposta no WhatsApp</button></div>
      ))}
    </Modal>
  );
}

export function VeiculosDemo({ concept }: { concept: string }) {
  const [sel, setSel] = useState<(typeof CARS)[number] | null>(null);

  if (concept === "02")
    return (
      <div className="min-h-screen bg-black font-sans text-white">
        <DemoBar segmentName="Veículos" brand="APEX GARAGE" conceptId="02" siblings={["01","02","03"]} segmentSlug="veiculos" context="Veículos — Apex (Performance)" />
        <nav className="flex items-center justify-between border-b border-white/10 px-5 py-4"><span className="text-xl font-black italic text-[#ff2d20]">APEX▲GARAGE</span><span className="text-[12px] font-bold text-white/50">0–100 em 3.2s</span></nav>
        <header className="relative"><img src={img("photo-1492144534655-ae79c964c9d7",1600)} alt="Esportivo" className="h-[66vh] w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" /><div className="absolute bottom-0 p-6"><h1 className="text-6xl font-black italic sm:text-8xl">POTÊNCIA<br />REAL.</h1></div></header>
        <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 sm:grid-cols-2">{CARS.slice(0,4).map((c) => (<button key={c.id} onClick={() => setSel(c)} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-left"><img src={c.img} alt={c.name} loading="lazy" className="h-56 w-full object-cover" /><div className="p-5"><h3 className="font-black italic">{c.name}</h3><p className="text-[#ff2d20] font-black">{c.price}</p></div></button>))}</section>
        <CarModal c={sel} onClose={() => setSel(null)} />
        <DemoCTA context="Veículos — Apex" dark />
      </div>
    );

  if (concept === "03")
    return (
      <div className="min-h-screen bg-[#f2f6fa] font-sans text-neutral-900">
        <DemoBar segmentName="Veículos" brand="Bom Negócio" conceptId="03" siblings={["01","02","03"]} segmentSlug="veiculos" context="Veículos — Bom Negócio (Seminovos)" />
        <nav className="bg-[#0e76bc] px-5 py-3.5 text-white"><div className="mx-auto flex max-w-6xl items-center justify-between"><span className="text-lg font-black">✓ Bom Negócio Seminovos</span><span className="hidden text-[12px] sm:block">Aprovado na perícia · Garantia 1 ano</span></div></nav>
        <header className="mx-auto max-w-6xl px-5 py-8"><h1 className="text-4xl font-black">Seminovo bom, parcela que cabe.</h1><p className="mt-1 text-sm text-neutral-500">Troca com troco · Primeira parcela p/ 90 dias · WhatsApp sempre aberto.</p></header>
        <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-12 sm:grid-cols-2 lg:grid-cols-3">{CARS.map((c) => (<button key={c.id} onClick={() => setSel(c)} className="overflow-hidden rounded-3xl bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><img src={c.img} alt={c.name} loading="lazy" className="h-48 w-full object-cover" /><div className="p-4"><h3 className="font-extrabold">{c.name}</h3><p className="text-[12px] text-neutral-500">{c.year} · {c.km}</p><p className="mt-1 text-lg font-black text-[#0e76bc]">{c.price}</p></div></button>))}</section>
        <CarModal c={sel} onClose={() => setSel(null)} />
        <DemoCTA context="Veículos — Bom Negócio" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b0b0c] font-sans text-white">
      <DemoBar segmentName="Veículos" brand="Prime Motors" conceptId="01" siblings={["01","02","03"]} segmentSlug="veiculos" context="Veículos — Prime Motors (Premium)" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><span className="tracking-[0.28em] text-sm font-bold">PRIME MOTORS</span><button className="border border-white/25 px-5 py-2 text-[12px] font-bold uppercase">Agendar visita</button></nav>
      <header className="relative"><img src={img("photo-1503376780353-7e6692767b70",1600)} alt="Premium" className="h-[70vh] w-full object-cover" /><div className="absolute inset-0 bg-black/50" /><div className="absolute inset-0 flex flex-col items-center justify-center text-center"><h1 className="max-w-2xl text-5xl font-extrabold sm:text-7xl">Curadoria de alto padrão.</h1><p className="mt-3 text-sm text-white/70">Blindados, esportivos e colecionáveis com procedência total.</p></div></header>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-12 sm:grid-cols-2">{CARS.slice(0,4).map((c) => (<button key={c.id} onClick={() => setSel(c)} className="group overflow-hidden rounded-2xl bg-white/[0.04] text-left"><div className="flex items-center gap-1 px-5 pt-4 text-[12px] text-white/50"><CarIcon className="h-4 w-4" />{c.year} · {c.km}</div><img src={c.img} alt={c.name} loading="lazy" className="mt-2 h-64 w-full object-cover transition duration-500 group-hover:scale-[1.02]" /><div className="p-5"><h3 className="text-xl font-extrabold">{c.name}</h3><p className="font-black">{c.price}</p></div></button>))}</section>
      <CarModal c={sel} onClose={() => setSel(null)} />
      <DemoCTA context="Veículos — Prime Motors" dark />
    </div>
  );
}
