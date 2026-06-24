"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CookieConsent() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in"
      style={{ background: "rgba(13,13,13,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(201,168,76,0.2)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm flex-1" style={{ color: "#c8c8c8" }}>
          {lang === "ar"
            ? "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. باستمرارك في التصفح، فإنك توافق على استخدامنا لملفات تعريف الارتباط."
            : "We use cookies to improve your experience. By continuing to browse, you agree to our use of cookies."}
          {" "}
          <a href="/privacy" className="underline" style={{ color: "#C9A84C" }}>
            {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
          </a>
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d" }}
          >
            {lang === "ar" ? "قبول" : "Accept"}
          </button>
          <button
            onClick={decline}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ color: "#aaa", border: "1px solid #333" }}
          >
            {lang === "ar" ? "رفض" : "Decline"}
          </button>
        </div>
      </div>
    </div>
  );
}
