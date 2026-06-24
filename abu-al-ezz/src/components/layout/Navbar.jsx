"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown, Package, Heart } from "lucide-react";
import GlobalSearch from "@/components/ui/GlobalSearch";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { t, lang, toggleLanguage, dir } = useLanguage();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: t("home") },
    { href: "/categories", label: t("categories") },
    { href: "/products", label: t("products") },
    { href: "/contact", label: t("contact") },
    { href: "/about", label: t("about") },
  ];

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        {lang === "ar" ? "تخطى إلى المحتوى" : "Skip to content"}
      </a>
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(13,13,13,0.97)"
          : "#0d0d0d",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      {/* Gold top accent line */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, #C9A84C, #E8C97A, #C9A84C)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div
              className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
              style={{ border: "2px solid rgba(201,168,76,0.5)" }}
            >
              <Image src="/logo.png" alt="Abu Al-Ezz" fill sizes="40px" className="object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <div
                className="absolute inset-0 flex items-center justify-center font-display font-bold text-sm"
                style={{ background: "#1a1a1a", color: "#C9A84C" }}
              >
                AE
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-semibold text-sm leading-tight tracking-wide"
                style={{ color: "#C9A84C" }}>
                {lang === "ar" ? "مؤسسة أبو العز" : "Abu Al-Ezz"}
              </p>
              <p className="text-xs leading-tight" style={{ color: "#666" }}>
                {lang === "ar" ? "و أولاده" : "Institution"}
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{ color: "#a4a4a4" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#C9A84C"; e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#a4a4a4"; e.currentTarget.style.background = "transparent"; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">

            {/* Global search */}
            <GlobalSearch />

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200"
              style={{
                color: "#C9A84C",
                border: "1.5px solid rgba(201,168,76,0.35)",
                background: "transparent",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; e.currentTarget.style.borderColor = "#C9A84C"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; }}
            >
              {lang === "en" ? "ع" : "EN"}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={cartCount > 0 ? `${t("cart")} (${cartCount})` : t("cart")}
              className="relative p-2.5 rounded-lg transition-all duration-200"
              style={{ color: "#a4a4a4" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#C9A84C"; e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#a4a4a4"; e.currentTarget.style.background = "transparent"; }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: "#C9A84C", color: "#0d0d0d" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label={t("myOrders")}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-1.5 p-1.5 rounded-lg transition-all"
                  style={{ color: "#a4a4a4" }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)" }}
                  >
                    <User size={13} style={{ color: "#C9A84C" }} />
                  </div>
                  <ChevronDown size={12} />
                </button>
                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-44 rounded-2xl overflow-hidden animate-scale-in"
                    style={{ background: "#141414", border: "1px solid rgba(201,168,76,0.2)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}
                  >
                    <Link href="/profile"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
                      style={{ color: "#c8c8c8" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; e.currentTarget.style.color = "#C9A84C"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c8c8c8"; }}
                    >
                      <User size={14} />
                      {lang === "ar" ? "الملف الشخصي" : "My Profile"}
                    </Link>
                    <Link href="/orders"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
                      style={{ color: "#c8c8c8" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; e.currentTarget.style.color = "#C9A84C"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c8c8c8"; }}
                    >
                      <Package size={14} />
                      {t("myOrders")}
                    </Link>
                    <Link href="/wishlist"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
                      style={{ color: "#c8c8c8" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.08)"; e.currentTarget.style.color = "#C9A84C"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c8c8c8"; }}
                    >
                      <Heart size={14} />
                      {lang === "ar" ? "المفضلة" : "Wishlist"}
                    </Link>
                    <button
                      role="menuitem"
                      onClick={async () => { await logout(); setUserMenuOpen(false); router.push("/"); router.refresh(); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors"
                      style={{ color: "#f87171" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <LogOut size={14} />
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
                  color: "#0d0d0d",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,168,76,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
              >
                <User size={13} />
                {t("login")}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: "#a4a4a4" }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden py-3 px-4 space-y-1 animate-fade-in"
          style={{ borderTop: "1px solid rgba(201,168,76,0.15)", background: "#0d0d0d" }}
        >
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
              style={{ color: "#a4a4a4" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#C9A84C"; e.currentTarget.style.background = "rgba(201,168,76,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#a4a4a4"; e.currentTarget.style.background = "transparent"; }}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="pt-2 flex gap-2">
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d" }}>
                {t("login")}
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium"
                style={{ border: "1.5px solid rgba(201,168,76,0.3)", color: "#C9A84C" }}>
                {t("register")}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
    </>
  );
}
