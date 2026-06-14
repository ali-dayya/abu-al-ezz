"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const { lang } = useLanguage();
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
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) {
      setSubmitting(false);
      setError(signInError.message);
      return;
    }

    const { data: admin } = await supabase.from("admins").select("id").eq("id", data.user.id).maybeSingle();
    if (!admin) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError(lang === "ar" ? "هذا الحساب غير مخوّل كمدير" : "This account is not an authorized admin");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{
      background:"linear-gradient(145deg, #0d0d0d, #111)",
      backgroundImage:"radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.06) 0%, transparent 60%)",
    }}>
      {/* Gold accent lines */}
      <div style={{ position:"fixed", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg, #C9A84C, #E8C97A, #C9A84C)" }} />

      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-5"
            style={{ border:"2px solid rgba(201,168,76,0.5)", boxShadow:"0 0 30px rgba(201,168,76,0.15)" }}
          >
            <Image src="/logo.png" alt="Logo" fill className="object-cover"
              onError={e=>e.currentTarget.style.display="none"} />
            <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl"
              style={{ background:"#141414", color:"#C9A84C" }}>AE</div>
          </div>
          <h1 className="font-display text-2xl font-bold" style={{ color:"#fff" }}>
            {lang === "ar" ? "لوحة التحكم" : "Admin Panel"}
          </h1>
          <p className="text-xs mt-1" style={{ color:"#515151" }}>Abu Al-Ezz Institution</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-7"
          style={{
            background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(201,168,76,0.15)",
            backdropFilter:"blur(10px)",
          }}
        >
          {/* Shield badge */}
          <div className="flex items-center gap-2 mb-6 px-3 py-2.5 rounded-xl"
            style={{ background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.15)" }}>
            <Shield size={14} style={{ color:"#C9A84C" }} />
            <span className="text-xs font-medium" style={{ color:"#C9A84C" }}>
              {lang === "ar" ? "دخول المديرين فقط" : "Administrators only"}
            </span>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-xs font-medium"
              style={{ background:"rgba(239,68,68,0.1)", color:"#fca5a5", border:"1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#C9A84C" }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e=>setForm({...form, email:e.target.value})}
                placeholder="admin@example.com"
                className="luxury-input-dark"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#C9A84C" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={e=>setForm({...form, password:e.target.value})}
                  placeholder="••••••••"
                  className="luxury-input-dark"
                  style={{ paddingRight:"44px" }}
                />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color:"#515151" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#C9A84C"}
                  onMouseLeave={e=>e.currentTarget.style.color="#515151"}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl font-bold text-sm mt-2 transition-all"
              style={{ background:"linear-gradient(135deg, #C9A84C, #E8C97A)", color:"#0d0d0d", opacity: submitting ? 0.7 : 1 }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 24px rgba(201,168,76,0.35)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
            >
              {submitting ? (lang === "ar" ? "جارٍ الدخول..." : "Signing in...") : (lang === "ar" ? "تسجيل الدخول" : "Sign In")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
