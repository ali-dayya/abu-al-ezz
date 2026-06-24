import { createOrder, createOrderCheckout, getOrders, getProductsByIds } from "@/lib/db";
import { badRequest, errorResponse, ok, tooManyRequests } from "@/lib/responses";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendOrderNotification, sendOrderConfirmation, sendLowStockAlert } from "@/lib/email";

const LOW_STOCK_THRESHOLD = 5;

export const dynamic = "force-dynamic";

export async function GET(request) {
  const deny = await requireAuth();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10) || 25));
  const status = searchParams.get("status") || "";

  try {
    return ok(await getOrders({ page, limit, status }));
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`order:${ip}`, { limit: 5, windowMs: 60_000 })) {
    return tooManyRequests("Too many order requests. Please wait a minute and try again.");
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return badRequest("Order must include at least one item");
  }

  try {
    const hasCheckoutAdjustments = body.coupon_code || body.delivery_zone_id;
    const finalOrder = hasCheckoutAdjustments
      ? await createOrderCheckout(body)
      : await createOrder(body);

    sendOrderNotification(finalOrder);
    sendOrderConfirmation(finalOrder);
    const productIds = finalOrder.items.map(i => i.product_id);
    getProductsByIds(productIds).then(products => {
      const low = products.filter(p => p.stock_quantity <= LOW_STOCK_THRESHOLD && p.stock_quantity >= 0);
      if (low.length > 0) sendLowStockAlert(low);
    }).catch(() => {});
    return ok(finalOrder, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
