import { getOrderById, updateOrder } from "@/lib/db";
import { badRequest, errorResponse, notFound, ok } from "@/lib/responses";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { sendOrderStatusUpdate } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const deny = await requireAuth();
  if (deny) return deny;

  try {
    const order = await getOrderById(params.id);
    if (!order) return notFound("Order not found");
    return ok(order);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(request, { params }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  try {
    const order = await updateOrder(params.id, body);
    if (!order) return notFound("Order not found");
    sendOrderStatusUpdate(order);
    return ok(order);
  } catch (err) {
    return errorResponse(err);
  }
}
