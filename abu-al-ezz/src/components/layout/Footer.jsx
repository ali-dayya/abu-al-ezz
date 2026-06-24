"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  const { t, lang, dir } = useLanguage();
  const [storeInfo, setStoreInfo] = useState({});
  const [showWaLabel, setShowWaLabel] = useState(false);

  useEffect(() => {
    const load = () => apiRequest("/api/store-info").then(setStoreInfo);
    load().catch(() => { setTimeout(() => load().catch(() => {}), 3000); });
  }, []);

  const links = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/categories", label: t("categories") },
    { href: "/cart", label: t("cart") },
    { href: "/contact", label: t("contact") },
    { href: "/about", label: t("about") },
    { href: "/delivery", label: lang === "ar" ? "التوصيل والدفع" : "Delivery & Payment" },
  ];

  const waNumber = storeInfo.whatsapp_num || "";
  const waLink = waNumber ? `https://wa.me/${waNumber.replace(/\D/g, "")}` : null;
  const floatSide = dir === "rtl" ? { left: "24px" } : { right: "24px" };

  return (
    <>
      <footer style={{ background: "#0d0d0d", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        {/* Gold accent */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, #C9A84C, #E8C97A, #C9A84C)", opacity: 0.5 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Brand */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div
                  className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
                  style={{ border: "2px solid rgba(201,168,76,0.4)" }}
                >
                  <Image src="/logo.png" alt="Logo" fill sizes="56px" className="object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <div
                    className="absolute inset-0 flex items-center justify-center font-display font-bold text-base"
                    style={{ background: "#1a1a1a", color: "#C9A84C" }}
                  >AE</div>
                </div>
                <div>
                  <p className="font-display font-semibold" style={{ color: "#C9A84C" }}>
                    {lang === "ar" ? storeInfo.store_name_ar : storeInfo.store_name_en}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#515151" }}>
                    {lang === "ar" ? storeInfo.tagline_ar : storeInfo.tagline_en}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#515151" }}>
                {lang === "ar"
                  ? "مؤسسة عائلية من برجعين — موثوقة في إقليم الخروب وعبر لبنان لأدوات منزلية ودفايات وأرجيلة، مع طلبات خارج لبنان."
                  : "A family institution from Borjein — trusted across Iqlim Al-Kharoub and all of Lebanon for household essentials, heaters & hookah products. Bulk orders ship outside Lebanon."}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display font-semibold text-xs uppercase tracking-[0.15em] mb-5"
                style={{ color: "#C9A84C" }}>
                {t("quickLinks")}
              </h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "#515151" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#C9A84C"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "#515151"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display font-semibold text-xs uppercase tracking-[0.15em] mb-5"
                style={{ color: "#C9A84C" }}>
                {t("contactInfo")}
              </h3>
              <ul className="space-y-3">
                {[
                  { icon: Phone, value: storeInfo.phone },
                  { icon: MapPin, value: lang === "ar" ? storeInfo.address_ar : storeInfo.address_en },
                  { icon: Clock, value: lang === "ar" ? storeInfo.open_hours_ar : storeInfo.open_hours_en },
                ].map(({ icon: Icon, value }, i) => value ? (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#515151" }}>
                    <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
                    <span>{value}</span>
                  </li>
                ) : null)}

                {/* Social links */}
                <li className="flex items-center gap-3 pt-1">
                  {storeInfo.insta_link && (
                    <a
                      href={storeInfo.insta_link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="flex items-center justify-center w-9 h-9 rounded-full transition-all"
                      style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.18)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                  {storeInfo.facebook_link && (
                    <a
                      href={storeInfo.facebook_link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="flex items-center justify-center w-9 h-9 rounded-full transition-all"
                      style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.18)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
                    >
                      <Facebook size={16} />
                    </a>
                  )}
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                      className="flex items-center justify-center w-9 h-9 rounded-full transition-all"
                      style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", color: "#25D366" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,211,102,0.22)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(37,211,102,0.1)"; }}
                    >
                      <WhatsAppIcon />
                    </a>
                  )}
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div
            className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs" style={{ color: "#434343" }}>
              © {new Date().getFullYear()} {lang === "ar" ? storeInfo.store_name_ar : storeInfo.store_name_en} — {t("allRights")}
            </p>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/terms"
                style={{ color: "#434343" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#C9A84C"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#434343"; }}>
                {lang === "ar" ? "الشروط والأحكام" : "Terms"}
              </Link>
              <Link href="/privacy"
                style={{ color: "#434343" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#C9A84C"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#434343"; }}>
                {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              </Link>
              <Link href="/delivery"
                style={{ color: "#434343" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#C9A84C"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#434343"; }}>
                {lang === "ar" ? "التوصيل والدفع" : "Delivery & Payment"}
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          aria-label={lang === "ar" ? "تواصل معنا عبر واتساب" : "Chat with us on WhatsApp"}
          onMouseEnter={() => setShowWaLabel(true)}
          onMouseLeave={() => setShowWaLabel(false)}
          style={{
            position: "fixed",
            bottom: "24px",
            zIndex: 9000,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#25D366",
            color: "#fff",
            borderRadius: "50px",
            padding: showWaLabel ? "14px 20px" : "14px",
            boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
            textDecoration: "none",
            transition: "all 0.25s ease",
            ...floatSide,
          }}
        >
          <WhatsAppIcon />
          {showWaLabel && (
            <span style={{ fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>
              {lang === "ar" ? "تواصل معنا" : "Chat with us"}
            </span>
          )}
        </a>
      )}
    </>
  );
}
