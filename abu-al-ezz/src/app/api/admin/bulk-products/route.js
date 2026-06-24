import { bulkDeleteProducts, bulkUpdateProductStock, bulkUpdateProductPrice } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  const { action } = body;

  try {
    if (action === "delete") {
      if (!Array.isArray(body.ids) || body.ids.length === 0) return badRequest("ids array is required");
      await bulkDeleteProducts(body.ids);
      return ok({ deleted: body.ids.length });
    }

    if (action === "update_stock") {
      if (!Array.isArray(body.updates) || body.updates.length === 0) return badRequest("updates array is required");
      await bulkUpdateProductStock(body.updates);
      return ok({ updated: body.updates.length });
    }

    if (action === "update_price") {
      if (!Array.isArray(body.updates) || body.updates.length === 0) return badRequest("updates array is required");
      await bulkUpdateProductPrice(body.updates);
      return ok({ updated: body.updates.length });
    }

    return badRequest("Invalid action. Use: delete, update_stock, update_price");
  } catch (err) {
    return errorResponse(err);
  }
}
