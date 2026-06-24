"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
        style={{
          border: "1px solid #f0ece4",
          color: page <= 1 ? "#ddd" : "#434343",
          cursor: page <= 1 ? "not-allowed" : "pointer",
        }}
      >
        <ChevronLeft size={16} />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 rounded-xl text-sm font-medium transition-all"
            style={{ border: "1px solid #f0ece4", color: "#434343" }}
          >
            1
          </button>
          {start > 2 && <span className="text-xs px-1" style={{ color: "#aaa" }}>...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="w-9 h-9 rounded-xl text-sm font-medium transition-all"
          style={
            p === page
              ? { background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0d0d0d", border: "none" }
              : { border: "1px solid #f0ece4", color: "#434343" }
          }
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-xs px-1" style={{ color: "#aaa" }}>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 rounded-xl text-sm font-medium transition-all"
            style={{ border: "1px solid #f0ece4", color: "#434343" }}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
        style={{
          border: "1px solid #f0ece4",
          color: page >= totalPages ? "#ddd" : "#434343",
          cursor: page >= totalPages ? "not-allowed" : "pointer",
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
