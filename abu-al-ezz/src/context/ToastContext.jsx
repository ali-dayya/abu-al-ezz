"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

const ToastContext = createContext();

const ICONS = {
  success: { Icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)" },
  error: { Icon: AlertTriangle, color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" },
  info: { Icon: Info, color: "#C9A84C", bg: "rgba(201,168,76,0.1)", border: "rgba(201,168,76,0.3)" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-20 right-4 z-[200] space-y-2 pointer-events-none" style={{ maxWidth: "360px" }}>
        {toasts.map((toast) => {
          const style = ICONS[toast.type] || ICONS.info;
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm animate-fade-in"
              style={{
                background: "#fff",
                border: `1px solid ${style.border}`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              <style.Icon size={18} style={{ color: style.color, flexShrink: 0 }} />
              <span className="flex-1" style={{ color: "#1a1a1a" }}>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0"
                style={{ color: "#aaa" }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
