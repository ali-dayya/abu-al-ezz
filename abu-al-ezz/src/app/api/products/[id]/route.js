import { deleteProduct, getProduct, updateProduct } from "@/lib/db";
import { errorResponse, notFound, ok } from "@/lib/responses";

export async function GET(_request, { params }) {
  const product = await getProduct(params.id);

  if (!product) return notFound("Product not found");

  return ok(product);
}

export async function PUT(request, { params }) {
  try {
    const product = await updateProduct(params.id, await request.json());
    if (!product) return notFound("Product not found");
    return ok(product);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request, { params }) {
  try {
    if (!(await deleteProduct(params.id))) return notFound("Product not found");
    return ok({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
