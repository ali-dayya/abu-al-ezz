import { getAuditLog } from "@/lib/db";
import { errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10) || 50));
  const table_name = searchParams.get("table") || "";

  try {
    return ok(await getAuditLog({ page, limit, table_name }));
  } catch (err) {
    return errorResponse(err);
  }
}
