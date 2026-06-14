import { updateOrder } from "@/lib/db";
import { errorResponse, notFound, ok } from "@/lib/responses";

export async function PATCH(request, { params }) {
  try {
    const order = await updateOrder(params.id, await request.json());
    if (!order) return notFound("Order not found");
    return ok(order);
  } catch (err) {
    return errorResponse(err);
  }
}
