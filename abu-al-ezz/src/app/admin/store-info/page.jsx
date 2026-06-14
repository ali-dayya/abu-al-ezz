"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Save } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export default function AdminStoreInfoPage() {
  const { t, lang } = useLanguage();
  const [info, setInfo] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/api/store-info").then(setInfo).catch(() => {}).finally(() => setLoading(false));
  }, []);

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
                    <div className="sm:col-span-2">
                      <Field label="Instagram Link" name="insta_link" />
                    </div>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
