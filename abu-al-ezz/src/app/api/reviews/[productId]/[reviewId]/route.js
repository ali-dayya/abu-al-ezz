import { deleteReview } from "@/lib/db";
import { errorResponse, ok } from "@/lib/responses";

export const dynamic = "force-dynamic";

export async function DELETE(_request, { params }) {
  try {
    await deleteReview(params.reviewId);
    return ok({ deleted: true });
  } catch (err) {
    return errorResponse(err);
  }
}
