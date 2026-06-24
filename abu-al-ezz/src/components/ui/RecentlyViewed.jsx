"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Package } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

const MAX_RECENT = 6;
const STORAGE_KEY = "recently-viewed";

export function trackRecentlyViewed(productId) {
  if (typeof window === "undefined") return;
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = ids.filter((id) => id !== productId);
    filtered.unshift(productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_RECENT + 1)));
  } catch {}
}

export default function RecentlyViewed({ excludeId }) {
  const { lang } = useLanguage();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
        .filter((id) => id !== excludeId)
        .slice(0, MAX_RECENT);

      if (ids.length === 0) return;

      apiRequest("/api/products")
        .then((all) => {
          const map = new Map(all.map((p) => [p.product_id, p]));
          setProducts(ids.map((id) => map.get(id)).filter(Boolean));
        })
        .catch(() => {});
    } catch {}
  }, [excludeId]);

  if (products.length === 0) return null;

  return (
    <div className="mt-20">
      <div className="flex items-center gap-2 mb-6">
        <Clock size={18} style={{ color: "#C9A84C" }} />
        <h2 className="font-display text-xl font-bold" style={{ color: "#1a1a1a" }}>
          {lang === "ar" ? "شاهدت مؤخراً" : "Recently Viewed"}
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((p) => (
          <Link key={p.product_id} href={`/product/${p.product_id}`} className="flex-shrink-0 w-36">
            <div
              className="rounded-xl overflow-hidden transition-all duration-300"
              style={{ background: "#fff", border: "1px solid #f0ece4" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,168,76,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="relative aspect-square" style={{ background: "#f9f7f2" }}>
                <Image src={p.image_url} alt={lang === "ar" ? p.product_name_ar : p.product_name_en} fill sizes="144px" className="object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Package size={24} style={{ color: "#e5dfc8", opacity: 0.5 }} />
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate" style={{ color: "#1a1a1a" }}>
                  {lang === "ar" ? p.product_name_ar : p.product_name_en}
                </p>
                <p className="text-xs font-bold" style={{ color: "#C9A84C" }}>${p.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
