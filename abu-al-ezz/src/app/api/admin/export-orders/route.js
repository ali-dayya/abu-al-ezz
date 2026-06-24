import { getAllOrders } from "@/lib/db";
import { errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";

  try {
    const orders = await getAllOrders({ status });
    return ok(orders);
  } catch (err) {
    return errorResponse(err);
  }
}
