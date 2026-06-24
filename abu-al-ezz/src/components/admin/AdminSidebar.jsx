"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tag, ClipboardList, Settings, LogOut, ChevronRight, Users, BarChart3, FileText, Ticket, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { t, lang } = useLanguage();

  const items = [
    { href: "/admin/dashboard",  label: t("dashboard"),        icon: LayoutDashboard },
    { href: "/admin/products",   label: t("manageProducts"),   icon: Package },
    { href: "/admin/categories", label: t("manageCategories"), icon: Tag },
    { href: "/admin/orders",     label: t("manageOrders"),     icon: ClipboardList },
    { href: "/admin/customers",  label: lang === "ar" ? "العملاء" : "Customers", icon: Users },
    { href: "/admin/coupons",        label: lang === "ar" ? "أكواد الخصم" : "Coupons", icon: Ticket },
    { href: "/admin/delivery-zones", label: lang === "ar" ? "مناطق التوصيل" : "Delivery Zones", icon: MapPin },
    { href: "/admin/reports",    label: lang === "ar" ? "التقارير" : "Reports",  icon: BarChart3 },
    { href: "/admin/audit-log",  label: lang === "ar" ? "سجل التدقيق" : "Audit Log", icon: FileText },
    { href: "/admin/store-info", label: t("storeSettings"),    icon: Settings },
  ];

  return (
    <aside
      className="w-64 min-h-screen flex flex-col flex-shrink-0"
      style={{ background:"linear-gradient(180deg, #0d0d0d 0%, #111 100%)", borderRight:"1px solid rgba(201,168,76,0.12)" }}
    >
      {/* Gold accent */}
      <div style={{ height:"2px", background:"linear-gradient(90deg, #C9A84C, #E8C97A, #C9A84C)" }} />

      {/* Logo */}
      <div className="px-5 py-6" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          <div
            className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{ border:"1.5px solid rgba(201,168,76,0.4)" }}
          >
            <Image src="/logo.png" alt="Logo" fill className="object-cover"
              onError={e=>e.currentTarget.style.display="none"} />
            <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-sm"
              style={{ background:"#1a1a1a", color:"#C9A84C" }}>AE</div>
          </div>
          <div>
            <p className="font-display font-semibold text-sm" style={{ color:"#C9A84C" }}>Abu Al-Ezz</p>
            <p className="text-xs" style={{ color:"#434343" }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {items.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group"
              style={isActive
                ? { background:"rgba(201,168,76,0.12)", color:"#C9A84C", border:"1px solid rgba(201,168,76,0.2)" }
                : { color:"#515151", border:"1px solid transparent" }
              }
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="#818181"; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#515151"; }}}
            >
              <item.icon size={16} style={{ color: isActive ? "#C9A84C" : "#434343", flexShrink:0 }} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={12} style={{ color:"#C9A84C" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <button
          onClick={async () => { await logout(); router.push("/admin-login"); router.refresh(); }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ color:"#ef4444" }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.08)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
        >
          <LogOut size={16} />
          <span>{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
}
