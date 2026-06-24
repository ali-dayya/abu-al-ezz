"use client";
import Image from "next/image";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

export default function CartItem({ item }) {
  const { lang } = useLanguage();
  const { updateQty, removeFromCart } = useCart();
  const name = lang === "ar" ? item.product_name_ar : item.product_name_en;

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      {/* Image */}
      <div
        className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
        style={{ background: "#f9f7f2" }}
      >
        <Image
          src={item.image_url}
          alt={name}
          fill
          sizes="80px"
          className="object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Package size={24} style={{ color: "#ddd" }} />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm leading-snug line-clamp-2" style={{ color: "#1a1a1a" }}>
          {name}
        </p>
        <p className="text-sm font-bold mt-1" style={{ color: "#C9A84C" }}>
          ${(item.price * item.qty).toFixed(2)}
        </p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQty(item.product_id, item.qty - 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ background: "#f3f4f6", color: "#6b7280" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#e5e7eb"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; }}
        >
          <Minus size={13} />
        </button>
        <span className="w-8 text-center text-sm font-bold" style={{ color: "#1a1a1a" }}>
          {item.qty}
        </span>
        <button
          onClick={() => updateQty(item.product_id, item.qty + 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ background: "#f3f4f6", color: "#6b7280" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#e5e7eb"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; }}
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeFromCart(item.product_id)}
        className="p-2 rounded-lg transition-all"
        style={{ color: "#ef4444" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
