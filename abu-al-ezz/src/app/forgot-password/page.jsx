"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(lang === "ar" ? "يرجى إدخال البريد الإلكتروني" : "Please enter your email");
      return;
    }

    setSubmitting(true);
    setError("");
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    setSent(true);
  };

  if (sent) return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background:"#FFFDF5" }}>
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background:"#fef3c7", border:"2px solid #fde68a" }}>
          <Mail size={36} style={{ color:"#92400e" }} />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color:"#1a1a1a" }}>
          {lang === "ar" ? "تحقق من بريدك الإلكتروني" : "Check your email"}
        </h2>
        <p className="text-sm" style={{ color:"#818181" }}>{t("checkEmailReset")}</p>
        <Link href="/login" className="font-semibold inline-block mt-5" style={{ color:"#C9A84C" }}>
          {t("backToLogin")}
        </Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-14" style={{ background:"#FFFDF5" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2" style={{ color:"#1a1a1a" }}>{t("resetPasswordTitle")}</h1>
          <p className="text-sm" style={{ color:"#818181" }}>{t("resetPasswordDesc")}</p>
        </div>

        <div className="rounded-3xl p-7"
          style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 8px 40px rgba(0,0,0,0.06)" }}>
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{ background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#C9A84C" }}>
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com"
                className="luxury-input"
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-gold w-full mt-2 justify-center" style={{ opacity: submitting ? 0.7 : 1 }}>
              {submitting ? (lang === "ar" ? "جارٍ الإرسال..." : "Sending...") : t("sendResetLink")}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color:"#818181" }}>
          <Link href="/login" className="font-semibold" style={{ color:"#C9A84C" }}>{t("backToLogin")}</Link>
        </p>
      </div>
    </main>
  );
}
