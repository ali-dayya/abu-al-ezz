"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Package, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/ui/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";
import OrderTracker from "@/components/ui/OrderTracker";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export default function OrderDetailPage() {
  const params = useParams();
  const { t, lang, dir } = useLanguage();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(false);
    apiRequest(`/api/orders/${params.id}`)
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight: "100vh", background: "#FFFDF5" }}>
        <section style={{ background: "#0d0d0d", padding: "60px 0 52px" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-display text-5xl font-bold" style={{ color: "#fff" }}>
              {lang === "ar" ? "تفاصيل الطلب" : "Order Details"}
            </h1>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          {loading ? (
            <div className="space-y-4">
              <div className="skeleton h-8 w-40" />
              <div className="skeleton h-48 rounded-2xl" />
              <div className="skeleton h-32 rounded-2xl" />
            </div>
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : !order ? (
            <div className="text-center py-24">
              <Package size={56} className="mx-auto mb-4" style={{ color: "#e5dfc8" }} />
              <h2 className="font-display text-xl font-bold mb-2" style={{ color: "#434343" }}>
                {lang === "ar" ? "الطلب غير موجود" : "Order not found"}
              </h2>
              <Link href="/orders" className="btn-gold mt-4 inline-block">
                {t("orderHistory")}
              </Link>
            </div>
          ) : (
            <>
              {/* Order summary card */}
              <div
                className="rounded-2xl overflow-hidden mb-6"
                style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #f0ece4" }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#aaa" }}>{t("orderId")}</p>
                    <p className="font-display text-2xl font-bold" style={{ color: "#1a1a1a" }}>
                      #{order.order_id}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="px-6 pt-5">
                  <OrderTracker status={order.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6">
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: "#aaa" }}>{t("orderDate")}</p>
                    <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                      {new Date(order.order_date).toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: "#aaa" }}>{t("orderTotal")}</p>
                    <p className="text-lg font-bold" style={{ color: "#C9A84C" }}>
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: "#aaa" }}>
                      {lang === "ar" ? "عدد المنتجات" : "Items Count"}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                      {order.items.length} {lang === "ar" ? "منتج" : "items"}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mx-6 mb-6 px-4 py-3 rounded-xl text-sm"
                    style={{ background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e" }}>
                    <span className="font-semibold">{t("orderNotes")}: </span>{order.notes}
                  </div>
                )}
              </div>

              {/* Items */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "#fff", border: "1px solid #f0ece4", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <div className="px-6 py-4" style={{ borderBottom: "1px solid #f0ece4" }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#C9A84C" }}>
                    {t("orderItems")}
                  </p>
                </div>
                <div>
                  {order.items.map((item, i) => (
                    <div
                      key={item.order_item_id}
                      className={`px-6 py-4 flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}
                      style={{ borderBottom: i < order.items.length - 1 ? "1px solid #f9f7f2" : "none" }}
                    >
                      <div className={`flex items-center gap-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}
                        >
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                            {lang === "ar" ? item.product_name_ar : item.product_name_en}
                          </p>
                          <p className="text-xs" style={{ color: "#aaa" }}>
                            ${item.unit_price.toFixed(2)} {lang === "ar" ? "للقطعة" : "each"}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold" style={{ color: "#1a1a1a" }}>
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "2px solid #f0ece4", background: "#fdfaf3" }}>
                  <p className="font-bold" style={{ color: "#434343" }}>{t("total")}</p>
                  <p className="text-xl font-bold" style={{ color: "#C9A84C" }}>
                    ${order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <Link
                href="/orders"
                className={`inline-flex items-center gap-2 mt-8 text-sm transition-colors ${dir === "rtl" ? "flex-row-reverse" : ""}`}
                style={{ color: "#aaa" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#C9A84C"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#aaa"; }}
              >
                {dir === "rtl" ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                {t("orderHistory")}
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
