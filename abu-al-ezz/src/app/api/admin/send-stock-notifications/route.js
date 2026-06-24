import { errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const STORE_NAME = "Abu Al-Ezz Institution";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function fromAddress() {
  return process.env.RESEND_FROM_EMAIL || `${STORE_NAME} <onboarding@resend.dev>`;
}

export async function POST() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const supabase = getSupabaseServerClient();

  const { data: notifications, error } = await supabase
    .from("stock_notifications")
    .select("*, products(product_name_en, product_name_ar, product_id)")
    .eq("notified", true);

  if (error) return errorResponse(error);
  if (!notifications || notifications.length === 0) return ok({ sent: 0 });

  let sent = 0;
  for (const n of notifications) {
    if (!resend || !n.email) continue;
    const productName = n.products?.product_name_en || "Product";
    const productUrl = `${SITE_URL}/product/${n.products?.product_id}`;

    try {
      await resend.emails.send({
        from: fromAddress(),
        to: n.email,
        subject: `${productName} is back in stock! — ${STORE_NAME}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <h2 style="color:#C9A84C;margin:0 0 16px;">Good news!</h2>
          <p style="color:#333;line-height:1.6;"><strong>${productName}</strong> is now back in stock at ${STORE_NAME}.</p>
          <a href="${productUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#C9A84C;color:#0d0d0d;font-weight:700;border-radius:8px;text-decoration:none;">View Product →</a>
        </div>`,
      });
      sent++;
    } catch {}
  }

  // Delete sent notifications
  const ids = notifications.map((n) => n.notification_id);
  await supabase.from("stock_notifications").delete().in("notification_id", ids).catch(() => {});

  return ok({ sent, total: notifications.length });
}
