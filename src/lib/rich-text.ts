/**
 * Texto rico (negrito, itálico, tamanho de fonte, listas) na descrição dos produtos.
 *
 * O admin edita a descrição em HTML; o site renderiza esse HTML depois de passar
 * por um saneador com lista branca de tags e atributos (sem <script>, sem
 * <iframe>, sem href javascript:, sem style perigoso).
 *
 * Tudo aqui roda no navegador E no servidor (sem usar DOM), para o SSR
 * continuar funcionando igual.
 */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "div",
  "span",
  "b",
  "strong",
  "i",
  "em",
  "u",
  "s",
  "strike",
  "del",
  "ins",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "a",
  "sub",
  "sup",
  "small",
  "mark",
  "code",
  "pre",
  "hr",
]);

const ALLOWED_STYLE_PROPS = new Set([
  "font-weight",
  "font-style",
  "text-decoration",
  "text-decoration-line",
  "color",
  "background-color",
  "font-size",
  "line-height",
  "text-align",
]);

const VOID_TAGS = new Set(["br", "hr"]);

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/**
 * Escapa texto para ir dentro de HTML como conteúdo (não como tag).
 * Entidades já existentes (&amp;, &#39;, &nbsp;) são preservadas para não
 * duplicar a escapes a cada passagem do saneador.
 */
export function escapeHtml(value: string): string {
  return String(value ?? "")
    .replace(/&(?![a-zA-Z][a-zA-Z0-9]*;|#\d+;|#x[0-9a-fA-F]+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Converte entidades HTML (&amp;, &#39;, &#x27;) de volta para texto. */
export function decodeEntities(value: string): string {
  return String(value ?? "").replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g,
    (match, code: string) => {
      if (code.charAt(0) === "#") {
        const isHex = code.charAt(1) === "x" || code.charAt(1) === "X";
        const num = parseInt(isHex ? code.slice(2) : code.slice(1), isHex ? 16 : 10);
        if (Number.isFinite(num) && num > 0 && num <= 0x10ffff) {
          try {
            return String.fromCodePoint(num);
          } catch {
            return match;
          }
        }
        return match;
      }
      const known = ENTITIES[code.toLowerCase()];
      return known ?? match;
    },
  );
}

/** Remove todas as tags e devolve só o texto (usado em resumos e no WhatsApp). */
export function stripHtml(html: string): string {
  if (!html) return "";
  const withBreaks = String(html)
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6]|blockquote|tr)\s*>/gi, "\n");
  return decodeEntities(withBreaks.replace(/<[^>]*>/g, "")).trim();
}

/** O texto já contém HTML (ou seja, veio do editor de texto rico)? */
export function hasHtmlTags(value: string): boolean {
  return /<\s*[a-zA-Z][^>]*>/.test(String(value ?? ""));
}

/** Quebra o HTML em parágrafos de texto simples. */
export function plainParagraphsFromHtml(html: string): string[] {
  return stripHtml(html)
    .split(/\n+/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function sanitizeStyle(value: string): string {
  const kept: string[] = [];
  for (const part of String(value ?? "").split(";")) {
    const separator = part.indexOf(":");
    if (separator < 0) continue;
    const prop = part.slice(0, separator).trim().toLowerCase();
    const val = part.slice(separator + 1).trim();
    if (!ALLOWED_STYLE_PROPS.has(prop)) continue;
    if (!val) continue;
    if (/url\s*\(|expression|javascript|@import|behavior/i.test(val)) continue;
    if (!/^[a-zA-Z0-9#%.,()'"+\-\s]*$/.test(val)) continue;
    kept.push(`${prop}: ${val}`);
  }
  return kept.join("; ");
}

function sanitizeUrl(value: string): string {
  const url = String(value ?? "").trim();
  if (!url) return "";
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  // Caminho interno ("/politica-de-privacidade") é permitido; "//site.com" não.
  if (/^\/(?!\/)/.test(url)) return url;
  return "";
}

const ATTR_PATTERN = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g;

function sanitizeAttrs(tagName: string, rawAttrs: string): string {
  const out: string[] = [];
  let href = "";
  ATTR_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null = ATTR_PATTERN.exec(rawAttrs);
  while (match !== null) {
    const name = (match[1] ?? "").toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    if (name === "style") {
      const style = sanitizeStyle(decodeEntities(value));
      if (style) out.push(`style="${escapeHtml(style)}"`);
    } else if (tagName === "a" && name === "href") {
      href = sanitizeUrl(decodeEntities(value));
    }
    match = ATTR_PATTERN.exec(rawAttrs);
  }
  // Link sempre abre em nova aba e com rel seguro (evita tabnabbing)
  if (href) {
    out.push(`href="${escapeHtml(href)}"`);
    out.push('target="_blank"');
    out.push('rel="noopener noreferrer nofollow"');
  }
  return out.length > 0 ? ` ${out.join(" ")}` : "";
}

/**
 * Saneia o HTML: mantém só tags e atributos da lista branca.
 * Tags desconhecidas somem (o texto dentro delas é preservado).
 */
export function sanitizeRichText(html: string): string {
  if (!html) return "";
  const src = String(html);
  let out = "";
  let index = 0;

  while (index < src.length) {
    const open = src.indexOf("<", index);
    if (open === -1) {
      out += escapeHtml(src.slice(index));
      break;
    }
    out += escapeHtml(src.slice(index, open));

    if (src.startsWith("<!--", open)) {
      const end = src.indexOf("-->", open + 4);
      index = end === -1 ? src.length : end + 3;
      continue;
    }

    const close = src.indexOf(">", open);
    if (close === -1) {
      out += escapeHtml(src.slice(open));
      break;
    }

    const inner = src.slice(open + 1, close).trim();
    index = close + 1;

    if (!inner) continue;
    if (inner.startsWith("!")) continue; // doctype

    if (inner.startsWith("/")) {
      const name = inner.slice(1).trim().toLowerCase();
      if (ALLOWED_TAGS.has(name) && !VOID_TAGS.has(name)) out += `</${name}>`;
      continue;
    }

    const selfClosing = inner.endsWith("/");
    const body = selfClosing ? inner.slice(0, -1).trim() : inner;
    const nameMatch = /^([a-zA-Z][a-zA-Z0-9]*)/.exec(body);
    if (!nameMatch) continue;

    const rawName = nameMatch[1] ?? "";
    const name = rawName.toLowerCase();
    if (!ALLOWED_TAGS.has(name)) continue;

    const attrs = sanitizeAttrs(name, body.slice(rawName.length));
    out += VOID_TAGS.has(name)
      ? `<${name}${attrs} />`
      : `<${name}${attrs}>`;
  }

  return out;
}

/**
 * Prepara o valor guardado (texto simples ou HTML) para o editor.
 * Texto simples vira parágrafos; HTML já formatado é apenas saneado.
 */
export function toEditorHtml(value: string): string {
  const raw = String(value ?? "");
  if (!raw.trim()) return "";
  if (hasHtmlTags(raw)) return sanitizeRichText(raw);

  return raw
    .split(/\n{2,}/)
    .map((block) => block.split("\n").map((line) => escapeHtml(line)).join("<br />"))
    .filter((block) => block.replace(/<br \/>/g, "").trim().length > 0)
    .map((block) => `<p>${block}</p>`)
    .join("");
}

/**
 * Limpa o HTML vindo do contentEditable antes de salvar:
 * remove tags vazias e converte <div> (sobra de navegador) em <p>.
 */
export function normalizeEditorHtml(html: string): string {
  let out = sanitizeRichText(html);

  // Sobras de navegadores antigos: <font color> e <div>
  out = out.replace(/<\/?font[^>]*>/gi, "");
  out = out.replace(/<div>/gi, "<p>").replace(/<\/div>/gi, "</p>");

  // Parágrafos vazios no fim
  out = out.replace(/(<p>\s*(?:<br \/>)?\s*<\/p>\s*)+$/i, "");
  // <p> sem fechamento
  out = out.replace(/<p>(?![\s\S]*?<\/p>)/gi, "");

  out = out.trim();

  // Conteúdo vazio (o editor deixa só um <br>) vira string vazia
  if (/^(?:\s|<br\s*\/?>|&nbsp;)*$/i.test(out)) return "";

  return out;
}

/**
 * Resumo em texto simples da descrição (usado em SEO, WhatsApp e listagens).
 */
export function excerptFromDescription(
  description: string,
  maxLength = 160,
): string {
  const plain = plainParagraphsFromHtml(String(description ?? "")).join(" ");
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}
