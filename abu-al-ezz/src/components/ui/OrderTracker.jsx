"use client";
import { Check, Clock, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const STEPS = [
  { key: "pending", icon: Clock, en: "Order Placed", ar: "تم تقديم الطلب" },
  { key: "confirmed", icon: Check, en: "Confirmed", ar: "تم التأكيد" },
  { key: "completed", icon: CheckCircle, en: "Completed", ar: "مكتمل" },
];

export default function OrderTracker({ status }) {
  const { lang } = useLanguage();

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <XCircle size={20} style={{ color: "#ef4444" }} />
        <span className="text-sm font-semibold" style={{ color: "#ef4444" }}>
          {lang === "ar" ? "تم إلغاء الطلب" : "Order Cancelled"}
        </span>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isCompleted ? "linear-gradient(135deg, #C9A84C, #E8C97A)" : "#f3f4f6",
                  color: isCompleted ? "#0d0d0d" : "#aaa",
                  boxShadow: isCurrent ? "0 0 0 4px rgba(201,168,76,0.2)" : "none",
                }}
              >
                <Icon size={18} />
              </div>
              <span
                className="text-[11px] font-medium text-center"
                style={{ color: isCompleted ? "#1a1a1a" : "#aaa" }}
              >
                {lang === "ar" ? step.ar : step.en}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className="h-0.5 rounded-full transition-all"
                  style={{ background: i < currentIndex ? "#C9A84C" : "#e5e7eb" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
