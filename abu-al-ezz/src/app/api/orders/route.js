import { createOrder, getOrders } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";

export const dynamic = "force-dynamic";

export async function GET() {
  return ok(await getOrders());
}

export async function POST(request) {
  const body = await request.json();

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return badRequest("Order must include at least one item");
  }

  try {
    return ok(await createOrder(body), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
