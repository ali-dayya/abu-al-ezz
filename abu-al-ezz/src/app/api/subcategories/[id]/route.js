import { deleteSubcategory, updateSubcategory } from "@/lib/db";
import { errorResponse, notFound, ok } from "@/lib/responses";

export async function PUT(request, { params }) {
  try {
    const subcategory = await updateSubcategory(params.id, await request.json());
    if (!subcategory) return notFound("Subcategory not found");
    return ok(subcategory);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request, { params }) {
  try {
    if (!(await deleteSubcategory(params.id))) return notFound("Subcategory not found");
    return ok({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
