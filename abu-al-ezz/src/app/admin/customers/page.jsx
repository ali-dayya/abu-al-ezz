"use client";
import { useEffect, useState } from "react";
import { Search, Users, Mail, Phone } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

function CustomerRowSkeleton() {
  return (
    <tr>
      <td><div className="skeleton h-4 w-36" /></td>
      <td><div className="skeleton h-4 w-44" /></td>
      <td><div className="skeleton h-4 w-28" /></td>
      <td><div className="skeleton h-4 w-16" /></td>
      <td><div className="skeleton h-4 w-16" /></td>
      <td><div className="skeleton h-4 w-24" /></td>
    </tr>
  );
}

export default function AdminCustomersPage() {
  const { lang } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const loadData = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/admin/customers")
      .then(setCustomers)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q || c.full_name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q);
  });

  const totalSpent = (c) =>
    (c.orders || []).reduce((s, o) => s + Number(o.total_amount ?? 0), 0);

  const orderCount = (c) => (c.orders || []).length;

  return (
    <div className="flex min-h-screen" style={{ background: "#f8f7f4" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="px-6 py-4 sticky top-0 z-20 flex items-center justify-between"
          style={{ background: "#fff", borderBottom: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h1 className="font-display text-xl font-bold" style={{ color: "#1a1a1a" }}>
            {lang === "ar" ? "العملاء" : "Customers"}
          </h1>
          {!loading && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}>
              {customers.length} {lang === "ar" ? "عميل" : "total"}
            </span>
          )}
        </div>

        <div className="p-6">
          {/* Summary cards */}
          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: lang === "ar" ? "إجمالي العملاء" : "Total Customers", value: customers.length, icon: Users },
                { label: lang === "ar" ? "لديهم طلبات" : "Have Orders", value: customers.filter(c => orderCount(c) > 0).length, icon: Mail },
                { label: lang === "ar" ? "إجمالي الإيرادات" : "Total Revenue", value: `$${customers.reduce((s, c) => s + totalSpent(c), 0).toFixed(2)}`, icon: Phone },
              ].map(({ label, value, icon: Icon }, i) => (
                <div key={i} className="rounded-2xl p-5"
                  style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#aaa" }}>{label}</p>
                  <p className="font-display text-2xl font-bold" style={{ color: "#1a1a1a" }}>{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative mb-5 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#aaa" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "بحث بالاسم أو البريد أو الهاتف..." : "Search by name, email or phone..."}
              className="luxury-input"
              style={{ paddingLeft: "36px" }}
            />
          </div>

          {/* Table */}
          {error ? (
            <ErrorState onRetry={loadData} />
          ) : (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="overflow-x-auto">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      {[
                        lang === "ar" ? "الاسم" : "Name",
                        "Email",
                        lang === "ar" ? "الهاتف" : "Phone",
                        lang === "ar" ? "الطلبات" : "Orders",
                        lang === "ar" ? "الإجمالي" : "Total Spent",
                        lang === "ar" ? "تاريخ التسجيل" : "Joined",
                      ].map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? [...Array(8)].map((_, i) => <CustomerRowSkeleton key={i} />)
                      : filtered.map(c => (
                        <tr key={c.id}>
                          <td>
                            <p className="font-semibold text-sm" style={{ color: "#1a1a1a" }}>{c.full_name || "—"}</p>
                          </td>
                          <td style={{ color: "#434343", fontSize: "13px" }}>{c.email}</td>
                          <td>
                            {c.phone ? (
                              <a
                                href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                                target="_blank" rel="noreferrer"
                                className="text-sm font-medium transition-colors"
                                style={{ color: "#25D366" }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                              >
                                {c.phone}
                              </a>
                            ) : <span style={{ color: "#ccc" }}>—</span>}
                          </td>
                          <td>
                            <span className="font-bold" style={{ color: orderCount(c) > 0 ? "#1a1a1a" : "#ccc" }}>
                              {orderCount(c)}
                            </span>
                          </td>
                          <td>
                            <span className="font-bold" style={{ color: "#C9A84C" }}>
                              {totalSpent(c) > 0 ? `$${totalSpent(c).toFixed(2)}` : "—"}
                            </span>
                          </td>
                          <td style={{ color: "#818181", fontSize: "12px" }}>
                            {new Date(c.created_at).toLocaleDateString(lang === "ar" ? "ar" : "en-US")}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              {!loading && filtered.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-sm" style={{ color: "#aaa" }}>
                    {lang === "ar" ? "لا يوجد عملاء مطابقون" : "No customers found"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
