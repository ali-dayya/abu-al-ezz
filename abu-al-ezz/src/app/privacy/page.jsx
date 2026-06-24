"use client";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPage() {
  const { lang } = useLanguage();

  const isAr = lang === "ar";

  const sections = isAr ? [
    {
      title: "ما الذي نجمعه",
      body: "عند إنشاء حساب أو تقديم طلب، نجمع: الاسم الكامل وعنوان البريد الإلكتروني ورقم الهاتف والعنوان (اختياري). لا نجمع معلومات بطاقات الائتمان — جميع المدفوعات تتم نقداً عند الاستلام.",
    },
    {
      title: "كيف نستخدم بياناتك",
      body: "نستخدم بياناتك حصراً لمعالجة طلباتك والتواصل معك بشأن التسليم وتحسين خدماتنا. لن نرسل لك رسائل تسويقية دون إذنك.",
    },
    {
      title: "لا نبيع بياناتك",
      body: "لا نبيع معلوماتك الشخصية لأي طرف ثالث، ولا نشاركها إلا إذا اقتضى القانون اللبناني ذلك.",
    },
    {
      title: "تخزين البيانات",
      body: "تُخزَّن بياناتك بأمان من خلال Supabase (supabase.com)، وهي منصة قواعد بيانات تلتزم بأعلى معايير الأمان والتشفير. نحن لا نخزن أي بيانات على خوادمنا الخاصة.",
    },
    {
      title: "التحليلات",
      body: "نستخدم Vercel Analytics لقياس عدد الزوار وتحسين الأداء. هذه الخدمة لا تستخدم ملفات تعريف الارتباط (كوكيز) ولا تخزن معلومات شخصية.",
    },
    {
      title: "حقوقك",
      body: "يحق لك في أي وقت الاطلاع على بياناتك الشخصية، أو طلب تعديلها، أو حذفها نهائياً. للقيام بذلك، تواصل معنا عبر واتساب على الرقم +961 78 885 719.",
    },
    {
      title: "التعديلات على هذه السياسة",
      body: "قد نحدّث هذه السياسة من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تحديث تاريخ آخر مراجعة.",
    },
  ] : [
    {
      title: "What we collect",
      body: "When you create an account or place an order, we collect: your full name, email address, phone number, and address (optional). We do not collect credit card information — all payments are cash on delivery.",
    },
    {
      title: "How we use your data",
      body: "We use your data solely to process your orders, contact you about delivery, and improve our service. We will not send you marketing messages without your consent.",
    },
    {
      title: "We don't sell your data",
      body: "We do not sell your personal information to any third parties, and we do not share it except as required by Lebanese law.",
    },
    {
      title: "Data storage",
      body: "Your data is stored securely through Supabase (supabase.com), a database platform that meets the highest security and encryption standards. We do not store any data on our own servers.",
    },
    {
      title: "Analytics",
      body: "We use Vercel Analytics to measure site traffic and improve performance. This service does not use cookies and does not store personal information.",
    },
    {
      title: "Your rights",
      body: "You may at any time view, update, or request deletion of your personal data. To do so, contact us on WhatsApp at +961 78 885 719.",
    },
    {
      title: "Changes to this policy",
      body: "We may update this policy from time to time. Any changes will be posted on this page with an updated date.",
    },
  ];

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>

        {/* Hero */}
        <section style={{ background: "#0d0d0d", padding: "60px 0 56px" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="section-tag">{isAr ? "القانونية" : "Legal"}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold" style={{ color: "#fff" }}>
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </h1>
            <p className="mt-4 text-xs" style={{ color: "#515151" }}>
              {isAr ? "آخر تحديث: يونيو ٢٠٢٦" : "Last updated: June 2026"}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6" dir={isAr ? "rtl" : "ltr"}>

            {/* Intro */}
            <div
              className="flex items-start gap-4 rounded-2xl p-6 mb-10"
              style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <Shield size={24} className="flex-shrink-0 mt-0.5" style={{ color: "#C9A84C" }} />
              <p className="text-sm leading-relaxed" style={{ color: "#515151" }}>
                {isAr
                  ? "نحن في مؤسسة أبو العز و أولاده نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضّح هذه السياسة ما نجمعه وكيف نستخدمه."
                  : "At Abu Al-Ezz Institution, we respect your privacy and are committed to protecting your personal data. This policy explains what we collect and how we use it."}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6"
                  style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                >
                  <h2 className="font-display font-bold text-base mb-3" style={{ color: "#C9A84C" }}>
                    {s.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#515151" }}>{s.body}</p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div
              className="mt-10 rounded-2xl p-6 text-center"
              style={{ background: "#0d0d0d", border: "1px solid rgba(201,168,76,0.15)" }}
            >
              <p className="text-sm mb-4" style={{ color: "#888" }}>
                {isAr ? "للاستفسارات المتعلقة بالخصوصية:" : "For privacy-related inquiries:"}
              </p>
              <p className="font-display font-bold mb-1" style={{ color: "#C9A84C" }}>Abu Al-Ezz Institution</p>
              <p className="text-sm" style={{ color: "#666" }}>Borjein, Iqlim Al-Kharoub, Lebanon</p>
              <a
                href="https://wa.me/96178885719"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-sm font-bold px-5 py-2.5 rounded-full transition-all"
                style={{ background: "#25D366", color: "#fff" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1da851"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#25D366"; }}
              >
                WhatsApp: +961 78 885 719
              </a>
            </div>
          </div>
        </section>

        {/* Breadcrumb nav */}
        <div style={{ background: "#FFFDF5", padding: "24px 0", borderTop: "1px solid #f0ece4" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs" style={{ color: "#aaa" }}>
            <Link href="/" style={{ color: "#aaa" }}
              onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
              onMouseLeave={e => e.currentTarget.style.color = "#aaa"}>
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight size={11} />
            <span style={{ color: "#1a1a1a" }}>{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</span>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
