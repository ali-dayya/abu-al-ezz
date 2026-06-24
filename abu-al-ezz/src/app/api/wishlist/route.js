import { getWishlist, getWishlistIds } from "@/lib/db";
import { errorResponse, ok } from "@/lib/responses";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const deny = await requireAuth();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const idsOnly = searchParams.get("ids") === "true";

  try {
    return ok(idsOnly ? await getWishlistIds() : await getWishlist());
  } catch (err) {
    return errorResponse(err);
  }
}
