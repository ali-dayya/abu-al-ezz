"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Save, Mail, AlertCircle, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export default function AdminStoreInfoPage() {
  const { t, lang } = useLanguage();
  const [info, setInfo] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [emailTest, setEmailTest] = useState(null); // null | "sending" | {success, sentTo?, error?}

  const loadData = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/store-info").then(setInfo).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleTestEmail = async () => {
    setEmailTest("sending");
    try {
      const result = await apiRequest("/api/admin/test-email", { method: "POST" });
      setEmailTest(result);
    } catch {
      setEmailTest({ success: false, error: "Request failed — check your server logs." });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await apiRequest("/api/store-info", {
      method: "PUT",
      body: JSON.stringify(info),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Field = ({ label, name, dir: fieldDir }) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "#C9A84C" }}>
        {label}
      </label>
      <input
        type="text"
        value={info[name] || ""}
        onChange={e => setInfo({ ...info, [name]: e.target.value })}
        dir={fieldDir}
        className="luxury-input"
      />
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#f8f7f4" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div
          className="px-6 py-4 sticky top-0 z-20"
          style={{ background: "#fff", borderBottom: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <h1 className="font-display text-xl font-bold" style={{ color: "#1a1a1a" }}>{t("storeSettings")}</h1>
        </div>

        <div className="p-6 max-w-3xl">
          {loading ? (
            <p className="text-sm" style={{ color: "#aaa" }}>{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : (
            <>
              {saved && (
                <div
                  className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium"
                  style={{ background: "#d1fae5", border: "1px solid #a7f3d0", color: "#065f46" }}
                >
                  <CheckCircle size={16} />
                  {lang === "ar" ? "تم حفظ الإعدادات بنجاح!" : "Settings saved successfully!"}
                </div>
              )}

              <form onSubmit={handleSave}>
                <div
                  className="rounded-2xl p-6"
                  style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  <h2
                    className="font-display font-bold mb-5 pb-4"
                    style={{ color: "#1a1a1a", borderBottom: "1px solid #f0ece4" }}
                  >
                    {lang === "ar" ? "معلومات المتجر" : "Store Information"}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Store Name (English)" name="store_name_en" />
                    <Field label="اسم المتجر (عربي)" name="store_name_ar" dir="rtl" />
                    <Field label="Phone Number" name="phone" />
                    <Field label="WhatsApp Number" name="whatsapp_num" />
                    <Field label="Address (English)" name="address_en" />
                    <Field label="العنوان (عربي)" name="address_ar" dir="rtl" />
                    <Field label="Opening Hours (English)" name="open_hours_en" />
                    <Field label="أوقات العمل (عربي)" name="open_hours_ar" dir="rtl" />
                    <Field label="Instagram Link" name="insta_link" />
                    <Field label="Facebook Link" name="facebook_link" />
                  </div>

                  <div className="mt-6 pt-5" style={{ borderTop: "1px solid #f0ece4" }}>
                    <button
                      type="submit"
                      className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-2xl transition-all"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d" }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,168,76,0.35)"}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                    >
                      <Save size={15} />
                      {t("save")}
                    </button>
                  </div>
                </div>
              </form>

              {/* Email Settings */}
              <div
                className="mt-6 rounded-2xl p-6"
                style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <h2
                  className="font-display font-bold mb-2 pb-4"
                  style={{ color: "#1a1a1a", borderBottom: "1px solid #f0ece4" }}
                >
                  {lang === "ar" ? "إعدادات البريد الإلكتروني (Resend)" : "Email Settings (Resend)"}
                </h2>
                <p className="text-sm mb-5" style={{ color: "#818181", lineHeight: 1.6 }}>
                  {lang === "ar"
                    ? "أضف متغيرات البيئة على استضافتك لتفعيل إشعارات البريد الإلكتروني. ثم انقر على «إرسال بريد تجريبي» للتأكد."
                    : "Set the environment variables on your host to enable email notifications, then click Send Test Email to verify."}
                </p>

                <div className="space-y-2 mb-5">
                  {[
                    { key: "RESEND_API_KEY", desc: lang === "ar" ? "مفتاح API من resend.com" : "API key from resend.com" },
                    { key: "ADMIN_EMAIL", desc: lang === "ar" ? "البريد الذي يستقبل إشعارات الطلبات" : "Email that receives order notifications" },
                    { key: "RESEND_FROM_EMAIL", desc: lang === "ar" ? "مثال: Abu Al-Ezz <no-reply@yourdomain.com>" : 'e.g. Abu Al-Ezz <no-reply@yourdomain.com>' },
                  ].map(({ key, desc }) => (
                    <div key={key} className="flex flex-wrap items-start gap-2 text-sm">
                      <code
                        className="px-2 py-0.5 rounded font-mono text-xs"
                        style={{ background: "#f5f0e8", color: "#C9A84C", flexShrink: 0 }}
                      >{key}</code>
                      <span style={{ color: "#818181" }}>{desc}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={handleTestEmail}
                    disabled={emailTest === "sending"}
                    className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all disabled:opacity-60"
                    style={{ background: "#0d0d0d", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
                    onMouseEnter={e => { if (emailTest !== "sending") e.currentTarget.style.background = "#1a1a1a"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#0d0d0d"; }}
                  >
                    {emailTest === "sending"
                      ? <><Loader2 size={14} className="animate-spin" /> {lang === "ar" ? "جارٍ الإرسال..." : "Sending..."}</>
                      : <><Mail size={14} /> {lang === "ar" ? "إرسال بريد تجريبي" : "Send Test Email"}</>
                    }
                  </button>

                  {emailTest && emailTest !== "sending" && (
                    <div
                      className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl"
                      style={emailTest.success
                        ? { background: "#d1fae5", color: "#065f46" }
                        : { background: "#fee2e2", color: "#991b1b" }
                      }
                    >
                      {emailTest.success
                        ? <><CheckCircle size={14} /> {lang === "ar" ? `تم الإرسال إلى ${emailTest.sentTo}` : `Sent to ${emailTest.sentTo}`}</>
                        : <><AlertCircle size={14} /> {emailTest.error}</>
                      }
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
