import { useEffect, useRef, useState } from "react";
import { Check, Facebook, Link2, Mail, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ProductShareProps {
  productName: string;
  productUrl?: string;
  /** Descrição curta — vira o texto levado ao app de destino. */
  description?: string;
  /** URL absoluta da foto — tenta ir anexada no compartilhamento nativo. */
  imageUrl?: string;
  variant?: "floating" | "inline";
  className?: string;
}

type NativeNavigator = Navigator & {
  share?: (data: ShareData & { files?: File[] }) => Promise<void>;
  canShare?: (data: { files?: File[] }) => boolean;
};

function getProductUrl(explicit?: string): string {
  if (explicit) return explicit;
  if (typeof window !== "undefined") return window.location.href;
  return "";
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

/**
 * Abre o menu nativo do sistema (WhatsApp, E-mail, Telegram...) no celular.
 * Tenta levar a foto do produto anexada para a prévia ficar rica.
 * Retorna true quando o menu abriu (mesmo que o usuário cancele).
 */
async function tryNativeShare(args: {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}): Promise<boolean> {
  const nav = navigator as NativeNavigator;
  if (typeof nav.share !== "function") return false;

  // Nível 2: anexa a imagem quando o aparelho aceita (WhatsApp mostra a foto).
  if (args.imageUrl && typeof nav.canShare === "function") {
    try {
      const res = await fetch(args.imageUrl, { mode: "cors" });
      if (res.ok) {
        const blob = await res.blob();
        if (blob.type.startsWith("image/")) {
          const file = new File([blob], "produto.jpg", { type: blob.type || "image/jpeg" });
          if (nav.canShare({ files: [file] })) {
            try {
              await nav.share({ title: args.title, text: args.text, url: args.url, files: [file] });
              return true;
            } catch (err) {
              if (err instanceof DOMException && err.name === "AbortError") return true;
            }
          }
        }
      }
    } catch {
      // sem foto anexada: segue para o compartilhamento simples abaixo
    }
  }

  try {
    await nav.share({ title: args.title, text: args.text, url: args.url });
    return true;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return true;
    return false;
  }
}

/**
 * Botão de compartilhar produto.
 * - No celular: abre o menu nativo (WhatsApp, E-mail, Telegram...).
 * - No desktop/sem suporte: abre um menuzinho com WhatsApp, Facebook,
 *   E-mail e Copiar link.
 */
export function ProductShare({
  productName,
  productUrl,
  description,
  imageUrl,
  variant = "inline",
  className = "",
}: ProductShareProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const url = getProductUrl(productUrl);
  const text = description?.trim() ? `${productName} — ${description.trim()}` : productName;

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [menuOpen]);

  const handleCopy = async () => {
    if (!url) return;
    await copyText(url);
    setCopied(true);
    toast.success("Link do produto copiado!");
    setTimeout(() => setCopied(false), 2000);
    setMenuOpen(false);
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noreferrer");
    setMenuOpen(false);
  };

  const openFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noreferrer",
    );
    setMenuOpen(false);
  };

  const openEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(productName)}&body=${encodeURIComponent(`${text}\n${url}`)}`;
    setMenuOpen(false);
  };

  const handleMainClick = async () => {
    if (!url) return;
    // Celular com menu nativo: abre WhatsApp, E-mail, Telegram... direto.
    if (await tryNativeShare({ title: productName, text, url, imageUrl })) return;
    // Desktop ou sem suporte: mostra o menuzinho de opções.
    setMenuOpen((open) => !open);
  };

  if (variant === "floating") {
    return (
      <button
        type="button"
        onClick={async () => {
          if (!url) return;
          if (await tryNativeShare({ title: productName, text, url, imageUrl })) return;
          await handleCopy();
        }}
        aria-label={`Compartilhar ${productName}`}
        title="Compartilhar produto"
        className={`absolute left-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-primary shadow-card backdrop-blur transition-transform hover:scale-105 ${className}`}
      >
        <Share2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleMainClick}
        aria-label={`Compartilhar ${productName}`}
        aria-expanded={menuOpen}
        title="Compartilhar produto"
        className="grid h-8 w-8 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-muted"
      >
        <Share2 className="h-3.5 w-3.5" />
      </button>

      {menuOpen && (
        <div
          role="menu"
          aria-label="Opções de compartilhamento"
          className="absolute bottom-10 right-0 z-30 w-52 overflow-hidden rounded-xl border border-border bg-background shadow-lg"
        >
          <p className="border-b border-border px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Compartilhar via
          </p>
          <button
            type="button"
            role="menuitem"
            onClick={openWhatsApp}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <MessageCircle className="h-4 w-4 text-whatsapp" />
            WhatsApp
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={openFacebook}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Facebook className="h-4 w-4 text-[#1877f2]" />
            Facebook
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={openEmail}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Mail className="h-4 w-4 text-primary" />
            E-mail
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleCopy}
            className="flex w-full items-center gap-2.5 border-t border-border px-3.5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Link2 className="h-4 w-4 text-primary" />
            )}
            {copied ? "Link copiado!" : "Copiar link"}
          </button>
        </div>
      )}

    </div>
  );
}
