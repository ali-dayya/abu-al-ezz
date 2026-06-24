"use client";
import Link from "next/link";
import { AlertTriangle, Home, RotateCw } from "lucide-react";

export default function Error({ reset }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-center" style={{ background: "#FFFDF5" }}>
      <div>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "#fef2f2", border: "2px solid #fecaca" }}
        >
          <AlertTriangle size={36} style={{ color: "#ef4444" }} />
        </div>
        <h1 className="font-display text-3xl font-bold mb-1" style={{ color: "#1a1a1a" }}>Something went wrong</h1>
        <p className="text-2xl font-bold mb-3" style={{ color: "#1a1a1a", fontFamily: "'Noto Serif Arabic', serif" }}>حدث خطأ ما</p>
        <p className="text-sm mb-1" style={{ color: "#aaa" }}>
          Please try again, or head back to the homepage.
        </p>
        <p className="text-sm mb-8" style={{ color: "#aaa", fontFamily: "'Noto Serif Arabic', serif" }}>
          يرجى المحاولة مجدداً أو العودة إلى الصفحة الرئيسية.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => reset()} className="btn-gold">
            <RotateCw size={16} />
            Try Again / حاول مجدداً
          </button>
          <Link href="/" className="btn-outline-gold">
            <Home size={16} />
            Back to Home / الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
