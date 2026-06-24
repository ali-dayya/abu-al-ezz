"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Tag, X, Check } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

const empty = { code: "", discount_type: "percentage", discount_value: "", min_order_amount: "", max_uses: "", expires_at: "", is_active: true };

export default function CouponsPage() {
  const { lang } = useLanguage();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/coupons").then(setCoupons).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (form.coupon_id) {
        await apiRequest(`/api/coupons/${form.coupon_id}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await apiRequest("/api/coupons", { method: "POST", body: JSON.stringify(form) });
      }
      setForm(null);
      loadData();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm(lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?")) return;
    await apiRequest(`/api/coupons/${id}`, { method: "DELETE" }).catch(() => {});
    loadData();
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#f8f7f4" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-20"
          style={{ background: "#fff", borderBottom: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: "#1a1a1a" }}>
              {lang === "ar" ? "أكواد الخصم" : "Coupons"}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>
              {lang === "ar" ? "إدارة أكواد الخصم والعروض" : "Manage discount codes and promotions"}
            </p>
          </div>
          <button
            onClick={() => setForm({ ...empty })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d" }}
          >
            <Plus size={16} /> {lang === "ar" ? "إضافة كود" : "Add Coupon"}
          </button>
        </div>

        <div className="p-6">
          {/* Form modal */}
          {form && (
            <div className="rounded-2xl p-5 mb-6 space-y-4" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold" style={{ color: "#1a1a1a" }}>
                  {form.coupon_id ? (lang === "ar" ? "تعديل الكود" : "Edit Coupon") : (lang === "ar" ? "كود جديد" : "New Coupon")}
                </h3>
                <button onClick={() => setForm(null)} style={{ color: "#aaa" }}><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#C9A84C" }}>
                    {lang === "ar" ? "الكود" : "Code"}
                  </label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="luxury-input w-full" placeholder="SUMMER20" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#C9A84C" }}>
                    {lang === "ar" ? "نوع الخصم" : "Type"}
                  </label>
                  <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="luxury-input w-full">
                    <option value="percentage">{lang === "ar" ? "نسبة مئوية (%)" : "Percentage (%)"}</option>
                    <option value="fixed">{lang === "ar" ? "مبلغ ثابت ($)" : "Fixed Amount ($)"}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#C9A84C" }}>
                    {lang === "ar" ? "قيمة الخصم" : "Discount Value"}
                  </label>
                  <input type="number" min="0" step="0.01" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    className="luxury-input w-full" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#C9A84C" }}>
                    {lang === "ar" ? "الحد الأدنى للطلب" : "Min Order Amount"}
                  </label>
                  <input type="number" min="0" step="0.01" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                    className="luxury-input w-full" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#C9A84C" }}>
                    {lang === "ar" ? "الحد الأقصى للاستخدام" : "Max Uses"}
                  </label>
                  <input type="number" min="1" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                    className="luxury-input w-full" placeholder={lang === "ar" ? "غير محدود" : "Unlimited"} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: "#C9A84C" }}>
                    {lang === "ar" ? "ينتهي في" : "Expires At"}
                  </label>
                  <input type="datetime-local" value={form.expires_at?.slice(0, 16) || ""} onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                    className="luxury-input w-full" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                <span style={{ color: "#434343" }}>{lang === "ar" ? "مفعّل" : "Active"}</span>
              </label>
              <button onClick={handleSave} disabled={saving || !form.code || !form.discount_value}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d", opacity: saving ? 0.6 : 1 }}>
                {saving ? "..." : (lang === "ar" ? "حفظ" : "Save")}
              </button>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : coupons.length === 0 ? (
            <div className="text-center py-20">
              <Tag size={48} className="mx-auto mb-4" style={{ color: "#e5dfc8" }} />
              <p className="text-sm" style={{ color: "#aaa" }}>{lang === "ar" ? "لا توجد أكواد خصم" : "No coupons yet"}</p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
              {coupons.map((c, i) => (
                <div key={c.coupon_id} className="px-5 py-4 flex items-center justify-between flex-wrap gap-3"
                  style={{ borderBottom: i < coupons.length - 1 ? "1px solid #f9f7f2" : "none" }}>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-sm px-3 py-1.5 rounded-lg"
                      style={{ background: c.is_active ? "rgba(201,168,76,0.1)" : "#f3f4f6", color: c.is_active ? "#C9A84C" : "#aaa" }}>
                      {c.code}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                        {c.discount_type === "percentage" ? `${c.discount_value}%` : `$${c.discount_value.toFixed(2)}`} off
                      </p>
                      <p className="text-xs" style={{ color: "#aaa" }}>
                        {c.used_count}{c.max_uses ? `/${c.max_uses}` : ""} used
                        {c.min_order_amount > 0 && ` · Min $${c.min_order_amount.toFixed(2)}`}
                        {c.expires_at && ` · Exp ${new Date(c.expires_at).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!c.is_active && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f3f4f6", color: "#aaa" }}>Inactive</span>}
                    <button onClick={() => setForm({ ...c })} className="p-2 rounded-lg" style={{ color: "#818181" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#C9A84C"} onMouseLeave={(e) => e.currentTarget.style.color = "#818181"}>
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(c.coupon_id)} className="p-2 rounded-lg" style={{ color: "#818181" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#818181"}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
