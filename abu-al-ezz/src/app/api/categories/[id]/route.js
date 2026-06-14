import { deleteCategory, updateCategory } from "@/lib/db";
import { errorResponse, notFound, ok } from "@/lib/responses";

export async function PUT(request, { params }) {
  try {
    const category = await updateCategory(params.id, await request.json());
    if (!category) return notFound("Category not found");
    return ok(category);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request, { params }) {
  try {
    if (!(await deleteCategory(params.id))) return notFound("Category not found");
    return ok({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
