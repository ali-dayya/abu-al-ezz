"use client";
import { useEffect, useState } from "react";
import { Phone, MessageCircle, MapPin, Clock, Instagram } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export default function ContactPage() {
  const { t, lang } = useLanguage();
  const [storeInfo, setStoreInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/store-info").then(setStoreInfo).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const cards = [
    { icon: Phone, bg:"#EFF6FF", icon_color:"#2563eb", label: t("phone_label"), value: storeInfo.phone, href:`tel:${storeInfo.phone}` },
    { icon: MessageCircle, bg:"#ECFDF5", icon_color:"#059669", label: t("whatsapp"), value: storeInfo.whatsapp_num, href:`https://wa.me/${storeInfo.whatsapp_num}` },
    { icon: MapPin, bg:"#FFF1F2", icon_color:"#e11d48", label: t("visitUs"), value: lang==="ar"?storeInfo.address_ar:storeInfo.address_en },
    { icon: Clock, bg:"#FFFBEB", icon_color:"#d97706", label: t("openHours"), value: lang==="ar"?storeInfo.open_hours_ar:storeInfo.open_hours_en },
    { icon: Instagram, bg:"#F5F3FF", icon_color:"#7c3aed", label:"Instagram", value:"@abu-al-ezz", href:storeInfo.insta_link },
  ];

  return (
    <>
      <Navbar />
      <main style={{ minHeight:"100vh", background:"#FFFDF5" }}>
        <section style={{ background:"#0d0d0d", padding:"60px 0 52px" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="section-tag">{lang==="ar"?"تواصل معنا":"Get In Touch"}</p>
            <h1 className="font-display text-5xl font-bold" style={{ color:"#fff" }}>{t("contact")}</h1>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          {loading ? (
            <div className="text-center py-24">
              <p className="text-sm" style={{ color:"#aaa" }}>{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
            </div>
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : (
          <>
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold" style={{ color:"#1a1a1a" }}>
              {lang==="ar"?storeInfo.store_name_ar:storeInfo.store_name_en}
            </h2>
            <span className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {cards.map((card, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 rounded-2xl transition-all duration-200"
                style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 30px rgba(0,0,0,0.08)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.04)"}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background:card.bg }}>
                  <card.icon size={20} style={{ color:card.icon_color }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:"#C9A84C" }}>
                    {card.label}
                  </p>
                  {card.href ? (
                    <a href={card.href} target="_blank" rel="noreferrer"
                      className="text-sm font-medium transition-colors"
                      style={{ color:"#1a1a1a" }}
                      onMouseEnter={e=>e.currentTarget.style.color="#C9A84C"}
                      onMouseLeave={e=>e.currentTarget.style.color="#1a1a1a"}>
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium" style={{ color:"#1a1a1a" }}>{card.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div
            className="rounded-2xl h-60 flex items-center justify-center"
            style={{ background:"#f9f7f2", border:"1px solid #f0ece4" }}
          >
            <div className="text-center">
              <MapPin size={36} className="mx-auto mb-3" style={{ color:"#C9A84C" }} />
              <p className="font-medium text-sm mb-1" style={{ color:"#434343" }}>
                {lang==="ar"?"الموقع على الخريطة":"Location Map"}
              </p>
              <p className="text-xs" style={{ color:"#aaa" }}>
                {lang==="ar"?"اضغط على العنوان أعلاه للاتجاهات":"Tap the address above for directions"}
              </p>
            </div>
          </div>
          </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
