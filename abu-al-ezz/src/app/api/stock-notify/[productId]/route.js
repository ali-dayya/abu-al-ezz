import { subscribeStockNotification, unsubscribeStockNotification } from "@/lib/db";
import { errorResponse, ok } from "@/lib/responses";

export const dynamic = "force-dynamic";

export async function POST(_request, { params }) {
  try {
    return ok(await subscribeStockNotification(params.productId));
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await unsubscribeStockNotification(params.productId);
    return ok({ unsubscribed: true });
  } catch (err) {
    return errorResponse(err);
  }
}
