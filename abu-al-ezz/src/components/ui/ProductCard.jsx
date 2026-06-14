"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, Package } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";

export default function ProductCard({ product }) {
  const { t, lang } = useLanguage();
  const { addToCart } = useCart();
  const { getCategoryName } = useCatalog();
  const isAvailable = product.availability_status === "available";
  const name = lang === "ar" ? product.product_name_ar : product.product_name_en;
  const catName = getCategoryName(product.category_id, lang);

  return (
    <div
      className="group rounded-2xl overflow-hidden flex flex-col h-full"
      style={{
        background: "#fff",
        border: "1px solid #f0ece4",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 50px rgba(201,168,76,0.18)";
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
        e.currentTarget.style.borderColor = "#f0ece4";
      }}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ paddingTop: "75%", background: "#f9f7f2" }}>
        <div className="absolute inset-0">
          <Image
            src={product.image_url}
            alt={name}
            fill
            className="object-cover"
            style={{ transition: "transform 0.5s ease" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          {/* Fallback icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Package size={44} style={{ color: "#e5dfc8", opacity: 0.5 }} />
          </div>
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-end justify-center pb-4 transition-all duration-300"
          style={{
            background: "linear-gradient(to top, rgba(13,13,13,0.75) 0%, transparent 60%)",
            opacity: 0,
          }}
          ref={el => {
            if (!el) return;
            const parent = el.closest(".group");
            if (parent) {
              parent.addEventListener("mouseenter", () => { el.style.opacity = "1"; });
              parent.addEventListener("mouseleave", () => { el.style.opacity = "0"; });
            }
          }}
        >
          <Link
            href={`/product/${product.product_id}`}
            className="flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-full transition-all"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
            }}
          >
            <Eye size={14} />
            {t("viewDetails")}
          </Link>
        </div>

        {/* Out of stock badge */}
        {!isAvailable && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full badge-out_of_stock">
              {t("outOfStock")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#C9A84C" }}>
          {catName}
        </p>
        <h3
          className="font-display font-semibold text-base leading-snug mb-auto line-clamp-2 transition-colors duration-200"
          style={{ color: "#1a1a1a" }}
        >
          {name}
        </h3>

        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid #f0ece4" }}>
          <div>
            <span className="text-xl font-bold" style={{ color: "#1a1a1a" }}>
              ${product.price.toFixed(2)}
            </span>
          </div>
          <span className="text-xs" style={{ color: "#aaa" }}>
            {product.stock_quantity} {t("pieces")}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <Link
            href={`/product/${product.product_id}`}
            className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ border: "1.5px solid rgba(201,168,76,0.4)", color: "#C9A84C" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            {t("viewDetails")}
          </Link>
          <button
            onClick={() => isAvailable && addToCart(product)}
            disabled={!isAvailable}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={isAvailable
              ? { background: "#0d0d0d", color: "#C9A84C" }
              : { background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed" }
            }
            onMouseEnter={e => { if (isAvailable) e.currentTarget.style.background = "#1a1a1a"; }}
            onMouseLeave={e => { if (isAvailable) e.currentTarget.style.background = "#0d0d0d"; }}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
