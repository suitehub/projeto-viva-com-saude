import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
} from "react";
import {
  normalizeEditorHtml,
  sanitizeRichText,
  toEditorHtml,
} from "@/lib/rich-text";

interface RichTextEditorProps {
  /** HTML (ou texto simples) com o conteúdo atual da descrição. */
  value: string;
  /** Recebe o HTML sanitizado a cada alteração. */
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

/**
 * Deixa o HTML válido: o navegador corrige aninhamento inválido
 * (<p><ul>) e a gente remove parágrafos vazios que sobram.
 */
function normalizeInBrowser(html: string): string {
  if (typeof DOMParser === "undefined") return html;
  try {
    const parsed = new DOMParser().parseFromString(html, "text/html");
    parsed.querySelectorAll("p").forEach((paragraph) => {
      const vazio =
        !(paragraph.textContent || "").trim() && paragraph.children.length === 0;
      if (vazio) paragraph.remove();
    });
    return parsed.body.innerHTML;
  } catch {
    return html;
  }
}

const FONT_SIZES = [
  { label: "Pequeno", value: "0.85em" },
  { label: "Normal", value: "1em" },
  { label: "Médio", value: "1.15em" },
  { label: "Grande", value: "1.35em" },
  { label: "Enorme", value: "1.6em" },
];

const TEXT_COLORS = [
  { label: "Padrão", value: "" },
  { label: "Preto", value: "#1f2937" },
  { label: "Verde", value: "#166534" },
  { label: "Azul", value: "#1d4ed8" },
  { label: "Vermelho", value: "#b91c1c" },
  { label: "Laranja", value: "#c2410c" },
];

const BACKGROUNDS = [
  { label: "Sem cor", value: "" },
  { label: "Amarelo", value: "#fef08a" },
  { label: "Verde claro", value: "#bbf7d0" },
  { label: "Azul claro", value: "#bfdbfe" },
  { label: "Rosa", value: "#fbcfe8" },
];

const BLOCK_OPTIONS = [
  { label: "Parágrafo", value: "p" },
  { label: "Título (H2)", value: "h2" },
  { label: "Subtítulo (H3)", value: "h3" },
];

/**
 * Editor de texto rico da descrição do produto.
 *
 * Usa contentEditable + document.execCommand (funciona em Chrome, Edge,
 * Firefox e Safari, inclusive no celular) e devolve sempre HTML saneado.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escreva a descrição do produto...",
  minHeight = 170,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const lastEmitted = useRef<string>("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Estilos inline (cor, tamanho) em vez de <font color>
  useEffect(() => {
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {
      /* navegador sem suporte */
    }
  }, []);

  const saveSelection = useCallback(() => {
    const el = editorRef.current;
    const selection = window.getSelection();
    if (!el || !selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (el.contains(range.commonAncestorContainer)) {
      savedRange.current = range.cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const el = editorRef.current;
    if (!el) return false;
    el.focus({ preventScroll: true });
    const range = savedRange.current;
    if (!range) return false;
    const selection = window.getSelection();
    if (!selection) return false;
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  }, []);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = normalizeEditorHtml(normalizeInBrowser(el.innerHTML));
    lastEmitted.current = html;
    setIsEmpty((el.textContent || "").trim().length === 0);
    onChange(html);
  }, [onChange]);

  // Sincroniza quando o valor muda de fora (troca de produto, etc.)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (value === lastEmitted.current) return; // veio do próprio editor
    const html = toEditorHtml(value);
    if (el.innerHTML !== html) {
      el.innerHTML = html;
      lastEmitted.current = html;
    }
    setIsEmpty((el.textContent || "").trim().length === 0);
  }, [value]);

  const exec = useCallback(
    (command: string, commandValue?: string) => {
      if (!editorRef.current) return;
      restoreSelection();
      try {
        document.execCommand(command, false, commandValue);
      } catch {
        /* comando não suportado */
      }
      emit();
    },
    [emit, restoreSelection],
  );

  const execBlock = useCallback(
    (tag: string) => {
      const el = editorRef.current;
      if (!el) return;
      restoreSelection();
      try {
        document.execCommand("formatBlock", false, `<${tag}>`);
      } catch {
        /* ignora */
      }
      if (!el.querySelector(tag)) {
        try {
          document.execCommand("formatBlock", false, tag);
        } catch {
          /* ignora */
        }
      }
      emit();
    },
    [emit, restoreSelection],
  );

  /** Aplica um tamanho de fonte no trecho selecionado. */
  const applyFontSize = useCallback(
    (size: string) => {
      const el = editorRef.current;
      if (!el) return;
      restoreSelection();
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      if (range.collapsed) return;

      const span = document.createElement("span");
      span.style.fontSize = size;
      span.appendChild(range.extractContents());
      range.insertNode(span);

      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
      savedRange.current = newRange.cloneRange();
      emit();
    },
    [emit, restoreSelection],
  );

  /** Limpa negrito/itálico/sublinhado, cores e tamanhos do trecho selecionado. */
  const clearFormatting = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    restoreSelection();
    try {
      document.execCommand("removeFormat", false);
    } catch {
      /* ignora */
    }
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const container = selection.getRangeAt(0).commonAncestorContainer;
      const root =
        container.nodeType === Node.ELEMENT_NODE
          ? (container as Element)
          : container.parentElement;
      const sized = root?.querySelectorAll<HTMLElement>("[style*='font-size']");
      sized?.forEach((node) => {
        node.style.removeProperty("font-size");
      });
    }
    emit();
  }, [emit, restoreSelection]);

  const applyLink = useCallback(() => {
    const url = linkUrl.trim();
    // Só entra link seguro (o saneador também bloqueia o resto ao salvar)
    if (!/^(https?:|mailto:|tel:|\/)/i.test(url)) return;
    exec("createLink", url);
    setLinkOpen(false);
    setLinkUrl("");
  }, [exec, linkUrl]);

  const removeLink = useCallback(() => {
    exec("unlink");
    setLinkOpen(false);
    setLinkUrl("");
  }, [exec]);

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      const html = event.clipboardData.getData("text/html");
      if (!html) return; // texto puro: deixa o comportamento padrão
      event.preventDefault();
      const clean = sanitizeRichText(html);
      try {
        document.execCommand("insertHTML", false, clean);
      } catch {
        /* ignora */
      }
      emit();
    },
    [emit],
  );

  const btnBase =
    "flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40";

  const toolButtons: Array<{
    key: string;
    label: string;
    title: string;
    className?: string;
    separatorBefore?: boolean;
    onClick: () => void;
  }> = [
    { key: "bold", label: "B", title: "Negrito", onClick: () => exec("bold") },
    {
      key: "italic",
      label: "I",
      title: "Itálico",
      className: "italic",
      onClick: () => exec("italic"),
    },
    {
      key: "underline",
      label: "U",
      title: "Sublinhado",
      className: "underline",
      onClick: () => exec("underline"),
    },
    {
      key: "strike",
      label: "S",
      title: "Tachado",
      className: "line-through",
      onClick: () => exec("strikeThrough"),
    },
    {
      key: "ul",
      label: "• Lista",
      title: "Lista com marcadores",
      separatorBefore: true,
      onClick: () => exec("insertUnorderedList"),
    },
    {
      key: "ol",
      label: "1. Lista",
      title: "Lista numerada",
      onClick: () => exec("insertOrderedList"),
    },
    {
      key: "left",
      label: "Esquerda",
      title: "Alinhar à esquerda",
      separatorBefore: true,
      onClick: () => exec("justifyLeft"),
    },
    {
      key: "center",
      label: "Centro",
      title: "Centralizar",
      onClick: () => exec("justifyCenter"),
    },
    {
      key: "right",
      label: "Direita",
      title: "Alinhar à direita",
      onClick: () => exec("justifyRight"),
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 focus-within:border-[#0066d6] focus-within:ring-1 focus-within:ring-[#0066d6]">
      {/* Barra de formatação */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        {toolButtons.map((button) => (
          <span key={button.key} className="contents">
            {button.separatorBefore ? (
              <span className="mx-1 h-4 w-px bg-gray-300" />
            ) : null}
            <button
              type="button"
              title={button.title}
              aria-label={button.title}
              onMouseDown={(event) => event.preventDefault()}
              onClick={button.onClick}
              className={`${btnBase} ${button.className ?? ""}`}
            >
              {button.label}
            </button>
          </span>
        ))}

        <span className="mx-1 h-4 w-px bg-gray-300" />

        <select
          aria-label="Estilo do texto"
          title="Estilo do texto"
          onChange={(event) => execBlock(event.target.value)}
          onMouseDown={() => saveSelection()}
          className="h-7 rounded border border-gray-200 bg-white px-1.5 text-xs font-semibold text-gray-700 focus:outline-hidden"
        >
          {BLOCK_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Tamanho da fonte"
          title="Tamanho da fonte"
          onChange={(event) => applyFontSize(event.target.value)}
          onMouseDown={() => saveSelection()}
          className="h-7 rounded border border-gray-200 bg-white px-1.5 text-xs font-semibold text-gray-700 focus:outline-hidden"
        >
          {FONT_SIZES.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Cor do texto"
          title="Cor do texto"
          onChange={(event) => {
            if (event.target.value) exec("foreColor", event.target.value);
          }}
          onMouseDown={() => saveSelection()}
          className="h-7 rounded border border-gray-200 bg-white px-1.5 text-xs font-semibold text-gray-700 focus:outline-hidden"
        >
          {TEXT_COLORS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Cor de destaque"
          title="Cor de destaque"
          onChange={(event) => {
            if (event.target.value) exec("hiliteColor", event.target.value);
          }}
          onMouseDown={() => saveSelection()}
          className="h-7 rounded border border-gray-200 bg-white px-1.5 text-xs font-semibold text-gray-700 focus:outline-hidden"
        >
          {BACKGROUNDS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="mx-1 h-4 w-px bg-gray-300" />

        <button
          type="button"
          title="Inserir link"
          aria-label="Inserir link"
          onMouseDown={(event) => {
            event.preventDefault();
            saveSelection();
            setLinkOpen((open) => !open);
          }}
          className={`${btnBase} ${linkOpen ? "bg-gray-200 text-gray-900" : ""}`}
        >
          Link
        </button>

        <button
          type="button"
          title="Limpar formatação"
          aria-label="Limpar formatação"
          onMouseDown={(event) => event.preventDefault()}
          onClick={clearFormatting}
          className={btnBase}
        >
          Limpar
        </button>
      </div>

      {/* Campo de link */}
      {linkOpen ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-2.5 py-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://exemplo.com"
            className="min-w-40 flex-1 rounded border border-gray-300 px-2 py-1 text-xs text-gray-800 focus:border-[#0066d6] focus:outline-hidden"
          />
          <button
            type="button"
            onClick={applyLink}
            className="rounded bg-[#0066d6] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#0055b0]"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={removeLink}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            Remover
          </button>
        </div>
      ) : null}

      {/* Área de edição */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Descrição do produto"
        data-placeholder={placeholder}
        data-empty={isEmpty ? "true" : "false"}
        onInput={emit}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onBlur={saveSelection}
        onPaste={handlePaste}
        style={{ minHeight }}
        className="viva-rte__content px-3.5 py-3 text-sm leading-relaxed text-gray-800 focus:outline-hidden"
      />

      <div className="border-t border-gray-100 bg-gray-50/60 px-3 py-1.5 text-[11px] text-gray-500">
        Selecione o texto e use a barra para deixar em negrito, itálico, mudar o
        tamanho, a cor e criar listas. O texto aparece igual no site.
      </div>
    </div>
  );
}
