import { deleteSubcategory, updateSubcategory } from "@/lib/db";
import { badRequest, errorResponse, notFound, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  try {
    const subcategory = await updateSubcategory(params.id, body);
    if (!subcategory) return notFound("Subcategory not found");
    return ok(subcategory);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request, { params }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    if (!(await deleteSubcategory(params.id))) return notFound("Subcategory not found");
    return ok({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
