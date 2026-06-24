import { toggleWishlist } from "@/lib/db";
import { errorResponse, ok } from "@/lib/responses";

export const dynamic = "force-dynamic";

export async function POST(_request, { params }) {
  try {
    return ok(await toggleWishlist(params.productId));
  } catch (err) {
    return errorResponse(err);
  }
}
