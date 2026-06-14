import { getStoreInfo, updateStoreInfo } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";

export const dynamic = "force-dynamic";

export async function GET() {
  return ok(await getStoreInfo());
}

export async function PUT(request) {
  const body = await request.json();

  if (!body.store_name_en) {
    return badRequest("Store name is required");
  }

  try {
    return ok(await updateStoreInfo(body));
  } catch (err) {
    return errorResponse(err);
  }
}
