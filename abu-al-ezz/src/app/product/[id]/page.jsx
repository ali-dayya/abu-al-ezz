"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Package, ShoppingCart, Minus, Plus, ChevronRight, ZoomIn, X, Heart, Bell, BellOff } from "lucide-react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/ui/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";
import ReviewSection from "@/components/ui/ReviewSection";
import SocialShare from "@/components/ui/SocialShare";
import ImageGallery from "@/components/ui/ImageGallery";
import RecentlyViewed, { trackRecentlyViewed } from "@/components/ui/RecentlyViewed";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

function ProductDetailSkeleton() {
  return (
    <>
      <Navbar />
      <div style={{ background: "#fff", borderBottom: "1px solid #f0ece4", padding: "12px 0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="skeleton h-3 w-10" />
            <div className="skeleton h-3 w-3 rounded" />
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-3 w-3 rounded" />
            <div className="skeleton h-3 w-32" />
          </div>
        </div>
      </div>
      <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
              <div className="skeleton aspect-square rounded-3xl" style={{ borderRadius: "24px" }} />
              <div className="space-y-6">
                <div className="skeleton h-4 w-40" />
                <div className="skeleton h-10 w-full" />
                <div className="skeleton h-10 w-3/4" />
                <div className="skeleton h-12 w-36" />
                <div style={{ height: "1px", background: "#f0ece4" }} />
                <div className="space-y-2">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-5/6" />
                  <div className="skeleton h-4 w-4/5" />
                </div>
                <div className="skeleton h-14 rounded-2xl" style={{ borderRadius: "16px" }} />
                <div className="flex gap-4">
                  <div className="skeleton h-12 w-36 rounded-2xl" style={{ borderRadius: "16px" }} />
                  <div className="skeleton h-12 flex-1 rounded-2xl" style={{ borderRadius: "16px" }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const { t, lang, dir } = useLanguage();
  const { addToCart } = useCart();
  const { getCategoryName, getSubcategoryName } = useCatalog();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [notifySubscribed, setNotifySubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(false);
    apiRequest(`/api/products/${params.id}`)
      .then(p => {
        setProduct(p);
        apiRequest("/api/products")
          .then(all => setRelated(all.filter(r => r.category_id === p.category_id && r.product_id !== p.product_id).slice(0, 3)))
          .catch(() => {});
        apiRequest(`/api/product-images/${params.id}`)
          .then(setGalleryImages)
          .catch(() => {});
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (product) trackRecentlyViewed(product.product_id); }, [product]);

  useEffect(() => {
    if (user) {
      apiRequest("/api/wishlist?ids=true")
        .then((ids) => setWishlisted(ids.includes(Number(params.id))))
        .catch(() => {});
    }
  }, [user, params.id]);

  const toggleWishlist = async () => {
    if (!user) return;
    try {
      const res = await apiRequest(`/api/wishlist/${params.id}`, { method: "POST" });
      setWishlisted(res.added);
    } catch {}
  };

  if (loading) return <ProductDetailSkeleton />;

  if (error) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFDF5" }}>
        <ErrorState onRetry={loadData} />
      </div>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFDF5" }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "#f9f7f2", border: "1px solid #f0ece4" }}>
            <Package size={40} style={{ color: "#e5dfc8" }} />
          </div>
          <h2 className="font-display text-2xl font-bold mb-4" style={{ color: "#434343" }}>
            {lang === "ar" ? "المنتج غير موجود" : "Product not found"}
          </h2>
          <Link href="/products" className="btn-gold">{t("backToProducts")}</Link>
        </div>
      </div>
      <Footer />
    </>
  );

  const name = lang === "ar" ? product.product_name_ar : product.product_name_en;
  const desc = lang === "ar" ? product.description_ar : product.description_en;
  const catName = getCategoryName(product.category_id, lang);
  const subName = getSubcategoryName(product.subcategory_id, lang);
  const isAvailable = product.availability_status === "available";

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: lang === "ar" ? "الرئيسية" : "Home", item: siteUrl },
              { "@type": "ListItem", position: 2, name: lang === "ar" ? "المنتجات" : "Products", item: `${siteUrl}/products` },
              { "@type": "ListItem", position: 3, name: name, item: `${siteUrl}/product/${product.product_id}` },
            ],
          }),
        }}
      />
      <Navbar />
      <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>

        {/* Breadcrumb */}
        <div style={{ background: "#fff", borderBottom: "1px solid #f0ece4", padding: "12px 0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center gap-2 text-xs ${dir === "rtl" ? "flex-row-reverse" : ""}`} style={{ color: "#aaa" }}>
              <Link href="/" style={{ color: "#aaa" }}
                onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                onMouseLeave={e => e.currentTarget.style.color = "#aaa"}>{t("home")}</Link>
              <ChevronRight size={11} className={dir === "rtl" ? "rotate-180" : ""} />
              <Link href="/products" style={{ color: "#aaa" }}
                onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                onMouseLeave={e => e.currentTarget.style.color = "#aaa"}>{t("products")}</Link>
              <ChevronRight size={11} className={dir === "rtl" ? "rotate-180" : ""} />
              <span style={{ color: "#1a1a1a" }} className="font-medium truncate max-w-xs">{name}</span>
            </div>
          </div>
        </div>

        {/* Main product section */}
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-start ${dir === "rtl" ? "lg:grid-flow-dense" : ""}`}>

              {/* Image Gallery */}
              <ImageGallery mainImage={product.image_url} images={galleryImages} alt={name} />

              {/* Info panel */}
              <div className="space-y-7">
                <div className={`flex items-center gap-2 text-sm ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <span className="font-semibold" style={{ color: "#C9A84C" }}>{catName}</span>
                  <ChevronRight size={13} className={dir === "rtl" ? "rotate-180" : ""} style={{ color: "#ccc" }} />
                  <span style={{ color: "#aaa" }}>{subName}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-bold leading-snug" style={{ color: "#1a1a1a" }}>
                  {name}
                </h1>

                <div className="flex items-center gap-5">
                  <span className="text-4xl font-bold" style={{ color: "#1a1a1a" }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <StatusBadge status={product.availability_status} />
                </div>

                <div style={{ height: "1px", background: "#f0ece4" }} />

                {desc && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A84C" }}>
                      {t("description")}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#515151" }}>{desc}</p>
                  </div>
                )}

                <div
                  className="rounded-2xl px-5 py-4 flex items-center justify-between text-sm"
                  style={{ background: "#f9f7f2", border: "1px solid #f0ece4" }}
                >
                  <span style={{ color: "#818181" }}>{t("stock")}</span>
                  <span className="font-bold" style={{ color: product.stock_quantity > 0 ? "#065F46" : "#991B1B" }}>
                    {product.stock_quantity} {t("pieces")}
                  </span>
                </div>

                {isAvailable && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#C9A84C" }}>{t("quantity")}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-2xl overflow-hidden" style={{ border: "1.5px solid #f0ece4" }}>
                        <button
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          aria-label={lang === "ar" ? "تقليل الكمية" : "Decrease quantity"}
                          className="w-11 h-11 flex items-center justify-center transition-colors"
                          style={{ color: "#818181" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f9f7f2"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-12 text-center font-bold text-lg" style={{ color: "#1a1a1a" }} aria-live="polite">{qty}</span>
                        <button
                          onClick={() => setQty(Math.min(product.stock_quantity, qty + 1))}
                          aria-label={lang === "ar" ? "زيادة الكمية" : "Increase quantity"}
                          className="w-11 h-11 flex items-center justify-center transition-colors"
                          style={{ color: "#818181" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f9f7f2"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300"
                        style={added
                          ? { background: "#10b981", color: "#fff" }
                          : { background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d" }
                        }
                        onMouseEnter={e => { if (!added) e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,168,76,0.4)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <ShoppingCart size={17} />
                        {added ? (lang === "ar" ? "تمت الإضافة ✓" : "Added ✓") : t("addToCart")}
                      </button>
                    </div>
                  </div>
                )}

                {/* Stock notification for out-of-stock */}
                {!isAvailable && user && (
                  <button
                    onClick={async () => {
                      if (notifySubscribed) {
                        await apiRequest(`/api/stock-notify/${product.product_id}`, { method: "DELETE" }).catch(() => {});
                        setNotifySubscribed(false);
                      } else {
                        await apiRequest(`/api/stock-notify/${product.product_id}`, { method: "POST" }).catch(() => {});
                        setNotifySubscribed(true);
                      }
                    }}
                    className="flex items-center gap-2 text-sm font-medium py-2.5 px-5 rounded-xl transition-all w-full justify-center"
                    style={{
                      border: notifySubscribed ? "1.5px solid #22c55e" : "1.5px solid #f0ece4",
                      color: notifySubscribed ? "#22c55e" : "#C9A84C",
                      background: notifySubscribed ? "rgba(34,197,94,0.05)" : "rgba(201,168,76,0.05)",
                    }}
                  >
                    {notifySubscribed ? <BellOff size={16} /> : <Bell size={16} />}
                    {notifySubscribed
                      ? (lang === "ar" ? "إلغاء الإشعار" : "Cancel Notification")
                      : (lang === "ar" ? "أشعرني عند التوفر" : "Notify When Available")}
                  </button>
                )}

                {/* Wishlist + Social share row */}
                <div className="flex items-center gap-3 flex-wrap">
                  {user && (
                    <button
                      onClick={toggleWishlist}
                      className="flex items-center gap-2 text-sm font-medium py-2.5 px-5 rounded-xl transition-all"
                      style={{
                        border: wishlisted ? "1.5px solid #ef4444" : "1.5px solid #f0ece4",
                        color: wishlisted ? "#ef4444" : "#aaa",
                        background: wishlisted ? "rgba(239,68,68,0.05)" : "transparent",
                      }}
                    >
                      <Heart size={16} fill={wishlisted ? "#ef4444" : "none"} />
                      {wishlisted
                        ? (lang === "ar" ? "في المفضلة" : "In Wishlist")
                        : (lang === "ar" ? "أضف للمفضلة" : "Add to Wishlist")}
                    </button>
                  )}
                </div>

                {/* Social sharing */}
                <SocialShare title={name} />

                <Link
                  href="/products"
                  className={`inline-flex items-center gap-2 text-sm transition-colors ${dir === "rtl" ? "flex-row-reverse" : ""}`}
                  style={{ color: "#aaa" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                  onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
                >
                  {dir === "rtl" ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                  {t("backToProducts")}
                </Link>
              </div>
            </div>

            {/* Reviews */}
            <ReviewSection productId={product.product_id} />

            {/* Related products */}
            {related.length > 0 && (
              <div className="mt-24">
                <h2 className="font-display text-2xl font-bold mb-8" style={{ color: "#1a1a1a" }}>
                  {lang === "ar" ? "منتجات مشابهة" : "Related Products"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {related.map(p => (
                    <Link key={p.product_id} href={`/product/${p.product_id}`}>
                      <div
                        className="rounded-2xl overflow-hidden transition-all duration-300"
                        style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(201,168,76,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
                      >
                        <div className="relative aspect-video" style={{ background: "#f9f7f2" }}>
                          <Image src={p.image_url} alt={lang === "ar" ? p.product_name_ar : p.product_name_en} fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            className="object-cover"
                            onError={e => e.currentTarget.style.display = "none"} />
                        </div>
                        <div className="p-4">
                          <p className="font-display font-semibold text-sm" style={{ color: "#1a1a1a" }}>
                            {lang === "ar" ? p.product_name_ar : p.product_name_en}
                          </p>
                          <p className="font-bold mt-1" style={{ color: "#C9A84C" }}>${p.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recently viewed */}
            <RecentlyViewed excludeId={product.product_id} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
