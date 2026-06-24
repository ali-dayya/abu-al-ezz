"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, MapPin, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

const emptyZone = { zone_name_en: "", zone_name_ar: "", estimated_days: 1, delivery_fee: 0, is_active: true, display_order: 0 };

export default function DeliveryZonesPage() {
  const { lang } = useLanguage();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/delivery-zones?all=true").then(setZones).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest("/api/delivery-zones", { method: "POST", body: JSON.stringify(form) });
      setForm(null);
      loadData();
    } catch {} finally { setSaving(false); }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#f8f7f4" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-20"
          style={{ background: "#fff", borderBottom: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: "#1a1a1a" }}>
              {lang === "ar" ? "مناطق التوصيل" : "Delivery Zones"}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>
              {lang === "ar" ? "إدارة مناطق ورسوم التوصيل" : "Manage delivery areas and fees"}
            </p>
          </div>
          <button onClick={() => setForm({ ...emptyZone })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d" }}>
            <Plus size={16} /> {lang === "ar" ? "إضافة منطقة" : "Add Zone"}
          </button>
        </div>

        <div className="p-6">
          {form && (
            <div className="rounded-2xl p-5 mb-6 space-y-4" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold" style={{ color: "#1a1a1a" }}>
                  {form.zone_id ? (lang === "ar" ? "تعديل المنطقة" : "Edit Zone") : (lang === "ar" ? "منطقة جديدة" : "New Zone")}
                </h3>
                <button onClick={() => setForm(null)} style={{ color: "#aaa" }}><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#C9A84C" }}>Name (EN)</label>
                  <input value={form.zone_name_en} onChange={(e) => setForm({ ...form, zone_name_en: e.target.value })} className="luxury-input w-full" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#C9A84C" }}>Name (AR)</label>
                  <input value={form.zone_name_ar} onChange={(e) => setForm({ ...form, zone_name_ar: e.target.value })} className="luxury-input w-full" dir="rtl" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#C9A84C" }}>
                    {lang === "ar" ? "رسوم التوصيل ($)" : "Delivery Fee ($)"}
                  </label>
                  <input type="number" min="0" step="0.5" value={form.delivery_fee} onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })} className="luxury-input w-full" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#C9A84C" }}>
                    {lang === "ar" ? "أيام التوصيل المقدرة" : "Estimated Days"}
                  </label>
                  <input type="number" min="0" value={form.estimated_days} onChange={(e) => setForm({ ...form, estimated_days: e.target.value })} className="luxury-input w-full" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                <span style={{ color: "#434343" }}>{lang === "ar" ? "مفعّل" : "Active"}</span>
              </label>
              <button onClick={handleSave} disabled={saving || !form.zone_name_en}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d", opacity: saving ? 0.6 : 1 }}>
                {saving ? "..." : (lang === "ar" ? "حفظ" : "Save")}
              </button>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
              {zones.map((z, i) => (
                <div key={z.zone_id} className="px-5 py-4 flex items-center justify-between"
                  style={{ borderBottom: i < zones.length - 1 ? "1px solid #f9f7f2" : "none" }}>
                  <div className="flex items-center gap-4">
                    <MapPin size={16} style={{ color: z.is_active ? "#C9A84C" : "#ccc" }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: z.is_active ? "#1a1a1a" : "#aaa" }}>
                        {lang === "ar" ? z.zone_name_ar : z.zone_name_en}
                      </p>
                      <p className="text-xs" style={{ color: "#aaa" }}>
                        {z.delivery_fee > 0 ? `$${z.delivery_fee.toFixed(2)}` : "Free"} · {z.estimated_days} {lang === "ar" ? "يوم" : "days"}
                        {!z.is_active && " · Inactive"}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setForm({ ...z })} className="p-2 rounded-lg" style={{ color: "#818181" }}>
                    <Edit3 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
