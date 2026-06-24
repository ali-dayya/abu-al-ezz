import { getStoreInfo, updateStoreInfo } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getStoreInfo());
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  if (!body.store_name_en) return badRequest("Store name (English) is required");

  try {
    return ok(await updateStoreInfo(body));
  } catch (err) {
    return errorResponse(err);
  }
}
