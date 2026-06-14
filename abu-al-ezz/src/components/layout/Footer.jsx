"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Clock, Instagram, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export default function Footer() {
  const { t, lang } = useLanguage();
  const [storeInfo, setStoreInfo] = useState({});

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
  ];

  return (
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
                <Image src="/logo.png" alt="Logo" fill className="object-cover"
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
                ? "وجهتك الموثوقة للأدوات المنزلية والدفايات ومنتجات الأرجيلة في لبنان."
                : "Your trusted destination for quality household items, heaters & hookah products in Lebanon."}
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
                { icon: MessageCircle, value: storeInfo.whatsapp_num },
                { icon: MapPin, value: lang === "ar" ? storeInfo.address_ar : storeInfo.address_en },
                { icon: Clock, value: lang === "ar" ? storeInfo.open_hours_ar : storeInfo.open_hours_en },
              ].map(({ icon: Icon, value }, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#515151" }}>
                  <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
                  <span>{value}</span>
                </li>
              ))}
              <li>
                <a
                  href={storeInfo.insta_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors"
                  style={{ color: "#515151" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#C9A84C"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#515151"; }}
                >
                  <Instagram size={14} style={{ color: "#C9A84C" }} />
                  Instagram
                </a>
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
          <Link
            href="/admin-login"
            className="text-xs transition-colors"
            style={{ color: "#383838" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#515151"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#383838"; }}
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
