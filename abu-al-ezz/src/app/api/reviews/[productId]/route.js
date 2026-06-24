import { getProductReviews, createReview } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    return ok(await getProductReviews(params.productId));
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request, { params }) {
  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  try {
    return ok(await createReview(params.productId, body), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
