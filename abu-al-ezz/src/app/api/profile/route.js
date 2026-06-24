import { getProfile, updateProfile, validateRequired } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const deny = await requireAuth();
  if (deny) return deny;

  try {
    return ok(await getProfile());
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(request) {
  const deny = await requireAuth();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  const error = validateRequired(body, ["full_name"]);
  if (error) return badRequest(error);

  try {
    return ok(await updateProfile(body));
  } catch (err) {
    return errorResponse(err);
  }
}
