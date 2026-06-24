"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Truck, Users, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
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

function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl p-6" style={{ background:"linear-gradient(145deg,#141414,#1c1c1c)", border:"1px solid rgba(201,168,76,0.15)" }}>
      <div className="skeleton-dark w-14 h-14 rounded-2xl mb-4" />
      <div className="skeleton-dark h-5 w-36 mb-2" />
      <div className="space-y-1.5 mb-5">
        <div className="skeleton-dark h-3 w-full" />
        <div className="skeleton-dark h-3 w-4/5" />
      </div>
      <div className="flex gap-2 mb-5">
        <div className="skeleton-dark h-6 w-16 rounded-full" />
        <div className="skeleton-dark h-6 w-20 rounded-full" />
      </div>
      <div className="skeleton-dark h-4 w-20" />
    </div>
  );
}

export default function HomePage() {
  const { t, lang, dir } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      apiRequest("/api/products").then(setProducts),
      apiRequest("/api/categories").then((data) => setCategories(data.categories)),
    ]).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const featured = products.slice(0, 4);

  return (
    <>
      <Navbar />
      <main id="main-content">

        {/* ═══ HERO ════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{ background: "#0d0d0d" }}
        >
          {/* Layered radial glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{
              position:"absolute", top:"10%", left:"5%",
              width:"500px", height:"500px", borderRadius:"50%",
              background:"radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)",
            }}/>
            <div style={{
              position:"absolute", bottom:"10%", right:"5%",
              width:"400px", height:"400px", borderRadius:"50%",
              background:"radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)",
            }}/>
          </div>

          {/* Decorative grid lines */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }}>
            <div style={{ position:"absolute", top:0, left:"33%", width:"1px", height:"100%", background:"#C9A84C" }} />
            <div style={{ position:"absolute", top:0, left:"66%", width:"1px", height:"100%", background:"#C9A84C" }} />
            <div style={{ position:"absolute", top:"33%", left:0, width:"100%", height:"1px", background:"#C9A84C" }} />
            <div style={{ position:"absolute", top:"66%", left:0, width:"100%", height:"1px", background:"#C9A84C" }} />
          </div>

          {/* Top gold line */}
          <div className="absolute top-0 left-0 right-0" style={{ height:"1px", background:"linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-24">

            {/* Logo */}
            <div className="flex justify-center mb-10">
              <div
                className="animate-float"
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid rgba(201,168,76,0.5)",
                  boxShadow: "0 0 40px rgba(201,168,76,0.2), 0 0 80px rgba(201,168,76,0.08)",
                  background: "#141414",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Abu Al-Ezz Institution Logo"
                  width={140}
                  height={140}
                  className="object-contain"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>

            {/* Status pill */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
              style={{
                background:"rgba(201,168,76,0.08)",
                border:"1px solid rgba(201,168,76,0.25)",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background:"#C9A84C" }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color:"#C9A84C" }}>
                {lang === "ar" ? "برجعين · إقليم الخروب · لبنان" : "Borjein · Iqlim Al-Kharoub · Lebanon"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold leading-tight mb-6">
              {lang === "ar" ? (
                <>
                  <span className="block text-5xl sm:text-6xl md:text-7xl" style={{ color:"#fff" }}>مؤسسة</span>
                  <span className="block text-5xl sm:text-7xl md:text-8xl gold-text-gradient">أبو العز</span>
                  <span className="block text-3xl sm:text-4xl font-light mt-2" style={{ color:"#515151" }}>و أولاده</span>
                </>
              ) : (
                <>
                  <span className="block text-6xl sm:text-7xl md:text-8xl" style={{ color:"#fff" }}>Abu Al-Ezz</span>
                  <span className="block text-4xl sm:text-5xl md:text-6xl gold-text-gradient">Institution</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color:"#666" }}>
              {lang === "ar"
                ? "مؤسسة عائلية من برجعين — تثق بها البيوت في إقليم الخروب وعبر لبنان — أدوات منزلية ودفايات وأرجيلة، مع طلبات كبيرة تصل خارج لبنان."
                : "A family institution from Borjein — trusted by homes across Iqlim Al-Kharoub and all of Lebanon for household essentials, heaters & hookah products. We also handle bulk orders outside Lebanon."}
            </p>

            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}>
              <Link href="/products" className="btn-gold group">
                {t("browseProducts")}
                <ArrowRight size={16} className={`transition-transform duration-200 group-hover:translate-x-1 ${dir==="rtl"?"rotate-180":""}`} />
              </Link>
              <Link href="/contact" className="btn-outline-gold">
                {t("contactUs")}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
              {[
                { icon: MapPin, label: lang === "ar" ? "برجعين، إقليم الخروب" : "Borjein, Iqlim Al-Kharoub" },
                { icon: Truck,  label: lang === "ar" ? "شحن داخل وخارج لبنان" : "Ships Inside & Outside Lebanon" },
                { icon: Users,  label: lang === "ar" ? "مؤسسة عائلية"          : "Family Business" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2" style={{ color:"#434343" }}>
                  <Icon size={15} style={{ color:"#C9A84C" }} />
                  <span className="text-xs font-medium tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div style={{ width:"1px", height:"40px", background:"linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))" }} />
            <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#C9A84C" }} />
          </div>
        </section>

        {/* ═══ ANNOUNCEMENT BANNER ════════════════════════════════════ */}
        <section style={{ background:"linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C)" }}>
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="font-display font-bold text-base" style={{ color:"#0d0d0d" }}>{t("orderOnline")}</p>
              <p className="text-sm" style={{ color:"rgba(13,13,13,0.65)" }}>{t("orderOnlineDesc")}</p>
            </div>
            <Link
              href="/products"
              className="flex-shrink-0 text-sm font-bold px-6 py-2.5 rounded-full transition-all"
              style={{ background:"#0d0d0d", color:"#C9A84C" }}
              onMouseEnter={e => { e.currentTarget.style.background="#1a1a1a"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#0d0d0d"; }}
            >
              {t("browseProducts")}
            </Link>
          </div>
        </section>

        {/* ═══ CATEGORIES ═════════════════════════════════════════════ */}
        <section className="py-24" style={{ background:"#0d0d0d" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="section-tag">{lang === "ar" ? "ما نقدمه" : "What We Offer"}</p>
              <h2 className="section-title-light">{t("shopByCategory")}</h2>
              <span className="gold-divider" />
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <CategoryCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <ErrorState onRetry={loadData} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, i) => (
                  <div key={cat.category_id} className="fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <CategoryCard category={cat} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══ FEATURED PRODUCTS ══════════════════════════════════════ */}
        <section className="py-24" style={{ background:"#FFFDF5" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14 gap-4">
              <div>
                <p className="section-tag">{lang === "ar" ? "منتجات مختارة" : "Handpicked For You"}</p>
                <h2 className="section-title-dark">{t("featuredProducts")}</h2>
              </div>
              <Link
                href="/products"
                className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all flex-shrink-0"
                style={{ border:"1.5px solid rgba(201,168,76,0.4)", color:"#C9A84C" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(201,168,76,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}
              >
                {t("viewAll")}
                <ArrowRight size={14} className={dir === "rtl" ? "rotate-180" : ""} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((product, i) => (
                  <div key={product.product_id} className="fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══ OUR STORY ══════════════════════════════════════════════ */}
        <section className="py-24" style={{ background:"#111" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <p className="section-tag">{lang === "ar" ? "قصتنا" : "Our Story"}</p>
            <h2 className="section-title-light mb-4">
              {lang === "ar" ? "اسم بُني على الثقة" : "A Name Built on Trust"}
            </h2>
            <span className="gold-divider" />
            <p className="mt-6 mb-14 text-sm" style={{ color:"#515151" }}>
              {lang === "ar"
                ? "أجيال من العائلات في إقليم الخروب تعرف أين تجد ما تحتاج."
                : "Generations of families across Iqlim Al-Kharoub know exactly where to come."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  Icon: MapPin,
                  title: lang === "ar" ? "من برجعين، إقليم الخروب" : "From Borjein, Iqlim Al-Kharoub",
                  desc: lang === "ar"
                    ? "لسنا مجرد متجر. نحن مؤسسة عائلية لها جذور في برجعين، يعرفها كل بيت في إقليم الخروب وعبر لبنان."
                    : "We're not just a store. We're a family institution rooted in Borjein — known to every household across Iqlim Al-Kharoub and all of Lebanon.",
                },
                {
                  Icon: Globe,
                  title: lang === "ar" ? "نشحن خارج لبنان" : "We Ship Outside Lebanon",
                  desc: lang === "ar"
                    ? "الطلبات الكبيرة هي تخصصنا. سواء كنت في لبنان أو خارجه، نرتّب الشحن لجميع منتجاتنا."
                    : "Bulk orders are our specialty. Whether you're in Lebanon or abroad, we arrange large shipments of our full product range.",
                },
                {
                  Icon: Users,
                  title: lang === "ar" ? "عائلة، لا مجرد علامة" : "A Family, Not a Brand",
                  desc: lang === "ar"
                    ? "مؤسسة أبو العز و أولاده عائلية منذ سنوات. حين تتعامل معنا، تتعامل مع أناس تعرفهم — لا مع شركة مجهولة."
                    : "Abu Al-Ezz has been family-run for years. When you deal with us, you're dealing with people — not a faceless company.",
                },
              ].map(({ Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-7 text-left fade-up"
                  style={{
                    background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(201,168,76,0.12)",
                    animationDelay:`${i*0.12}s`,
                  }}
                >
                  <div
                    className="mb-5 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background:"rgba(201,168,76,0.1)" }}
                  >
                    <Icon size={24} style={{ color:"#C9A84C" }} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color:"#E8C97A" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color:"#515151" }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA STRIP ════════════════════════════════════════ */}
        <section className="py-20" style={{ background:"#FFFDF5" }}>
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="section-tag">{lang === "ar" ? "تسوق الآن" : "Ready to Shop?"}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6" style={{ color:"#1a1a1a" }}>
              {lang === "ar" ? "اكتشف كل منتجاتنا" : "Explore Our Full Collection"}
            </h2>
            <Link href="/products" className="btn-gold inline-flex">
              {t("browseProducts")}
              <ArrowRight size={16} className={dir === "rtl" ? "rotate-180" : ""} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
