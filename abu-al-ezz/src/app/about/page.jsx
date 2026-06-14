"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t, lang, dir } = useLanguage();

  const features = [
    { icon:"🏠", title:lang==="ar"?"أدوات منزلية":"Household Items",
      desc:lang==="ar"?"مجموعة متنوعة من أدوات التخزين والمطبخ عالية الجودة":"A diverse range of high-quality kitchen storage and household tools" },
    { icon:"🔥", title:lang==="ar"?"دفايات":"Heaters",
      desc:lang==="ar"?"دفايات غاز وكهرباء وصوابين حطب ومازوت للتدفئة الشتوية":"Gas, electric, wood stoves and mazot heaters for winter warmth" },
    { icon:"💨", title:lang==="ar"?"منتجات الأرجيلة":"Hookah Products",
      desc:lang==="ar"?"أرجيلة زجاج وألمنيوم بتصاميم مميزة وجودة عالية":"Glass and aluminum hookah with distinctive designs and high quality" },
  ];

  const stats = [
    { n:"500+", label:lang==="ar"?"عميل راضٍ":"Happy Customers" },
    { n:"3",    label:lang==="ar"?"فئات منتجات":"Product Categories" },
    { n:"50+",  label:lang==="ar"?"منتج متاح":"Products Available" },
    { n:"∞",    label:lang==="ar"?"سنوات خبرة":"Years of Experience" },
  ];

  return (
    <>
      <Navbar />
      <main style={{ minHeight:"100vh", background:"#FFFDF5" }}>

        {/* Header */}
        <section style={{ background:"#0d0d0d", padding:"80px 0 70px" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="section-tag">{lang==="ar"?"من نحن":"About Us"}</p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold" style={{ color:"#fff" }}>
              {lang==="ar"?"مؤسسة أبو العز":"Abu Al-Ezz"}
            </h1>
            <p className="mt-3 text-lg" style={{ color:"#515151" }}>
              {lang==="ar"?"و أولاده":"Institution"}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="section-tag">{lang==="ar"?"رسالتنا":"Our Mission"}</p>
            <h2 className="font-display text-3xl font-bold mb-6" style={{ color:"#1a1a1a" }}>
              {lang==="ar"?"جودة في كل منتج، ثقة في كل تعامل":"Quality in Every Product, Trust in Every Deal"}
            </h2>
            <span className="gold-divider" />
            <p className="mt-8 text-base leading-relaxed max-w-2xl mx-auto" style={{ color:"#515151" }}>
              {lang==="ar"
                ? "نحن في مؤسسة أبو العز و أولاده نفتخر بخدمة عملائنا في لبنان بأفضل الأدوات المنزلية والدفايات ومنتجات الأرجيلة. نؤمن بأن الجودة والأمانة هما أساس أي علاقة تجارية ناجحة."
                : "At Abu Al-Ezz Institution, we are proud to serve our customers in Lebanon with the best household items, heaters, and hookah products. We believe that quality and honesty are the foundation of any successful business relationship."}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background:"#0d0d0d", padding:"64px 0" }}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s,i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-4xl font-bold mb-2 gold-text-gradient">{s.n}</p>
                  <p className="text-sm" style={{ color:"#515151" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we offer */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="section-tag">{lang==="ar"?"ما نقدمه":"What We Offer"}</p>
              <h2 className="section-title-dark">{lang==="ar"?"تخصصنا":"Our Specializations"}</h2>
              <span className="gold-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {features.map((f,i) => (
                <div key={i}
                  className="p-7 rounded-2xl transition-all duration-200"
                  style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}
                  onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 12px 40px rgba(201,168,76,0.12)"; e.currentTarget.style.borderColor="rgba(201,168,76,0.25)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor="#f0ece4"; }}
                >
                  <div className="text-3xl mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background:"rgba(201,168,76,0.08)" }}>{f.icon}</div>
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color:"#1a1a1a" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:"#818181" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16" style={{ background:"#0d0d0d" }}>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold mb-4" style={{ color:"#fff" }}>
              {lang==="ar"?"تسوق معنا الآن":"Start Shopping With Us"}
            </h2>
            <p className="mb-8 text-sm" style={{ color:"#515151" }}>
              {lang==="ar"?"اكتشف مجموعتنا الواسعة من المنتجات":"Explore our wide range of quality products"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-gold">
                {t("browseProducts")}
                <ArrowRight size={16} className={dir==="rtl"?"rotate-180":""} />
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
