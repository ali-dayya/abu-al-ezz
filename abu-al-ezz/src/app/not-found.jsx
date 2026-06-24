import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-center" style={{ background: "#FFFDF5" }}>
      <div>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "#fef3c7", border: "2px solid #fde68a" }}
        >
          <SearchX size={36} style={{ color: "#92400e" }} />
        </div>
        <h1 className="font-display text-6xl font-bold mb-2" style={{ color: "#1a1a1a" }}>404</h1>
        <span className="gold-divider" />
        <p className="text-lg font-semibold mt-5 mb-1" style={{ color: "#1a1a1a" }}>Page not found</p>
        <p className="text-base font-semibold mb-3" style={{ color: "#1a1a1a" }}>الصفحة غير موجودة</p>
        <p className="text-sm mb-8" style={{ color: "#aaa" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-gold inline-flex">
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
