"use client";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
      <div className="skeleton" style={{ paddingTop:"75%", borderRadius:0 }} />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="flex items-center justify-between pt-3 mt-1" style={{ borderTop:"1px solid #f0ece4" }}>
          <div className="skeleton h-6 w-16" />
          <div className="skeleton h-3 w-14" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton flex-1 h-10" style={{ borderRadius:"12px" }} />
          <div className="skeleton w-12 h-10" style={{ borderRadius:"12px" }} />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const loadData = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      apiRequest("/api/products").then(setProducts),
      apiRequest("/api/categories").then((data) => setCategories(data.categories)),
    ]).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const filtered = products.filter(p => {
    const name = lang === "ar" ? p.product_name_ar : p.product_name_en;
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category_id === parseInt(catFilter);
    const matchAvail = availFilter === "all" || p.availability_status === availFilter;
    return matchSearch && matchCat && matchAvail;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "newest") return b.product_id - a.product_id;
    if (sortBy === "name_az") {
      const na = lang === "ar" ? a.product_name_ar : a.product_name_en;
      const nb = lang === "ar" ? b.product_name_ar : b.product_name_en;
      return na.localeCompare(nb, lang === "ar" ? "ar" : "en");
    }
    return a.product_id - b.product_id;
  });

  const hasFilters = search || catFilter !== "all" || availFilter !== "all" || sortBy !== "default";
  const clearFilters = () => { setSearch(""); setCatFilter("all"); setAvailFilter("all"); setSortBy("default"); };

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>

        {/* Page header */}
        <section style={{ background: "#0d0d0d", padding: "60px 0 56px" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="section-tag">{lang === "ar" ? "تسوق الآن" : "Shop Now"}</p>
            <h1 className="font-display text-5xl font-bold" style={{ color: "#fff" }}>{t("products")}</h1>
          </div>
        </section>

        {/* Filters bar */}
        <div
          className="sticky z-30"
          style={{
            top: "66px",
            background: "#fff",
            borderBottom: "1px solid #f0ece4",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            padding: "14px 0",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:"#aaa" }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  aria-label={lang === "ar" ? "البحث عن المنتجات" : "Search products"}
                  className="luxury-input"
                  style={{ paddingLeft: "40px" }}
                />
              </div>

              {/* Category */}
              <select
                value={catFilter}
                onChange={e => setCatFilter(e.target.value)}
                aria-label={lang === "ar" ? "تصفية حسب الفئة" : "Filter by category"}
                className="luxury-input"
                style={{ minWidth: "160px" }}
              >
                <option value="all">{t("allCategories")}</option>
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>
                    {lang === "ar" ? c.category_name_ar : c.category_name_en}
                  </option>
                ))}
              </select>

              {/* Availability */}
              <select
                value={availFilter}
                onChange={e => setAvailFilter(e.target.value)}
                aria-label={lang === "ar" ? "تصفية حسب التوفر" : "Filter by availability"}
                className="luxury-input"
                style={{ minWidth: "150px" }}
              >
                <option value="all">{t("allAvailability")}</option>
                <option value="available">{t("available")}</option>
                <option value="out_of_stock">{t("outOfStock")}</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                aria-label={lang === "ar" ? "ترتيب المنتجات" : "Sort products"}
                className="luxury-input"
                style={{ minWidth: "160px" }}
              >
                <option value="default">{lang === "ar" ? "الترتيب الافتراضي" : "Default Order"}</option>
                <option value="price_asc">{lang === "ar" ? "السعر: من الأقل" : "Price: Low to High"}</option>
                <option value="price_desc">{lang === "ar" ? "السعر: من الأعلى" : "Price: High to Low"}</option>
                <option value="name_az">{lang === "ar" ? "الاسم: أ–ي" : "Name: A–Z"}</option>
                <option value="newest">{lang === "ar" ? "الأحدث أولاً" : "Newest First"}</option>
              </select>

              {/* Clear */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-3 rounded-xl transition-all"
                  style={{ color:"#ef4444", border:"1.5px solid #fecaca", background:"#fef2f2" }}
                >
                  <X size={14} />
                  {lang === "ar" ? "مسح" : "Clear"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-medium" style={{ color:"#818181" }} aria-live="polite" aria-atomic="true">
                {!loading && (<><span className="font-bold" style={{ color:"#1a1a1a" }}>{sorted.length}</span>
                {" "}{lang === "ar" ? "منتج" : "products"}
                {hasFilters && <span style={{ color:"#C9A84C" }}> · filtered</span>}</>)}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <ErrorState onRetry={loadData} />
            ) : sorted.length === 0 ? (
              <div className="text-center py-28">
                <Search size={56} className="mx-auto mb-5" style={{ color: "#e5dfc8" }} />
                <h3 className="font-display text-xl font-semibold mb-2" style={{ color:"#434343" }}>{t("noProducts")}</h3>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
                  style={{ color:"#C9A84C", border:"1.5px solid rgba(201,168,76,0.4)" }}
                >
                  {lang === "ar" ? "مسح الفلاتر" : "Clear filters"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sorted.map((product, i) => (
                  <div key={product.product_id} className="fade-up" style={{ animationDelay: `${(i % 8) * 0.07}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
