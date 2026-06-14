import { getDashboard } from "@/lib/db";
import { forbidden, ok } from "@/lib/responses";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return forbidden("Admin access required");

  const { data: admin } = await supabase.from("admins").select("id").eq("id", user.id).maybeSingle();
  if (!admin) return forbidden("Admin access required");

  return ok(await getDashboard());
}
