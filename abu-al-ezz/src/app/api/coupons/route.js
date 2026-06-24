import { getCoupons, createCoupon } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    return ok(await getCoupons());
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
    return ok(await createCoupon(body), { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
