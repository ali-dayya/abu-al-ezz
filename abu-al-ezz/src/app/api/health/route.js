import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ok, errorResponse } from "@/lib/responses";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("store_info").select("store_id").limit(1);
    if (error) throw error;
    return ok({ status: "ok", timestamp: new Date().toISOString() });
  } catch {
    return errorResponse({ status: 503, message: "Database unreachable" });
  }
}
