import { useState } from "react";
import { Check, Copy, Facebook, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ProductShareProps {
  productName: string;
  productUrl?: string;
  variant?: "floating" | "inline";
  className?: string;
}

function getProductUrl(explicit?: string): string {
  if (explicit) return explicit;
  if (typeof window !== "undefined") return window.location.href;
  return "";
}

/**
 * Botão de compartilhar produto: Web Share API no mobile,
 * senão copia o link + atalhos WhatsApp/Facebook.
 */
export function ProductShare({ productName, productUrl, variant = "inline", className = "" }: ProductShareProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    toast.success("Link do produto copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = getProductUrl(productUrl);
    if (!url) return;
    const shareData = { title: productName, text: `Olha este produto: ${productName}`, url };
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share(shareData);
        return;
      }
    } catch {
      // usuário cancelou ou falhou -> cai para copiar link
    }
    await copyLink(url);
  };

  const openWhatsApp = () => {
    const url = getProductUrl(productUrl);
    window.open(`https://wa.me/?text=${encodeURIComponent(`${productName} ${url}`)}`, "_blank", "noreferrer");
  };

  const openFacebook = () => {
    const url = getProductUrl(productUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noreferrer");
  };

  if (variant === "floating") {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Compartilhar ${productName}`}
        title="Compartilhar produto"
        className={`absolute left-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-primary shadow-card backdrop-blur transition-transform hover:scale-105 ${className}`}
      >
        <Share2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Compartilhar ${productName}`}
        title="Compartilhar / copiar link"
        className="grid h-8 w-8 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-muted"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        onClick={openFacebook}
        aria-label={`Compartilhar ${productName} no Facebook`}
        title="Compartilhar no Facebook"
        className="grid h-8 w-8 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-muted"
      >
        <Facebook className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => copyLink(getProductUrl(productUrl))}
        aria-label="Copiar link do produto"
        title="Copiar link"
        className="grid h-8 w-8 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-muted"
      >
        <Link2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={openWhatsApp}
        aria-label={`Compartilhar ${productName} no WhatsApp`}
        title="Compartilhar no WhatsApp"
        className="grid h-8 w-8 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-muted"
      >
        <Share2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
