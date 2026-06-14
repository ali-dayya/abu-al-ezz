export default function StatusBadge({ status }) {
  const styles = {
    pending:     { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A", label: "Pending" },
    confirmed:   { bg: "#DBEAFE", color: "#1E40AF", border: "#BFDBFE", label: "Confirmed" },
    completed:   { bg: "#D1FAE5", color: "#065F46", border: "#A7F3D0", label: "Completed" },
    cancelled:   { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA", label: "Cancelled" },
    available:   { bg: "#D1FAE5", color: "#065F46", border: "#A7F3D0", label: "Available" },
    out_of_stock:{ bg: "#F3F4F6", color: "#6B7280", border: "#E5E7EB", label: "Out of Stock" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
        style={{ background: s.color }}
      />
      {s.label}
    </span>
  );
}
