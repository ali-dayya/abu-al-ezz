"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 md:bottom-6 right-4 z-40 w-10 h-10 rounded-full flex items-center justify-center transition-all no-print"
      style={{
        background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
        color: "#0d0d0d",
        boxShadow: "0 4px 16px rgba(201,168,76,0.4)",
      }}
      aria-label="Back to top"
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      <ArrowUp size={18} />
    </button>
  );
}
