# -*- coding: utf-8 -*-
"""Gera vitrine estatica 100% navegavel em Desktop/Suite-Hub-Vitrine."""
import os

OUT = r"C:\Users\User\Desktop\Suite-Hub-Vitrine"
os.makedirs(OUT, exist_ok=True)

U = lambda pid, w=900: f"https://images.unsplash.com/{pid}?auto=format&fit=crop&w={w}&q=70"
WA = "https://wa.me/5511999999999?text=Ol%C3%A1!%20Vi%20a%20vitrine%20da%20Suite%20Hub%20e%20quero%20um%20site."

SEGS = [
 dict(slug="restaurante", nome="Restaurantes", emoji="🍽", img=U("photo-1414235077428-338989a2e8c0"),
      tag="Do premium ao delivery próprio", desc="Três estratégias: experiência premium, conversão rápida e marca afetiva.",
      modelos=[
       dict(id="01", nome="Premium Gastronômico", brand="Casa Nostra", strat="Experiência premium",
            desc="Fotografia grande, tipografia elegante, reserva de mesa e menu degustação. Para quem vende atmosfera.",
            feats=["Cardápio editorial","Reserva de mesa","Adega premiada"], accent="#c9a24b", bg="#0e0c09", fg="#f3ead9",
            img=U("photo-1414235077428-338989a2e8c0")),
       dict(id="02", nome="Urbano / Moderno", brand="Brasa & Rua", strat="Conversão e pedidos",
            desc="Pedido em 3 cliques, delivery próprio, combos e cupom. Para vender muito no almoço e no jantar.",
            feats=["Pedido online","Delivery próprio","Combos"], accent="#ff3d00", bg="#0c0c0d", fg="#ffffff",
            img=U("photo-1565299624946-b28f40a0ae38")),
       dict(id="03", nome="Familiar / Acolhedor", brand="Cantina da Vó", strat="Marca e relacionamento",
            desc="Clima afetivo, história da família e pedido direto sem taxa de app.",
            feats=["História da casa","Pratos da família","WhatsApp direto"], accent="#2f7d4f", bg="#faf4e8", fg="#3d2b1f",
            img=U("photo-1517248135467-4c7edcad34c4")),
      ]),
 dict(slug="barbeiro", nome="Barbearias", emoji="✂️", img=U("photo-1585747860715-2ba37e788b70"),
      tag="Agenda cheia sem depender de direct", desc="Autoridade premium, cultura street e minimalismo autoral.",
      modelos=[
       dict(id="01", nome="Barber Shop Premium", brand="Barber Club 91", strat="Autoridade e ticket alto",
            desc="Masculino e sofisticado, agendamento por barbeiro e planos mensais.",
            feats=["Por barbeiro","Planos mensais","Galeria"], accent="#b08d3e", bg="#0d0d0f", fg="#ece7dd",
            img=U("photo-1585747860715-2ba37e788b70")),
       dict(id="02", nome="Street / Urbano", brand="CORTE FIRME", strat="Movimento e comunidade",
            desc="Jovem e ousado, agendamento relâmpago, drops e eventos.",
            feats=["Agendamento rápido","Drops","Feed"], accent="#d4ff3f", bg="#101010", fg="#ffffff",
            img=U("photo-1503951914875-452dadb0f02f")),
       dict(id="03", nome="Minimalista", brand="Rafa Prates", strat="Profissional autoral",
            desc="Extremamente limpo, focado no barbeiro, preço claro e WhatsApp.",
            feats=["Perfil","Preços claros","WhatsApp"], accent="#111111", bg="#ffffff", fg="#171717",
            img=U("photo-1621605815971-fbc98d665033")),
      ]),
 dict(slug="cabeleireira", nome="Beleza & Salão", emoji="💇", img=U("photo-1560066984-138dadb4c035"),
      tag="Beleza que se vê no site", desc="Luxo editorial, modernidade feminina e boutique intimista.",
      modelos=[
       dict(id="01", nome="Luxury Beauty", brand="Maison Lumière", strat="Premium e sofisticado",
            desc="Editorial de moda, antes/depois e concierge de agendamento.",
            feats=["Editorial","Antes/depois","Concierge"], accent="#a67c52", bg="#121110", fg="#f0e8dc",
            img=U("photo-1560066984-138dadb4c035")),
       dict(id="02", nome="Modern Beauty", brand="Studio Glow", strat="Moderno e editorial",
            desc="Serviços por categoria e horários livres hoje.",
            feats=["Catálogo","Horários livres","Depoimentos"], accent="#ec4899", bg="#fff5f7", fg="#171717",
            img=U("photo-1522337660859-02fbefca4702")),
       dict(id="03", nome="Boutique", brand="Ateliê Marina", strat="Delicado e intimista",
            desc="Atendimento individual, 4 vagas por dia, conversa no WhatsApp.",
            feats=["Intimista","Poucas vagas","Direto"], accent="#7c6a5a", bg="#f7f2ec", fg="#4a3f35",
            img=U("photo-1487412947147-5cebf100ffc2")),
      ]),
 dict(slug="psicologo", nome="Psicologia", emoji="🧠", img=U("photo-1506126613408-eca07ce68773"),
      tag="Confiança antes da 1ª sessão", desc="Clínico premium, humanizado leve e moderno digital.",
      modelos=[
       dict(id="01", nome="Clínico Premium", brand="Dra. Helena Prado", strat="Credibilidade e ética",
            desc="Abordagem, CRP, especialidades, presencial + online.",
            feats=["CRP","Especialidades","Online"], accent="#0e4d4a", bg="#f4f1ea", fg="#14201f",
            img=U("photo-1573497019940-1c28c88b4f3e")),
       dict(id="02", nome="Humanizado", brand="Espaço Acolher", strat="Acolhimento e leveza",
            desc="Tons suaves, linguagem simples e FAQ que abraça.",
            feats=["Para quem é","Como funciona","FAQ"], accent="#c98a4b", bg="#fdf8f1", fg="#5b4a3a",
            img=U("photo-1493836512294-502baa1986e2")),
       dict(id="03", nome="Moderno", brand="mente.livre", strat="Minimalista e digital",
            desc="Online-first com agendamento em 3 passos.",
            feats=["Online-first","3 passos","Planos"], accent="#6366f1", bg="#08070d", fg="#ffffff",
            img=U("photo-1506126613408-eca07ce68773")),
      ]),
 dict(slug="imobiliaria", nome="Imobiliárias", emoji="🏠", img=U("photo-1600596542815-ffad4c1539a9"),
      tag="O imóvel é o protagonista", desc="Luxo editorial, marketplace com filtros e regional confiável.",
      modelos=[
       dict(id="01", nome="Luxury", brand="Alto Vale", strat="Alto padrão editorial",
            desc="Curadoria private com galeria imersiva.",
            feats=["Curadoria","Galeria","Private"], accent="#8a6d2b", bg="#0c0b09", fg="#efe9dc",
            img=U("photo-1600596542815-ffad4c1539a9")),
       dict(id="02", nome="Marketplace", brand="LarGO", strat="Busca e conversão",
            desc="Busca com filtros, página do imóvel e agendar visita.",
            feats=["Filtros","Página do imóvel","Visita"], accent="#2563eb", bg="#f4f6fb", fg="#171717",
            img=U("photo-1568605114967-8130f3a36994")),
       dict(id="03", nome="Regional", brand="Casa & Terra", strat="Proximidade e confiança",
            desc="Corretor com nome e WhatsApp, linguagem de bairro.",
            feats=["Time local","Bairros","Corretor"], accent="#15803d", bg="#f3f7f2", fg="#171717",
            img=U("photo-1600585154340-be6161a56a0c")),
      ]),
 dict(slug="veiculos", nome="Automóveis", emoji="🚗", img=U("photo-1492144534655-ae79c964c9d7"),
      tag="Estoque de concessionária grande", desc="Premium, performance agressiva e seminovos de conversão.",
      modelos=[
       dict(id="01", nome="Premium", brand="Prime Motors", strat="Alto padrão",
            desc="Ficha técnica e simulação de financiamento elegante.",
            feats=["Premium","Ficha técnica","Financiamento"], accent="#334155", bg="#0b0b0c", fg="#ffffff",
            img=U("photo-1503376780353-7e6692767b70")),
       dict(id="02", nome="Performance", brand="APEX GARAGE", strat="Agressivo e tecnológico",
            desc="Dark agressivo, potência e proposta imediata.",
            feats=["Performance","Comparar","Proposta"], accent="#ff2d20", bg="#000000", fg="#ffffff",
            img=U("photo-1492144534655-ae79c964c9d7")),
       dict(id="03", nome="Seminovos", brand="Bom Negócio", strat="Confiança e conversão",
            desc="Perícia aprovada, troca com troco e parcelas claras.",
            feats=["Perícia","Troca","Parcelas"], accent="#0e76bc", bg="#f2f6fa", fg="#171717",
            img=U("photo-1555215695-3004980ad54e")),
      ]),
 dict(slug="lava-car", nome="Lava-Car", emoji="🚿", img=U("photo-1607860108855-64acf2078b60"),
      tag="Reserva moderna em 30s", desc="Detailing premium, speed jovem e clean tecnológico.",
      modelos=[
       dict(id="01", nome="Premium Detailing", brand="Studio Detail", strat="Sofisticação técnica",
            desc="Pacotes por nível e antes/depois.",
            feats=["Níveis","Antes/depois","Avaliação"], accent="#38bdf8", bg="#0a0f1e", fg="#ffffff",
            img=U("photo-1607860108855-64acf2078b60")),
       dict(id="02", nome="Speed Wash", brand="LAVA FLASH", strat="Rápido e jovem",
            desc="Express, combos mensais e reserva em 30s.",
            feats=["Express","Mensal","30s"], accent="#eab308", bg="#111111", fg="#ffffff",
            img=U("photo-1558618666-fcd25c85cd64")),
       dict(id="03", nome="Clean Minimal", brand="puro.lava", strat="Limpo e tecnológico",
            desc="Serviço → horário → placa. Extremamente simples.",
            feats=["Serviço","Horário","Na retirada"], accent="#06b6d4", bg="#ffffff", fg="#171717",
            img=U("photo-1605559424843-9e4c228bf1c2")),
      ]),
 dict(slug="advocacia", nome="Advocacia", emoji="⚖️", img=U("photo-1589829545856-d10d557cf95f"),
      tag="Autoridade em 5 segundos", desc="Tradicional premium, boutique e digital law.",
      modelos=[
       dict(id="01", nome="Tradicional Premium", brand="Moretti & Salles", strat="Institucional sofisticado",
            desc="Áreas de atuação, sócios e artigos.",
            feats=["Áreas","Sócios","Artigos"], accent="#1a2340", bg="#f8f7f4", fg="#1a2340",
            img=U("photo-1505664194779-8beaceb93744")),
       dict(id="02", nome="Boutique Jurídica", brand="Lina Duarte", strat="Moderno e elegante",
            desc="Atendimento personalizado e agendar conversa.",
            feats=["Boutique","Casos","Conversa"], accent="#5b4a3a", bg="#f6f1ea", fg="#2e2620",
            img=U("photo-1521791136064-7986c2920216")),
       dict(id="03", nome="Digital Law", brand="lex.digital", strat="Tecnológico e direto",
            desc="Diagnóstico online e atendimento remoto.",
            feats=["Diagnóstico","Remoto","Direto"], accent="#00c2a8", bg="#060b0a", fg="#ffffff",
            img=U("photo-1589829545856-d10d557cf95f")),
      ]),
 dict(slug="distribuidora-gas", nome="Gás & Delivery", emoji="🔥", img=U("photo-1556911220-bff31c812dba"),
      tag="Pedido em 30 segundos", desc="Ultrarrápido, delivery moderno e regional familiar.",
      modelos=[
       dict(id="01", nome="Pedido em 30s", brand="Gás Já", strat="Velocidade extrema",
            desc="Um produto, um botão, endereço e pagamento.",
            feats=["Pedir agora","Retirada","Na entrega"], accent="#ea580c", bg="#fff7ed", fg="#171717",
            img=U("photo-1556911220-bff31c812dba")),
       dict(id="02", nome="Delivery Moderno", brand="fogão.em.casa", strat="App-like e moderno",
            desc="Combos gás + água e acompanhamento do pedido.",
            feats=["Combos","Acompanhar","App-like"], accent="#7c3aed", bg="#0f0b1e", fg="#ffffff",
            img=U("photo-1600320254374-ce2d293c324e")),
       dict(id="03", nome="Distribuidora Regional", brand="Gás da Família", strat="Comercial e familiar",
            desc="Preço do dia e WhatsApp gigante.",
            feats=["Preço do dia","Horário","WhatsApp"], accent="#1971c2", bg="#eef4fa", fg="#171717",
            img=U("photo-1587293852726-70cdb56c2866")),
      ]),
]

BASE_CSS = """*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;background:#070b16;color:#fff}a{color:inherit}.wrap{max-width:1100px;margin:0 auto;padding:0 20px}.top{position:sticky;top:0;z-index:50;background:rgba(7,11,22,.94);border-bottom:1px solid rgba(255,255,255,.1)}.top-in{display:flex;align-items:center;justify-content:space-between;height:60px}.logo{font-weight:800}.logo small{display:block;font-size:10px;color:#7aa5ff;letter-spacing:2px}.btn{display:inline-block;background:#2563eb;color:#fff!important;font-weight:800;font-size:13px;padding:11px 22px;border-radius:999px;text-decoration:none;border:0;cursor:pointer}.btn:hover{background:#3b82f6}.grid{display:grid;gap:18px;margin-top:26px}@media(min-width:700px){.grid{grid-template-columns:repeat(3,1fr)}}.card{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);border-radius:20px;overflow:hidden;text-decoration:none;display:block}.card:hover{border-color:#3b82f6;transform:translateY(-4px);transition:.25s}.card img{width:100%;height:150px;object-fit:cover;display:block}.card-b{padding:16px}.tag{display:inline-block;font-size:10.5px;font-weight:800;background:rgba(255,255,255,.08);padding:3px 10px;border-radius:999px;margin-bottom:8px}footer{border-top:1px solid rgba(255,255,255,.08);margin-top:50px;padding:28px 0 40px;text-align:center;color:rgba(255,255,255,.4);font-size:12px}"""

def topbar(back=None):
    b = f'<a href="{back}" style="font-size:13px;font-weight:700;color:#93c5fd;text-decoration:none">← Voltar</a>' if back else ""
    return f'<div class="top"><div class="wrap top-in"><div style="display:flex;align-items:center;gap:14px"><div class="logo">Suite Hub<small>SHOWROOM</small></div>{b}</div><a class="btn" href="{WA}" target="_blank">Quero meu site</a></div></div>'

def footer():
    return f'''<footer><div class="wrap"><div>© 2026 Suite Hub — demonstrações conceituais, marcas fictícias.</div><br><a class="btn" href="{WA}" target="_blank">Quero meu site — WhatsApp</a></div></footer>'''

# ---------- INDEX ----------
cards = "".join(
 f'<a class="card" href="segmento-{s["slug"]}.html"><img src="{s["img"]}" alt="{s["nome"]}"><div class="card-b"><span class="tag">3 modelos</span><h3>{s["emoji"]} {s["nome"]}</h3><p style="font-size:12.5px;color:rgba(255,255,255,.55);margin-top:6px">{s["tag"]}</p></div></a>'
 for s in SEGS)
index = f"""<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Suite Hub — Vitrine de Sites</title><style>{BASE_CSS}h1{{font-size:clamp(32px,5vw,56px);line-height:1.03;letter-spacing:-1px;text-align:center;margin:26px auto 0;max-width:820px}}h1 span{{color:#60a5fa}}.sub{{color:rgba(255,255,255,.6);max-width:640px;margin:14px auto 0;font-size:15px;text-align:center;line-height:1.6}}.cta{{display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap}}</style></head><body>{topbar()}
<div class="wrap" style="padding:52px 20px 10px"><div style="text-align:center"><span class="tag">9 SEGMENTOS · 27 MODELOS · CLIQUE PARA ENTRAR</span><h1>Seu negócio merece mais do que <span>um site.</span></h1><p class="sub">Clique em um segmento, depois em <b>Abrir modelo</b> para navegar na demonstração completa.</p><div class="cta"><a class="btn" href="segmento-restaurante.html">Começar por Restaurantes</a></div></div>
<div class="grid">{cards}</div></div>{footer()}</body></html>"""
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(index)

BOOK_JS = """<script>
var M=null,S1='',S2='',S3='';
function openBook(servs,pros,brand){M={servs:servs,pros:pros,brand:brand};S1=servs[0];S2=pros[0];S3='';renderBook();}
function renderBook(){var b=document.getElementById('bookBody');if(!M||!b)return;var h='<p style="font-size:12px;color:#666;margin-bottom:10px">'+M.brand+' · demonstração</p>';
h+='<p style="font-size:12px;font-weight:800;margin:8px 0 6px">1 · Serviço</p>'+M.servs.map(function(s){return '<button onclick="S1=\\''+s+'\\';renderBook()" style="display:block;width:100%;text-align:left;margin:4px 0;padding:10px 12px;border-radius:12px;border:2px solid '+(S1===s?'#111':'#e5e5e5')+';background:#fff;cursor:pointer;font-weight:700">'+s+'</button>'}).join('');
h+='<p style="font-size:12px;font-weight:800;margin:8px 0 6px">2 · Profissional</p>'+M.pros.map(function(s){return '<button onclick="S2=\\''+s+'\\';renderBook()" style="margin:3px;padding:9px 14px;border-radius:999px;border:2px solid '+(S2===s?'#111':'#e5e5e5')+';background:#fff;cursor:pointer;font-weight:700">'+s+'</button>'}).join('');
h+='<p style="font-size:12px;font-weight:800;margin:8px 0 6px">3 · Horário</p>'+['09:00','10:30','13:00','14:30','16:00','18:00'].map(function(s){return '<button onclick="S3=\\''+s+'\\';renderBook()" style="margin:3px;padding:9px 12px;border-radius:10px;border:2px solid '+(S3===s?'#111':'#e5e5e5')+';background:'+(S3===s?'#111':'#fff')+';color:'+(S3===s?'#fff':'#111')+';cursor:pointer;font-weight:800">'+s+'</button>'}).join('');
h+='<button onclick="finishBook()" '+(S3?'':'disabled')+' style="display:block;width:100%;margin-top:12px;padding:14px;border-radius:999px;border:0;background:#111;color:#fff;font-weight:800;cursor:pointer;opacity:'+(S3?'1':'.4')+'">Confirmar agendamento</button>';
b.innerHTML=h;document.getElementById('bookModal').style.display='flex';}
function finishBook(){document.getElementById('bookBody').innerHTML='<div style="text-align:center;padding:16px"><div style="font-size:44px">✅</div><h3>Agendamento demonstrativo realizado!</h3><p style="font-size:13px;color:#666;margin-top:6px">'+S1+' · '+S2+' · '+S3+'. Em um site real, salvaria no sistema e confirmaria no WhatsApp.</p><button onclick="closeBook()" style="margin-top:12px;padding:12px 26px;border-radius:999px;border:0;background:#111;color:#fff;font-weight:800;cursor:pointer">Fechar</button></div>';}
function closeBook(){document.getElementById('bookModal').style.display='none';}
function toggleFaq(el){var p=el.nextElementSibling;p.style.display=(p.style.display==='block'?'none':'block');}
</script>"""
BOOK_MODAL = """<div id="bookModal" style="display:none;position:fixed;inset:0;z-index:99;background:rgba(0,0,0,.6);align-items:center;justify-content:center;padding:16px" onclick="if(event.target===this)closeBook()"><div style="background:#fff;color:#111;border-radius:22px;max-width:480px;width:100%;padding:22px;max-height:90vh;overflow:auto"><div style="display:flex;justify-content:space-between;align-items:center"><h3>Agendar horário</h3><button onclick="closeBook()" style="border:0;background:#eee;width:32px;height:32px;border-radius:50%;cursor:pointer">✕</button></div><div id="bookBody"></div></div></div>"""

# ---------- SEGMENT PAGES + DEMOS ----------
for s in SEGS:
    models_html = "".join(
     f'<div class="card"><img src="{m["img"]}" alt="{m["brand"]}"><div class="card-b"><span class="tag">Modelo {m["id"]} · {m["strat"]}</span><h3>{m["nome"]} — {m["brand"]}</h3><p style="font-size:12.5px;color:rgba(255,255,255,.55);margin-top:6px">{m["desc"]}</p><p style="font-size:12px;color:rgba(255,255,255,.5);margin-top:8px">{" · ".join(m["feats"])}</p><a class="btn" style="margin-top:12px;display:inline-block" href="demo-{s["slug"]}-{m["id"]}.html">Abrir modelo →</a></div></div>'
     for m in s["modelos"])
    seg_page = f"""<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{s["nome"]} — Suite Hub</title><style>{BASE_CSS}</style></head><body>{topbar("index.html")}
<div class="wrap" style="padding:36px 20px"><a href="index.html" style="font-size:13px;color:#93c5fd;text-decoration:none">← Todas as vitrines</a>
<h1 style="font-size:34px;margin-top:12px">{s["emoji"]} Sites para {s["nome"]}</h1>
<p style="color:rgba(255,255,255,.6);margin-top:8px;max-width:680px;font-size:14px;line-height:1.6">{s["desc"]}</p>
<div class="grid">{models_html}</div></div>{footer()}</body></html>"""
    open(os.path.join(OUT, f'segmento-{s["slug"]}.html'), "w", encoding="utf-8").write(seg_page)

    for m in s["modelos"]:
        sib = " · ".join(f'<a href="demo-{s["slug"]}-{x["id"]}.html" style="padding:6px 12px;border-radius:999px;text-decoration:none;font-size:12px;font-weight:800;{"background:#fff;color:#000" if x["id"]==m["id"] else "color:#fff;background:rgba(255,255,255,.12)"}">{x["id"]}</a>' for x in s["modelos"])
        dark = m["bg"].startswith("#0") or m["bg"].startswith("#1") or m["bg"] in ("#000000",)
        demo = f"""<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{m["brand"]} — {s["nome"]} (Demo) · Suite Hub</title></head>
<body style="margin:0;font-family:'Segoe UI',Arial,sans-serif;background:{m["bg"]};color:{m["fg"]}">
<div style="position:sticky;top:0;z-index:50;background:#070b16;color:#fff;border-bottom:1px solid rgba(255,255,255,.12)"><div style="max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:52px;padding:0 14px;gap:8px">
<div style="display:flex;align-items:center;gap:8px"><a href="segmento-{s["slug"]}.html" style="border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:999px;padding:6px 12px;font-size:11px;font-weight:800;text-decoration:none">← Modelos</a><span style="font-size:11px;color:rgba(255,255,255,.55)">DEMO · {s["nome"]} · {m["brand"]}</span></div>
<div style="display:flex;align-items:center;gap:6px">{sib}<a href="{WA}" target="_blank" style="background:#2563eb;color:#fff;border-radius:999px;padding:7px 14px;font-size:11px;font-weight:800;text-decoration:none">Quero um assim</a></div>
</div></div>
<div style="max-width:1100px;margin:0 auto;padding:0 20px">
<nav style="display:flex;align-items:center;justify-content:space-between;padding:20px 0"><span style="font-weight:800;letter-spacing:1px">{m["brand"]}</span><button onclick="openBook(['Opção 1 — R$ 89','Opção 2 — R$ 129','Opção 3 — R$ 59'],['Profissional A','Profissional B'],'{m["brand"]}')" style="background:{m["accent"]};color:{'#000' if not dark else '#fff'};border:0;border-radius:999px;padding:11px 24px;font-weight:800;cursor:pointer">Agendar / Pedir</button></nav>
<header style="position:relative;border-radius:26px;overflow:hidden;margin-top:6px"><img src="{m["img"]}" alt="{m["brand"]}" style="width:100%;height:52vh;min-height:340px;object-fit:cover;display:block"><div style="position:absolute;inset:0;background:linear-gradient(transparent,rgba(0,0,0,.72))"></div>
<div style="position:absolute;left:0;right:0;bottom:0;padding:28px"><span style="background:{m["accent"]};color:{'#000' if not dark else '#fff'};font-size:11px;font-weight:800;letter-spacing:2px;padding:5px 14px;border-radius:999px">MODELO {m["id"]} · {m["strat"].upper()}</span><h1 style="font-size:clamp(30px,5vw,54px);margin-top:10px;color:#fff">{m["nome"]}</h1><p style="color:rgba(255,255,255,.8);max-width:560px;margin-top:8px">{m["desc"]}</p></div></header>
<section style="display:grid;gap:12px;margin-top:18px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">{"".join(f'<div style="border:1px solid rgba(128,128,128,.3);border-radius:18px;padding:18px"><h3>{f}</h3><p style="font-size:12.5px;opacity:.65;margin-top:6px">Incluso nesta demonstração — clique em Agendar/Pedir para simular.</p><button onclick="openBook([\\'{f} — R$ 89\\',\\'{f} Premium — R$ 149\\'],[\\'Equipe 1\\',\\'Equipe 2\\'],\\'{m["brand"]}\\')" style="margin-top:10px;border:0;background:{m["accent"]};color:{'#000' if not dark else '#fff'};border-radius:999px;padding:9px 18px;font-weight:800;cursor:pointer">Simular →</button></div>' for f in m["feats"])}</section>
<section style="margin-top:22px;border:1px solid rgba(128,128,128,.3);border-radius:20px;padding:22px"><h2>Perguntas frequentes (demonstração)</h2>
<div style="margin-top:10px"><button onclick="toggleFaq(this)" style="width:100%;text-align:left;background:none;border:0;color:inherit;font-weight:800;padding:10px 0;cursor:pointer;font-size:14px">Como funciona o atendimento? +</button><p style="display:none;font-size:13px;opacity:.7;padding-bottom:10px">Você escolhe o serviço, o profissional e o horário. No site real, tudo é salvo e confirmado no WhatsApp.</p>
<button onclick="toggleFaq(this)" style="width:100%;text-align:left;background:none;border:0;color:inherit;font-weight:800;padding:10px 0;cursor:pointer;font-size:14px">Quais as formas de pagamento? +</button><p style="display:none;font-size:13px;opacity:.7;padding-bottom:10px">Pix, cartão e dinheiro — demonstração sem cobrança real.</p></div></section>
<section style="text-align:center;padding:40px 10px"><p style="font-size:11px;letter-spacing:3px;opacity:.5">GOSTOU DESSA IDEIA?</p><h2 style="font-size:26px;margin-top:8px">Podemos criar assim para a sua empresa.</h2><br><a href="{WA}" target="_blank" style="background:#2563eb;color:#fff;border-radius:999px;padding:14px 34px;font-weight:800;text-decoration:none">Quero meu site</a><p style="margin-top:14px"><a href="segmento-{s["slug"]}.html" style="font-size:13px;opacity:.6">← Comparar os 3 modelos de {s["nome"]}</a></p></section>
</div>{BOOK_MODAL}{BOOK_JS}
</body></html>"""
        open(os.path.join(OUT, f'demo-{s["slug"]}-{m["id"]}.html'), "w", encoding="utf-8").write(demo)

print("OK:", OUT, "- index + segmentos + demos gerados")
