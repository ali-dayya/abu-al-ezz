"use client";
import { useEffect, useState, useCallback } from "react";
import { Eye, X, ChevronLeft, ChevronRight, Download, Search, Printer } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatusBadge from "@/components/ui/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const LIMIT = 25;

function OrderRowSkeleton() {
  return (
    <tr>
      <td><div className="skeleton h-4 w-10" /></td>
      <td><div className="skeleton h-4 w-32" /></td>
      <td><div className="skeleton h-4 w-24" /></td>
      <td><div className="skeleton h-4 w-16" /></td>
      <td><div className="skeleton h-6 w-24 rounded-full" /></td>
      <td><div className="skeleton h-6 w-24 rounded-lg" /></td>
      <td><div className="skeleton h-7 w-7 rounded-lg" /></td>
    </tr>
  );
}

function escapeCSV(val) {
  if (val === null || val === undefined) return "";
  const s = String(val);
  return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCSV(orders, lang) {
  const headers = ["Order ID", "Customer", "Email", "Phone", "Date", "Total ($)", "Status", "Notes", "Items"];
  const rows = orders.map(o => [
    o.order_id,
    o.customer_name,
    o.customer?.email || "",
    o.customer?.phone || "",
    o.order_date,
    o.total_amount.toFixed(2),
    o.status,
    o.notes,
    (o.items || []).map(i => `${lang === "ar" ? i.product_name_ar : i.product_name_en} x${i.quantity}`).join(" | "),
  ]);

  const csv = [headers, ...rows].map(r => r.map(escapeCSV).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminOrdersPage() {
  const { t, lang } = useLanguage();
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(() => {
    setLoading(true);
    setError(false);
    const qs = new URLSearchParams({ page, limit: LIMIT });
    if (statusFilter) qs.set("status", statusFilter);
    apiRequest(`/api/orders?${qs}`)
      .then(result => {
        setOrderList(result.data);
        setTotalPages(result.totalPages || 1);
        setTotal(result.total || 0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleStatusFilterChange = (s) => { setStatusFilter(s); setPage(1); setSearchQuery(""); };

  const updateStatus = async (orderId, status) => {
    const saved = await apiRequest(`/api/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setOrderList(prev => prev.map(o => o.order_id === orderId ? { ...o, ...saved } : o));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const qs = new URLSearchParams();
      if (statusFilter) qs.set("status", statusFilter);
      const all = await apiRequest(`/api/admin/export-orders?${qs}`);
      downloadCSV(all, lang);
    } catch {
      alert(lang === "ar" ? "فشل التصدير" : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const displayed = searchQuery.trim()
    ? orderList.filter(o => o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || String(o.order_id).includes(searchQuery))
    : orderList;

  const start = (page - 1) * LIMIT + 1;
  const end = Math.min(page * LIMIT, total);

  return (
    <div className="flex min-h-screen" style={{ background: "#f8f7f4" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="px-6 py-4 sticky top-0 z-20 flex items-center justify-between gap-4"
          style={{ background: "#fff", borderBottom: "1px solid #f0ece4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h1 className="font-display text-xl font-bold" style={{ color: "#1a1a1a" }}>{t("manageOrders")}</h1>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
            style={{ border: "1.5px solid rgba(201,168,76,0.4)", color: "#C9A84C" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <Download size={14} />
            {exporting ? "Exporting..." : lang === "ar" ? "تصدير CSV" : "Export CSV"}
          </button>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1 min-w-48 max-w-xs">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#aaa" }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "بحث باسم العميل أو رقم الطلب..." : "Search by customer or order #..."}
                className="luxury-input"
                style={{ paddingLeft: "36px" }}
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => handleStatusFilterChange(e.target.value)}
              className="luxury-input"
              style={{ minWidth: "160px" }}
              aria-label="Filter by status"
            >
              <option value="">{lang === "ar" ? "جميع الحالات" : "All Statuses"}</option>
              {STATUSES.map(s => <option key={s} value={s}>{t(s)}</option>)}
            </select>

            {(statusFilter || searchQuery) && (
              <button
                onClick={() => { setStatusFilter(""); setSearchQuery(""); setPage(1); }}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl"
                style={{ color: "#ef4444", border: "1.5px solid #fecaca", background: "#fef2f2" }}
              >
                <X size={13} />
                {lang === "ar" ? "مسح" : "Clear"}
              </button>
            )}
          </div>

          {error ? (
            <ErrorState onRetry={loadData} />
          ) : (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="overflow-x-auto">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      {[t("orderId"), lang === "ar" ? "العميل" : "Customer", t("orderDate"), t("orderTotal"), "Status", t("updateStatus"), ""].map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? [...Array(LIMIT)].map((_, i) => <OrderRowSkeleton key={i} />)
                      : displayed.map(order => (
                        <tr key={order.order_id}>
                          <td><span className="font-bold" style={{ color: "#1a1a1a" }}>#{order.order_id}</span></td>
                          <td>
                            <div>
                              <p className="font-semibold text-sm" style={{ color: "#434343" }}>{order.customer_name}</p>
                              {order.customer?.phone && (
                                <p className="text-xs" style={{ color: "#aaa" }}>{order.customer.phone}</p>
                              )}
                            </div>
                          </td>
                          <td style={{ color: "#818181" }}>{new Date(order.order_date).toLocaleDateString(lang === "ar" ? "ar" : "en-US")}</td>
                          <td><span className="font-bold" style={{ color: "#1a1a1a" }}>${order.total_amount.toFixed(2)}</span></td>
                          <td><StatusBadge status={order.status} /></td>
                          <td>
                            <select
                              value={order.status}
                              onChange={e => updateStatus(order.order_id, e.target.value)}
                              className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
                              style={{ border: "1.5px solid #f0ece4", background: "#f9f7f2", color: "#434343" }}
                            >
                              {STATUSES.map(s => <option key={s} value={s}>{t(s)}</option>)}
                            </select>
                          </td>
                          <td>
                            <button onClick={() => setViewOrder(order)}
                              className="p-2 rounded-lg transition-colors"
                              style={{ color: "#aaa" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; e.currentTarget.style.color = "#C9A84C"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; }}
                            >
                              <Eye size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && total > 0 && !searchQuery && (
                <div className="flex items-center justify-between px-6 py-4"
                  style={{ borderTop: "1px solid #f0ece4" }}>
                  <p className="text-xs" style={{ color: "#aaa" }}>
                    {lang === "ar"
                      ? `عرض ${start}–${end} من ${total} طلب`
                      : `Showing ${start}–${end} of ${total} orders`}
                  </p>
                  <div className="flex items-center gap-2">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                      className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                      style={{ border: "1.5px solid #f0ece4", color: "#818181" }}
                      onMouseEnter={e => { if (page > 1) { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; } }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#f0ece4"; e.currentTarget.style.color = "#818181"; }}>
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs font-medium px-3" style={{ color: "#434343" }}>
                      {lang === "ar" ? `${page} / ${totalPages}` : `Page ${page} of ${totalPages}`}
                    </span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                      className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                      style={{ border: "1.5px solid #f0ece4", color: "#818181" }}
                      onMouseEnter={e => { if (page < totalPages) { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; } }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#f0ece4"; e.currentTarget.style.color = "#818181"; }}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* View modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={() => setViewOrder(null)}>
          <div className="w-full max-w-md rounded-3xl overflow-hidden animate-scale-in"
            style={{ background: "#fff", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f0ece4" }}>
              <h3 className="font-display font-bold" style={{ color: "#1a1a1a" }}>Order #{viewOrder.order_id}</h3>
              <div className="flex items-center gap-1">
                <button onClick={() => window.print()} className="p-2 rounded-lg" style={{ color: "#aaa" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; e.currentTarget.style.color = "#C9A84C"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; }}
                  aria-label="Print">
                  <Printer size={16} />
                </button>
                <button onClick={() => setViewOrder(null)} className="p-2 rounded-lg" style={{ color: "#aaa" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9f7f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: lang === "ar" ? "العميل" : "Customer", value: viewOrder.customer_name },
                viewOrder.customer?.email ? { label: "Email", value: viewOrder.customer.email } : null,
                viewOrder.customer?.phone ? { label: lang === "ar" ? "الهاتف" : "Phone", value: viewOrder.customer.phone } : null,
                { label: lang === "ar" ? "التاريخ" : "Date", value: new Date(viewOrder.order_date).toLocaleDateString(lang === "ar" ? "ar" : "en-US") },
                { label: lang === "ar" ? "الإجمالي" : "Total", value: `$${viewOrder.total_amount.toFixed(2)}` },
              ].filter(Boolean).map((r, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span style={{ color: "#aaa" }}>{r.label}</span>
                  <span className="font-semibold" style={{ color: "#1a1a1a" }}>{r.value}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span style={{ color: "#aaa" }}>Status</span>
                <StatusBadge status={viewOrder.status} />
              </div>
              {viewOrder.customer?.phone && (
                <a
                  href={`https://wa.me/${viewOrder.customer.phone.replace(/\D/g, "")}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#25D366", color: "#fff" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1da851"}
                  onMouseLeave={e => e.currentTarget.style.background = "#25D366"}
                >
                  WhatsApp Customer
                </a>
              )}
              {viewOrder.notes && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e" }}>
                  <span className="font-semibold">{t("orderNotes")}: </span>{viewOrder.notes}
                </div>
              )}
              <div style={{ borderTop: "1px solid #f0ece4", paddingTop: "12px" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A84C" }}>Items</p>
                <div className="space-y-2">
                  {viewOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span style={{ color: "#434343" }}>
                        {(lang === "ar" ? item.product_name_ar : item.product_name_en)} × {item.quantity}
                      </span>
                      <span className="font-semibold" style={{ color: "#1a1a1a" }}>${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
