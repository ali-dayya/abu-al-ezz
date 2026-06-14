import { createProduct, getProducts, validateRequired } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";

export const dynamic = "force-dynamic";

export async function GET() {
  return ok(await getProducts());
}

export async function POST(request) {
  const body = await request.json();
  const error = validateRequired(body, ["product_name_en", "price", "subcategory_id"]);

  if (error) return badRequest(error);

  try {
    return ok(await createProduct(body), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
