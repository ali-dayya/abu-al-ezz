import { getMyStockNotifications } from "@/lib/db";
import { errorResponse, ok } from "@/lib/responses";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const deny = await requireAuth();
  if (deny) return deny;

  try {
    return ok(await getMyStockNotifications());
  } catch (err) {
    return errorResponse(err);
  }
}
