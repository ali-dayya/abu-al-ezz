import { deleteProduct, getProduct, updateProduct } from "@/lib/db";
import { badRequest, errorResponse, notFound, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const product = await getProduct(params.id);
    if (!product) return notFound("Product not found");
    return ok(product);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(request, { params }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  try {
    const product = await updateProduct(params.id, body);
    if (!product) return notFound("Product not found");
    return ok(product);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request, { params }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    if (!(await deleteProduct(params.id))) return notFound("Product not found");
    return ok({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
