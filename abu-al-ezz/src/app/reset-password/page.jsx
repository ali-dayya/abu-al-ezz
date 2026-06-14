"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [status, setStatus] = useState("checking"); // checking | ready | invalid
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setStatus("ready");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus("ready");
    });

    const timeout = setTimeout(() => {
      setStatus((s) => (s === "checking" ? "invalid" : s));
    }, 3000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError(lang === "ar" ? "كلمة مرور قصيرة (6 أحرف على الأقل)" : "Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    setError("");
    const supabase = getSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/"), 1800);
  };

  if (success) return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background:"#FFFDF5" }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background:"#d1fae5", border:"2px solid #a7f3d0" }}>
          <CheckCircle size={40} style={{ color:"#065f46" }} />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color:"#1a1a1a" }}>{t("passwordUpdated")}</h2>
        <p className="text-sm" style={{ color:"#aaa" }}>
          {lang === "ar" ? "جاري تحويلك..." : "Redirecting you..."}
        </p>
      </div>
    </main>
  );

  if (status === "invalid") return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background:"#FFFDF5" }}>
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background:"#fef2f2", border:"2px solid #fecaca" }}>
          <AlertTriangle size={36} style={{ color:"#991b1b" }} />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color:"#1a1a1a" }}>
          {lang === "ar" ? "رابط غير صالح أو منتهي الصلاحية" : "Invalid or expired link"}
        </h2>
        <p className="text-sm mb-5" style={{ color:"#818181" }}>
          {lang === "ar"
            ? "يرجى طلب رابط جديد لإعادة تعيين كلمة المرور."
            : "Please request a new password reset link."}
        </p>
        <Link href="/forgot-password" className="font-semibold inline-block" style={{ color:"#C9A84C" }}>
          {t("resetPasswordTitle")}
        </Link>
      </div>
    </main>
  );

  if (status === "checking") return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background:"#FFFDF5" }}>
      <p className="text-sm" style={{ color:"#aaa" }}>{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
    </main>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-14" style={{ background:"#FFFDF5" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2" style={{ color:"#1a1a1a" }}>{t("resetPasswordTitle")}</h1>
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
                {t("newPassword")}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="luxury-input"
                  style={{ paddingRight:"44px" }}
                />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color:"#aaa" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#C9A84C"}
                  onMouseLeave={e=>e.currentTarget.style.color="#aaa"}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-gold w-full mt-2 justify-center" style={{ opacity: submitting ? 0.7 : 1 }}>
              {submitting ? (lang === "ar" ? "جارٍ التحديث..." : "Updating...") : t("updatePassword")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
