"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingCart, User, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t, lang } = useLanguage();
  const { cartCount } = useCart();
  const { user } = useAuth();

  if (pathname.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/categories", label: t("categories"), icon: Grid3X3 },
    { href: "/cart", label: t("cart"), icon: ShoppingCart, badge: cartCount || null },
    { href: "/wishlist", label: lang === "ar" ? "المفضلة" : "Wishlist", icon: Heart },
    { href: user ? "/profile" : "/login", label: user ? (lang === "ar" ? "حسابي" : "Account") : t("login"), icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "rgba(13,13,13,0.97)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(201,168,76,0.15)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 relative px-3 py-1"
              style={{ color: isActive ? "#C9A84C" : "#666" }}
            >
              <div className="relative">
                <item.icon size={20} />
                {item.badge && (
                  <span
                    className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "#C9A84C", color: "#0d0d0d" }}
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full" style={{ background: "#C9A84C" }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
