"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { useCatalog } from "@/context/CatalogContext";
import { apiRequest } from "@/lib/api";

export default function CategoriesPage() {
  const { t, lang } = useLanguage();
  const { categories, getSubcategoriesForCategory } = useCatalog();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/products").then(setProducts).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const getProductsByCategory = (categoryId) => products.filter((item) => item.category_id === categoryId);

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight:"100vh", background:"#FFFDF5" }}>

        {/* Header */}
        <section style={{ background:"#0d0d0d", padding:"60px 0 52px" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="section-tag">{lang === "ar" ? "تصفح حسب التصنيف" : "Browse by Category"}</p>
            <h1 className="font-display text-5xl font-bold" style={{ color:"#fff" }}>{t("categories")}</h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          {error ? (
            <ErrorState onRetry={loadData} />
          ) : categories.map(cat => {
            const subs = getSubcategoriesForCategory(cat.category_id);
            const catProducts = getProductsByCategory(cat.category_id);
            const catName = lang === "ar" ? cat.category_name_ar : cat.category_name_en;
            const catDesc = lang === "ar" ? cat.description_ar : cat.description_en;

            return (
              <section key={cat.category_id} id={`cat-${cat.category_id}`} className="scroll-mt-24">

                {/* Category header bar */}
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10 pb-6"
                  style={{ borderBottom:"2px solid #f0ece4" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background:"#0d0d0d", border:"1px solid rgba(201,168,76,0.25)" }}
                  >
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-bold" style={{ color:"#1a1a1a" }}>{catName}</h2>
                    <p className="text-sm mt-1" style={{ color:"#818181" }}>{catDesc}</p>
                  </div>
                  {/* Subcategory pills */}
                  <div className="flex flex-wrap gap-2">
                    {subs.map(sub => (
                      <span key={sub.subcategory_id}
                        className="text-xs font-medium px-3 py-1.5 rounded-full"
                        style={{ background:"rgba(201,168,76,0.1)", color:"#C9A84C", border:"1px solid rgba(201,168,76,0.2)" }}>
                        {lang === "ar" ? sub.subcategory_name_ar : sub.subcategory_name_en}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Products grid */}
                {loading ? (
                  <div className="text-center py-10">
                    <p className="text-sm" style={{ color:"#aaa" }}>{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
                  </div>
                ) : catProducts.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm" style={{ color:"#aaa" }}>
                      {lang === "ar" ? "لا توجد منتجات في هذه الفئة" : "No products in this category yet"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {catProducts.map((product, i) => (
                      <div key={product.product_id} className="fade-up" style={{ animationDelay:`${i*0.08}s` }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
