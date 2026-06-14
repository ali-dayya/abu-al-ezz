"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export default function AdminCategoriesPage() {
  const { t, lang } = useLanguage();
  const [cats, setCats] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  // Category modal state
  const [catModal, setCatModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [catForm, setCatForm] = useState({ category_name_en: "", category_name_ar: "", icon: "" });

  // Subcategory modal state
  const [subModal, setSubModal] = useState(false);
  const [editSub, setEditSub] = useState(null);
  const [subForm, setSubForm] = useState({ subcategory_name_en: "", subcategory_name_ar: "", category_id: 1 });

  useEffect(() => {
    apiRequest("/api/categories")
      .then((data) => {
        setCats(data.categories);
        setSubs(data.subcategories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Category CRUD
  const openAddCat = () => {
    setEditCat(null);
    setCatForm({ category_name_en: "", category_name_ar: "", icon: "" });
    setCatModal(true);
  };
  const openEditCat = (c) => {
    setEditCat(c);
    setCatForm({ category_name_en: c.category_name_en, category_name_ar: c.category_name_ar, icon: c.icon });
    setCatModal(true);
  };
  const saveCat = async () => {
    if (!catForm.category_name_en) return;
    if (editCat) {
      const saved = await apiRequest(`/api/categories/${editCat.category_id}`, {
        method: "PUT",
        body: JSON.stringify(catForm),
      });
      setCats(cats.map(c => c.category_id === editCat.category_id ? saved : c));
    } else {
      const saved = await apiRequest("/api/categories", {
        method: "POST",
        body: JSON.stringify(catForm),
      });
      setCats([...cats, saved]);
    }
    setCatModal(false);
  };
  const deleteCat = async (id) => {
    await apiRequest(`/api/categories/${id}`, { method: "DELETE" });
    setCats(cats.filter(c => c.category_id !== id));
    setSubs(subs.filter(s => s.category_id !== id));
  };

  // Subcategory CRUD
  const openAddSub = (catId) => {
    setEditSub(null);
    setSubForm({ subcategory_name_en: "", subcategory_name_ar: "", category_id: catId });
    setSubModal(true);
  };
  const openEditSub = (s) => {
    setEditSub(s);
    setSubForm({ subcategory_name_en: s.subcategory_name_en, subcategory_name_ar: s.subcategory_name_ar, category_id: s.category_id });
    setSubModal(true);
  };
  const saveSub = async () => {
    if (!subForm.subcategory_name_en) return;
    if (editSub) {
      const saved = await apiRequest(`/api/subcategories/${editSub.subcategory_id}`, {
        method: "PUT",
        body: JSON.stringify(subForm),
      });
      setSubs(subs.map(s => s.subcategory_id === editSub.subcategory_id ? saved : s));
    } else {
      const saved = await apiRequest("/api/subcategories", {
        method: "POST",
        body: JSON.stringify(subForm),
      });
      setSubs([...subs, saved]);
    }
    setSubModal(false);
  };
  const deleteSub = async (id) => {
    await apiRequest(`/api/subcategories/${id}`, { method: "DELETE" });
    setSubs(subs.filter(s => s.subcategory_id !== id));
  };

  // Shared label style
  const Label = ({ children }) => (
    <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "#C9A84C" }}>
      {children}
    </label>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#f8f7f4" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">

        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between sticky top-0 z-20"
          style={{ background: "#fff", borderBottom: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <h1 className="font-display text-xl font-bold" style={{ color: "#1a1a1a" }}>
            {t("manageCategories")}
          </h1>
          <button
            onClick={openAddCat}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(201,168,76,0.35)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <Plus size={15} />
            {lang === "ar" ? "إضافة تصنيف" : "Add Category"}
          </button>
        </div>

        {/* Category list */}
        <div className="p-6 space-y-3">
          {loading ? (
            <p className="text-sm" style={{ color: "#aaa" }}>{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
          ) : cats.map(cat => {
            const catSubs = subs.filter(s => s.category_id === cat.category_id);
            const isExpanded = expanded === cat.category_id;

            return (
              <div
                key={cat.category_id}
                className="rounded-2xl overflow-hidden"
                style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                {/* Category row */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : cat.category_id)}
                  onMouseEnter={e => e.currentTarget.style.background = "#fdfaf3"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "rgba(201,168,76,0.08)" }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#1a1a1a" }}>
                        {cat.category_name_en}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>
                        {cat.category_name_ar}
                      </p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}
                    >
                      {catSubs.length} {lang === "ar" ? "فرعي" : "subcategories"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => { e.stopPropagation(); openEditCat(cat); }}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: "#aaa" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; e.currentTarget.style.color = "#C9A84C"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); deleteCat(cat.category_id); }}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: "#aaa" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; }}
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="ml-1" style={{ color: "#ccc" }}>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expanded subcategories */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #f0ece4", background: "#fdfaf3", padding: "16px 20px" }}>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#C9A84C" }}>
                        Subcategories
                      </p>
                      <button
                        onClick={() => openAddSub(cat.category_id)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                        style={{ color: "#C9A84C", border: "1.5px solid rgba(201,168,76,0.3)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <Plus size={12} />
                        {lang === "ar" ? "إضافة" : "Add Sub"}
                      </button>
                    </div>

                    {catSubs.length === 0 ? (
                      <p className="text-xs text-center py-4" style={{ color: "#ccc" }}>
                        {lang === "ar" ? "لا توجد تصنيفات فرعية بعد" : "No subcategories yet"}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {catSubs.map(sub => (
                          <div
                            key={sub.subcategory_id}
                            className="flex items-center justify-between px-4 py-3 rounded-xl"
                            style={{ background: "#fff", border: "1px solid #f0ece4" }}
                          >
                            <div>
                              <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                                {sub.subcategory_name_en}
                              </p>
                              <p className="text-xs" style={{ color: "#aaa" }}>
                                {sub.subcategory_name_ar}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => openEditSub(sub)}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ color: "#aaa" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; e.currentTarget.style.color = "#C9A84C"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; }}
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => deleteSub(sub.subcategory_id)}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ color: "#aaa" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Category Modal ── */}
      {catModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={() => setCatModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden animate-scale-in"
            style={{ background: "#fff", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ background: "#0d0d0d", borderBottom: "1px solid rgba(201,168,76,0.15)" }}
            >
              <h3 className="font-display font-semibold" style={{ color: "#C9A84C" }}>
                {editCat ? (lang === "ar" ? "تعديل التصنيف" : "Edit Category") : (lang === "ar" ? "إضافة تصنيف" : "Add Category")}
              </h3>
              <button onClick={() => setCatModal(false)} className="p-1.5 rounded-lg" style={{ color: "#515151" }}>
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "category_name_en", label: "Name (English)", placeholder: "Household Items" },
                { key: "category_name_ar", label: "الاسم (عربي)", placeholder: "أدوات منزلية" },
                { key: "icon", label: "Icon (emoji)", placeholder: "🏠" },
              ].map(f => (
                <div key={f.key}>
                  <Label>{f.label}</Label>
                  <input
                    value={catForm[f.key] || ""}
                    onChange={e => setCatForm({ ...catForm, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="luxury-input"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={saveCat}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d" }}
                >
                  {t("save")}
                </button>
                <button
                  onClick={() => setCatModal(false)}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all"
                  style={{ border: "1.5px solid #f0ece4", color: "#818181" }}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Subcategory Modal ── */}
      {subModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={() => setSubModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden animate-scale-in"
            style={{ background: "#fff", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ background: "#0d0d0d", borderBottom: "1px solid rgba(201,168,76,0.15)" }}
            >
              <h3 className="font-display font-semibold" style={{ color: "#C9A84C" }}>
                {editSub ? (lang === "ar" ? "تعديل التصنيف الفرعي" : "Edit Subcategory") : (lang === "ar" ? "إضافة تصنيف فرعي" : "Add Subcategory")}
              </h3>
              <button onClick={() => setSubModal(false)} className="p-1.5 rounded-lg" style={{ color: "#515151" }}>
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "subcategory_name_en", label: "Name (English)", placeholder: "Kitchen Storage" },
                { key: "subcategory_name_ar", label: "الاسم (عربي)", placeholder: "تخزين المطبخ" },
              ].map(f => (
                <div key={f.key}>
                  <Label>{f.label}</Label>
                  <input
                    value={subForm[f.key] || ""}
                    onChange={e => setSubForm({ ...subForm, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="luxury-input"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={saveSub}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d" }}
                >
                  {t("save")}
                </button>
                <button
                  onClick={() => setSubModal(false)}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all"
                  style={{ border: "1.5px solid #f0ece4", color: "#818181" }}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
