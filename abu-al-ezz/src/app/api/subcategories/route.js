import { createSubcategory, validateRequired } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  const error = validateRequired(body, ["subcategory_name_en", "category_id"]);
  if (error) return badRequest(error);

  try {
    return ok(await createSubcategory(body), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
