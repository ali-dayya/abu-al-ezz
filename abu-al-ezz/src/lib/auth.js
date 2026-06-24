import { getSupabaseServerClient } from "@/lib/supabase/server";
import { forbidden, unauthorized } from "@/lib/responses";

/**
 * Returns a 401/403 Response if the request is not from an authenticated admin,
 * or null if the caller may proceed.
 *
 * Usage:
 *   const deny = await requireAdmin();
 *   if (deny) return deny;
 */
export async function requireAdmin() {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorized("Login required");
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!admin) return forbidden("Admin access required");
  return null;
}

/**
 * Returns a 401 Response if the request is not authenticated, or null if ok.
 */
export async function requireAuth() {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorized("Login required");
  return null;
}
