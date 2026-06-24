"use client";
import { Star } from "lucide-react";

export default function StarRating({ rating, onRate, size = 18, interactive = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          className="transition-transform"
          style={{
            cursor: interactive ? "pointer" : "default",
            padding: 0,
            background: "none",
            border: "none",
            transform: interactive ? undefined : "none",
          }}
          onMouseEnter={(e) => { if (interactive) e.currentTarget.style.transform = "scale(1.2)"; }}
          onMouseLeave={(e) => { if (interactive) e.currentTarget.style.transform = "scale(1)"; }}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            fill={star <= rating ? "#C9A84C" : "none"}
            style={{ color: star <= rating ? "#C9A84C" : "#d4d4d4" }}
          />
        </button>
      ))}
    </div>
  );
}

export function AverageRating({ reviews, lang }) {
  if (!reviews || reviews.length === 0) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="flex items-center gap-2">
      <StarRating rating={Math.round(avg)} />
      <span className="text-sm font-bold" style={{ color: "#1a1a1a" }}>
        {avg.toFixed(1)}
      </span>
      <span className="text-xs" style={{ color: "#aaa" }}>
        ({reviews.length} {lang === "ar" ? "تقييم" : reviews.length === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}
