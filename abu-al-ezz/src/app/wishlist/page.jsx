"use client";
import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export default function WishlistPage() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/wishlist")
      .then(setItems)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadData(); else setLoading(false); }, [user]);

  const removeItem = async (productId) => {
    try {
      await apiRequest(`/api/wishlist/${productId}`, { method: "POST" });
      setItems((prev) => prev.filter((w) => w.product_id !== productId));
    } catch {}
  };

  if (!user && !loading) {
    return (
      <>
        <Navbar />
        <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Heart size={56} className="mx-auto mb-4" style={{ color: "#e5dfc8" }} />
              <p className="text-sm" style={{ color: "#aaa" }}>
                {lang === "ar" ? "يرجى تسجيل الدخول لعرض المفضلة" : "Please log in to view your wishlist"}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>
        <section style={{ background: "#0d0d0d", padding: "60px 0 52px" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="section-tag">{lang === "ar" ? "المفضلة" : "Favorites"}</p>
            <h1 className="font-display text-5xl font-bold" style={{ color: "#fff" }}>
              {lang === "ar" ? "قائمة الأمنيات" : "My Wishlist"}
            </h1>
          </div>
        </section>

        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
                    <div className="skeleton" style={{ paddingTop: "75%", borderRadius: 0 }} />
                    <div className="p-4 space-y-3">
                      <div className="skeleton h-4 w-full" />
                      <div className="skeleton h-6 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorState onRetry={loadData} />
            ) : items.length === 0 ? (
              <div className="text-center py-24">
                <Heart size={56} className="mx-auto mb-4" style={{ color: "#e5dfc8" }} />
                <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "#434343" }}>
                  {lang === "ar" ? "قائمة الأمنيات فارغة" : "Your wishlist is empty"}
                </h3>
                <p className="text-sm" style={{ color: "#aaa" }}>
                  {lang === "ar" ? "تصفح المنتجات وأضف ما يعجبك" : "Browse products and add your favorites"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium mb-6" style={{ color: "#818181" }}>
                  <span className="font-bold" style={{ color: "#1a1a1a" }}>{items.length}</span>
                  {" "}{lang === "ar" ? "منتج في المفضلة" : "items in your wishlist"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((w) => w.product && (
                    <div key={w.wishlist_id} className="relative">
                      <ProductCard product={w.product} />
                      <button
                        onClick={() => removeItem(w.product_id)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{ background: "rgba(239,68,68,0.9)", color: "#fff" }}
                        aria-label={lang === "ar" ? "إزالة من المفضلة" : "Remove from wishlist"}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
