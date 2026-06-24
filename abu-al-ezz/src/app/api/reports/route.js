import { getRevenueByCategory, getTopSellingProducts, getOrdersPerDay } from "@/lib/db";
import { errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const days = Math.min(365, Math.max(7, parseInt(searchParams.get("days") || "30", 10) || 30));

  try {
    const [revenueByCategory, topProducts, ordersPerDay] = await Promise.all([
      getRevenueByCategory(),
      getTopSellingProducts(10),
      getOrdersPerDay(days),
    ]);

    return ok({ revenueByCategory, topProducts, ordersPerDay });
  } catch (err) {
    return errorResponse(err);
  }
}
