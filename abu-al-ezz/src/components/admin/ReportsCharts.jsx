"use client";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#C9A84C", "#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#f59e0b", "#06b6d4", "#ec4899"];

export default function ReportsCharts({ data, lang }) {
  const ordersPerDay = [...(data?.ordersPerDay || [])].reverse();
  const revenueByCategory = data?.revenueByCategory || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily revenue line chart */}
      <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
        <h3 className="font-display font-bold mb-4" style={{ color: "#1a1a1a" }}>
          {lang === "ar" ? "الإيرادات اليومية" : "Daily Revenue"}
        </h3>
        {ordersPerDay.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "#aaa" }}>
            {lang === "ar" ? "لا توجد بيانات" : "No data available"}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ordersPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
              <XAxis
                dataKey="order_date"
                tickFormatter={(d) => new Date(d).toLocaleDateString(lang === "ar" ? "ar" : "en-US", { month: "short", day: "numeric" })}
                tick={{ fontSize: 11, fill: "#aaa" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#aaa" }} />
              <Tooltip
                formatter={(value) => [`$${Number(value).toFixed(2)}`, lang === "ar" ? "الإيرادات" : "Revenue"]}
                labelFormatter={(d) => new Date(d).toLocaleDateString(lang === "ar" ? "ar" : "en-US")}
                contentStyle={{ borderRadius: "12px", border: "1px solid #f0ece4", fontSize: "13px" }}
              />
              <Line type="monotone" dataKey="daily_revenue" stroke="#C9A84C" strokeWidth={2} dot={{ r: 3, fill: "#C9A84C" }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Orders per day bar chart */}
      <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
        <h3 className="font-display font-bold mb-4" style={{ color: "#1a1a1a" }}>
          {lang === "ar" ? "الطلبات اليومية" : "Daily Orders"}
        </h3>
        {ordersPerDay.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "#aaa" }}>
            {lang === "ar" ? "لا توجد بيانات" : "No data available"}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ordersPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
              <XAxis
                dataKey="order_date"
                tickFormatter={(d) => new Date(d).toLocaleDateString(lang === "ar" ? "ar" : "en-US", { month: "short", day: "numeric" })}
                tick={{ fontSize: 11, fill: "#aaa" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#aaa" }} allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, lang === "ar" ? "الطلبات" : "Orders"]}
                labelFormatter={(d) => new Date(d).toLocaleDateString(lang === "ar" ? "ar" : "en-US")}
                contentStyle={{ borderRadius: "12px", border: "1px solid #f0ece4", fontSize: "13px" }}
              />
              <Bar dataKey="order_count" fill="#C9A84C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Revenue by category pie chart */}
      <div className="rounded-2xl p-5 lg:col-span-2" style={{ background: "#fff", border: "1px solid #f0ece4" }}>
        <h3 className="font-display font-bold mb-4" style={{ color: "#1a1a1a" }}>
          {lang === "ar" ? "توزيع الإيرادات حسب التصنيف" : "Revenue Distribution by Category"}
        </h3>
        {revenueByCategory.filter(c => c.total_revenue > 0).length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "#aaa" }}>
            {lang === "ar" ? "لا توجد بيانات" : "No data available"}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={revenueByCategory.filter(c => c.total_revenue > 0)}
                dataKey="total_revenue"
                nameKey={lang === "ar" ? "category_name_ar" : "category_name_en"}
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: "#ccc" }}
              >
                {revenueByCategory.filter(c => c.total_revenue > 0).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${Number(value).toFixed(2)}`}
                contentStyle={{ borderRadius: "12px", border: "1px solid #f0ece4", fontSize: "13px" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
