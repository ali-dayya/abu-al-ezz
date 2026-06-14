"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError(lang === "ar" ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError("");
    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) {
      setSubmitting(false);
      setError(signInError.message);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex" style={{ background:"#0d0d0d" }}>
      {/* Brand panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ background:"linear-gradient(145deg, #0d0d0d, #141414)" }}>
        <div className="absolute inset-0" style={{
          backgroundImage:"radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)"
        }}/>
        <div className="relative z-10 text-center px-12">
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden mx-auto mb-8 animate-float"
            style={{ border:"2px solid rgba(201,168,76,0.5)", boxShadow:"0 0 40px rgba(201,168,76,0.15)" }}
          >
            <Image src="/logo.png" alt="Logo" fill className="object-cover"
              onError={e=>e.currentTarget.style.display="none"} />
            <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-3xl"
              style={{ background:"#141414", color:"#C9A84C" }}>AE</div>
          </div>
          <h2 className="font-display text-4xl font-bold mb-2" style={{ color:"#fff" }}>
            {lang === "ar" ? "مؤسسة أبو العز" : "Abu Al-Ezz"}
          </h2>
          <p style={{ color:"#515151" }}>{lang === "ar" ? "و أولاده" : "Institution"}</p>
          <div style={{ width:"48px", height:"2px", background:"linear-gradient(90deg,#C9A84C,#E8C97A)", margin:"24px auto" }} />
          <p className="text-sm leading-relaxed max-w-xs" style={{ color:"#434343" }}>
            {lang === "ar"
              ? "سجل دخولك لتتمكن من تصفح المنتجات وإرسال طلبات الشراء"
              : "Sign in to browse products and submit order requests"}
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background:"#FFFDF5" }}>
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto"
              style={{ border:"2px solid rgba(201,168,76,0.4)" }}>
              <Image src="/logo.png" alt="Logo" fill className="object-cover"
                onError={e=>e.currentTarget.style.display="none"} />
              <div className="absolute inset-0 flex items-center justify-center font-display font-bold"
                style={{ background:"#141414", color:"#C9A84C" }}>AE</div>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold mb-2" style={{ color:"#1a1a1a" }}>{t("login")}</h1>
          <p className="text-sm mb-8" style={{ color:"#818181" }}>
            {lang === "ar" ? "أدخل بياناتك للدخول" : "Enter your details to sign in"}
          </p>

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
                value={form.email}
                onChange={e=>setForm({...form, email:e.target.value})}
                placeholder="you@example.com"
                className="luxury-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#C9A84C" }}>
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={e=>setForm({...form, password:e.target.value})}
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
              {submitting ? (lang === "ar" ? "جارٍ الدخول..." : "Signing in...") : t("login")}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color:"#818181" }}>
            {t("noAccount")}{" "}
            <Link href="/register" className="font-semibold transition-colors"
              style={{ color:"#C9A84C" }}>
              {t("register")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
