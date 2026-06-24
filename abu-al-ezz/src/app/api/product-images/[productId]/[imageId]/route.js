import { deleteProductImage } from "@/lib/db";
import { errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(_request, { params }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    await deleteProductImage(params.imageId);
    return ok({ deleted: true });
  } catch (err) {
    return errorResponse(err);
  }
}
