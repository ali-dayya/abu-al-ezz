"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({ fullName:"", email:"", password:"", phone:"", address:"" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName) e.fullName = lang==="ar"?"الاسم مطلوب":"Name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = lang==="ar"?"بريد إلكتروني غير صالح":"Invalid email";
    if (!form.password || form.password.length < 6) e.password = lang==="ar"?"كلمة مرور قصيرة (6 أحرف على الأقل)":"Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          phone: form.phone,
          address: form.address,
        },
      },
    });
    setSubmitting(false);

    if (error) {
      setErrors({ email: error.message });
      return;
    }

    if (data.session) {
      setSuccess(true);
      setTimeout(() => router.push("/"), 1800);
    } else {
      setNeedsConfirmation(true);
    }
  };

  if (needsConfirmation) return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background:"#FFFDF5" }}>
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background:"#fef3c7", border:"2px solid #fde68a" }}>
          <Mail size={36} style={{ color:"#92400e" }} />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color:"#1a1a1a" }}>
          {lang==="ar"?"تحقق من بريدك الإلكتروني":"Check your email"}
        </h2>
        <p className="text-sm" style={{ color:"#818181" }}>
          {lang==="ar"
            ? "أرسلنا رابط تأكيد إلى بريدك الإلكتروني. يرجى تأكيد حسابك ثم تسجيل الدخول."
            : "We sent a confirmation link to your email. Please confirm your account, then log in."}
        </p>
        <Link href="/login" className="font-semibold inline-block mt-5" style={{ color:"#C9A84C" }}>
          {t("login")}
        </Link>
      </div>
    </main>
  );

  if (success) return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background:"#FFFDF5" }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background:"#d1fae5", border:"2px solid #a7f3d0" }}>
          <CheckCircle size={40} style={{ color:"#065f46" }} />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color:"#1a1a1a" }}>
          {lang==="ar"?"تم إنشاء الحساب!":"Account Created!"}
        </h2>
        <p className="text-sm" style={{ color:"#aaa" }}>
          {lang==="ar"?"جاري تحويلك...":"Redirecting you..."}
        </p>
      </div>
    </main>
  );

  const fieldErr = (k) => errors[k] && (
    <p className="text-xs mt-1.5" style={{ color:"#ef4444" }}>{errors[k]}</p>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-14" style={{ background:"#FFFDF5" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-1" style={{ color:"#1a1a1a" }}>{t("register")}</h1>
          <p className="text-sm" style={{ color:"#818181" }}>
            {lang==="ar"?"أنشئ حسابك للبدء":"Create your account to get started"}
          </p>
        </div>

        <div className="rounded-3xl p-7"
          style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 8px 40px rgba(0,0,0,0.06)" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { k:"fullName", label:lang==="ar"?"الاسم الكامل":"Full Name", type:"text", placeholder:lang==="ar"?"اسمك الكامل":"Your full name" },
              { k:"email",    label:t("email"),   type:"email",  placeholder:"you@example.com" },
              { k:"phone",    label:lang==="ar"?"رقم الهاتف":"Phone Number", type:"tel", placeholder:"+961 xx xxx xxx" },
              { k:"address",  label:lang==="ar"?"العنوان":"Address", type:"text", placeholder:lang==="ar"?"بيروت، لبنان":"Beirut, Lebanon" },
            ].map(({ k, label, type, placeholder }) => (
              <div key={k}>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:"#C9A84C" }}>
                  {label}
                </label>
                <input type={type} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                  placeholder={placeholder} className="luxury-input" />
                {fieldErr(k)}
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:"#C9A84C" }}>
                {t("password")}
              </label>
              <div className="relative">
                <input type={showPass?"text":"password"} value={form.password}
                  onChange={e=>setForm({...form,password:e.target.value})}
                  placeholder="••••••••" className="luxury-input" style={{ paddingRight:"44px" }} />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:"#aaa" }}>
                  {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              </div>
              {fieldErr("password")}
            </div>

            <button type="submit" disabled={submitting} className="btn-gold w-full justify-center mt-2" style={{ opacity: submitting ? 0.7 : 1 }}>
              {submitting ? (lang === "ar" ? "جارٍ الإنشاء..." : "Creating account...") : t("register")}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color:"#818181" }}>
          {t("haveAccount")}{" "}
          <Link href="/login" className="font-semibold" style={{ color:"#C9A84C" }}>{t("login")}</Link>
        </p>
      </div>
    </main>
  );
}
