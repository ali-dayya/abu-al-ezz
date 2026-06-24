import { getDeliveryZones, getAllDeliveryZones, upsertDeliveryZone } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  try {
    return ok(all ? await getAllDeliveryZones() : await getDeliveryZones());
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  try {
    return ok(await upsertDeliveryZone(body), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
