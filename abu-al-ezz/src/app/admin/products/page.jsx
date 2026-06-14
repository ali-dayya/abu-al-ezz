"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, X, Package, Upload } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatusBadge from "@/components/ui/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const emptyForm = { product_name_en:"", product_name_ar:"", price:"", stock_quantity:"", category_id:"", subcategory_id:"", availability_status:"available", description_en:"", description_ar:"", image_url:"" };

export default function AdminProductsPage() {
  const { t, lang } = useLanguage();
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      apiRequest("/api/products").then(setProductList),
      apiRequest("/api/categories").then((data) => {
        setCategories(data.categories);
        setSubcategories(data.subcategories);
      }),
    ]).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const filtered = productList.filter(p =>
    p.product_name_en.toLowerCase().includes(search.toLowerCase()) || p.product_name_ar.includes(search)
  );

  const openAdd = () => {
    setEditProduct(null);
    const firstCat = categories[0]?.category_id ?? "";
    const firstSub = subcategories.find(s => s.category_id === firstCat)?.subcategory_id ?? "";
    setForm({ ...emptyForm, category_id: firstCat, subcategory_id: firstSub });
    setModalOpen(true);
  };
  const openEdit = (p) => { setEditProduct(p); setForm({...p, price:String(p.price), stock_quantity:String(p.stock_quantity)}); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.product_name_en || !form.price) return;
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock_quantity: parseInt(form.stock_quantity) || 0,
      category_id: parseInt(form.category_id),
      subcategory_id: parseInt(form.subcategory_id),
    };
    if (editProduct) {
      const saved = await apiRequest(`/api/products/${editProduct.product_id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setProductList(productList.map(p => p.product_id === editProduct.product_id ? saved : p));
    } else {
      const saved = await apiRequest("/api/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setProductList([...productList, saved]);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    await apiRequest(`/api/products/${id}`, { method: "DELETE" });
    setProductList(productList.filter(p => p.product_id !== id));
    setDeleteModal(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm(f => ({ ...f, image_url: data.publicUrl }));
    } catch (err) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const inp = (k, placeholder, type="text") => (
    <input type={type} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
      placeholder={placeholder} className="luxury-input" />
  );

  return (
    <div className="flex min-h-screen" style={{ background:"#f8f7f4" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-20"
          style={{ background:"#fff", borderBottom:"1px solid #f0ece4", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
          <h1 className="font-display text-xl font-bold" style={{ color:"#1a1a1a" }}>{t("manageProducts")}</h1>
          <button onClick={openAdd}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            style={{ background:"linear-gradient(135deg, #C9A84C, #E8C97A)", color:"#0d0d0d" }}>
            <Plus size={15} />{lang==="ar"?"إضافة منتج":"Add Product"}
          </button>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="relative mb-5 max-w-sm">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:"#aaa" }} />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder={lang==="ar"?"بحث...":"Search products..."}
              className="luxury-input" style={{ paddingLeft:"40px" }} />
          </div>

          {/* Table */}
          {loading ? (
            <p className="text-sm" style={{ color:"#aaa" }}>{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : (
          <div className="rounded-2xl overflow-hidden"
            style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
            <div className="overflow-x-auto">
              <table className="luxury-table">
                <thead>
                  <tr>
                    {["Product", "Price", "Stock", "Status", ""].map((h,i) => <th key={i}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.product_id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                            style={{ background:"#f9f7f2", border:"1px solid #f0ece4" }}>
                            <Image src={p.image_url} alt="" fill className="object-cover"
                              onError={e=>e.currentTarget.style.display="none"} />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Package size={14} style={{ color:"#ddd" }} />
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color:"#1a1a1a" }}>{p.product_name_en}</p>
                            <p className="text-xs" style={{ color:"#aaa" }}>{p.product_name_ar}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="font-bold" style={{ color:"#C9A84C" }}>${p.price.toFixed(2)}</span></td>
                      <td><span className="font-semibold" style={{ color:"#1a1a1a" }}>{p.stock_quantity}</span></td>
                      <td><StatusBadge status={p.availability_status} /></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={()=>openEdit(p)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color:"#aaa" }}
                            onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,168,76,0.08)";e.currentTarget.style.color="#C9A84C";}}
                            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#aaa";}}>
                            <Pencil size={14}/>
                          </button>
                          <button onClick={()=>setDeleteModal(p)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color:"#aaa" }}
                            onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.08)";e.currentTarget.style.color="#ef4444";}}
                            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#aaa";}}>
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={()=>setModalOpen(false)}>
          <div className="w-full max-w-lg rounded-3xl overflow-hidden animate-scale-in"
            style={{ background:"#fff", boxShadow:"0 24px 80px rgba(0,0,0,0.2)", maxHeight:"90vh", overflowY:"auto" }}
            onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:"1px solid #f0ece4" }}>
              <h3 className="font-display font-bold" style={{ color:"#1a1a1a" }}>
                {editProduct ? (lang==="ar"?"تعديل المنتج":"Edit Product") : (lang==="ar"?"إضافة منتج":"Add Product")}
              </h3>
              <button onClick={()=>setModalOpen(false)} className="p-2 rounded-lg" style={{ color:"#aaa" }}>
                <X size={18}/>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color:"#C9A84C" }}>Name EN</label>{inp("product_name_en","Name in English")}</div>
                <div><label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color:"#C9A84C" }}>Name AR</label>{inp("product_name_ar","الاسم بالعربي")}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color:"#C9A84C" }}>Category</label>
                  <select
                    value={form.category_id}
                    onChange={e => {
                      const newCatId = parseInt(e.target.value);
                      const firstSub = subcategories.find(s => s.category_id === newCatId)?.subcategory_id ?? "";
                      setForm({ ...form, category_id: newCatId, subcategory_id: firstSub });
                    }}
                    className="luxury-input"
                  >
                    {categories.map(c => (
                      <option key={c.category_id} value={c.category_id}>
                        {lang === "ar" ? c.category_name_ar : c.category_name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div><label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color:"#C9A84C" }}>Subcategory</label>
                  <select
                    value={form.subcategory_id}
                    onChange={e => setForm({ ...form, subcategory_id: parseInt(e.target.value) })}
                    className="luxury-input"
                  >
                    {subcategories.filter(s => s.category_id === Number(form.category_id)).map(s => (
                      <option key={s.subcategory_id} value={s.subcategory_id}>
                        {lang === "ar" ? s.subcategory_name_ar : s.subcategory_name_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color:"#C9A84C" }}>Price ($)</label>{inp("price","0.00","number")}</div>
                <div><label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color:"#C9A84C" }}>Stock</label>{inp("stock_quantity","0","number")}</div>
              </div>
              <div><label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color:"#C9A84C" }}>Status</label>
                <select value={form.availability_status} onChange={e=>setForm({...form,availability_status:e.target.value})} className="luxury-input">
                  <option value="available">Available</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <div><label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color:"#C9A84C" }}>Description (English)</label>
                <textarea value={form.description_en} onChange={e=>setForm({...form,description_en:e.target.value})} rows={3} className="luxury-input resize-none" placeholder="Product description..." />
              </div>
              <div><label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color:"#C9A84C" }}>الوصف (عربي)</label>
                <textarea value={form.description_ar} onChange={e=>setForm({...form,description_ar:e.target.value})} rows={3} dir="rtl" className="luxury-input resize-none" placeholder="وصف المنتج..." />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color:"#C9A84C" }}>Image</label>
                {inp("image_url","/products/image.jpg or paste a URL")}
                <div className="flex items-center gap-3 mt-2">
                  <label
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer transition-all"
                    style={{ border:"1.5px solid rgba(201,168,76,0.3)", color:"#C9A84C" }}
                  >
                    <Upload size={13} />
                    {lang === "ar" ? "رفع صورة" : "Upload Image"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {uploading && (
                    <span className="text-xs" style={{ color:"#aaa" }}>{lang === "ar" ? "جارٍ الرفع..." : "Uploading..."}</span>
                  )}
                  {form.image_url && (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background:"#f9f7f2", border:"1px solid #f0ece4" }}>
                      <Image src={form.image_url} alt="" fill className="object-cover" onError={e=>e.currentTarget.style.display="none"} />
                    </div>
                  )}
                </div>
              </div>
              <button onClick={handleSave}
                className="w-full py-3.5 rounded-2xl font-bold text-sm"
                style={{ background:"linear-gradient(135deg, #C9A84C, #E8C97A)", color:"#0d0d0d" }}>
                {editProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={()=>setDeleteModal(null)}>
          <div className="w-full max-w-sm rounded-3xl p-7 animate-scale-in text-center"
            style={{ background:"#fff", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}
            onClick={e=>e.stopPropagation()}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background:"#fef2f2" }}><Trash2 size={24} style={{ color:"#ef4444" }}/></div>
            <h3 className="font-display font-bold mb-2" style={{ color:"#1a1a1a" }}>Delete Product?</h3>
            <p className="text-sm mb-6" style={{ color:"#aaa" }}>&quot;{deleteModal.product_name_en}&quot;</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteModal(null)} className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{ border:"1.5px solid #f0ece4", color:"#818181" }}>Cancel</button>
              <button onClick={()=>handleDelete(deleteModal.product_id)} className="flex-1 py-3 rounded-2xl text-sm font-bold"
                style={{ background:"#ef4444", color:"#fff" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
