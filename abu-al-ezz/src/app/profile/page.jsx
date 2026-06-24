"use client";
import { useEffect, useState } from "react";
import { User, Save, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export default function ProfilePage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "" });

  const loadProfile = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/profile")
      .then((data) => {
        setProfile(data);
        setForm({ full_name: data.full_name || "", phone: data.phone || "", address: data.address || "" });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadProfile(); else setLoading(false); }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const data = await apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (!user && !loading) {
    return (
      <>
        <Navbar />
        <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <User size={56} className="mx-auto mb-4" style={{ color: "#e5dfc8" }} />
              <p className="text-sm" style={{ color: "#aaa" }}>
                {lang === "ar" ? "يرجى تسجيل الدخول" : "Please log in to view your profile"}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>
        <section style={{ background: "#0d0d0d", padding: "60px 0 52px" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-display text-5xl font-bold" style={{ color: "#fff" }}>
              {lang === "ar" ? "الملف الشخصي" : "My Profile"}
            </h1>
          </div>
        </section>

        <div className="max-w-xl mx-auto px-4 sm:px-6 py-14">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
            </div>
          ) : error ? (
            <ErrorState onRetry={loadProfile} />
          ) : (
            <form
              onSubmit={handleSave}
              className="rounded-2xl p-6 space-y-5"
              style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(201,168,76,0.1)", border: "2px solid rgba(201,168,76,0.3)" }}
                >
                  <User size={28} style={{ color: "#C9A84C" }} />
                </div>
                <div>
                  <p className="font-display font-bold text-lg" style={{ color: "#1a1a1a" }}>
                    {profile?.full_name || ""}
                  </p>
                  <p className="text-sm" style={{ color: "#aaa" }}>{profile?.email}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#C9A84C" }}>
                  {t("fullName")}
                </label>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="luxury-input w-full"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#C9A84C" }}>
                  {t("phone")}
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="luxury-input w-full"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#C9A84C" }}>
                  {t("address")}
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="luxury-input w-full"
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={
                  saved
                    ? { background: "#10b981", color: "#fff" }
                    : { background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d", opacity: saving ? 0.6 : 1 }
                }
              >
                {saved ? <><CheckCircle size={16} /> {lang === "ar" ? "تم الحفظ" : "Saved!"}</> :
                  saving ? (lang === "ar" ? "جارٍ الحفظ..." : "Saving...") :
                    <><Save size={16} /> {t("save")}</>}
              </button>

              <p className="text-xs text-center" style={{ color: "#aaa" }}>
                {lang === "ar" ? `عضو منذ ${new Date(profile?.created_at).toLocaleDateString("ar")}` :
                  `Member since ${new Date(profile?.created_at).toLocaleDateString("en-US")}`}
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
