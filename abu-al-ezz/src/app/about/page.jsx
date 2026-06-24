"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Home, Flame, Wind, MapPin, Globe, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export default function AboutPage() {
  const { t, lang, dir } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      apiRequest("/api/products"),
      apiRequest("/api/categories"),
    ]).then(([products, catData]) => {
      setStats([
        { n: catData.categories?.length ?? "—", label: lang === "ar" ? "فئات منتجات" : "Product Categories" },
        { n: products.length, label: lang === "ar" ? "منتج متاح" : "Products Available" },
        { n: lang === "ar" ? "برجعين" : "Borjein", label: lang === "ar" ? "مقرنا في إقليم الخروب" : "Home in Iqlim Al-Kharoub" },
      ]);
    }).catch(() => {
      setStats([
        { n: "3+", label: lang === "ar" ? "فئات منتجات" : "Product Categories" },
        { n: lang === "ar" ? "متنوعة" : "Many", label: lang === "ar" ? "منتج متاح" : "Products Available" },
        { n: lang === "ar" ? "برجعين" : "Borjein", label: lang === "ar" ? "مقرنا في إقليم الخروب" : "Home in Iqlim Al-Kharoub" },
      ]);
    });
  }, [lang]);

  const features = [
    {
      Icon: Home,
      title: lang === "ar" ? "أدوات منزلية" : "Household Items",
      desc: lang === "ar"
        ? "مجموعة متنوعة من أدوات التخزين والمطبخ عالية الجودة"
        : "A diverse range of high-quality kitchen, storage, and household tools",
    },
    {
      Icon: Flame,
      title: lang === "ar" ? "دفايات" : "Heaters",
      desc: lang === "ar"
        ? "دفايات غاز وكهرباء وصوابين حطب ومازوت للتدفئة الشتوية"
        : "Gas, electric, wood stoves and mazot heaters to keep you warm through Lebanese winters",
    },
    {
      Icon: Wind,
      title: lang === "ar" ? "منتجات الأرجيلة" : "Hookah Products",
      desc: lang === "ar"
        ? "أرجيلة زجاج وألمنيوم بتصاميم مميزة وجودة عالية"
        : "Glass and aluminum hookahs with distinctive designs and high quality craftsmanship",
    },
  ];

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>

        {/* Header */}
        <section style={{ background: "#0d0d0d", padding: "80px 0 70px" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="section-tag">{lang === "ar" ? "من نحن" : "About Us"}</p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold" style={{ color: "#fff" }}>
              {lang === "ar" ? "مؤسسة أبو العز" : "Abu Al-Ezz"}
            </h1>
            <p className="mt-3 text-lg" style={{ color: "#515151" }}>
              {lang === "ar" ? "و أولاده" : "Institution"}
            </p>
          </div>
        </section>

        {/* Story section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="section-tag">{lang === "ar" ? "قصتنا" : "Our Story"}</p>
            <h2 className="font-display text-3xl font-bold mb-6" style={{ color: "#1a1a1a" }}>
              {lang === "ar" ? "اسم بُني على الثقة" : "A Name Built on Trust"}
            </h2>
            <span className="gold-divider" />
            <p className="mt-8 text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#515151" }}>
              {lang === "ar"
                ? "منذ سنوات ونحن في مؤسسة أبو العز و أولاده نخدم أهالي برجعين وإقليم الخروب ولبنان الكبير بأفضل الأدوات المنزلية والدفايات ومنتجات الأرجيلة. مؤسسة عائلية قامت على الأمانة، وتواصل خدمتها لكل ربوع لبنان وما خارجه."
                : "For years, Abu Al-Ezz Institution has been a trusted name in Borjein, serving the families of Iqlim Al-Kharoub and all of Lebanon with quality household items, heaters, and hookah products. A family business built on honesty — and we ship large orders outside Lebanon too."}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: "#0d0d0d", padding: "64px 0" }}>
          <div className="max-w-3xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats
                ? stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="font-display text-4xl font-bold mb-2 gold-text-gradient">{s.n}</p>
                    <p className="text-sm" style={{ color: "#515151" }}>{s.label}</p>
                  </div>
                ))
                : [...Array(3)].map((_, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="skeleton h-10 w-20 mx-auto" style={{ background: "rgba(255,255,255,0.08)" }} />
                    <div className="skeleton h-3 w-28 mx-auto" style={{ background: "rgba(255,255,255,0.05)" }} />
                  </div>
                ))
              }
            </div>
          </div>
        </section>

        {/* What we offer */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="section-tag">{lang === "ar" ? "ما نقدمه" : "What We Offer"}</p>
              <h2 className="section-title-dark">{lang === "ar" ? "تخصصنا" : "Our Specializations"}</h2>
              <span className="gold-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {features.map(({ Icon, title, desc }, i) => (
                <div key={i}
                  className="p-7 rounded-2xl transition-all duration-200"
                  style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(201,168,76,0.12)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#f0ece4"; }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(201,168,76,0.08)" }}>
                    <Icon size={26} style={{ color: "#C9A84C" }} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color: "#1a1a1a" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#818181" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="py-20" style={{ background: "#f9f7f2" }}>
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="section-tag">{lang === "ar" ? "لماذا نحن" : "Why Us"}</p>
              <h2 className="section-title-dark">{lang === "ar" ? "ما يميزنا" : "What Sets Us Apart"}</h2>
              <span className="gold-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  Icon: MapPin,
                  title: lang === "ar" ? "برجعين، إقليم الخروب" : "Borjein, Iqlim Al-Kharoub",
                  desc: lang === "ar"
                    ? "متجرنا في قلب برجعين — يعرفنا أهل المنطقة ويثقون بنا منذ سنوات"
                    : "Our store is in the heart of Borjein. The people of this region have known and trusted us for years.",
                },
                {
                  Icon: Globe,
                  title: lang === "ar" ? "نشحن خارج لبنان" : "Shipping Outside Lebanon",
                  desc: lang === "ar"
                    ? "نستقبل طلبات الجملة ونوصلها خارج لبنان — تواصل معنا لمزيد من التفاصيل"
                    : "We accept bulk orders and ship outside Lebanon. Contact us to arrange delivery.",
                },
                {
                  Icon: Users,
                  title: lang === "ar" ? "مؤسسة عائلية" : "Family Business",
                  desc: lang === "ar"
                    ? "نتعامل معكم كما يتعامل أهل البيت مع بعض — بصدق وأمانة واحترام"
                    : "We treat every customer the way family treats family — with honesty, fairness, and care.",
                },
              ].map(({ Icon, title, desc }, i) => (
                <div key={i}
                  className="p-7 rounded-2xl transition-all duration-200"
                  style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(201,168,76,0.12)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#f0ece4"; }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(201,168,76,0.08)" }}>
                    <Icon size={26} style={{ color: "#C9A84C" }} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color: "#1a1a1a" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#818181" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16" style={{ background: "#0d0d0d" }}>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold mb-4" style={{ color: "#fff" }}>
              {lang === "ar" ? "تسوق معنا الآن" : "Start Shopping With Us"}
            </h2>
            <p className="mb-8 text-sm" style={{ color: "#515151" }}>
              {lang === "ar" ? "اكتشف مجموعتنا الواسعة من المنتجات" : "Explore our full range of quality products"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-gold">
                {t("browseProducts")}
                <ArrowRight size={16} className={dir === "rtl" ? "rotate-180" : ""} />
              </Link>
              <Link href="/contact" className="btn-outline-gold">
                {t("contactUs")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
