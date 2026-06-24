"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, CheckCircle, ArrowRight, Trash2, Tag, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartItem from "@/components/ui/CartItem";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export default function CartPage() {
  const { t, lang, dir } = useLanguage();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart, orderSubmitted, setOrderSubmitted } = useCart();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    apiRequest("/api/delivery-zones").then(setZones).catch(() => {});
  }, []);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setCouponResult(null);
    try {
      const result = await apiRequest("/api/coupons/validate", {
        method: "POST",
        body: JSON.stringify({ code: couponCode, order_amount: cartTotal }),
      });
      setCouponResult(result);
    } catch (err) {
      setCouponError(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const deliveryFee = selectedZone ? zones.find((z) => z.zone_id === selectedZone)?.delivery_fee || 0 : 0;
  const discount = couponResult?.discount || 0;
  const finalTotal = Math.max(0, cartTotal - discount + deliveryFee);

  const handleSubmit = async () => {
    if (cartItems.length === 0 || !user) return;

    setSubmitting(true);
    setError("");
    try {
      await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          notes,
          items: cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.qty,
          })),
          coupon_code: couponResult?.code || "",
          delivery_zone_id: selectedZone || null,
        }),
      });
      setOrderSubmitted(true);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSubmitted) return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen flex items-center justify-center px-4" style={{ background:"#FFFDF5" }}>
        <div className="max-w-md w-full text-center">
          <div
            className="rounded-3xl p-12"
            style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 24px 60px rgba(0,0,0,0.08)" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background:"#d1fae5", border:"2px solid #a7f3d0" }}
            >
              <CheckCircle size={40} style={{ color:"#065f46" }} />
            </div>
            <div style={{ width:"48px", height:"2px", background:"linear-gradient(90deg,#C9A84C,#E8C97A)", margin:"0 auto 24px" }} />
            <h2 className="font-display text-2xl font-bold mb-3" style={{ color:"#1a1a1a" }}>
              {lang === "ar" ? "تم إرسال طلبك!" : "Order Submitted!"}
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color:"#818181" }}>{t("orderSuccess")}</p>
            <div className="flex flex-col gap-3">
              <Link href="/products" onClick={() => setOrderSubmitted(false)} className="btn-gold">
                {t("continueShopping")}
              </Link>
              <Link href="/orders"
                className="text-sm font-medium py-3 rounded-full transition-all"
                style={{ border:"1.5px solid rgba(201,168,76,0.35)", color:"#C9A84C" }}
              >
                {t("myOrders")}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main id="main-content" style={{ minHeight:"100vh", background:"#FFFDF5" }}>
        {/* Header */}
        <section style={{ background:"#0d0d0d", padding:"60px 0 52px" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-display text-5xl font-bold" style={{ color:"#fff" }}>{t("myCart")}</h1>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {cartItems.length === 0 ? (
            <div className="text-center py-28">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background:"#f9f7f2", border:"1px solid #f0ece4" }}
              >
                <ShoppingBag size={40} style={{ color:"#e5dfc8" }} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2" style={{ color:"#434343" }}>{t("emptyCart")}</h2>
              <p className="text-sm mb-8" style={{ color:"#aaa" }}>{t("emptyCartDesc")}</p>
              <Link href="/products" className="btn-gold inline-flex">
                {t("browseProducts")}
                <ArrowRight size={16} className={dir === "rtl" ? "rotate-180" : ""} />
              </Link>
            </div>
          ) : (
            <div className={`flex flex-col lg:flex-row gap-8 items-start ${dir==="rtl"?"lg:flex-row-reverse":""}`}>

              {/* Cart items */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold" style={{ color:"#1a1a1a" }}>
                    {cartItems.length} {lang === "ar" ? "منتج في سلتك" : "items in your cart"}
                  </h2>
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl transition-all"
                    style={{ color:"#ef4444", border:"1px solid #fecaca" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#fef2f2"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <Trash2 size={14} />
                    {lang === "ar" ? "مسح الكل" : "Clear all"}
                  </button>
                </div>

                {cartItems.map(item => (
                  <CartItem key={item.product_id} item={item} />
                ))}

                {/* Notes */}
                <div
                  className="mt-4 rounded-2xl p-5"
                  style={{ background:"#fff", border:"1px solid #f0ece4" }}
                >
                  <label htmlFor="order-notes" className="text-xs font-bold uppercase tracking-widest block mb-3" style={{ color:"#C9A84C" }}>
                    {t("notes")}
                  </label>
                  <textarea
                    id="order-notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    placeholder={lang === "ar" ? "ملاحظات خاصة للطلب..." : "Special notes for your order..."}
                    className="luxury-input resize-none"
                  />
                </div>
              </div>

              {/* Order summary */}
              <div
                className="lg:w-80 w-full rounded-3xl p-6 sticky top-24"
                style={{ background:"#fff", border:"1px solid #f0ece4", boxShadow:"0 8px 40px rgba(0,0,0,0.06)" }}
              >
                <h3 className="font-display font-bold text-lg mb-5" style={{ color:"#1a1a1a" }}>
                  {lang === "ar" ? "ملخص الطلب" : "Order Summary"}
                </h3>

                <div className="space-y-3 text-sm mb-5">
                  {cartItems.map(item => (
                    <div key={item.product_id} className="flex items-center justify-between">
                      <span style={{ color:"#818181" }}>
                        {lang === "ar" ? item.product_name_ar : item.product_name_en} × {item.qty}
                      </span>
                      <span className="font-semibold" style={{ color:"#1a1a1a" }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ height:"1px", background:"#f0ece4", margin:"16px 0" }} />

                {/* Coupon code */}
                <div className="mb-4">
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#C9A84C" }}>
                    <Tag size={12} className="inline mr-1" />
                    {lang === "ar" ? "كود الخصم" : "Coupon Code"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder={lang === "ar" ? "أدخل الكود" : "Enter code"}
                      className="luxury-input flex-1 text-sm"
                      disabled={!!couponResult}
                    />
                    {couponResult ? (
                      <button onClick={() => { setCouponResult(null); setCouponCode(""); }} className="px-3 py-2 rounded-xl text-xs font-semibold" style={{ color: "#ef4444", border: "1px solid #fecaca" }}>
                        {lang === "ar" ? "إزالة" : "Remove"}
                      </button>
                    ) : (
                      <button onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()} className="px-3 py-2 rounded-xl text-xs font-semibold"
                        style={{ background: "#0d0d0d", color: "#C9A84C", opacity: couponLoading ? 0.6 : 1 }}>
                        {couponLoading ? "..." : (lang === "ar" ? "تطبيق" : "Apply")}
                      </button>
                    )}
                  </div>
                  {couponError && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{couponError}</p>}
                  {couponResult && (
                    <p className="text-xs mt-1" style={{ color: "#22c55e" }}>
                      {couponResult.discount_type === "percentage" ? `${couponResult.discount_value}%` : `$${couponResult.discount_value.toFixed(2)}`} off! -${couponResult.discount.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Delivery zone */}
                {zones.length > 0 && (
                  <div className="mb-4">
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#C9A84C" }}>
                      <MapPin size={12} className="inline mr-1" />
                      {lang === "ar" ? "منطقة التوصيل" : "Delivery Zone"}
                    </label>
                    <select
                      value={selectedZone || ""}
                      onChange={(e) => setSelectedZone(e.target.value ? Number(e.target.value) : null)}
                      className="luxury-input w-full text-sm"
                    >
                      <option value="">{lang === "ar" ? "اختر المنطقة" : "Select zone"}</option>
                      {zones.map((z) => (
                        <option key={z.zone_id} value={z.zone_id}>
                          {lang === "ar" ? z.zone_name_ar : z.zone_name_en} — {z.delivery_fee > 0 ? `$${z.delivery_fee.toFixed(2)}` : (lang === "ar" ? "مجاني" : "Free")} ({z.estimated_days} {lang === "ar" ? "يوم" : "days"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span style={{ color: "#818181" }}>{t("subtotal")}</span>
                    <span style={{ color: "#1a1a1a" }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: "#22c55e" }}>{lang === "ar" ? "الخصم" : "Discount"}</span>
                      <span style={{ color: "#22c55e" }}>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: "#818181" }}>{lang === "ar" ? "التوصيل" : "Delivery"}</span>
                      <span style={{ color: "#1a1a1a" }}>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6 pt-3" style={{ borderTop: "2px solid #f0ece4" }}>
                  <span className="font-bold" style={{ color:"#1a1a1a" }}>{t("total")}</span>
                  <span className="text-2xl font-bold" style={{ color:"#C9A84C" }}>
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                {error && (
                  <div role="alert" aria-live="assertive" className="mb-4 px-4 py-3 rounded-xl text-sm"
                    style={{ background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca" }}>
                    {error}
                  </div>
                )}

                {user ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl font-bold text-sm transition-all"
                    style={{ background:"linear-gradient(135deg, #C9A84C, #E8C97A)", color:"#0d0d0d", opacity: submitting ? 0.7 : 1 }}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 30px rgba(201,168,76,0.4)"}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
                  >
                    {submitting ? (lang === "ar" ? "جارٍ الإرسال..." : "Submitting...") : t("placeOrder")}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="w-full block text-center py-4 rounded-2xl font-bold text-sm transition-all"
                    style={{ background:"linear-gradient(135deg, #C9A84C, #E8C97A)", color:"#0d0d0d" }}
                  >
                    {lang === "ar" ? "سجل الدخول لإتمام الطلب" : "Log in to place your order"}
                  </Link>
                )}

                <p className="text-xs text-center mt-4" style={{ color:"#aaa" }}>
                  {lang === "ar" ? "سيتم التواصل معك لتأكيد الطلب" : "We'll contact you to confirm your order"}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
