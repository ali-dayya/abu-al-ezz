"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, CheckCircle, ArrowRight, Trash2 } from "lucide-react";
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
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background:"#FFFDF5" }}>
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
      <main style={{ minHeight:"100vh", background:"#FFFDF5" }}>
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
                  <label className="text-xs font-bold uppercase tracking-widest block mb-3" style={{ color:"#C9A84C" }}>
                    {t("notes")}
                  </label>
                  <textarea
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

                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold" style={{ color:"#1a1a1a" }}>{t("total")}</span>
                  <span className="text-2xl font-bold" style={{ color:"#C9A84C" }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl text-sm"
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
