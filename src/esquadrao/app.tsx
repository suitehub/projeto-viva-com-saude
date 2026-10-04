import { useMemo, useState, type ReactNode } from "react";
import {
  Home, Shield, Users, ClipboardCheck, CalendarDays, Trophy, Camera, BarChart3,
  Settings, Search, Bell, Plus, ChevronRight, ChevronLeft, Star, Flame, Bird,
  Check, X, MapPin, Clock, Menu, Sparkles, Medal, Target, Shirt, QrCode,
} from "lucide-react";
import { UNITS, MEMBERS, REQ_INDIVIDUAIS, REQ_UNIDADE, REQ_CONSELHEIRO, EVENTS, MISSIONS, GALLERY, FREQ_HISTORY, type UnitId, type Member } from "./data";

type Screen = "dashboard"|"unidades"|"unidade"|"desbravadores"|"membro"|"requisitos"|"frequencia"|"agenda"|"eventos"|"missoes"|"ranking"|"premiacoes"|"galeria"|"relatorios"|"config"|"mais";
interface Route { screen: Screen; unitId?: UnitId; memberId?: string; eventId?: string; }

const unitOf = (id?: UnitId) => UNITS.find(u=>u.id===id) ?? UNITS[0];
const memberOf = (id?: string) => MEMBERS.find(m=>m.id===id) ?? MEMBERS[0];
const unitMembers = (id: UnitId) => MEMBERS.filter(m=>m.unit===id);

function Logo({ size=44 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div style={{width:size,height:size}} className="grid shrink-0 place-items-center text-cyan-300">
        <Shield style={{width:"72%",height:"72%"}} />
      </div>
      <div className="leading-none">
        <p className="text-[9px] font-bold tracking-[0.28em] text-cyan-300">CLUBE</p>
        <p className="text-[15px] font-black tracking-tight text-white">ESQUADRÃO<br/><span className="text-cyan-300">DO CÉU</span></p>
      </div>
    </div>
  );
}

function Progress({ v, color="#F5B82E", h="h-2" }: { v:number; color?:string; h?:string }) {
  return <div className={`w-full overflow-hidden rounded-full bg-white/10 ${h}`}><div className="h-full rounded-full transition-all" style={{width:`${v}%`,background:color,boxShadow:`0 0 12px ${color}`}}/></div>;
}
function Ring({ v, size=110, color="#38BDF8" }: { v:number; size?:number; color?:string }) {
  const r=(size-12)/2, c=2*Math.PI*r;
  return (
    <div className="relative grid place-items-center" style={{width:size,height:size}}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,.1)" strokeWidth={10} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c-(c*v/100)} style={{filter:`drop-shadow(0 0 8px ${color})`}}/>
      </svg>
      <div className="absolute text-center"><p className="text-2xl font-black text-white">{v}%</p><p className="text-[10px] text-slate-400">concluído</p></div>
    </div>
  );
}
function UnitIcon({ id, className="h-10 w-10" }: { id: UnitId; className?: string }) {
  if (id==="aguias") return <Bird className={`${className} text-amber-300`} />;
  if (id==="fenix") return <Flame className={`${className} text-orange-400`} />;
  return <Star className={`${className} text-sky-300`} />;
}
function AwardBadge({ a }: { a: Member["award"] }) {
  const c = a==="Ouro"?"bg-amber-400/15 text-amber-300 ring-amber-400/40":a==="Prata"?"bg-slate-300/15 text-slate-200 ring-slate-300/40":"bg-orange-500/15 text-orange-300 ring-orange-500/40";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${c}`}><Medal className="h-3 w-3"/>{a}</span>;
}

const NAV = [
  { id:"dashboard" as Screen, label:"Início", icon:Home },
  { id:"unidades" as Screen, label:"Unidades", icon:Shield },
  { id:"desbravadores" as Screen, label:"Desbravadores", icon:Users },
  { id:"requisitos" as Screen, label:"Requisitos", icon:ClipboardCheck },
  { id:"agenda" as Screen, label:"Agenda", icon:CalendarDays },
  { id:"eventos" as Screen, label:"Eventos", icon:Target },
  { id:"ranking" as Screen, label:"Ranking", icon:Trophy },
  { id:"galeria" as Screen, label:"Galeria", icon:Camera },
  { id:"relatorios" as Screen, label:"Relatórios", icon:BarChart3 },
  { id:"config" as Screen, label:"Configurações", icon:Settings },
];
const BOTTOM = [
  { id:"dashboard" as Screen, label:"Início", icon:Home },
  { id:"unidades" as Screen, label:"Unidades", icon:Shield },
  { id:"eventos" as Screen, label:"Eventos", icon:CalendarDays },
  { id:"ranking" as Screen, label:"Ranking", icon:BarChart3 },
  { id:"mais" as Screen, label:"Mais", icon:Menu },
];

export default function EsquadraoApp() {
  const [logged, setLogged] = useState(false);
  const [route, setRoute] = useState<Route>({ screen:"dashboard" });
  const go = (screen: Screen, extra?: Partial<Route>) => { setRoute({ screen, ...extra }); window.scrollTo({top:0}); };
  const [search, setSearch] = useState("");
  const [unitTab, setUnitTab] = useState("Visão geral");
  const [reqTab, setReqTab] = useState("Individuais");
  const [freqTab, setFreqTab] = useState("Presença");
  const [galFilter, setGalFilter] = useState("Todos");
  const [rankFilter, setRankFilter] = useState("Geral");
  const [checked, setChecked] = useState<Set<string>>(new Set(["r0","r1","r2","r4","r5"]));
  const [freq, setFreq] = useState<Record<string,{p:"P"|"A";u:"C"|"I"|"-"}>>({});
  const [modal, setModal] = useState<null|"evento"|"membro"|"foto"|"missao">(null);
  const [toast, setToast] = useState<string|null>(null);
  const [history, setHistory] = useState<string>(UNITS[0].history);
  const [warcry, setWarcry] = useState<string>(UNITS[0].warcryFull);
  const [editingStory, setEditingStory] = useState(false);
  const [formEvent, setFormEvent] = useState({ name:"", date:"", time:"", place:"", type:"Reunião" });
  const [agendaView, setAgendaView] = useState<"Mês"|"Lista">("Mês");

  const say = (t:string) => { setToast(t); setTimeout(()=>setToast(null),2200); };
  const toggleReq = (k:string) => { const n=new Set(checked); if(n.has(k))n.delete(k);else n.add(k); setChecked(n); };
  const setP = (mid:string,p:"P"|"A") => setFreq(s=>({...s,[mid]:{p,u:s[mid]?.u??"-"}}));
  const setU = (mid:string,u:"C"|"I"|"-") => setFreq(s=>({...s,[mid]:{p:s[mid]?.p??"P",u}}));
  const markAll = () => { const o:typeof freq={}; MEMBERS.slice(0,8).forEach(m=>o[m.id]={p:"P",u:"C"}); setFreq(o); say("Todos marcados como presentes"); };

  const filteredMembers = useMemo(()=>MEMBERS.filter(m=>m.name.toLowerCase().includes(search.toLowerCase())),[search]);

  if (!logged) return <Login onEnter={()=>setLogged(true)} />;

  const r = route;
  const activeUnit = unitOf(r.unitId);

  return (
    <div className="min-h-screen bg-[#050B11] font-sans text-[#F5F8FC] antialiased" style={{fontFamily:"Manrope,Inter,system-ui,sans-serif"}}>
      {/* TOP GLOW */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/3 h-72 w-[40rem] rounded-full bg-[#009FE3]/15 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* SIDEBAR DESKTOP */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-[#07121c]/95 p-5 lg:flex">
          <button onClick={()=>go("dashboard")} className="text-left"><Logo /></button>
          <nav className="mt-8 flex-1 space-y-1 overflow-y-auto">
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>go(n.id)} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition ${r.screen===n.id||(n.id==="unidades"&&r.screen==="unidade")||(n.id==="desbravadores"&&r.screen==="membro") ? "bg-gradient-to-r from-[#009FE3]/30 to-[#009FE3]/10 text-white shadow-[inset_0_0_0_1px_rgba(0,159,227,.35),0_0_20px_rgba(0,159,227,.25)]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <n.icon className="h-[18px] w-[18px]" />{n.label}
                {n.id==="requisitos" && <ChevronRight className="ml-auto h-4 w-4 opacity-50"/>}
              </button>
            ))}
            <button onClick={()=>go("missoes")} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold ${r.screen==="missoes"?"bg-[#009FE3]/20 text-white":"text-slate-400 hover:text-white hover:bg-white/5"}`}><Sparkles className="h-[18px] w-[18px]"/>Missões</button>
            <button onClick={()=>go("frequencia")} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold ${r.screen==="frequencia"?"bg-[#009FE3]/20 text-white":"text-slate-400 hover:text-white hover:bg-white/5"}`}><QrCode className="h-[18px] w-[18px]"/>Frequência</button>
            <button onClick={()=>go("premiacoes")} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold ${r.screen==="premiacoes"?"bg-[#009FE3]/20 text-white":"text-slate-400 hover:text-white hover:bg-white/5"}`}><Medal className="h-[18px] w-[18px]"/>Premiações</button>
          </nav>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" className="h-10 w-10 rounded-full object-cover ring-2 ring-cyan-400/40" alt="Henrique"/>
            <div className="min-w-0"><p className="truncate text-[13px] font-bold">Henrique Castro</p><p className="text-[11px] text-slate-400">Diretor do Clube</p></div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* HEADER */}
          <header className="sticky top-0 z-20 border-b border-white/5 bg-[#050B11]/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
              <div className="lg:hidden"><Logo size={36}/></div>
              {(r.screen==="unidade"||r.screen==="membro") && (
                <button onClick={()=>go(r.screen==="unidade"?"unidades":"unidade",{unitId:r.unitId})} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5"><ChevronLeft className="h-4 w-4"/></button>
              )}
              <h1 className="hidden text-[15px] font-extrabold capitalize sm:block lg:hidden">{titleOf(r)}</h1>
              <div className="ml-auto flex items-center gap-2.5">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"/>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar desbravadores, eventos..." className="w-64 rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-4 text-[13px] outline-none placeholder:text-slate-500 focus:border-cyan-400/50"/>
                </div>
                <button onClick={()=>say("3 notificações não lidas")} className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]"><Bell className="h-4 w-4"/><span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[9px] font-black">4</span></button>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-300/60" alt="avatar"/>
              </div>
            </div>
            <div className="px-4 pb-3 sm:hidden">
              <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar desbravador..." className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-4 text-[13px] outline-none placeholder:text-slate-500"/></div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-5 lg:pb-10">
            {r.screen==="dashboard" && <Dashboard go={go} say={say} />}
            {r.screen==="unidades" && <Unidades go={go} />}
            {r.screen==="unidade" && <UnidadePerfil unit={activeUnit} tab={unitTab} setTab={setUnitTab} go={go} say={say} history={history} setHistory={setHistory} warcry={warcry} setWarcry={setWarcry} editing={editingStory} setEditing={setEditingStory} />}
            {r.screen==="desbravadores" && <Desbravadores list={filteredMembers} go={go} say={say} setModal={setModal} />}
            {r.screen==="membro" && <MembroPerfil m={memberOf(r.memberId)} go={go} />}
            {r.screen==="requisitos" && <Requisitos tab={reqTab} setTab={setReqTab} checked={checked} toggle={toggleReq} say={say} />}
            {r.screen==="frequencia" && <Frequencia tab={freqTab} setTab={setFreqTab} freq={freq} setP={setP} setU={setU} markAll={markAll} say={say} />}
            {r.screen==="agenda" && <Agenda view={agendaView} setView={setAgendaView} go={go} say={say} setModal={setModal} />}
            {r.screen==="eventos" && <Eventos go={go} say={say} setModal={setModal} />}
            {r.screen==="missoes" && <Missoes say={say} />}
            {r.screen==="ranking" && <Ranking filter={rankFilter} setFilter={setRankFilter} go={go} />}
            {r.screen==="premiacoes" && <Premiacoes say={say} />}
            {r.screen==="galeria" && <Galeria f={galFilter} setF={setGalFilter} say={say} setModal={setModal} />}
            {r.screen==="relatorios" && <Relatorios />}
            {r.screen==="config" && <Config say={say} />}
            {r.screen==="mais" && <Mais go={go} say={say} setLogged={setLogged} />}
          </main>

          {/* BOTTOM NAV MOBILE */}
          <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#07121c]/95 backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-md grid-cols-5 px-2 py-2">
              {BOTTOM.map(b=>(
                <button key={b.id} onClick={()=>go(b.id)} className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-bold ${r.screen===b.id?"text-cyan-300":"text-slate-500"}`}>
                  <b.icon className={`h-5 w-5 ${r.screen===b.id?"drop-shadow-[0_0_8px_rgba(0,159,227,.8)]":""}`}/>{b.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* MODAIS */}
      {modal==="evento" && (
        <Modal onClose={()=>setModal(null)} title="Novo evento">
          <label className="lbl">Nome</label><input value={formEvent.name} onChange={e=>setFormEvent({...formEvent,name:e.target.value})} placeholder="Ex: Reunião regular" className="inp"/>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div><label className="lbl">Data</label><input value={formEvent.date} onChange={e=>setFormEvent({...formEvent,date:e.target.value})} placeholder="05/11/2026" className="inp"/></div>
            <div><label className="lbl">Horário</label><input value={formEvent.time} onChange={e=>setFormEvent({...formEvent,time:e.target.value})} placeholder="19:00" className="inp"/></div>
          </div>
          <div className="mt-3"><label className="lbl">Local</label><input value={formEvent.place} onChange={e=>setFormEvent({...formEvent,place:e.target.value})} placeholder="IASD Central" className="inp"/></div>
          <div className="mt-3"><label className="lbl">Tipo</label><div className="flex flex-wrap gap-2">{["Reunião","Acampamento","Investidura","Caminhada","Evento externo","Outro"].map(t=><button key={t} onClick={()=>setFormEvent({...formEvent,type:t})} className={`rounded-full px-3 py-1.5 text-[12px] font-bold ring-1 ${formEvent.type===t?"bg-cyan-500/20 text-cyan-200 ring-cyan-400/50":"bg-white/5 text-slate-400 ring-white/10"}`}>{t}</button>)}</div></div>
          <div className="mt-4 space-y-2">{["Registrar frequência","Registrar fardamento","Gerar pontuação"].map(o=><label key={o} className="flex items-center gap-2 text-[13px] text-slate-300"><span className="grid h-5 w-5 place-items-center rounded-md bg-cyan-500"><Check className="h-3.5 w-3.5 text-white"/></span>{o}</label>)}</div>
          <button onClick={()=>{setModal(null);say("Evento criado com sucesso");}} className="btn-primary mt-5">Criar evento</button>
        </Modal>
      )}
      {modal==="membro" && (
        <Modal onClose={()=>setModal(null)} title="Adicionar membro">
          <label className="lbl">Nome completo</label><input placeholder="Ex: Davi Silva" className="inp"/>
          <div className="mt-3 grid grid-cols-2 gap-3"><div><label className="lbl">Idade</label><input placeholder="12" className="inp"/></div><div><label className="lbl">Classe</label><input placeholder="Amigo" className="inp"/></div></div>
          <div className="mt-3"><label className="lbl">Unidade</label><div className="flex gap-2">{UNITS.map(u=><span key={u.id} className="rounded-full bg-white/5 px-3 py-1.5 text-[12px] font-bold ring-1 ring-white/10">{u.short}</span>)}</div></div>
          <button onClick={()=>{setModal(null);say("Desbravador adicionado");}} className="btn-primary mt-5">Adicionar</button>
        </Modal>
      )}
      {modal==="foto" && (
        <Modal onClose={()=>setModal(null)} title="Adicionar foto">
          <div className="grid h-36 place-items-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] text-slate-400"><Camera className="h-8 w-8"/></div>
          <button onClick={()=>{setModal(null);say("Foto enviada para aprovação");}} className="btn-primary mt-4">Enviar foto</button>
        </Modal>
      )}
      {toast && <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-cyan-400/30 bg-[#0A1B2A] px-5 py-2.5 text-[13px] font-bold shadow-[0_0_30px_rgba(0,159,227,.4)] lg:bottom-8">{toast}</div>}
      <style>{`.lbl{font-size:12px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em}.inp{margin-top:6px;width:100%;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);padding:10px 14px;font-size:14px;outline:none;color:#fff}.inp:focus{border-color:rgba(56,189,248,.6)}.btn-primary{display:flex;width:100%;align-items:center;justify-content:center;gap:8px;border-radius:14px;background:linear-gradient(135deg,#009FE3,#0077ff);padding:13px;font-size:14px;font-weight:800;box-shadow:0 12px 30px rgba(0,159,227,.4)}`}</style>
    </div>
  );
}

function titleOf(r: Route) {
  const m: Record<string,string> = {dashboard:"Início",unidades:"Unidades",unidade:"Águias",desbravadores:"Desbravadores",membro:"Pedro Henrique",requisitos:"Requisitos",frequencia:"Frequência",agenda:"Agenda",eventos:"Eventos",missoes:"Missões",ranking:"Ranking",premiacoes:"Premiações",galeria:"Galeria",relatorios:"Relatórios",config:"Configurações",mais:"Mais"};
  return m[r.screen] ?? "Esquadrão do Céu";
}

function Login({ onEnter }: { onEnter:()=>void }) {
  const [email,setEmail]=useState("henrique@esquadraodoceu.com"); const [pass,setPass]=useState("esquadrao123");
  return (
    <div className="grid min-h-screen bg-[#050B11] text-white lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80" className="absolute inset-0 h-full w-full object-cover opacity-50" alt="bg"/>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B11] via-[#050B11]/60 to-transparent"/>
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo />
          <div><h2 className="max-w-md text-5xl font-black leading-[1.05]">O futuro do seu clube começa aqui.</h2><p className="mt-4 text-white/60">Menos planilhas. Mais tempo para liderar.</p>
          <div className="mt-8 flex gap-3">{[["24","Desbravadores"],["3","Unidades"],["87%","Frequência"]].map(([a,b])=><div key={b} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur"><p className="text-xl font-black text-cyan-300">{a}</p><p className="text-[11px] text-white/60">{b}</p></div>)}</div></div>
          <p className="font-script text-2xl italic text-white/70" style={{fontFamily:"cursive"}}>“Mais que um clube, uma missão.”</p>
        </div>
      </div>
      <div className="relative flex items-center justify-center overflow-hidden px-6 py-10">
        <img src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80" className="absolute inset-0 h-full w-full object-cover opacity-20 lg:hidden" alt=""/>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B11]/60 to-[#050B11]"/>
        <div className="relative w-full max-w-sm">
          <div className="mx-auto w-fit lg:hidden"><Logo size={64}/></div>
          <h1 className="mt-6 text-center text-2xl font-black lg:text-left lg:text-3xl">O futuro do seu clube<br/>começa aqui.</h1>
          <p className="mt-2 text-center text-[13px] text-slate-400 lg:text-left">Menos planilhas. Mais tempo para liderar.</p>
          <div className="mt-6 space-y-3">
            <div className="relative"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail" className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3.5 pl-4 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400/60"/></div>
            <div className="relative"><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Senha" className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3.5 pl-4 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400/60"/></div>
            <p className="text-right text-[12px] font-bold text-cyan-300">Esqueci minha senha?</p>
            <button onClick={onEnter} className="w-full rounded-xl bg-gradient-to-r from-[#009FE3] to-[#0077ff] py-3.5 text-sm font-black shadow-[0_16px_40px_rgba(0,159,227,.45)] transition hover:brightness-110">Entrar</button>
            <p className="text-center text-[12px] text-slate-500">ou continue com</p>
            <button onClick={onEnter} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-bold"><span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[12px] font-black text-blue-600">G</span>Continuar com Google</button>
            <p className="pt-2 text-center text-[12px] text-slate-500">Não tem uma conta? <span className="font-bold text-cyan-300">Fale com o diretor.</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ DASHBOARD ============ */
function Dashboard({ go, say }: { go:(s:Screen, e?:Partial<Route>)=>void; say:(t:string)=>void }) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-white/10">
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80" className="absolute inset-0 h-full w-full object-cover" alt="hero"/>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B11] via-[#050B11]/80 to-transparent"/>
        <div className="relative p-6 sm:p-8">
          <h2 className="text-2xl font-black sm:text-3xl">Olá, Henrique!</h2>
          <p className="mt-1 text-[13px] text-slate-300">Veja como está o Esquadrão do Céu hoje.</p>
          <p className="mt-4 hidden max-w-[220px] text-right font-script text-lg italic text-white/80 sm:ml-auto sm:block" style={{fontFamily:"cursive"}}>“Mais que um clube, uma missão.”</p>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              {v:"24",l:"Desbravadores",d:"+12% este mês",icon:Users},
              {v:"87%",l:"Frequência média",d:"+8% este mês",icon:CalendarDays},
              {v:"82%",l:"Requisitos concluídos",d:"+15% este mês",icon:Medal},
              {v:"3",l:"Unidades ativas",d:"Águias, Fênix e Stelar",icon:Shield},
            ].map(c=>(
              <div key={c.l} className="rounded-2xl border border-white/10 bg-[#0A1622]/90 p-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-2"><c.icon className="h-5 w-5 text-cyan-300"/><p className="text-2xl font-black">{c.v}</p></div>
                <p className="mt-1 text-[12px] text-slate-400">{c.l}</p>
                <p className="mt-1 text-[11px] font-bold text-emerald-400">↑ {c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="rounded-3xl border border-white/10 bg-[#081220] p-5">
            <div className="flex items-center justify-between"><h3 className="flex items-center gap-2 font-extrabold"><BarChart3 className="h-4 w-4 text-cyan-300"/>Desempenho das Unidades</h3><button onClick={()=>go("ranking")} className="text-[12px] font-bold text-cyan-300">Ver ranking completo →</button></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {UNITS.map(u=>(
                <button key={u.id} onClick={()=>go("unidade",{unitId:u.id})} className={`group overflow-hidden rounded-2xl border bg-gradient-to-b text-left transition hover:-translate-y-0.5 ${u.border} ${u.gradient}`}>
                  <div className="relative h-28 overflow-hidden">
                    <img src={u.id==="aguias"?"https://images.unsplash.com/photo-1611685434378-d1d7b3b3b3b3?auto=format&fit=crop&w=600&q=80":"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"} onError={(e)=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80"}} className="h-full w-full object-cover opacity-60 transition group-hover:scale-105" alt={u.name}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                    <span className="absolute right-2 top-2 rounded-lg bg-black/60 px-2 py-1 text-[11px] font-black text-amber-300 ring-1 ring-amber-400/40">{u.rank}° lugar</span>
                    <div className="absolute bottom-1 left-0 right-0 text-center"><UnitIcon id={u.id} className="mx-auto h-9 w-9 drop-shadow-[0_0_12px_rgba(255,255,255,.4)]"/><p className="text-lg font-black tracking-wide">{u.name}</p><p className="text-[11px] italic text-white/70">“{u.warcry}”</p></div>
                  </div>
                  <div className="space-y-2.5 p-4">
                    <div><div className="flex justify-between text-[12px]"><span className="font-black">{u.stats.req}%</span><span className="text-slate-400">Requisitos</span></div><Progress v={u.stats.req}/></div>
                    <div><div className="flex justify-between text-[12px]"><span className="font-black">{u.stats.freq}%</span><span className="text-slate-400">Frequência</span></div><Progress v={u.stats.freq} color="#38BDF8"/></div>
                    <div><div className="flex justify-between text-[12px]"><span className="font-black">{u.stats.events}%</span><span className="text-slate-400">Eventos</span></div><Progress v={u.stats.events} color="#35D07F"/></div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-3"><span className="flex items-center gap-1 text-[13px] font-black text-amber-300"><Star className="h-4 w-4 fill-amber-300"/>{u.stats.points.toLocaleString("pt-BR")} pontos</span><span className="text-[11px] text-slate-400">8 membros <ChevronRight className="inline h-3 w-3"/></span></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#081220] p-5">
              <h3 className="font-extrabold">Frequência nas últimas reuniões</h3>
              <div className="mt-4 flex h-40 items-end gap-3">
                {FREQ_HISTORY.map(f=><div key={f.d} className="flex flex-1 flex-col items-center gap-1.5"><span className="text-[10px] font-bold text-cyan-300">{f.v}%</span><div className="w-full rounded-t-lg bg-gradient-to-t from-[#0077ff] to-[#38BDF8]" style={{height:`${f.v*1.3}px`,boxShadow:"0 0 16px rgba(56,189,248,.4)"}}/><span className="text-[10px] text-slate-500">{f.d}</span></div>)}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#081220] p-5">
              <h3 className="font-extrabold">Requisitos do clube</h3>
              <div className="mt-3 flex items-center gap-4">
                <Ring v={82}/>
                <div className="flex-1 space-y-2 text-[13px]">{[["Individuais","78%","#F5B82E"],["Unidades","85%","#38BDF8"],["Conselheiros","81%","#35D07F"]].map(([a,b,c])=><div key={a} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{background:c}}/><span className="text-slate-300">{a}</span><span className="ml-auto font-black">{b}</span></div>)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-[#081220] p-5">
            <div className="flex items-center justify-between"><h3 className="font-extrabold">Próximo evento</h3><button onClick={()=>go("agenda")} className="text-[12px] font-bold text-cyan-300">Ver agenda →</button></div>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex gap-3"><div className="grid h-16 w-14 shrink-0 place-items-center rounded-xl bg-white/10"><div className="text-center"><p className="text-[10px] font-bold text-slate-400">OUT</p><p className="text-2xl font-black">05</p></div></div>
              <div><p className="font-extrabold">Reunião regular</p><p className="flex items-center gap-1 text-[12px] text-slate-400"><Clock className="h-3 w-3"/>19:00 - 21:00</p><p className="flex items-center gap-1 text-[12px] text-slate-400"><MapPin className="h-3 w-3"/>IASD Central</p></div></div>
              <button onClick={()=>go("eventos")} className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#009FE3] to-[#0077ff] py-2.5 text-[13px] font-extrabold">Ver detalhes →</button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#081220] p-5">
            <div className="flex items-center justify-between"><h3 className="font-extrabold">Eventos do mês</h3><button onClick={()=>go("eventos")} className="text-[12px] font-bold text-cyan-300">Ver todos →</button></div>
            <div className="mt-3 space-y-3">{EVENTS.slice(0,4).map(e=><button key={e.id} onClick={()=>go("eventos")} className="flex w-full items-center gap-3 text-left"><span className="grid h-11 w-10 shrink-0 place-items-center rounded-lg bg-white/5 text-center ring-1 ring-white/10"><span><span className="block text-[9px] font-bold text-slate-400">{e.month}</span><span className="block text-[15px] font-black leading-none">{e.day}</span></span></span><span className="min-w-0"><span className="block truncate text-[13px] font-bold">{e.name}</span><span className="block truncate text-[11px] text-slate-500">{e.time} · {e.place}</span></span><span className="ml-auto h-2.5 w-2.5 rounded-full" style={{background:e.color}}/></button>)}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#081220] p-5">
            <div className="flex items-center justify-between"><h3 className="font-extrabold">Atividades recentes</h3><span className="text-[12px] text-cyan-300">Ver todas →</span></div>
            <div className="mt-3 space-y-3 text-[12px]">{[["Pedro Henrique concluiu um requisito","há 2 horas"],["Unidade Fênix completou uma missão","há 5 horas"],["Maria Clara foi marcada presente","há 1 dia"],["Nova foto adicionada na galeria","há 1 dia"]].map(([a,b])=><div key={a} className="flex gap-2.5"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" className="h-8 w-8 rounded-full object-cover" alt=""/><div><p className="font-semibold leading-snug">{a}</p><p className="text-slate-500">{b}</p></div></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Unidades({ go }: { go:(s:Screen,e?:Partial<Route>)=>void }) {
  return (
    <div>
      <h2 className="text-xl font-black">Unidades</h2><p className="text-[13px] text-slate-400">3 unidades no Esquadrão do Céu</p>
      <div className="mt-4 space-y-4">
        {UNITS.map(u=>(
          <div key={u.id} className={`overflow-hidden rounded-3xl border ${u.border} bg-gradient-to-b ${u.gradient} p-5`}>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-black/40 ring-1 ring-white/15"><UnitIcon id={u.id}/></div>
              <div><p className="text-lg font-black">{u.short} <span className="ml-2 rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] text-amber-300 ring-1 ring-amber-400/40">{u.rank}° lugar</span></p><p className="text-[12px] italic text-white/60">“{u.warcry}”</p><p className="text-[12px] text-slate-400">8 desbravadores</p></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[[u.stats.req,"Requisitos"],[u.stats.freq,"Frequência"],[u.stats.events,"Eventos"]].map(([v,l])=><div key={l as string}><p className="text-lg font-black">{v}%</p><p className="text-[11px] text-slate-400">{l}</p></div>)}
            </div>
            <button onClick={()=>go("unidade",{unitId:u.id})} className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#009FE3] to-[#0077ff] py-2.5 text-[13px] font-extrabold">Ver unidade →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function UnidadePerfil({ unit, tab, setTab, go, say, history, setHistory, warcry, setWarcry, editing, setEditing }: any) {
  const members = unitMembers(unit.id);
  const tabs = ["Visão geral","Membros","Requisitos","Missões","História","Fotos"];
  return (
    <div>
      <div className={`relative overflow-hidden rounded-3xl border ${unit.border}`}>
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80" className="absolute inset-0 h-full w-full object-cover opacity-40" alt=""/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B11] via-transparent to-transparent"/>
        <div className="relative p-6 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-black/50 ring-2 ring-white/20 backdrop-blur"><UnitIcon id={unit.id} className="h-11 w-11"/></div>
          <h2 className="mt-2 text-2xl font-black">{unit.name}</h2><p className="text-[13px] italic text-white/70">“{unit.warcry}”</p>
          <div className="mx-auto mt-3 flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-black/50 p-3 text-left backdrop-blur">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" className="h-10 w-10 rounded-full object-cover" alt=""/><div><p className="text-[11px] text-slate-400">Conselheiro</p><p className="text-[13px] font-bold">{unit.counselor}</p></div>
            <div className="ml-auto flex items-center gap-1 text-[12px] text-slate-300"><Users className="h-4 w-4"/>8 desbravadores</div>
          </div>
          <div className="mx-auto mt-3 flex max-w-md items-center justify-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5"><Trophy className="h-5 w-5 text-amber-300"/><span className="font-black text-amber-300">{unit.rank}° lugar</span><span className="text-[12px] text-amber-200/80">{unit.stats.points.toLocaleString("pt-BR")} pontos</span></div>
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{tabs.map(t=><button key={t} onClick={()=>setTab(t)} className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-bold ring-1 ${tab===t?"bg-cyan-500/20 text-cyan-200 ring-cyan-400/50":"bg-white/5 text-slate-400 ring-white/10"}`}>{t}</button>)}</div>

      {tab==="Visão geral" && (
        <div className="mt-4 rounded-3xl border border-white/10 bg-[#081220] p-5">
          <h3 className="font-extrabold">Desempenho da Unidade</h3>
          <div className="mt-4 space-y-3">{[["Requisitos",unit.stats.req,"#F5B82E"],["Frequência",unit.stats.freq,"#38BDF8"],["Eventos",unit.stats.events,"#35D07F"],["Fardamento",unit.stats.uniform,"#A78BFA"]].map(([l,v,c])=><div key={l as string}><div className="flex justify-between text-[13px]"><span className="text-slate-300">{l}</span><span className="font-black">{v}%</span></div><div className="mt-1"><Progress v={v as number} color={c as string}/></div></div>)}</div>
          <button onClick={()=>go("ranking")} className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#009FE3] to-[#0077ff] py-2.5 text-[13px] font-extrabold">Ver ranking geral →</button>
        </div>
      )}
      {tab==="Membros" && (
        <div className="mt-4">
          <div className="flex items-center justify-between"><h3 className="font-extrabold">Membros da unidade <span className="text-slate-500">· 8 desbravadores</span></h3></div>
          <div className="mt-3 space-y-2.5">{members.map((m:Member)=><button key={m.id} onClick={()=>go("membro",{memberId:m.id,unitId:unit.id})} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#081220] p-3 text-left transition hover:border-cyan-400/40"><img src={m.avatar} className="h-11 w-11 rounded-full object-cover" alt=""/><div className="min-w-0"><p className="truncate text-[13px] font-bold">{m.name}</p><p className="text-[11px] text-slate-500">{m.role}</p></div><div className="ml-auto text-right"><p className="text-[13px] font-black">{m.progress}%</p><AwardBadge a={m.award}/></div><ChevronRight className="h-4 w-4 text-slate-600"/></button>)}</div>
        </div>
      )}
      {tab==="Requisitos" && <ReqList compact onToggle={()=>say("Requisito atualizado")} />}
      {tab==="Missões" && <MissionList unitId={unit.id} say={say} />}
      {tab==="História" && (
        <div className="mt-4 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-[#081220] p-5">
            <div className="flex items-center justify-between"><h3 className="font-extrabold tracking-wide">SOBRE A UNIDADE</h3><button onClick={()=>setEditing(!editing)} className="rounded-full bg-cyan-500/20 px-3 py-1 text-[12px] font-bold text-cyan-200 ring-1 ring-cyan-400/40">{editing?"Salvar":"Editar"}</button></div>
            <p className="mt-1 text-[12px] text-slate-500">Fundada em {unit.founded} · Conselheiro {unit.counselor}</p>
            {editing ? <textarea value={history} onChange={e=>setHistory(e.target.value)} rows={6} className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-[13px] leading-relaxed outline-none"/> : <p className="mt-3 text-[13px] leading-relaxed text-slate-300">{unit.id==="aguias"?history:unit.history}</p>}
            <h4 className="mt-5 font-extrabold tracking-wide">GRITO DE GUERRA</h4>
            {editing ? <textarea value={warcry} onChange={e=>setWarcry(e.target.value)} rows={2} className="mt-2 w-full rounded-xl border border-amber-400/30 bg-amber-400/5 p-3 text-center text-[14px] font-black text-amber-200 outline-none"/> : <p className="mt-2 whitespace-pre-line rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-center text-[15px] font-black leading-relaxed text-amber-200">{unit.id==="aguias"?warcry:unit.warcryFull}</p>}
            {editing && <button onClick={()=>{setEditing(false);say("História salva");}} className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#009FE3] to-[#0077ff] py-2.5 text-[13px] font-extrabold">Salvar alterações</button>}
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#081220] p-5"><h3 className="font-extrabold">MOMENTOS DA UNIDADE</h3><div className="mt-3 grid grid-cols-3 gap-2">{GALLERY.slice(0,6).map(g=><img key={g.id} src={g.url} className="h-24 w-full rounded-xl object-cover" alt=""/>)}</div></div>
        </div>
      )}
      {tab==="Fotos" && (
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">{GALLERY.map(g=><img key={g.id} src={g.url} className="h-36 w-full rounded-2xl object-cover" alt=""/>)}</div>
      )}
    </div>
  );
}

function ReqList({ compact=false, onToggle }: { compact?:boolean; onToggle:()=>void }) {
  const [local,setLocal]=useState<Set<number>>(new Set([0,1,2,3,4,5]));
  const toggle=(i:number)=>{const n=new Set(local); if(n.has(i))n.delete(i);else n.add(i);setLocal(n);onToggle();};
  return (
    <div className={`mt-4 rounded-3xl border border-white/10 bg-[#081220] p-5 ${compact?"":""}`}>
      {!compact && <div className="flex items-center gap-3"><img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" className="h-11 w-11 rounded-full object-cover" alt=""/><div><p className="font-bold">Pedro Henrique</p><p className="text-[12px] text-slate-500">Desbravador | Águias</p></div></div>}
      <div className="mt-3 rounded-2xl bg-white/[0.03] p-3"><div className="flex justify-between text-[12px]"><span>Progresso de classe</span><span className="font-black">18 de 21 · 86%</span></div><div className="mt-2"><Progress v={86} color="#38BDF8"/></div></div>
      <div className="mt-3 space-y-1">{REQ_INDIVIDUAIS.slice(0,compact?6:12).map((t,i)=>(
        <button key={t} onClick={()=>toggle(i)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5">
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ${local.has(i)?"bg-emerald-500 ring-emerald-400":"bg-transparent ring-white/20"}`}>{local.has(i)&&<Check className="h-3.5 w-3.5 text-white"/>}</span>
          <span className={`text-[13px] ${local.has(i)?"text-slate-200":"text-slate-400"}`}>{t}</span>
        </button>))}
      </div>
    </div>
  );
}

function Desbravadores({ list, go, say, setModal }: any) {
  return (
    <div>
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-black">Desbravadores</h2><p className="text-[13px] text-slate-400">24 membros no clube</p></div><button onClick={()=>setModal("membro")} className="flex items-center gap-1 rounded-full bg-cyan-500/20 px-4 py-2 text-[12px] font-bold text-cyan-200 ring-1 ring-cyan-400/40"><Plus className="h-4 w-4"/>Adicionar</button></div>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {list.map((m:Member)=>(
          <button key={m.id} onClick={()=>go("membro",{memberId:m.id,unitId:m.unit})} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#081220] p-3 text-left hover:border-cyan-400/40">
            <img src={m.avatar} className="h-12 w-12 rounded-full object-cover" alt=""/><div className="min-w-0"><p className="truncate text-[13px] font-bold">{m.name}</p><p className="text-[11px] text-slate-500">{m.age} anos · {unitOf(m.unit).short}</p><AwardBadge a={m.award}/></div>
            <div className="ml-auto text-right"><p className="text-[14px] font-black text-cyan-300">{m.progress}%</p><p className="text-[10px] text-slate-500">{m.points} pts</p></div>
          </button>))}
      </div>
    </div>
  );
}

function MembroPerfil({ m, go }: { m:Member; go:(s:Screen,e?:Partial<Route>)=>void }) {
  const [t,setT]=useState("Visão geral");
  const u=unitOf(m.unit);
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-white/10">
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80" className="absolute inset-0 h-full w-full object-cover opacity-40" alt=""/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B11] via-[#050B11]/40 to-transparent"/>
        <div className="relative flex flex-col items-center p-6 text-center">
          <img src={m.avatar} className="h-20 w-20 rounded-full object-cover ring-4 ring-cyan-400/50" alt=""/>
          <h2 className="mt-2 text-xl font-black">{m.name}</h2><p className="text-[12px] text-slate-300">{m.role} | {m.age} anos</p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold ring-1 ring-white/20"><UnitIcon id={m.unit} className="h-4 w-4"/>{u.short}</span>
        </div>
      </div>
      <div className="mt-3 flex gap-2">{["Visão geral","Requisitos","Frequência"].map(x=><button key={x} onClick={()=>setT(x)} className={`flex-1 rounded-full py-2 text-[12px] font-bold ring-1 ${t===x?"bg-cyan-500/20 text-cyan-200 ring-cyan-400/50":"bg-white/5 text-slate-400 ring-white/10"}`}>{x}</button>)}</div>
      {t==="Visão geral" && (
        <div className="mt-4 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-[#081220] p-5 text-center"><h3 className="text-left font-extrabold">Progresso geral</h3>
            <div className="mx-auto mt-2 w-fit"><Ring v={m.progress}/></div>
            <p className="mt-1 text-[12px] text-slate-400">{m.reqDone} de {m.reqTotal} requisitos concluídos</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-left text-[12px]">{[["Requisitos",m.progress,"#F5B82E"],["Frequência",m.freq,"#38BDF8"],["Eventos",m.events,"#35D07F"],["Fardamento",m.uniform,"#A78BFA"]].map(([l,v,c])=><div key={l as string} className="rounded-xl bg-white/[0.03] p-2.5"><div className="flex justify-between"><span className="text-slate-400">{l}</span><span className="font-black">{v}%</span></div><div className="mt-1.5"><Progress v={v as number} color={c as string} h="h-1.5"/></div></div>)}</div>
          </div>
          <div className="flex items-center gap-3 rounded-3xl border border-amber-400/25 bg-amber-400/5 p-4"><Medal className="h-9 w-9 text-amber-300"/><div><p className="text-[12px] text-slate-400">Premiação atual</p><p className="font-black text-amber-300">{m.award} · {m.points.toLocaleString("pt-BR")} pontos</p></div><ChevronRight className="ml-auto h-4 w-4 text-slate-500"/></div>
          <div className="rounded-3xl border border-white/10 bg-[#081220] p-5"><div className="flex justify-between"><h3 className="font-extrabold">Próximos requisitos</h3><button onClick={()=>go("requisitos")} className="text-[12px] font-bold text-cyan-300">Ver todos</button></div>
            <div className="mt-2 space-y-2">{["Completar especialidade de Primeiros Socorros","Participar do acampamento"].map(x=><div key={x} className="flex items-center gap-2.5 text-[13px] text-slate-300"><span className="h-5 w-5 rounded-full border border-white/25"/><span>{x}</span></div>)}</div>
          </div>
        </div>)}
      {t!=="Visão geral" && <ReqList onToggle={()=>{}} />}
    </div>
  );
}

function Requisitos({ tab,setTab,checked,toggle,say }: any) {
  const tabs=["Individuais","Unidade","Conselheiro"];
  const arr: string[] = tab==="Individuais"?REQ_INDIVIDUAIS:tab==="Unidade"?REQ_UNIDADE:REQ_CONSELHEIRO;
  const done = tab==="Individuais"?18:tab==="Unidade"?23:12;
  const total = tab==="Individuais"?21:tab==="Unidade"?25:15;
  const pct = Math.round(done/total*100);
  return (
    <div>
      <h2 className="text-xl font-black">Requisitos</h2>
      <div className="mt-3 flex gap-2">{tabs.map(t=><button key={t} onClick={()=>setTab(t)} className={`flex-1 rounded-full py-2 text-[12px] font-bold ring-1 ${tab===t?"bg-cyan-500/25 text-white ring-cyan-400/60":"bg-white/5 text-slate-400 ring-white/10"}`}>{t}</button>)}</div>
      <div className="mt-4 rounded-3xl border border-white/10 bg-[#081220] p-5">
        <div className="flex items-center gap-3"><img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" className="h-11 w-11 rounded-full object-cover" alt=""/><div><p className="font-bold">Pedro Henrique</p><p className="text-[12px] text-slate-500">Desbravador | Águias</p></div><span className="ml-auto text-lg font-black text-cyan-300">{pct}%</span></div>
        <div className="mt-3"><Progress v={pct} color="#38BDF8"/><p className="mt-1.5 text-[12px] text-slate-400">Progresso de classe · {done} de {total} concluídos</p></div>
        <div className="mt-3 space-y-0.5">{arr.map((t,i)=>{const k=`${tab}-${i}`;const on=checked.has(k)||i<5;return(
          <button key={t+i} onClick={()=>{toggle(k);say(on?"Requisito desmarcado":"Requisito concluído +10 pts");}} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-white/5">
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 transition ${on?"bg-emerald-500 ring-emerald-300 shadow-[0_0_12px_rgba(52,211,153,.6)]":"ring-white/25"}`}>{on&&<Check className="h-3.5 w-3.5 text-white"/>}</span>
            <span className={`text-[13.5px] ${on?"text-white":"text-slate-400"}`}>{t}</span>
          </button>);})}</div>
      </div>
    </div>
  );
}

function Frequencia({ tab,setTab,freq,setP,setU,markAll,say }: any) {
  const rows = MEMBERS.slice(0,6);
  const get=(id:string)=>freq[id]??{p:"P" as const,u:"C" as const};
  return (
    <div>
      <div className="flex items-center gap-3"><div className="grid h-14 w-12 place-items-center rounded-2xl bg-cyan-500/20 ring-1 ring-cyan-400/40"><div className="text-center"><p className="text-[10px] font-bold text-cyan-300">05</p><p className="text-[10px] text-slate-400">OUT</p></div></div>
        <div><h2 className="font-black">Frequência</h2><p className="text-[12px] text-slate-400">Reunião regular · 05 de outubro · 19:00 - 21:00 | IASD Central</p></div></div>
      <div className="mt-3 flex gap-2">{["Presença","Fardamento"].map(t=><button key={t} onClick={()=>setTab(t)} className={`flex-1 rounded-xl py-2.5 text-[13px] font-bold ${tab===t?"bg-gradient-to-r from-[#009FE3] to-[#0077ff]":"bg-white/5 text-slate-400"}`}>{t}</button>)}</div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
        <div className="hidden grid-cols-[1fr_130px_130px] gap-2 bg-white/[0.04] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 sm:grid"><span>Desbravador</span><span className="text-center">Presença</span><span className="text-center">Fardamento</span></div>
        {rows.map((m)=>{const s=get(m.id);return(
          <div key={m.id} className="grid grid-cols-[1fr_auto] items-center gap-2 border-t border-white/5 px-4 py-3 sm:grid-cols-[1fr_130px_130px]">
            <div className="flex items-center gap-2.5"><img src={m.avatar} className="h-9 w-9 rounded-full object-cover" alt=""/><div><p className="text-[13px] font-bold">{m.name}</p><div className="flex gap-1 sm:hidden"><button onClick={()=>setP(m.id,"P")} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.p==="P"?"bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/50":"bg-white/5 text-slate-500"}`}>Presente</button><button onClick={()=>setU(m.id,"C")} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.u==="C"?"bg-emerald-500/20 text-emerald-300":"bg-white/5 text-slate-500"}`}>Completo</button></div></div></div>
            <div className="hidden justify-center sm:flex"><button onClick={()=>setP(m.id,s.p==="P"?"A":"P")} className={`rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${s.p==="P"?"bg-emerald-500/15 text-emerald-300 ring-emerald-400/40":"bg-red-500/15 text-red-300 ring-red-400/40"}`}>{s.p==="P"?"Presente":"Ausente"}</button></div>
            <div className="hidden justify-center sm:flex"><button onClick={()=>setU(m.id,s.u==="C"?"I":"C")} className={`rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${s.u==="C"?"bg-emerald-500/15 text-emerald-300 ring-emerald-400/40":s.u==="I"?"bg-amber-500/15 text-amber-300 ring-amber-400/40":"bg-white/5 text-slate-500"}`}>{s.u==="C"?"Completo":s.u==="I"?"Incompleto":"—"}</button></div>
            <div className="flex gap-1.5 sm:hidden"><button onClick={()=>setP(m.id,s.p==="P"?"A":"P")} className={`h-9 w-9 rounded-full text-[13px] ${s.p==="P"?"bg-emerald-500":"bg-white/10"}`}>{s.p==="P"?"✓":"✕"}</button><button onClick={()=>setU(m.id,s.u==="C"?"I":"C")} className={`h-9 w-9 rounded-full ${s.u==="C"?"bg-emerald-500":"bg-amber-500/60"}`}><Shirt className="mx-auto h-4 w-4"/></button></div>
          </div>);})}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3"><button onClick={markAll} className="rounded-xl border border-white/15 bg-white/5 py-3 text-[13px] font-bold">Marcar todos presentes</button><button onClick={()=>say("Chamada salva · +100 pts")} className="rounded-xl bg-gradient-to-r from-[#009FE3] to-[#0077ff] py-3 text-[13px] font-extrabold shadow-[0_10px_30px_rgba(0,159,227,.4)]">Salvar chamada</button></div>
      <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-[12px] text-slate-400">Fardamento por evento: <span className="text-emerald-300">● Completo</span> · <span className="text-amber-300">● Incompleto</span> · <span className="text-red-300">● Não informado</span> — uniforme, lenço e insígnias avaliados.</p>
    </div>
  );
}

function Agenda({ view,setView,go,say,setModal }: any) {
  const days = Array.from({length:31},(_,i)=>i+1);
  const marked: Record<number,string> = {5:"#38BDF8",10:"#35D07F",17:"#A78BFA",24:"#94A3B8"};
  return (
    <div>
      <div className="flex items-center justify-between"><h2 className="text-xl font-black">Agenda</h2><button onClick={()=>setModal("evento")} className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-r from-[#009FE3] to-[#0077ff] shadow-lg"><Plus className="h-5 w-5"/></button></div>
      <div className="mt-3 flex gap-2">{["Mês","Lista"].map(v=><button key={v} onClick={()=>setView(v)} className={`rounded-full px-5 py-1.5 text-[12px] font-bold ${view===v?"bg-cyan-500/25 text-white ring-1 ring-cyan-400/50":"text-slate-500"}`}>{v}</button>)}</div>
      {(view==="Mês"||true) && (
        <div className="mt-3 rounded-3xl border border-white/10 bg-[#081220] p-5">
          <p className="text-center font-extrabold">Outubro 2026</p>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500">{["D","S","T","Q","Q","S","S"].map((d,i)=><span key={i}>{d}</span>)}</div>
          <div className="mt-1 grid grid-cols-7 gap-1">{[null,null,null,1,2,3,4,...days.slice(4)].slice(0,35).map((d,i)=>d===null?<span key={i}/>:(
            <button key={i} onClick={()=>say(`Dia ${d} selecionado`)} className={`aspect-square rounded-full text-[12px] font-bold ${marked[d as number]?`text-white ring-1`:d===5?"bg-cyan-500 text-white":"text-slate-400 hover:bg-white/5"}`} style={marked[d as number]?{background:marked[d as number]+"33",boxShadow:`0 0 0 1.5px ${marked[d as number]}`}:{}}>{d}</button>))}</div>
          <div className="mt-4 space-y-2.5">{EVENTS.slice(0,4).map(e=><button key={e.id} onClick={()=>go("eventos")} className="flex w-full items-center gap-3 rounded-2xl bg-white/[0.03] p-3 text-left ring-1 ring-white/5 hover:ring-cyan-400/30"><span className="grid h-11 w-10 place-items-center rounded-lg bg-white/5 text-center"><span><span className="block text-[9px] font-bold text-slate-400">{e.day}<br/>{e.month}</span></span></span><span><span className="block text-[13px] font-bold">{e.name}</span><span className="block text-[11px] text-slate-500">{e.time} | {e.place}</span></span><span className="ml-auto h-2.5 w-2.5 rounded-full" style={{background:e.color}}/></button>)}</div>
        </div>)}
    </div>
  );
}

function Eventos({ go,say,setModal }: any) {
  return (
    <div>
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-black">Eventos</h2><p className="text-[13px] text-slate-400">Outubro 2026 · 5 eventos</p></div><button onClick={()=>setModal("evento")} className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#009FE3] to-[#0077ff] px-4 py-2.5 text-[13px] font-extrabold shadow-[0_10px_30px_rgba(0,159,227,.4)]"><Plus className="h-4 w-4"/>Novo evento</button></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {EVENTS.map(e=>(
          <div key={e.id} className="rounded-3xl border border-white/10 bg-[#081220] p-4">
            <div className="flex items-center gap-3"><span className="grid h-14 w-12 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10"><span className="text-center"><span className="block text-[10px] font-bold text-slate-400">{e.month}</span><span className="block text-xl font-black">{e.day}</span></span></span>
              <div><span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{background:e.color+"22",color:e.color}}>{e.type}</span><p className="mt-0.5 font-extrabold">{e.name}</p><p className="flex items-center gap-1 text-[12px] text-slate-400"><Clock className="h-3 w-3"/>{e.time}</p><p className="flex items-center gap-1 text-[12px] text-slate-400"><MapPin className="h-3 w-3"/>{e.place} · +{e.points} pts</p></div></div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button onClick={()=>go("frequencia")} className="rounded-xl bg-white/5 py-2 text-[12px] font-bold ring-1 ring-white/10 hover:ring-cyan-400/40">Frequência</button>
              <button onClick={()=>go("frequencia")} className="rounded-xl bg-white/5 py-2 text-[12px] font-bold ring-1 ring-white/10 hover:ring-cyan-400/40">Fardamento</button>
              <button onClick={()=>say("Pontuação gerada")} className="rounded-xl bg-cyan-500/15 py-2 text-[12px] font-bold text-cyan-200 ring-1 ring-cyan-400/40">Pontuar</button>
            </div>
          </div>))}
      </div>
    </div>
  );
}

function MissionList({ unitId, say }: { unitId?: UnitId; say:(t:string)=>void }) {
  const list = unitId?MISSIONS.filter(m=>!m.unit||m.unit===unitId):MISSIONS;
  return (
    <div className="mt-4 space-y-3">
      {list.map(m=>(
        <div key={m.id} className="rounded-2xl border border-white/10 bg-[#081220] p-4">
          <div className="flex items-center gap-2"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${m.scope==="Unidade"?"bg-violet-500/15 text-violet-300 ring-violet-400/40":"bg-cyan-500/15 text-cyan-300 ring-cyan-400/40"}`}>{m.scope==="Unidade"?`Missão de unidade`:"Missão individual"}</span><span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${m.status==="Concluída"?"bg-emerald-500/15 text-emerald-300":"bg-amber-500/15 text-amber-300"}`}>{m.status}</span></div>
          <p className="mt-2 font-extrabold">{m.title}</p><p className="text-[13px] text-slate-400">{m.desc}</p>
          <div className="mt-2"><Progress v={m.progress} color={m.progress===100?"#35D07F":"#F5B82E"}/></div>
          <div className="mt-2 flex items-center justify-between"><span className="flex items-center gap-1 text-[13px] font-black text-amber-300"><Star className="h-4 w-4 fill-amber-300"/>+{m.reward} pontos</span><button onClick={()=>say("Progresso registrado")} className="rounded-full bg-white/5 px-4 py-1.5 text-[12px] font-bold ring-1 ring-white/15">Atualizar</button></div>
        </div>))}
    </div>
  );
}
function Missoes({ say }: { say:(t:string)=>void }) {
  const [f,setF]=useState("Todas");
  return (<div><h2 className="text-xl font-black">Missões</h2><p className="text-[13px] text-slate-400">Temporada 2026 · complete e ganhe pontos</p>
    <div className="mt-3 flex gap-2">{["Todas","Unidade","Individual"].map(t=><button key={t} onClick={()=>setF(t)} className={`rounded-full px-4 py-1.5 text-[12px] font-bold ring-1 ${f===t?"bg-cyan-500/25 text-white ring-cyan-400/50":"text-slate-500 ring-white/10"}`}>{t}</button>)}</div>
    <MissionList say={say}/></div>);
}

function Ranking({ filter,setFilter,go }: any) {
  const order=[...UNITS].sort((a,b)=>b.stats.points-a.stats.points);
  const max=order[0].stats.points;
  return (
    <div>
      <h2 className="text-center text-xl font-black">Ranking</h2><p className="text-center text-[13px] text-slate-400">Temporada 2026</p>
      <div className="mt-3 flex justify-center gap-2 overflow-x-auto">{["Geral","Requisitos","Frequência","Eventos","Missões"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold ring-1 ${filter===f?"bg-cyan-500/25 text-white ring-cyan-400/60":"bg-white/5 text-slate-400 ring-white/10"}`}>{f}</button>)}</div>
      <div className="mt-5 flex items-end justify-center gap-4">
        {order.map((u,i)=>(
          <button key={u.id} onClick={()=>go("unidade",{unitId:u.id})} className={`flex w-28 flex-col items-center ${i===0?"order-2":""} ${i===1?"order-1":""} ${i===2?"order-3":""}`}>
            <span className={`grid h-7 w-7 place-items-center rounded-full text-[12px] font-black ring-1 ${i===0?"bg-amber-400 text-black":"bg-white/10 text-slate-300 ring-white/20"}`}>{i+1}°</span>
            <div className={`mt-2 grid place-items-center rounded-3xl border p-3 ${i===0?"h-32 w-28 border-amber-400/50 bg-gradient-to-b from-amber-400/25 to-transparent shadow-[0_0_40px_rgba(245,184,46,.35)]":"h-24 w-24 border-white/10 bg-white/[0.03]"}`}><UnitIcon id={u.id} className={i===0?"h-12 w-12":"h-9 w-9"}/></div>
            <p className="mt-1.5 text-[13px] font-black">{u.short}</p><p className={`text-[12px] font-bold ${i===0?"text-amber-300":"text-slate-400"}`}>{u.stats.points.toLocaleString("pt-BR")} pts</p><p className="text-[11px] text-slate-500">{filter==="Geral"?"91%":filter==="Requisitos"?u.stats.req+"%":filter==="Frequência"?u.stats.freq+"%":u.stats.events+"%"}</p>
          </button>))}
      </div>
      <div className="mx-auto mt-5 max-w-lg space-y-2.5">
        <div className="grid grid-cols-[24px_1fr_auto_auto] items-center gap-2 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500"><span>#</span><span>Unidade</span><span>Pontos</span><span className="w-24 text-right">Progresso</span></div>
        {order.map((u,i)=>(
          <button key={u.id} onClick={()=>go("unidade",{unitId:u.id})} className={`grid w-full grid-cols-[24px_1fr_auto] items-center gap-2 rounded-2xl border p-3 text-left ${i===0?"border-amber-400/40 bg-amber-400/[0.06] shadow-[0_0_30px_rgba(245,184,46,.2)]":"border-white/10 bg-[#081220]"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[12px] font-black ${i===0?"bg-amber-400 text-black":i===1?"bg-slate-300 text-black":"bg-orange-700 text-white"}`}>{i+1}</span>
            <span className="flex items-center gap-2"><UnitIcon id={u.id} className="h-6 w-6"/><span className="text-[13px] font-bold">{u.short}</span></span>
            <span className="text-right"><span className="block text-[13px] font-black">{u.stats.points.toLocaleString("pt-BR")}</span><span className="block h-1.5 w-24 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full" style={{width:`${u.stats.points/max*100}%`,background:i===0?"#F5B82E":i===1?"#FB7185":"#38BDF8"}}/></span></span>
          </button>))}
      </div>
    </div>
  );
}

function Premiacoes({ say }: { say:(t:string)=>void }) {
  return (
    <div>
      <h2 className="text-xl font-black">Premiações</h2><p className="text-[13px] text-slate-400">Níveis configuráveis · Temporada 2026</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[["OURO","90% – 100%","#F5B82E","bg-amber-400/10 border-amber-400/30"],["PRATA","75% – 89%","#CBD5E1","bg-slate-300/10 border-slate-300/30"],["BRONZE","60% – 74%","#F97316","bg-orange-500/10 border-orange-500/30"]].map(([t,r,c,bg])=>(
          <div key={t} className={`rounded-3xl border p-5 text-center ${bg}`}><Medal className="mx-auto h-9 w-9" color={c}/><p className="mt-2 text-lg font-black" style={{color:c}}>{t}</p><p className="text-[12px] text-slate-300">{r}</p></div>))}
      </div>
      <div className="mt-4 space-y-2.5">{UNITS.map(u=>(
        <div key={u.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#081220] p-4"><UnitIcon id={u.id}/><div><p className="font-extrabold">{u.short}</p><p className="text-[12px] text-slate-400">{u.stats.req}% média geral</p></div><span className="ml-auto font-black text-amber-300">{u.rank===1?"Ouro":u.rank===2?"Prata":"Bronze"}</span></div>))}
      </div>
      <button onClick={()=>say("Configuração de faixas salva (protótipo)")} className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 py-3 text-[13px] font-bold">Editar faixas de premiação</button>
    </div>
  );
}

function Galeria({ f,setF,say,setModal }: any) {
  const filters=["Todos","Clube","Águias","Fênix","Stelar"];
  const list=GALLERY.filter(g=>f==="Todos"||g.unit===f);
  return (
    <div>
      <div className="flex items-center justify-between"><h2 className="text-xl font-black">Galeria</h2><button onClick={()=>setModal("foto")} className="flex items-center gap-1 rounded-full bg-cyan-500/20 px-4 py-2 text-[12px] font-bold text-cyan-200 ring-1 ring-cyan-400/40"><Plus className="h-4 w-4"/>Adicionar foto</button></div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{filters.map(x=><button key={x} onClick={()=>setF(x)} className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold ring-1 ${f===x?"bg-cyan-500/25 text-white ring-cyan-400/60":"bg-white/5 text-slate-400 ring-white/10"}`}>{x}</button>)}</div>
      <p className="mt-4 text-[13px] font-bold text-slate-300">Outubro 2026 · Reunião regular</p>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">{list.slice(0,4).map(g=><button key={g.id} onClick={()=>say(g.tag)} className="group relative overflow-hidden rounded-2xl"><img src={g.url} className="h-28 w-full object-cover transition group-hover:scale-105 sm:h-36" alt=""/><span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold backdrop-blur">{g.tag}</span></button>)}</div>
      <p className="mt-4 text-[13px] font-bold text-slate-300">Acampamento</p>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">{list.slice(4).map(g=><img key={g.id} src={g.url} className="h-28 w-full rounded-2xl object-cover sm:h-36" alt=""/>)}</div>
    </div>
  );
}

function Relatorios() {
  return (
    <div>
      <h2 className="text-xl font-black">Relatórios</h2><p className="text-[13px] text-slate-400">Desempenho do clube · Setembro/Outubro</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#081220] p-5"><h3 className="font-extrabold">Frequência das últimas reuniões</h3>
          <div className="mt-3 space-y-2">{FREQ_HISTORY.map(f=><div key={f.d} className="flex items-center gap-2 text-[12px]"><span className="w-10 text-slate-500">{f.d}</span><div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#009FE3] to-[#38BDF8]" style={{width:`${f.v}%`}}/></div><span className="w-9 text-right font-bold">{f.v}%</span></div>)}</div></div>
        <div className="rounded-3xl border border-white/10 bg-[#081220] p-5"><h3 className="font-extrabold">Participação em eventos</h3>
          <div className="mt-3 flex items-center justify-center gap-6"><Ring v={88} size={120} color="#35D07F"/><div className="space-y-1.5 text-[12px]">{[["Águias","100%"],["Fênix","90%"],["Stelar","85%"]].map(([a,b])=><div key={a} className="flex gap-2"><span className="text-slate-400">{a}</span><span className="font-bold">{b}</span></div>)}</div></div></div>
        <div className="rounded-3xl border border-white/10 bg-[#081220] p-5"><h3 className="font-extrabold">Ranking de pontos</h3>
          <div className="mt-3 space-y-2">{UNITS.map(u=><div key={u.id} className="flex items-center gap-2 text-[13px]"><UnitIcon id={u.id} className="h-5 w-5"/><span>{u.short}</span><span className="ml-auto font-black">{u.stats.points.toLocaleString("pt-BR")}</span></div>)}</div></div>
        <div className="rounded-3xl border border-white/10 bg-[#081220] p-5"><h3 className="font-extrabold">Exportar</h3><p className="mt-1 text-[12px] text-slate-500">Gere PDF ou planilha com um clique.</p><div className="mt-3 grid grid-cols-2 gap-2"><button className="rounded-xl bg-white/5 py-2.5 text-[13px] font-bold ring-1 ring-white/10">PDF</button><button className="rounded-xl bg-gradient-to-r from-[#009FE3] to-[#0077ff] py-2.5 text-[13px] font-extrabold">Excel</button></div></div>
      </div>
    </div>
  );
}

function Config({ say }: { say:(t:string)=>void }) {
  const items=[["Perfil do clube","Logo, nome e temporada"],["Unidades","Águias, Fênix e Stelar"],["Usuários","Diretores e conselheiros"],["Permissões","Quem pode editar o quê"],["Temporadas","2026 e histórico"],["Premiações","Faixas Ouro/Prata/Bronze"],["Requisitos","Listas por categoria"],["Configurações gerais","Notificações e idioma"]];
  return (<div><h2 className="text-xl font-black">Configurações</h2>
    <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-[#081220]">
      <div className="flex items-center gap-3 border-b border-white/5 p-4"><Logo size={40}/><div><p className="font-extrabold">Esquadrão do Céu</p><p className="text-[12px] text-slate-500">Fundado em 2022 · Temporada 2026</p></div></div>
      {items.map(([t,d])=><button key={t} onClick={()=>say(t)} className="flex w-full items-center gap-3 border-b border-white/5 p-4 text-left last:border-0 hover:bg-white/[0.02]"><Settings className="h-4 w-4 text-slate-500"/><div><p className="text-[13px] font-bold">{t}</p><p className="text-[11px] text-slate-500">{d}</p></div><ChevronRight className="ml-auto h-4 w-4 text-slate-600"/></button>)}
    </div></div>);
}

function Mais({ go,say,setLogged }: any) {
  return (<div><h2 className="text-xl font-black">Mais</h2>
    <div className="mt-3 flex items-center gap-3 rounded-3xl border border-white/10 bg-[#081220] p-4"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" className="h-12 w-12 rounded-full object-cover" alt=""/><div><p className="font-extrabold">Henrique Castro</p><p className="text-[12px] text-slate-500">Diretor do Clube</p></div><ChevronRight className="ml-auto h-4 w-4 text-slate-600"/></div>
    <div className="mt-3 overflow-hidden rounded-3xl border border-white/10 bg-[#081220]">
      {[["Perfil do clube","config"],["Configurações","config"],["Exportar relatórios","relatorios"],["Central de ajuda","config"],["Fale conosco","config"]].map(([t,s])=><button key={t} onClick={()=>go(s as Screen)} className="flex w-full items-center p-4 text-left text-[13px] font-bold hover:bg-white/[0.02]">{t}<ChevronRight className="ml-auto h-4 w-4 text-slate-600"/></button>)}
      <button onClick={()=>setLogged(false)} className="flex w-full items-center p-4 text-left text-[13px] font-bold text-red-400">Sair da conta</button>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-2.5">
      <button onClick={()=>go("missoes")} className="rounded-2xl border border-white/10 bg-[#081220] p-4 text-[13px] font-bold">Missões</button>
      <button onClick={()=>go("premiacoes")} className="rounded-2xl border border-white/10 bg-[#081220] p-4 text-[13px] font-bold">Premiações</button>
      <button onClick={()=>go("frequencia")} className="rounded-2xl border border-white/10 bg-[#081220] p-4 text-[13px] font-bold">Frequência</button>
      <button onClick={()=>go("requisitos")} className="rounded-2xl border border-white/10 bg-[#081220] p-4 text-[13px] font-bold">Requisitos</button>
    </div></div>);
}

function Modal({ children,title,onClose }: { children:ReactNode; title:string; onClose:()=>void }) {
  return (<div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0A1622] p-5 shadow-2xl" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between"><h3 className="font-extrabold">{title}</h3><button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/5"><X className="h-4 w-4"/></button></div>
      <div className="mt-4">{children}</div>
    </div></div>);
}
