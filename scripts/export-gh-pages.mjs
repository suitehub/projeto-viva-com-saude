import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const publicOutDir = path.join(rootDir, ".output", "public");
const serverEntry = path.join(rootDir, ".output", "server", "index.mjs");

console.log("🚀 Iniciando build e exportação para GitHub Pages...");

// 1. Determina a base URL correta para o GitHub Pages
// Domínio próprio (public/CNAME existe) sempre serve da raiz: base "/".
let targetBaseUrl = process.env.BASE_URL;
if (!targetBaseUrl) {
  if (fs.existsSync(path.join(rootDir, "public", "CNAME"))) {
    targetBaseUrl = "/";
  } else if (process.env.GITHUB_REPOSITORY) {
    const repoParts = process.env.GITHUB_REPOSITORY.split("/");
    const repoName = repoParts[1] || "";
    targetBaseUrl = repoName.endsWith(".github.io") ? "/" : `/${repoName}/`;
  } else {
    targetBaseUrl = "/projetovivacomsaude/";
  }
}
if (!targetBaseUrl.endsWith("/")) {
  targetBaseUrl += "/";
}
const urlPrefix = targetBaseUrl === "/" ? "" : targetBaseUrl.replace(/\/$/, "");
console.log(`🌐 Base URL configurada para: ${targetBaseUrl} (Prefixo: "${urlPrefix}")`);

// Executa o build de produção Vite / TanStack Start com a BASE_URL definida
console.log("📦 Compilando aplicação...");
execSync("npm run build", {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    BASE_URL: targetBaseUrl,
  },
});

// 2. Limpa e cria a pasta dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 3. Copia todos os assets estáticos gerados para dist
if (fs.existsSync(publicOutDir)) {
  console.log("📂 Copiando assets públicos para dist...");
  fs.cpSync(publicOutDir, distDir, { recursive: true });
}

// 4. Cria arquivo .nojekyll (essencial para que o GitHub Pages sirva todas as pastas e arquivos)
fs.writeFileSync(path.join(distDir, ".nojekyll"), "");
console.log("✅ Criado arquivo .nojekyll");

// 5. Renderiza as páginas via SSR para gerar HTMLs estáticos de cada rota
console.log("🌐 Gerando páginas HTML estáticas...");

let serverModule;
try {
  serverModule = await import(serverEntry);
} catch (err) {
  console.warn("⚠️ Aviso ao importar servidor SSR:", err.message);
}

const routesToRender = ["/", "/produtos", "/admin", "/conta"];

const spaDecodeScript = `<script>(function(l){if(l.search[1]==='/'){var p=l.search.slice(1).split('&').map(function(s){return s.replace(/~and~/g,'&')}).join('?');window.history.replaceState(null,null,l.pathname.slice(0,-1)+p+l.hash);}})(window.location);</script>`;

if (serverModule && serverModule.default && typeof serverModule.default.fetch === "function") {
  for (const route of routesToRender) {
    try {
      const requestPath = `${urlPrefix}${route === "/" ? "/" : route}`;
      let res = await serverModule.default.fetch(new Request(`http://localhost${requestPath}`), {});
      if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
        const redirectLoc = res.headers.get("location");
        res = await serverModule.default.fetch(
          new Request(new URL(redirectLoc, "http://localhost").href),
          {},
        );
      }

      if (res.status === 200) {
        let html = await res.text();

        // Injeta o script de decodificação SPA no <head> se ainda não existir
        if (!html.includes("l.search[1] === '/'") && html.includes("</head>")) {
          html = html.replace("</head>", `${spaDecodeScript}</head>`);
        }

        if (route === "/") {
          fs.writeFileSync(path.join(distDir, "index.html"), html, "utf8");
          console.log(`  ✓ Página / -> dist/index.html`);
        } else {
          const routeDir = path.join(distDir, route.slice(1));
          fs.mkdirSync(routeDir, { recursive: true });
          fs.writeFileSync(path.join(routeDir, "index.html"), html, "utf8");
          console.log(`  ✓ Página ${route} -> dist/${route.slice(1)}/index.html`);
        }
      } else {
        console.warn(`  ⚠️ Rota ${route} (caminho ${requestPath}) retornou status ${res.status}`);
      }
    } catch (err) {
      console.warn(`  ⚠️ Erro ao renderizar rota ${route}:`, err.message);
    }
  }
}

// 5b. Pré-renderiza /produto/{slug} com Open Graph (foto + nome + descrição).
// WhatsApp/Telegram NÃO executam JavaScript: cada produto precisa de um HTML
// estático próprio com og:title/og:description/og:image, senão o link sai sem cartão.
const SITE_URL = (() => {
  try {
    const cname = fs.readFileSync(path.join(rootDir, "public", "CNAME"), "utf8").trim();
    if (cname) return `https://${cname}`;
  } catch {
    // sem CNAME
  }
  return "https://www.projetovivacomsaude.com.br";
})();

const escapeAttr = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const slugifyExport = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Descrição do produto pode vir em HTML (texto rico): as metas OG precisam
// de texto puro, senão o WhatsApp mostra as tags.
const stripHtmlExport = (html) =>
  String(html ?? "")
    .replace(/<\s*br\s*\/?>/gi, " ")
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

async function fetchStoreProductsForPrerender() {
  try {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(rootDir, "firebase-applet-config.json"), "utf8"),
    );
    // runQuery (POST) em vez do list (GET): mesma permissão, mas o GET é
    // recusado neste projeto e o POST libera normalmente.
    const apiUrl =
      `https://firestore.googleapis.com/v1/projects/${cfg.projectId}` +
      `/databases/${cfg.firestoreDatabaseId}/documents:runQuery?key=${cfg.apiKey}`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        structuredQuery: { from: [{ collectionId: "products" }], limit: 300 },
      }),
    });
    if (!res.ok) throw new Error(`Firestore runQuery ${res.status}`);
    const json = await res.json();
    const seen = new Set();
    const list = [];
    for (const row of Array.isArray(json) ? json : []) {
      const d = row.document;
      if (!d) continue;
      const id = String(d.name || "").split("/").pop();
      const f = d.fields || {};
      if (f.visibility?.stringValue === "Oculto") continue;
      if (f.displayInStore?.booleanValue === false) continue;
      const name = f.name?.stringValue || "Produto";
      const slug = slugifyExport(f.urlSlug?.stringValue || name) || id;
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      const imgValues = f.images?.arrayValue?.values || [];
      const imageUrl =
        imgValues.map((v) => v.stringValue).find(Boolean) || f.imageUrl?.stringValue || "";
      const firstPara = stripHtmlExport(f.description?.stringValue || "").slice(0, 160);
      const short = (firstPara || f.seoDescription?.stringValue || name).slice(0, 160);
      list.push({ id, slug, name, short, imageUrl });
    }
    return list;
  } catch (err) {
    console.warn("  ⚠️ Não foi possível listar produtos p/ pré-render:", err.message);
    return [];
  }
}

// Páginas de produto a partir do shell da home (o SPA resolve /produto/x no cliente).
// Não depende do SSR: mesmo que a rota seja client-only, o HTML estático sai
// com as metas OG e o app abre o produto normalmente no navegador.
{
  const productsForSeo = await fetchStoreProductsForPrerender();
  console.log(`🛍️ Gerando ${productsForSeo.length} páginas de produto (Open Graph)...`);
  let productTemplate = "";
  try {
    productTemplate = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
  } catch (err) {
    console.warn("  ⚠️ Shell da home ausente, pulando páginas de produto:", err.message);
  }
  if (productTemplate && productsForSeo.length > 0) {
    for (const p of productsForSeo) {
      try {
        const title = `${p.name} | Projeto Viva com Saúde`;
        const pageUrl = `${SITE_URL}/produto/${p.slug}`;
        const image =
          p.imageUrl && p.imageUrl.startsWith("http") ? p.imageUrl : `${SITE_URL}/hero.png`;
        let html = productTemplate;
        // Remove OG/Twitter do template (são da home) e põe as do produto.
        html = html.replace(/<meta[^>]+(?:og:|twitter:)[^>]*>\s*/g, "");
        html = html.replace(/<title>.*?<\/title>/, `<title>${escapeAttr(title)}</title>`);
        const ogTags = [
          `<meta name="description" content="${escapeAttr(p.short)}" />`,
          `<meta property="og:title" content="${escapeAttr(title)}" />`,
          `<meta property="og:description" content="${escapeAttr(p.short)}" />`,
          `<meta property="og:type" content="product" />`,
          `<meta property="og:url" content="${escapeAttr(pageUrl)}" />`,
          `<meta property="og:image" content="${escapeAttr(image)}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
          `<meta name="twitter:description" content="${escapeAttr(p.short)}" />`,
          `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
        ].join("\n    ");
        if (html.includes("</head>")) {
          html = html.replace("</head>", `    ${ogTags}\n  </head>`);
        }
        const outDir = path.join(distDir, "produto", p.slug);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
        console.log(`  ✓ Produto /produto/${p.slug}`);
      } catch (err) {
        console.warn(`  ⚠️ Erro ao gerar página do produto ${p.slug}:`, err.message);
      }
    }
  }
}

// Garante OG absoluto na home (WhatsApp exige URL absoluta na imagem).
try {
  const homePath = path.join(distDir, "index.html");
  if (fs.existsSync(homePath)) {
    let homeHtml = fs.readFileSync(homePath, "utf8");
    let touched = false;
    // og:image / twitter:image relativos -> absolutos com o domínio.
    const absolutize = (tag) => {
      const next = homeHtml.replace(
        new RegExp(`(<meta[^>]*${tag}"[^>]*content=")(/[^"]*)(")`, "g"),
        (m, a, b, c) => `${a}${SITE_URL}${b}${c}`,
      );
      if (next !== homeHtml) {
        homeHtml = next;
        touched = true;
      }
    };
    absolutize("og:image");
    absolutize("twitter:image");
    if (!homeHtml.includes("og:url")) {
      homeHtml = homeHtml.replace(
        "</head>",
        `    <meta property="og:url" content="${SITE_URL}/" />\n  </head>`,
      );
      touched = true;
    }
    if (touched) {
      fs.writeFileSync(homePath, homeHtml, "utf8");
      console.log("  ✓ OG da home ajustado (URLs absolutas)");
    }
  }
} catch (err) {
  console.warn("  ⚠️ Erro ao ajustar OG da home:", err.message);
}

// Se não gerou index.html por algum motivo, gera fallback completo com os assets JS e CSS
if (!fs.existsSync(path.join(distDir, "index.html"))) {
  console.log("ℹ️ Gerando index.html fallback completo com scripts e estilos...");
  const assetsPath = path.join(distDir, "assets");
  const assetFiles = fs.existsSync(assetsPath) ? fs.readdirSync(assetsPath) : [];
  const mainJs = assetFiles.find((f) => f.startsWith("index-") && f.endsWith(".js"));
  const mainCss = assetFiles.find((f) => f.startsWith("styles-") && f.endsWith(".css"));

  const fallbackHtml = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Projeto Viva com Saúde | Produtos Naturais</title>
    ${mainCss ? `<link rel="stylesheet" href="${targetBaseUrl}assets/${mainCss}" />` : ""}
    ${spaDecodeScript}
  </head>
  <body>
    <div id="root"></div>
    ${mainJs ? `<script type="module" src="${targetBaseUrl}assets/${mainJs}"></script>` : ""}
  </body>
</html>`;
  fs.writeFileSync(path.join(distDir, "index.html"), fallbackHtml, "utf8");
}

// 6. Cria o 404.html inteligente para o GitHub Pages (redirecionamento SPA)
const spa404Html = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Projeto Viva com Saúde</title>
    <script>
      // Single Page Apps for GitHub Pages
      // https://github.com/rafgraph/spa-github-pages
      (function() {
        var l = window.location;
        var pathSegmentsToKeep = (l.hostname.endsWith('.github.io') && l.pathname.split('/')[1]) ? 1 : 0;
        var repo = l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/');
        var path = l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~');
        var query = l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '';
        l.replace(
          l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
          repo + '/?/' + path + query + l.hash
        );
      })();
    </script>
  </head>
  <body>
    <div style="font-family: sans-serif; text-align: center; padding: 40px; color: #444;">
      <h2>Carregando página...</h2>
    </div>
  </body>
</html>`;

fs.writeFileSync(path.join(distDir, "404.html"), spa404Html, "utf8");
console.log("✅ Criado dist/404.html para redirecionamento SPA");

console.log("🎉 Build para GitHub Pages concluído com sucesso em ./dist!");
process.exit(0);
