import { getProductImages, addProductImage, reorderProductImages } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    return ok(await getProductImages(params.productId));
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request, { params }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  if (body.reorder && Array.isArray(body.imageIds)) {
    try {
      await reorderProductImages(params.productId, body.imageIds);
      return ok({ reordered: true });
    } catch (err) {
      return errorResponse(err);
    }
  }

  if (!body.image_url) return badRequest("image_url is required");

  try {
    return ok(await addProductImage(params.productId, body.image_url, body.display_order || 0), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
