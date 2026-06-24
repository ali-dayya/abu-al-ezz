import { getAllOrders, getProducts } from "@/lib/db";
import { badRequest } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function escapeCSV(val) {
  const str = String(val ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "orders";

  try {
    let csv = "";

    if (type === "orders") {
      const orders = await getAllOrders({ status: searchParams.get("status") || "" });
      csv = "Order ID,Date,Customer,Email,Phone,Status,Items,Total,Notes\n";
      for (const o of orders) {
        const items = o.items.map((i) => `${i.product_name_en} x${i.quantity}`).join("; ");
        csv += [
          o.order_id,
          o.order_date,
          escapeCSV(o.customer.name),
          escapeCSV(o.customer.email),
          escapeCSV(o.customer.phone),
          o.status,
          escapeCSV(items),
          o.total_amount.toFixed(2),
          escapeCSV(o.notes),
        ].join(",") + "\n";
      }
    } else if (type === "products") {
      const products = await getProducts();
      csv = "Product ID,Name (EN),Name (AR),Price,Stock,Status,Category ID,Image URL\n";
      for (const p of products) {
        csv += [
          p.product_id,
          escapeCSV(p.product_name_en),
          escapeCSV(p.product_name_ar),
          p.price.toFixed(2),
          p.stock_quantity,
          p.availability_status,
          p.category_id,
          escapeCSV(p.image_url),
        ].join(",") + "\n";
      }
    } else {
      return badRequest("Invalid type. Use: orders, products");
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${type}_export_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
