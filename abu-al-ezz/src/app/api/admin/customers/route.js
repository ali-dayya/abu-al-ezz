import { getCustomers } from "@/lib/db";
import { errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    return ok(await getCustomers());
  } catch (err) {
    return errorResponse(err);
  }
}
