"use client";
import { useCallback, useEffect, useState } from "react";
import { BarChart3, TrendingUp, DollarSign, Package } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ErrorState from "@/components/ui/ErrorState";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";
import dynamic from "next/dynamic";

const RechartsCharts = dynamic(() => import("@/components/admin/ReportsCharts"), { ssr: false });

export default function ReportsPage() {
  const { lang } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [days, setDays] = useState(30);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(false);
    apiRequest(`/api/reports?days=${days}`)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [days]);

  useEffect(() => { loadData(); }, [loadData]);

  const totalRevenue = data?.revenueByCategory?.reduce((sum, c) => sum + c.total_revenue, 0) || 0;
  const totalUnitsSold = data?.revenueByCategory?.reduce((sum, c) => sum + c.total_units_sold, 0) || 0;

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
              {lang === "ar" ? "التقارير" : "Reports"}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>
              {lang === "ar" ? "تحليلات المبيعات والأداء" : "Sales & Performance Analytics"}
            </p>
          </div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="luxury-input text-sm"
            style={{ minWidth: "140px" }}
          >
            <option value={7}>{lang === "ar" ? "آخر 7 أيام" : "Last 7 days"}</option>
            <option value={30}>{lang === "ar" ? "آخر 30 يوم" : "Last 30 days"}</option>
            <option value={90}>{lang === "ar" ? "آخر 90 يوم" : "Last 90 days"}</option>
            <option value={365}>{lang === "ar" ? "آخر سنة" : "Last year"}</option>
          </select>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
              </div>
              <div className="skeleton h-80 rounded-2xl" />
            </div>
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "#fff", border: "1px solid rgba(201,168,76,0.2)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)" }}>
                    <DollarSign size={20} style={{ color: "#C9A84C" }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>${totalRevenue.toFixed(2)}</p>
                    <p className="text-xs font-medium" style={{ color: "#818181" }}>{lang === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "#fff", border: "1px solid rgba(59,130,246,0.2)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.1)" }}>
                    <Package size={20} style={{ color: "#3b82f6" }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>{totalUnitsSold}</p>
                    <p className="text-xs font-medium" style={{ color: "#818181" }}>{lang === "ar" ? "الوحدات المباعة" : "Units Sold"}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "#fff", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.1)" }}>
                    <TrendingUp size={20} style={{ color: "#22c55e" }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>{data?.ordersPerDay?.length || 0}</p>
                    <p className="text-xs font-medium" style={{ color: "#818181" }}>{lang === "ar" ? "أيام بطلبات" : "Active Days"}</p>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <RechartsCharts data={data} lang={lang} />

              {/* Revenue by category table */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #f0ece4" }}>
                  <h2 className="font-display font-bold" style={{ color: "#1a1a1a" }}>
                    {lang === "ar" ? "الإيرادات حسب التصنيف" : "Revenue by Category"}
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #f0ece4", background: "#fdfaf3" }}>
                        <th className="px-5 py-3 text-left font-semibold" style={{ color: "#818181" }}>
                          {lang === "ar" ? "التصنيف" : "Category"}
                        </th>
                        <th className="px-5 py-3 text-right font-semibold" style={{ color: "#818181" }}>
                          {lang === "ar" ? "الإيرادات" : "Revenue"}
                        </th>
                        <th className="px-5 py-3 text-right font-semibold" style={{ color: "#818181" }}>
                          {lang === "ar" ? "الوحدات" : "Units Sold"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.revenueByCategory?.map((cat) => (
                        <tr key={cat.category_id} style={{ borderBottom: "1px solid #f9f7f2" }}>
                          <td className="px-5 py-3 font-medium" style={{ color: "#1a1a1a" }}>
                            {lang === "ar" ? cat.category_name_ar : cat.category_name_en}
                          </td>
                          <td className="px-5 py-3 text-right font-bold" style={{ color: "#C9A84C" }}>
                            ${cat.total_revenue.toFixed(2)}
                          </td>
                          <td className="px-5 py-3 text-right" style={{ color: "#434343" }}>
                            {cat.total_units_sold}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top selling products */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #f0ece4" }}>
                  <h2 className="font-display font-bold" style={{ color: "#1a1a1a" }}>
                    {lang === "ar" ? "المنتجات الأكثر مبيعاً" : "Top Selling Products"}
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #f0ece4", background: "#fdfaf3" }}>
                        <th className="px-5 py-3 text-left font-semibold" style={{ color: "#818181" }}>#</th>
                        <th className="px-5 py-3 text-left font-semibold" style={{ color: "#818181" }}>
                          {lang === "ar" ? "المنتج" : "Product"}
                        </th>
                        <th className="px-5 py-3 text-right font-semibold" style={{ color: "#818181" }}>
                          {lang === "ar" ? "السعر" : "Price"}
                        </th>
                        <th className="px-5 py-3 text-right font-semibold" style={{ color: "#818181" }}>
                          {lang === "ar" ? "المبيعات" : "Sold"}
                        </th>
                        <th className="px-5 py-3 text-right font-semibold" style={{ color: "#818181" }}>
                          {lang === "ar" ? "الإيرادات" : "Revenue"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.topProducts?.map((p, i) => (
                        <tr key={p.product_id} style={{ borderBottom: "1px solid #f9f7f2" }}>
                          <td className="px-5 py-3">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: i < 3 ? "rgba(201,168,76,0.1)" : "#f9f7f2", color: i < 3 ? "#C9A84C" : "#aaa", display: "inline-flex" }}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-medium" style={{ color: "#1a1a1a" }}>
                            {lang === "ar" ? p.product_name_ar : p.product_name_en}
                          </td>
                          <td className="px-5 py-3 text-right" style={{ color: "#434343" }}>${p.price.toFixed(2)}</td>
                          <td className="px-5 py-3 text-right font-bold" style={{ color: "#1a1a1a" }}>{p.total_sold}</td>
                          <td className="px-5 py-3 text-right font-bold" style={{ color: "#C9A84C" }}>${p.total_revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
