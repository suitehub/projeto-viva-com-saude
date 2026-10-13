import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useProductReviews } from "@/data/product-reviews";
import { useCurrentUser } from "@/data/user-auth";

export function ReviewStars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Nota ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={`${className} ${index <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-border"}`}
        />
      ))}
    </span>
  );
}

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Sua nota de 1 a 5 estrelas">
      {[1, 2, 3, 4, 5].map((index) => (
        <button
          key={index}
          type="button"
          role="radio"
          aria-checked={value === index}
          aria-label={`${index} ${index === 1 ? "estrela" : "estrelas"}`}
          onClick={() => onChange(index)}
          className="rounded p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`h-7 w-7 ${index <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  );
}

interface ProductReviewsSectionProps {
  productId: string | number;
  productSlug: string;
  productName: string;
  fallbackRating?: number;
  fallbackCount?: number;
}

/**
 * Bloco de avaliações estilo marketplace (Shopee/ML):
 * média + total, lista com nome + estrelas + comentário
 * (quando sem comentário, mostra só as estrelas).
 * O formulário de avaliar fica em Minhas compras após a entrega.
 */
export function ProductReviewsSection({
  productId,
  productSlug,
  productName,
  fallbackRating = 0,
  fallbackCount = 0,
}: ProductReviewsSectionProps) {
  const { user, isLoggedIn } = useCurrentUser();
  void productSlug;
  void productName;
  void user;
  const { reviews, average, count } = useProductReviews(productId);
  const displayAverage = count > 0 ? average : fallbackRating;
  const displayCount = count > 0 ? count : fallbackCount;

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="font-display text-lg font-bold text-foreground">Avaliações dos clientes</h3>
      {displayCount > 0 ? (
        <div className="mt-2 flex items-center gap-3">
          <ReviewStars value={displayAverage} />
          <span className="text-sm text-muted-foreground">
            {displayAverage.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} de 5 · {displayCount}{" "}
            {displayCount === 1 ? "avaliação" : "avaliações"}
          </span>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Este produto ainda não tem avaliações. Seja a primeira pessoa a avaliar após a entrega!
        </p>
      )}

      {reviews.length > 0 && (
        <ul className="mt-4 space-y-3">
          {reviews.slice(0, 10).map((review) => (
            <li key={review.id} className="rounded-lg border border-border/70 bg-background/50 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {(review.userName || "C").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">{review.userName}</p>
                  <p className="text-[11px] text-muted-foreground">{review.date}</p>
                </div>
                <ReviewStars value={review.rating} className="h-3.5 w-3.5" />
              </div>
              {review.comment?.trim() && (
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{review.comment}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/40 p-3.5 text-xs text-muted-foreground">
        {isLoggedIn ? (
          <p>
            A avaliação é liberada após a entrega: vá em{" "}
            <Link to="/conta" className="font-bold text-primary hover:underline">
              Minha Conta → Minhas compras
            </Link>{" "}
            e avalie com 1 a 5 estrelas + comentário.
          </p>
        ) : (
          <p>
            <Link to="/conta" search={{ tab: "entrar" }} className="font-bold text-primary hover:underline">
              Entre na sua conta
            </Link>{" "}
            para avaliar este produto após a entrega.
          </p>
        )}
      </div>
    </div>
  );
}
