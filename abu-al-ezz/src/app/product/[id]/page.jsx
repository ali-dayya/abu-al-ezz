"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Package, ShoppingCart, Minus, Plus, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/ui/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { apiRequest } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const { t, lang, dir } = useLanguage();
  const { addToCart } = useCart();
  const { getCategoryName, getSubcategoryName } = useCatalog();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const product = productList.find(p => p.product_id === parseInt(params.id));

  useEffect(() => {
    apiRequest("/api/products").then(setProductList).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center" style={{ background:"#FFFDF5" }}>
        <p className="text-sm" style={{ color:"#aaa" }}>{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
      </div>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center" style={{ background:"#FFFDF5" }}>
        <div className="text-center">
          <p className="text-6xl mb-4">😔</p>
          <h2 className="font-display text-2xl font-bold mb-4" style={{ color:"#434343" }}>Product not found</h2>
          <Link href="/products" className="btn-gold">Back to Products</Link>
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
  const related = productList.filter(p => p.category_id === product.category_id && p.product_id !== product.product_id).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight:"100vh", background:"#FFFDF5" }}>

        {/* Breadcrumb */}
        <div style={{ background:"#fff", borderBottom:"1px solid #f0ece4", padding:"12px 0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center gap-2 text-xs ${dir==="rtl"?"flex-row-reverse":""}`} style={{ color:"#aaa" }}>
              <Link href="/" style={{ color:"#aaa" }}
                onMouseEnter={e=>e.currentTarget.style.color="#C9A84C"}
                onMouseLeave={e=>e.currentTarget.style.color="#aaa"}>{t("home")}</Link>
              <ChevronRight size={11} className={dir==="rtl"?"rotate-180":""} />
              <Link href="/products" style={{ color:"#aaa" }}
                onMouseEnter={e=>e.currentTarget.style.color="#C9A84C"}
                onMouseLeave={e=>e.currentTarget.style.color="#aaa"}>{t("products")}</Link>
              <ChevronRight size={11} className={dir==="rtl"?"rotate-180":""} />
              <span style={{ color:"#1a1a1a" }} className="font-medium truncate max-w-xs">{name}</span>
            </div>
          </div>
        </div>

        {/* Main product section */}
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-start ${dir==="rtl"?"lg:grid-flow-dense":""}`}>

              {/* Image */}
              <div
                className="relative aspect-square rounded-3xl overflow-hidden"
                style={{ background:"#f9f7f2", border:"1px solid #f0ece4", boxShadow:"0 8px 40px rgba(0,0,0,0.06)" }}
              >
                <Image src={product.image_url} alt={name} fill className="object-cover"
                  onError={(e)=>{ e.currentTarget.style.display="none"; }} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Package size={80} style={{ color:"#e5dfc8", opacity:0.5 }} />
                </div>
              </div>

              {/* Info panel */}
              <div className="space-y-7">
                {/* Breadcrumb in panel */}
                <div className={`flex items-center gap-2 text-sm ${dir==="rtl"?"flex-row-reverse":""}`}>
                  <span className="font-semibold" style={{ color:"#C9A84C" }}>{catName}</span>
                  <ChevronRight size={13} className={dir==="rtl"?"rotate-180":""} style={{ color:"#ccc" }} />
                  <span style={{ color:"#aaa" }}>{subName}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-bold leading-snug" style={{ color:"#1a1a1a" }}>
                  {name}
                </h1>

                {/* Price + status */}
                <div className="flex items-center gap-5">
                  <span className="text-4xl font-bold" style={{ color:"#1a1a1a" }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <StatusBadge status={product.availability_status} />
                </div>

                {/* Divider */}
                <div style={{ height:"1px", background:"#f0ece4" }} />

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:"#C9A84C" }}>
                    {t("description")}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color:"#515151" }}>{desc}</p>
                </div>

                {/* Stock info */}
                <div
                  className="rounded-2xl px-5 py-4 flex items-center justify-between text-sm"
                  style={{ background:"#f9f7f2", border:"1px solid #f0ece4" }}
                >
                  <span style={{ color:"#818181" }}>{t("stock")}</span>
                  <span className="font-bold" style={{ color: product.stock_quantity > 0 ? "#065F46" : "#991B1B" }}>
                    {product.stock_quantity} {t("pieces")}
                  </span>
                </div>

                {/* Quantity + CTA */}
                {isAvailable && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color:"#C9A84C" }}>{t("quantity")}</p>
                    <div className="flex items-center gap-4">
                      {/* Qty selector */}
                      <div
                        className="flex items-center rounded-2xl overflow-hidden"
                        style={{ border:"1.5px solid #f0ece4" }}
                      >
                        <button
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="w-11 h-11 flex items-center justify-center transition-colors"
                          style={{ color:"#818181" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#f9f7f2"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-12 text-center font-bold text-lg" style={{ color:"#1a1a1a" }}>{qty}</span>
                        <button
                          onClick={() => setQty(Math.min(product.stock_quantity, qty + 1))}
                          className="w-11 h-11 flex items-center justify-center transition-colors"
                          style={{ color:"#818181" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#f9f7f2"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Add to cart */}
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300"
                        style={added
                          ? { background:"#10b981", color:"#fff" }
                          : { background:"linear-gradient(135deg, #C9A84C, #E8C97A)", color:"#0d0d0d" }
                        }
                        onMouseEnter={e=>{ if (!added) e.currentTarget.style.boxShadow="0 8px 24px rgba(201,168,76,0.4)"; }}
                        onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; }}
                      >
                        <ShoppingCart size={17} />
                        {added ? (lang === "ar" ? "تمت الإضافة ✓" : "Added ✓") : t("addToCart")}
                      </button>
                    </div>
                  </div>
                )}

                {/* Back link */}
                <Link
                  href="/products"
                  className={`inline-flex items-center gap-2 text-sm transition-colors ${dir==="rtl"?"flex-row-reverse":""}`}
                  style={{ color:"#aaa" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#C9A84C"}
                  onMouseLeave={e=>e.currentTarget.style.color="#aaa"}
                >
                  {dir === "rtl" ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                  {t("backToProducts")}
                </Link>
              </div>
            </div>

            {/* Related products */}
            {related.length > 0 && (
              <div className="mt-24">
                <h2 className="font-display text-2xl font-bold mb-8" style={{ color:"#1a1a1a" }}>
                  {lang === "ar" ? "منتجات مشابهة" : "Related Products"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {related.map(p => (
                    <Link key={p.product_id} href={`/product/${p.product_id}`}>
                      <div
                        className="rounded-2xl overflow-hidden transition-all duration-300"
                        style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}
                        onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(201,168,76,0.15)"; }}
                        onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.04)"; }}
                      >
                        <div className="relative aspect-video" style={{ background:"#f9f7f2" }}>
                          <Image src={p.image_url} alt={lang==="ar"?p.product_name_ar:p.product_name_en} fill className="object-cover"
                            onError={e=>e.currentTarget.style.display="none"} />
                        </div>
                        <div className="p-4">
                          <p className="font-display font-semibold text-sm" style={{ color:"#1a1a1a" }}>
                            {lang === "ar" ? p.product_name_ar : p.product_name_en}
                          </p>
                          <p className="font-bold mt-1" style={{ color:"#C9A84C" }}>${p.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
