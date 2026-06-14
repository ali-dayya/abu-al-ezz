"use client";
import { AlertTriangle, RotateCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ErrorState({ onRetry }) {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background:"#fef2f2" }}>
        <AlertTriangle size={24} style={{ color:"#ef4444" }} />
      </div>
      <p className="text-sm font-semibold mb-1" style={{ color:"#1a1a1a" }}>
        {lang === "ar" ? "تعذّر تحميل البيانات" : "Couldn't load data"}
      </p>
      <p className="text-xs mb-5" style={{ color:"#aaa" }}>
        {lang === "ar" ? "تحقق من اتصالك بالإنترنت وحاول مرة أخرى" : "Check your connection and try again"}
      </p>
      <button onClick={onRetry} className="btn-gold">
        <RotateCw size={14} />
        {lang === "ar" ? "إعادة المحاولة" : "Retry"}
      </button>
    </div>
  );
}
