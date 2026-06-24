import { updateCoupon, deleteCoupon } from "@/lib/db";
import { badRequest, errorResponse, notFound, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  try {
    return ok(await updateCoupon(params.id, body));
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request, { params }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    await deleteCoupon(params.id);
    return ok({ deleted: true });
  } catch (err) {
    return errorResponse(err);
  }
}
