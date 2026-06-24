"use client";
import { useCallback, useEffect, useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Pagination from "@/components/ui/Pagination";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

const ACTION_COLORS = {
  INSERT: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", label: "Insert" },
  UPDATE: { bg: "rgba(59,130,246,0.1)", color: "#3b82f6", label: "Update" },
  DELETE: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", label: "Delete" },
};

export default function AuditLogPage() {
  const { lang } = useLanguage();
  const [data, setData] = useState({ data: [], total: 0, page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [tableFilter, setTableFilter] = useState("");
  const [expanded, setExpanded] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ page, limit: 25 });
    if (tableFilter) params.set("table", tableFilter);
    apiRequest(`/api/audit-log?${params}`)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [page, tableFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="flex min-h-screen" style={{ background: "#f8f7f4" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div
          className="px-6 py-4 flex items-center justify-between sticky top-0 z-20"
          style={{ background: "#fff", borderBottom: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: "#1a1a1a" }}>
              {lang === "ar" ? "سجل التدقيق" : "Audit Log"}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>
              {lang === "ar" ? "تتبع جميع التغييرات" : "Track all changes to your data"}
            </p>
          </div>
          <select
            value={tableFilter}
            onChange={(e) => { setTableFilter(e.target.value); setPage(1); }}
            className="luxury-input text-sm"
            style={{ minWidth: "150px" }}
          >
            <option value="">{lang === "ar" ? "جميع الجداول" : "All Tables"}</option>
            <option value="products">{lang === "ar" ? "المنتجات" : "Products"}</option>
            <option value="categories">{lang === "ar" ? "التصنيفات" : "Categories"}</option>
            <option value="orders">{lang === "ar" ? "الطلبات" : "Orders"}</option>
            <option value="store_info">{lang === "ar" ? "معلومات المتجر" : "Store Info"}</option>
          </select>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
            </div>
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : data.data.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={48} className="mx-auto mb-4" style={{ color: "#e5dfc8" }} />
              <p className="text-sm" style={{ color: "#aaa" }}>
                {lang === "ar" ? "لا يوجد سجلات بعد" : "No audit entries yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
                {data.data.map((entry, i) => {
                  const ac = ACTION_COLORS[entry.action] || ACTION_COLORS.UPDATE;
                  const isExpanded = expanded === entry.log_id;

                  return (
                    <div key={entry.log_id} style={{ borderBottom: i < data.data.length - 1 ? "1px solid #f9f7f2" : "none" }}>
                      <button
                        className="w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors"
                        onClick={() => setExpanded(isExpanded ? null : entry.log_id)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#fdfaf3"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ background: ac.bg, color: ac.color }}
                          >
                            {ac.label}
                          </span>
                          <span className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                            {entry.table_name}
                          </span>
                          <span className="text-xs" style={{ color: "#aaa" }}>
                            ID: {entry.record_id}
                          </span>
                          <span className="text-xs" style={{ color: "#aaa" }}>
                            {new Date(entry.changed_at).toLocaleString(lang === "ar" ? "ar" : "en-US")}
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp size={14} style={{ color: "#aaa" }} /> : <ChevronDown size={14} style={{ color: "#aaa" }} />}
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {entry.old_data && (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#ef4444" }}>
                                  {lang === "ar" ? "البيانات القديمة" : "Old Data"}
                                </p>
                                <pre className="text-xs rounded-xl p-3 overflow-auto max-h-48"
                                  style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}>
                                  {JSON.stringify(entry.old_data, null, 2)}
                                </pre>
                              </div>
                            )}
                            {entry.new_data && (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#22c55e" }}>
                                  {lang === "ar" ? "البيانات الجديدة" : "New Data"}
                                </p>
                                <pre className="text-xs rounded-xl p-3 overflow-auto max-h-48"
                                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534" }}>
                                  {JSON.stringify(entry.new_data, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
