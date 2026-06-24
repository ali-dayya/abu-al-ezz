"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Package } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export default function GlobalSearch() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setProducts([]); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLoading(true);
      apiRequest("/api/products")
        .then((all) => {
          const q = query.toLowerCase();
          setProducts(
            all.filter((p) =>
              p.product_name_en.toLowerCase().includes(q) ||
              p.product_name_ar.toLowerCase().includes(q)
            ).slice(0, 6)
          );
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2.5 rounded-lg transition-all"
        style={{ color: "#a4a4a4" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#C9A84C"; e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#a4a4a4"; e.currentTarget.style.background = "transparent"; }}
        aria-label={lang === "ar" ? "بحث" : "Search (Ctrl+K)"}
      >
        <Search size={18} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden animate-scale-in"
            style={{ background: "#fff", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid #f0ece4" }}>
              <Search size={18} style={{ color: "#aaa" }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن المنتجات..." : "Search products..."}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "#1a1a1a" }}
              />
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#f3f4f6", color: "#aaa" }}>ESC</kbd>
              <button onClick={() => setOpen(false)} style={{ color: "#aaa" }}><X size={16} /></button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading && (
                <div className="p-4 text-center text-sm" style={{ color: "#aaa" }}>
                  {lang === "ar" ? "جارٍ البحث..." : "Searching..."}
                </div>
              )}
              {!loading && query && products.length === 0 && (
                <div className="p-6 text-center">
                  <Search size={32} className="mx-auto mb-2" style={{ color: "#e5dfc8" }} />
                  <p className="text-sm" style={{ color: "#aaa" }}>
                    {lang === "ar" ? "لا توجد نتائج" : "No products found"}
                  </p>
                </div>
              )}
              {products.map((p) => (
                <Link
                  key={p.product_id}
                  href={`/product/${p.product_id}`}
                  onClick={() => { setOpen(false); setQuery(""); }}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fdfaf3"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "#f9f7f2" }}>
                    <Image src={p.image_url} alt="" fill sizes="40px" className="object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package size={16} style={{ color: "#e5dfc8" }} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#1a1a1a" }}>
                      {lang === "ar" ? p.product_name_ar : p.product_name_en}
                    </p>
                    <p className="text-xs" style={{ color: "#C9A84C" }}>${p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
