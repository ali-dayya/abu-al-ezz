import { createCategory, getCategoriesWithSubcategories, validateRequired } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";

export const dynamic = "force-dynamic";

export async function GET() {
  return ok(await getCategoriesWithSubcategories());
}

export async function POST(request) {
  const body = await request.json();
  const error = validateRequired(body, ["category_name_en"]);

  if (error) return badRequest(error);

  try {
    return ok(await createCategory(body), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
