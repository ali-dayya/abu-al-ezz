import { validateCoupon } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  if (!body.code) return badRequest("Coupon code is required");
  if (!body.order_amount && body.order_amount !== 0) return badRequest("Order amount is required");

  try {
    return ok(await validateCoupon(body.code, body.order_amount));
  } catch (err) {
    return errorResponse(err);
  }
}
