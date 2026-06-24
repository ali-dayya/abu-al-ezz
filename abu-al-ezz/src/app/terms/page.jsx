"use client";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsPage() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const sections = isAr ? [
    {
      title: "القبول بالشروط",
      body: "باستخدامك موقع مؤسسة أبو العز و أولاده أو تقديمك لأي طلب، فإنك توافق على هذه الشروط والأحكام. إذا لم توافق عليها، يُرجى عدم استخدام الموقع.",
    },
    {
      title: "طريقة الطلب والتأكيد",
      body: "تُعدّ الطلبات المُقدَّمة عبر الموقع طلبات مبدئية فقط. لا يُعتبر الطلب مؤكداً حتى يتواصل معك فريقنا ويُؤكد توفر المنتجات والسعر النهائي. نحتفظ بالحق في رفض أي طلب لأي سبب.",
    },
    {
      title: "الأسعار والدفع",
      body: "الأسعار المعروضة بالدولار الأمريكي وقابلة للتغيير دون إشعار مسبق. جميع المدفوعات تتم نقداً عند الاستلام (COD). لا نقبل الدفع الإلكتروني أو البطاقات الائتمانية في الوقت الحالي.",
    },
    {
      title: "التوصيل",
      body: "نوصّل إلى جميع مناطق لبنان. الطلبات الخارجية تُرتّب بشكل منفصل. لسنا مسؤولين عن أي تأخير ناتج عن ظروف خارجة عن إرادتنا (حركة المرور، الطقس، الأوضاع الأمنية).",
    },
    {
      title: "الإرجاع والاستبدال",
      body: "يُقبل إرجاع المنتجات التالفة أو غير المطابقة للوصف خلال 48 ساعة من الاستلام مع الإبلاغ فوراً. لا يُقبل الإرجاع بعد استخدام المنتج. تواصل معنا عبر واتساب لأي شكوى.",
    },
    {
      title: "توفر المنتجات",
      body: "نبذل قصارى جهدنا للحفاظ على دقة معلومات المخزون. في حال نفاد المنتج بعد تقديم الطلب، سنتواصل معك لإيجاد بديل أو استرداد أي دفعة مسبقة.",
    },
    {
      title: "تحديد المسؤولية",
      body: "تُقدّم مؤسسة أبو العز منتجاتها 'كما هي'. لا نتحمل المسؤولية عن أي أضرار غير مباشرة تنشأ عن استخدام منتجاتنا.",
    },
    {
      title: "تعديل الشروط",
      body: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. أي تغييرات ستُنشر على هذه الصفحة مع تاريخ السريان.",
    },
  ] : [
    {
      title: "Acceptance of Terms",
      body: "By using the Abu Al-Ezz Institution website or placing any order, you agree to these terms and conditions. If you do not agree, please do not use the site.",
    },
    {
      title: "Orders and Confirmation",
      body: "Orders placed through the website are preliminary requests only. An order is not confirmed until our team contacts you and confirms product availability and final pricing. We reserve the right to decline any order for any reason.",
    },
    {
      title: "Pricing and Payment",
      body: "Prices are listed in US Dollars and are subject to change without prior notice. All payments are cash on delivery (COD). We do not currently accept electronic payments or credit cards.",
    },
    {
      title: "Delivery",
      body: "We deliver to all regions of Lebanon. International orders are arranged separately. We are not responsible for delays caused by circumstances beyond our control (traffic, weather, security conditions).",
    },
    {
      title: "Returns and Exchanges",
      body: "Damaged or incorrectly described products may be returned within 48 hours of receipt, with immediate notification. Returns are not accepted after the product has been used. Contact us via WhatsApp for any complaint.",
    },
    {
      title: "Product Availability",
      body: "We make every effort to keep stock information accurate. If a product runs out after an order is placed, we will contact you to find an alternative or refund any advance payment.",
    },
    {
      title: "Limitation of Liability",
      body: "Abu Al-Ezz Institution provides its products 'as is'. We are not liable for any indirect damages arising from the use of our products.",
    },
    {
      title: "Changes to Terms",
      body: "We reserve the right to modify these terms at any time. Any changes will be posted on this page with an effective date.",
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
              {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
            </h1>
            <p className="mt-4 text-xs" style={{ color: "#515151" }}>
              {isAr ? "آخر تحديث: يونيو ٢٠٢٦" : "Last updated: June 2026"}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6" dir={isAr ? "rtl" : "ltr"}>
            <div
              className="flex items-start gap-4 rounded-2xl p-6 mb-10"
              style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <FileText size={24} className="flex-shrink-0 mt-0.5" style={{ color: "#C9A84C" }} />
              <p className="text-sm leading-relaxed" style={{ color: "#515151" }}>
                {isAr
                  ? "تحكم هذه الشروط العلاقة بينك وبين مؤسسة أبو العز و أولاده. يُرجى قراءتها بعناية قبل تقديم أي طلب."
                  : "These terms govern your relationship with Abu Al-Ezz Institution. Please read them carefully before placing any order."}
              </p>
            </div>

            <div className="space-y-5">
              {sections.map((s, i) => (
                <div key={i} className="rounded-2xl p-6"
                  style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <h2 className="font-display font-bold text-base mb-3" style={{ color: "#C9A84C" }}>{s.title}</h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#515151" }}>{s.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl p-6 text-center" style={{ background: "#0d0d0d" }}>
              <p className="text-sm mb-3" style={{ color: "#888" }}>
                {isAr ? "للاستفسارات:" : "Questions?"}
              </p>
              <a href="https://wa.me/96178885719" target="_blank" rel="noreferrer"
                className="inline-block text-sm font-bold px-5 py-2.5 rounded-full"
                style={{ background: "#25D366", color: "#fff" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1da851"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#25D366"; }}>
                WhatsApp: +961 78 885 719
              </a>
            </div>
          </div>
        </section>

        <div style={{ background: "#FFFDF5", padding: "24px 0", borderTop: "1px solid #f0ece4" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs" style={{ color: "#aaa" }}>
            <Link href="/" style={{ color: "#aaa" }}
              onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
              onMouseLeave={e => e.currentTarget.style.color = "#aaa"}>
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight size={11} />
            <span style={{ color: "#1a1a1a" }}>{isAr ? "الشروط والأحكام" : "Terms & Conditions"}</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
