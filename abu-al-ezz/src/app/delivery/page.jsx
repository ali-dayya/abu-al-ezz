"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck, CreditCard, Clock, MapPin, Package, MessageCircle, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export default function DeliveryPage() {
  const { lang, dir } = useLanguage();
  const [whatsapp, setWhatsapp] = useState("+961 78 885 719");

  useEffect(() => {
    apiRequest("/api/store-info")
      .then((info) => { if (info?.whatsapp_num) setWhatsapp(info.whatsapp_num); })
      .catch(() => {});
  }, []);

  const waLink = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  const steps = lang === "ar"
    ? [
        { n: "١", title: "تصفح وأضف للسلة", desc: "اختر منتجاتك وأضفها إلى السلة بالكمية التي تريدها." },
        { n: "٢", title: "أرسل طلبك", desc: "سجّل الدخول أو أنشئ حساباً، ثم أرسل طلبك مع أي ملاحظات." },
        { n: "٣", title: "نؤكد ونتواصل معك", desc: "يتواصل فريقنا معك خلال 24 ساعة لتأكيد الطلب وتحديد موعد التسليم." },
        { n: "٤", title: "التسليم إلى بابك", desc: "نرتب التوصيل إلى موقعك، وتدفع عند الاستلام." },
      ]
    : [
        { n: "1", title: "Browse & add to cart", desc: "Choose your products and add them to your cart in the quantities you need." },
        { n: "2", title: "Submit your order", desc: "Log in or create an account, then submit your order with any special notes." },
        { n: "3", title: "We confirm & call you", desc: "Our team contacts you within 24 hours to confirm the order and arrange a delivery time." },
        { n: "4", title: "Delivered to your door", desc: "We deliver to your location and you pay cash on delivery." },
      ];

  const areas = lang === "ar"
    ? [
        { icon: MapPin, title: "إقليم الخروب", desc: "التسليم في نفس اليوم أو اليوم التالي لمعظم مناطق إقليم الخروب." },
        { icon: Truck, title: "باقي لبنان", desc: "التسليم خلال 1–3 أيام عمل إلى جميع المحافظات اللبنانية." },
        { icon: Package, title: "خارج لبنان", desc: "نتخصص في الطلبات الكبيرة للخارج. تواصل معنا لترتيب الشحن." },
      ]
    : [
        { icon: MapPin, title: "Iqlim Al-Kharoub", desc: "Same day or next business day delivery for most areas in Iqlim Al-Kharoub." },
        { icon: Truck, title: "Rest of Lebanon", desc: "1–3 business days delivery to all Lebanese regions." },
        { icon: Package, title: "Outside Lebanon", desc: "We specialize in bulk export orders. Contact us to arrange international shipping." },
      ];

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>

        {/* Hero */}
        <section style={{ background: "#0d0d0d", padding: "60px 0 56px" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="section-tag">{lang === "ar" ? "الشحن والدفع" : "Delivery & Payment"}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold" style={{ color: "#fff" }}>
              {lang === "ar" ? "كيف نوصّل وكيف ندفع" : "How It Works"}
            </h1>
            <p className="mt-4 text-sm max-w-xl mx-auto" style={{ color: "#666" }}>
              {lang === "ar"
                ? "عملية بسيطة — اطلب عبر الموقع، نؤكد، ونوصل إلى بابك."
                : "Simple process — order online, we confirm, and deliver to your door."}
            </p>
          </div>
        </section>

        {/* How to order */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="section-tag">{lang === "ar" ? "الخطوات" : "The Steps"}</p>
              <h2 className="section-title-dark">{lang === "ar" ? "طريقة الطلب" : "How to Order"}</h2>
              <span className="gold-divider" />
            </div>
            <div className="space-y-4" dir={dir}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-5 rounded-2xl p-6 fade-up"
                  style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-lg"
                    style={{ background: "linear-gradient(135deg,#C9A84C,#E8C97A)", color: "#0d0d0d" }}
                  >
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base mb-1" style={{ color: "#1a1a1a" }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#515151" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="py-20" style={{ background: "#0d0d0d" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="section-tag">{lang === "ar" ? "الدفع" : "Payment"}</p>
            <h2 className="section-title-light">{lang === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}</h2>
            <span className="gold-divider" />
            <div
              className="mt-10 rounded-2xl p-8 max-w-lg mx-auto"
              style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <CreditCard size={36} style={{ color: "#C9A84C", margin: "0 auto 16px" }} />
              <p className="text-lg font-bold mb-3" style={{ color: "#E8C97A" }}>
                {lang === "ar" ? "لا حاجة لبطاقة بنكية" : "No card required"}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
                {lang === "ar"
                  ? "جميع طلباتنا تُدفع نقداً عند الاستلام. لا حاجة لبطاقات ائتمان أو دفع إلكتروني. ادفع فقط عندما تستلم طلبك."
                  : "All orders are cash on delivery. No credit cards, no online payment. You pay only when your order arrives at your door."}
              </p>
            </div>
          </div>
        </section>

        {/* Delivery areas */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="section-tag">{lang === "ar" ? "مناطق التوصيل" : "Where We Deliver"}</p>
              <h2 className="section-title-dark">{lang === "ar" ? "نوصّل إلى" : "Delivery Areas"}</h2>
              <span className="gold-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" dir={dir}>
              {areas.map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-7 text-center fade-up"
                  style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(201,168,76,0.1)" }}
                  >
                    <Icon size={26} style={{ color: "#C9A84C" }} />
                  </div>
                  <h3 className="font-display font-bold text-base mb-2" style={{ color: "#1a1a1a" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#515151" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bulk orders CTA */}
        <section className="py-16" style={{ background: "#111" }}>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-2xl font-bold mb-3" style={{ color: "#E8C97A" }}>
              {lang === "ar" ? "طلبات بالجملة؟" : "Bulk orders?"}
            </h2>
            <p className="text-sm mb-8" style={{ color: "#666" }}>
              {lang === "ar"
                ? "نتخصص في تجهيز الطلبات الكبيرة للتجار والموزعين داخل لبنان وخارجه. تواصل معنا مباشرة عبر واتساب."
                : "We specialize in large orders for retailers and distributors inside Lebanon and abroad. Contact us directly on WhatsApp."}
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-sm transition-all"
              style={{ background: "#25D366", color: "#fff" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1da851"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#25D366"; }}
            >
              <MessageCircle size={17} />
              {lang === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
            </a>
          </div>
        </section>

        {/* Breadcrumb-style footer nav */}
        <div style={{ background: "#FFFDF5", padding: "24px 0", borderTop: "1px solid #f0ece4" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs" style={{ color: "#aaa" }}>
            <Link href="/" style={{ color: "#aaa" }}
              onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
              onMouseLeave={e => e.currentTarget.style.color = "#aaa"}>
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight size={11} />
            <span style={{ color: "#1a1a1a" }}>{lang === "ar" ? "التوصيل والدفع" : "Delivery & Payment"}</span>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
