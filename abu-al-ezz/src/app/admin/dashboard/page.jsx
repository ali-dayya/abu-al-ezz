"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Package, ShoppingBag, Clock, AlertTriangle, Users, TrendingUp } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardCard from "@/components/admin/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export default function AdminDashboard() {
  const { t, lang } = useLanguage();
  const [data, setData] = useState({ products: [], orders: [], customers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/dashboard").then(setData).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const { products, orders, customers } = data;

  const pendingOrders = orders.filter(o => o.status === "pending");
  const outOfStock = products.filter(p => p.availability_status === "out_of_stock");
  const lowStock = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5);
  const recentOrders = [...orders].sort((a, b) => new Date(b.order_date) - new Date(a.order_date)).slice(0, 5);

  const stats = [
    { title: t("totalProducts"),   value: products.length,       icon: Package,       color: "gold" },
    { title: t("totalOrders"),     value: orders.length,          icon: ShoppingBag,   color: "blue" },
    { title: t("pendingOrders"),   value: pendingOrders.length,   icon: Clock,         color: "gold" },
    { title: t("outOfStockItems"), value: outOfStock.length,      icon: AlertTriangle, color: "red" },
    { title: t("totalCustomers"),  value: customers.length,       icon: Users,         color: "purple" },
  ];

  return (
    <div className="flex min-h-screen" style={{ background:"#f8f7f4" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">

        {/* Top bar */}
        <div
          className="px-6 py-4 flex items-center justify-between sticky top-0 z-20"
          style={{ background:"#fff", borderBottom:"1px solid #f0ece4", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color:"#1a1a1a" }}>{t("dashboard")}</h1>
            <p className="text-xs mt-0.5" style={{ color:"#aaa" }}>
              {lang === "ar" ? "نظرة عامة على المتجر" : "Store Overview"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="relative w-9 h-9 rounded-full overflow-hidden"
              style={{ border:"1.5px solid rgba(201,168,76,0.4)" }}
            >
              <Image src="/logo.png" alt="Logo" fill className="object-cover"
                onError={e=>e.currentTarget.style.display="none"} />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ background:"#f9f7f2", color:"#C9A84C" }}>AE</div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold" style={{ color:"#1a1a1a" }}>Admin</p>
              <p className="text-xs" style={{ color:"#aaa" }}>Abu Al-Ezz</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {loading ? (
            <p className="text-sm" style={{ color:"#aaa" }}>{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : (
          <>
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {stats.map((s, i) => <DashboardCard key={i} {...s} />)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent orders */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:"1px solid #f0ece4" }}>
                <h2 className="font-display font-bold" style={{ color:"#1a1a1a" }}>{t("recentOrders")}</h2>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background:"rgba(201,168,76,0.1)", color:"#C9A84C", border:"1px solid rgba(201,168,76,0.2)" }}
                >
                  {recentOrders.length} orders
                </span>
              </div>
              <div>
                {recentOrders.map((order, i) => (
                  <div
                    key={order.order_id}
                    className="px-5 py-3.5 flex items-center justify-between transition-colors"
                    style={{ borderBottom: i < recentOrders.length - 1 ? "1px solid #f9f7f2" : "none" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#fdfaf3"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <div>
                      <p className="text-sm font-bold" style={{ color:"#1a1a1a" }}>#{order.order_id}</p>
                      <p className="text-xs mt-0.5" style={{ color:"#aaa" }}>
                        {order.customer_name} · {new Date(order.order_date).toLocaleDateString(lang === "ar" ? "ar" : "en-US")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold" style={{ color:"#1a1a1a" }}>
                        ${order.total_amount.toFixed(2)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low stock */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:"1px solid #f0ece4" }}>
                <h2 className="font-display font-bold" style={{ color:"#1a1a1a" }}>
                  {lang === "ar" ? "مخزون منخفض" : "Low Stock Alerts"}
                </h2>
                {lowStock.length > 0 && (
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background:"rgba(239,68,68,0.1)", color:"#ef4444", border:"1px solid rgba(239,68,68,0.2)" }}
                  >
                    {lowStock.length} items
                  </span>
                )}
              </div>
              {lowStock.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-3xl mb-2">✅</p>
                  <p className="text-sm" style={{ color:"#aaa" }}>
                    {lang === "ar" ? "جميع المنتجات متوفرة" : "All products are well stocked"}
                  </p>
                </div>
              ) : (
                <div>
                  {lowStock.map((p, i) => (
                    <div
                      key={p.product_id}
                      className="px-5 py-3.5 flex items-center justify-between transition-colors"
                      style={{ borderBottom: i < lowStock.length - 1 ? "1px solid #f9f7f2" : "none" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#fdfaf3"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <p className="text-sm font-medium" style={{ color:"#1a1a1a" }}>
                        {lang === "ar" ? p.product_name_ar : p.product_name_en}
                      </p>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background:"rgba(239,68,68,0.1)", color:"#ef4444" }}
                      >
                        {p.stock_quantity} left
                      </span>
                    </div>
                  ))}
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
