export default function DashboardCard({ title, value, icon: Icon, color }) {
  const colorMap = {
    gold:   { bg:"rgba(201,168,76,0.1)",  icon:"#C9A84C", border:"rgba(201,168,76,0.2)" },
    blue:   { bg:"rgba(59,130,246,0.1)",  icon:"#3b82f6", border:"rgba(59,130,246,0.2)" },
    red:    { bg:"rgba(239,68,68,0.1)",   icon:"#ef4444", border:"rgba(239,68,68,0.2)" },
    purple: { bg:"rgba(168,85,247,0.1)",  icon:"#a855f7", border:"rgba(168,85,247,0.2)" },
    green:  { bg:"rgba(34,197,94,0.1)",   icon:"#22c55e", border:"rgba(34,197,94,0.2)" },
  };
  const c = colorMap[color] || colorMap.gold;

  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200"
      style={{ background:"#fff", border:`1px solid ${c.border}`, boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,0.08)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.04)"}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background:c.bg }}
      >
        <Icon size={20} style={{ color:c.icon }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color:"#1a1a1a" }}>{value}</p>
        <p className="text-xs font-medium mt-0.5" style={{ color:"#818181" }}>{title}</p>
      </div>
    </div>
  );
}
