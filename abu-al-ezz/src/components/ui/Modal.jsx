"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxW = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size] || "max-w-lg";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop`}
      onClick={onClose}
    >
      <div
        className={`w-full ${maxW} rounded-3xl overflow-hidden animate-scale-in`}
        style={{ background:"#fff", boxShadow:"0 24px 80px rgba(0,0,0,0.2)", maxHeight:"90vh", display:"flex", flexDirection:"column" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ background:"#0d0d0d", borderBottom:"1px solid rgba(201,168,76,0.15)" }}
        >
          <h3 className="font-display font-semibold" style={{ color:"#C9A84C" }}>{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color:"#515151" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.1)"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#515151"; }}
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
