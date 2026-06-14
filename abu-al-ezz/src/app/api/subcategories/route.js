import { createSubcategory, validateRequired } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";

export async function POST(request) {
  const body = await request.json();
  const error = validateRequired(body, ["subcategory_name_en", "category_id"]);

  if (error) return badRequest(error);

  try {
    return ok(await createSubcategory(body), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
