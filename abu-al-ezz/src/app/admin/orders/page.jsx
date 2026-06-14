"use client";
import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatusBadge from "@/components/ui/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const { t, lang } = useLanguage();
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  const loadData = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/orders").then(setOrderList).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const updateStatus = async (orderId, status) => {
    const saved = await apiRequest(`/api/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setOrderList(orderList.map(o => o.order_id === orderId ? { ...o, ...saved } : o));
  };

  return (
    <div className="flex min-h-screen" style={{ background:"#f8f7f4" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="px-6 py-4 sticky top-0 z-20"
          style={{ background:"#fff", borderBottom:"1px solid #f0ece4", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
          <h1 className="font-display text-xl font-bold" style={{ color:"#1a1a1a" }}>{t("manageOrders")}</h1>
        </div>

        <div className="p-6">
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
                    {[t("orderId"), "Customer", t("orderDate"), t("orderTotal"), "Status", t("updateStatus"), ""].map((h,i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orderList.map(order => (
                    <tr key={order.order_id}>
                      <td><span className="font-bold" style={{ color:"#1a1a1a" }}>#{order.order_id}</span></td>
                      <td style={{ color:"#434343" }}>{order.customer_name}</td>
                      <td style={{ color:"#818181" }}>{new Date(order.order_date).toLocaleDateString(lang === "ar" ? "ar" : "en-US")}</td>
                      <td><span className="font-bold" style={{ color:"#1a1a1a" }}>${order.total_amount.toFixed(2)}</span></td>
                      <td><StatusBadge status={order.status} /></td>
                      <td>
                        <select
                          value={order.status}
                          onChange={e=>updateStatus(order.order_id, e.target.value)}
                          className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
                          style={{ border:"1.5px solid #f0ece4", background:"#f9f7f2", color:"#434343" }}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{t(s)}</option>)}
                        </select>
                      </td>
                      <td>
                        <button onClick={()=>setViewOrder(order)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color:"#aaa" }}
                          onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,168,76,0.08)";e.currentTarget.style.color="#C9A84C";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#aaa";}}
                        >
                          <Eye size={15} />
                        </button>
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

      {/* View modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          onClick={()=>setViewOrder(null)}>
          <div className="w-full max-w-md rounded-3xl overflow-hidden animate-scale-in"
            style={{ background:"#fff", boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}
            onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom:"1px solid #f0ece4" }}>
              <h3 className="font-display font-bold" style={{ color:"#1a1a1a" }}>
                Order #{viewOrder.order_id}
              </h3>
              <button onClick={()=>setViewOrder(null)}
                className="p-2 rounded-lg transition-colors"
                style={{ color:"#aaa" }}
                onMouseEnter={e=>e.currentTarget.style.background="#f9f7f2"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label:"Customer", value:viewOrder.customer_name },
                { label:"Date", value:new Date(viewOrder.order_date).toLocaleDateString(lang === "ar" ? "ar" : "en-US") },
                { label:"Total", value:`$${viewOrder.total_amount.toFixed(2)}` },
              ].map((r,i)=>(
                <div key={i} className="flex justify-between text-sm">
                  <span style={{ color:"#aaa" }}>{r.label}</span>
                  <span className="font-semibold" style={{ color:"#1a1a1a" }}>{r.value}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span style={{ color:"#aaa" }}>Status</span>
                <StatusBadge status={viewOrder.status} />
              </div>
              <div style={{ borderTop:"1px solid #f0ece4", paddingTop:"16px" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:"#C9A84C" }}>Items</p>
                <div className="space-y-2">
                  {viewOrder.items.map(item=>(
                    <div key={item.product_id} className="flex justify-between text-sm">
                      <span style={{ color:"#434343" }}>{(lang === "ar" ? item.product_name_ar : item.product_name_en)} × {item.quantity}</span>
                      <span className="font-semibold" style={{ color:"#1a1a1a" }}>${item.subtotal.toFixed(2)}</span>
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
