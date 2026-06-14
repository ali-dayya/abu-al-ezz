"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCatalog } from "@/context/CatalogContext";

export default function CategoryCard({ category }) {
  const { t, lang, dir } = useLanguage();
  const { getSubcategoriesForCategory } = useCatalog();
  const subs = getSubcategoriesForCategory(category.category_id);
  const name = lang === "ar" ? category.category_name_ar : category.category_name_en;
  const desc = lang === "ar" ? category.description_ar : category.description_en;

  return (
    <Link href={`/categories#cat-${category.category_id}`}>
      <div
        className="group relative rounded-2xl p-6 overflow-hidden cursor-pointer h-full"
        style={{
          background: "linear-gradient(145deg, #141414 0%, #1c1c1c 100%)",
          border: "1px solid rgba(201,168,76,0.15)",
          transition: "all 0.35s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 24px 60px rgba(201,168,76,0.18)";
          e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
        }}
      >
        {/* Glow orb */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none transition-all duration-500"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)" }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(201,168,76,0.04), transparent)" }}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div
            className="text-4xl mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(201,168,76,0.1)" }}
          >
            {category.icon}
          </div>

          {/* Name */}
          <h3
            className="font-display font-bold text-xl mb-2 transition-colors duration-200"
            style={{ color: "#E8C97A" }}
          >
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-5" style={{ color: "#818181" }}>
            {desc}
          </p>

          {/* Subcategory pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {subs.slice(0, 3).map(sub => (
              <span
                key={sub.subcategory_id}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#818181",
                }}
              >
                {lang === "ar" ? sub.subcategory_name_ar : sub.subcategory_name_en}
              </span>
            ))}
          </div>

          {/* Arrow CTA */}
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#C9A84C" }}>
            <span>{t("viewAll")}</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
              style={dir === "rtl" ? { transform: "scaleX(-1)" } : {}}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
