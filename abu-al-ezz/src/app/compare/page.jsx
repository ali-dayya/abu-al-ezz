"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Package, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/ui/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/api";

export default function ComparePage() {
  const { t, lang } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("compare-products") || "[]");
    if (ids.length === 0) { setLoading(false); return; }

    apiRequest("/api/products")
      .then((all) => setProducts(all.filter((p) => ids.includes(p.product_id))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const removeProduct = (id) => {
    const ids = JSON.parse(localStorage.getItem("compare-products") || "[]").filter((i) => i !== id);
    localStorage.setItem("compare-products", JSON.stringify(ids));
    setProducts((prev) => prev.filter((p) => p.product_id !== id));
  };

  const clearAll = () => {
    localStorage.setItem("compare-products", "[]");
    setProducts([]);
  };

  const rows = [
    { label: lang === "ar" ? "السعر" : "Price", render: (p) => <span className="font-bold" style={{ color: "#C9A84C" }}>${p.price.toFixed(2)}</span> },
    { label: lang === "ar" ? "الحالة" : "Status", render: (p) => <StatusBadge status={p.availability_status} /> },
    { label: lang === "ar" ? "المخزون" : "Stock", render: (p) => <span>{p.stock_quantity} {t("pieces")}</span> },
    { label: lang === "ar" ? "الوصف" : "Description", render: (p) => <span className="text-xs leading-relaxed">{lang === "ar" ? p.description_ar : p.description_en || "—"}</span> },
  ];

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>
        <section style={{ background: "#0d0d0d", padding: "60px 0 52px" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-display text-5xl font-bold" style={{ color: "#fff" }}>
              {lang === "ar" ? "مقارنة المنتجات" : "Compare Products"}
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <Package size={56} className="mx-auto mb-4" style={{ color: "#e5dfc8" }} />
              <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "#434343" }}>
                {lang === "ar" ? "لا توجد منتجات للمقارنة" : "No products to compare"}
              </h3>
              <p className="text-sm mb-6" style={{ color: "#aaa" }}>
                {lang === "ar" ? "أضف منتجات من صفحة المنتجات للمقارنة" : "Add products from the products page to compare"}
              </p>
              <Link href="/products" className="btn-gold">{t("products")}</Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm" style={{ color: "#818181" }}>
                  {products.length} {lang === "ar" ? "منتجات" : "products"}
                </p>
                <button onClick={clearAll} className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: "#ef4444", border: "1px solid #fecaca" }}>
                  {lang === "ar" ? "مسح الكل" : "Clear All"}
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden overflow-x-auto" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
                <table className="w-full text-sm" style={{ minWidth: `${products.length * 220}px` }}>
                  <thead>
                    <tr>
                      <th className="p-4 text-left" style={{ width: "120px", borderBottom: "1px solid #f0ece4" }} />
                      {products.map((p) => (
                        <th key={p.product_id} className="p-4 text-center relative" style={{ borderBottom: "1px solid #f0ece4", minWidth: "200px" }}>
                          <button onClick={() => removeProduct(p.product_id)} className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#fef2f2", color: "#ef4444" }}>
                            <X size={12} />
                          </button>
                          <Link href={`/product/${p.product_id}`}>
                            <div className="relative w-20 h-20 mx-auto rounded-xl overflow-hidden mb-2" style={{ background: "#f9f7f2" }}>
                              <Image src={p.image_url} alt={lang === "ar" ? p.product_name_ar : p.product_name_en} fill sizes="80px" className="object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            </div>
                            <p className="font-display font-semibold text-sm" style={{ color: "#1a1a1a" }}>
                              {lang === "ar" ? p.product_name_ar : p.product_name_en}
                            </p>
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.label}>
                        <td className="px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "#C9A84C", borderBottom: "1px solid #f9f7f2" }}>
                          {row.label}
                        </td>
                        {products.map((p) => (
                          <td key={p.product_id} className="px-4 py-3 text-center" style={{ color: "#434343", borderBottom: "1px solid #f9f7f2" }}>
                            {row.render(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="px-4 py-3" />
                      {products.map((p) => (
                        <td key={p.product_id} className="px-4 py-3 text-center">
                          <button
                            onClick={() => p.availability_status === "available" && addToCart(p)}
                            disabled={p.availability_status !== "available"}
                            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={p.availability_status === "available"
                              ? { background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d" }
                              : { background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed" }
                            }
                          >
                            {t("addToCart")}
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <Link href="/products" className="inline-flex items-center gap-2 mt-8 text-sm" style={{ color: "#aaa" }}>
                <ArrowLeft size={14} /> {t("backToProducts")}
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
