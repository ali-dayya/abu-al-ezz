"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/ui/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ShoppingBag, ExternalLink } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import ErrorState from "@/components/ui/ErrorState";

function OrderRowSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-5">
          <div className="space-y-1.5">
            <div className="skeleton h-2.5 w-14" />
            <div className="skeleton h-4 w-10" />
          </div>
          <div className="hidden sm:block space-y-1.5">
            <div className="skeleton h-2.5 w-10" />
            <div className="skeleton h-4 w-24" />
          </div>
          <div className="hidden sm:block space-y-1.5">
            <div className="skeleton h-2.5 w-12" />
            <div className="skeleton h-4 w-16" />
          </div>
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="skeleton h-5 w-5 rounded" />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { t, lang, dir } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const loadData = () => {
    setLoading(true);
    setError(false);
    apiRequest("/api/orders?limit=100").then(r => setOrders(r.data)).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight:"100vh", background:"#FFFDF5" }}>
        <section style={{ background:"#0d0d0d", padding:"60px 0 52px" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-display text-5xl font-bold" style={{ color:"#fff" }}>{t("orderHistory")}</h1>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <OrderRowSkeleton key={i} />)}
            </div>
          ) : error ? (
            <ErrorState onRetry={loadData} />
          ) : orders.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag size={56} className="mx-auto mb-4" style={{ color:"#e5dfc8" }} />
              <p className="text-sm" style={{ color:"#aaa" }}>{t("noOrders")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div
                  key={order.order_id}
                  className="rounded-2xl overflow-hidden"
                  style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  {/* Order header — clickable */}
                  <button
                    className={`w-full flex items-center justify-between p-5 cursor-pointer transition-colors text-left ${dir==="rtl"?"flex-row-reverse text-right":""}`}
                    onClick={() => setExpanded(expanded === order.order_id ? null : order.order_id)}
                    aria-expanded={expanded === order.order_id}
                    aria-controls={`order-${order.order_id}-details`}
                    onMouseEnter={e=>e.currentTarget.style.background="#fdfaf3"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <div className={`flex items-center gap-5 flex-wrap ${dir==="rtl"?"flex-row-reverse":""}`}>
                      <div>
                        <p className="text-xs font-medium mb-0.5" style={{ color:"#aaa" }}>{t("orderId")}</p>
                        <Link href={`/orders/${order.order_id}`} className="font-bold flex items-center gap-1 transition-colors" style={{ color:"#1a1a1a" }}
                          onMouseEnter={e => e.currentTarget.style.color="#C9A84C"}
                          onMouseLeave={e => e.currentTarget.style.color="#1a1a1a"}
                          onClick={e => e.stopPropagation()}>
                          #{order.order_id} <ExternalLink size={12} />
                        </Link>
                      </div>
                      <div style={{ width:"1px", height:"32px", background:"#f0ece4" }} className="hidden sm:block" />
                      <div>
                        <p className="text-xs font-medium mb-0.5" style={{ color:"#aaa" }}>{t("orderDate")}</p>
                        <p className="text-sm font-medium" style={{ color:"#434343" }}>
                          {new Date(order.order_date).toLocaleDateString(lang === "ar" ? "ar" : "en-US")}
                        </p>
                      </div>
                      <div style={{ width:"1px", height:"32px", background:"#f0ece4" }} className="hidden sm:block" />
                      <div>
                        <p className="text-xs font-medium mb-0.5" style={{ color:"#aaa" }}>{t("orderTotal")}</p>
                        <p className="font-bold" style={{ color:"#C9A84C" }}>${order.total_amount.toFixed(2)}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div style={{ color:"#aaa" }} aria-hidden="true">
                      {expanded === order.order_id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {expanded === order.order_id && (
                    <div id={`order-${order.order_id}-details`} style={{ borderTop:"1px solid #f0ece4", background:"#fdfaf3", padding:"20px" }}>
                      {order.notes && (
                        <div className="mb-4 px-4 py-3 rounded-xl text-sm"
                          style={{ background:"#fffbeb", border:"1px solid #fde68a", color:"#92400e" }}>
                          <span className="font-semibold">{t("orderNotes")}: </span>{order.notes}
                        </div>
                      )}
                      <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:"#C9A84C" }}>
                        {t("orderItems")}
                      </p>
                      <div className="space-y-2.5">
                        {order.items.map(item => (
                          <div
                            key={item.product_id}
                            className={`flex items-center justify-between py-2.5 ${dir==="rtl"?"flex-row-reverse":""}`}
                            style={{ borderBottom:"1px solid #f0ece4" }}
                          >
                            <div className={`flex items-center gap-3 ${dir==="rtl"?"flex-row-reverse":""}`}>
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                                style={{ background:"rgba(201,168,76,0.1)", color:"#C9A84C" }}
                              >
                                {item.quantity}×
                              </div>
                              <span className="text-sm" style={{ color:"#434343" }}>
                                {lang === "ar" ? item.product_name_ar : item.product_name_en}
                              </span>
                            </div>
                            <span className="text-sm font-bold" style={{ color:"#1a1a1a" }}>
                              ${item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
