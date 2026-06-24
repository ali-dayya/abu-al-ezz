import { requireAdmin } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/responses";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Abu Al-Ezz <onboarding@resend.dev>";

  if (!apiKey) {
    return ok({ success: false, error: "RESEND_API_KEY is not set in environment variables." });
  }
  if (!adminEmail) {
    return ok({ success: false, error: "ADMIN_EMAIL is not set in environment variables." });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: "✓ Abu Al-Ezz — Email is working!",
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0d0d0d;padding:24px 32px;">
            <p style="margin:0;color:#C9A84C;font-size:20px;font-weight:700;">Abu Al-Ezz Institution</p>
            <p style="margin:4px 0 0;color:#999;font-size:13px;">مؤسسة أبو العز و أولاده</p>
          </td>
        </tr>
        <tr>
          <td style="background:#10b981;padding:12px 32px;">
            <p style="margin:0;color:#fff;font-size:15px;font-weight:700;">✓ Email is working correctly!</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;">Your Resend email integration is set up and working.</p>
            <p style="margin:0;font-size:14px;color:#515151;line-height:1.6;">
              From this point, order notifications and customer emails will be delivered automatically.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-top:24px;width:100%;border-collapse:collapse;">
              <tr style="background:#f5f0e8;">
                <th style="padding:8px 12px;text-align:left;font-size:12px;color:#666;font-weight:600;">Setting</th>
                <th style="padding:8px 12px;text-align:left;font-size:12px;color:#666;font-weight:600;">Value</th>
              </tr>
              <tr>
                <td style="padding:8px 12px;font-size:13px;color:#666;border-bottom:1px solid #e9e0ca;">RESEND_API_KEY</td>
                <td style="padding:8px 12px;font-size:13px;color:#10b981;font-weight:600;border-bottom:1px solid #e9e0ca;">✓ Set</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;font-size:13px;color:#666;border-bottom:1px solid #e9e0ca;">ADMIN_EMAIL</td>
                <td style="padding:8px 12px;font-size:13px;color:#1a1a1a;border-bottom:1px solid #e9e0ca;">${adminEmail}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;font-size:13px;color:#666;">RESEND_FROM_EMAIL</td>
                <td style="padding:8px 12px;font-size:13px;color:#1a1a1a;">${fromEmail}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f5f0e8;padding:16px 32px;border-top:1px solid #e9e0ca;">
            <p style="margin:0;font-size:12px;color:#999;">This is a test email sent from the Admin Panel.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
    return ok({ success: true, sentTo: adminEmail });
  } catch (err) {
    return ok({ success: false, error: err?.message ?? "Unknown error" });
  }
}
