import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const STORE_NAME = "Abu Al-Ezz Institution";
const ADMIN_PANEL_URL = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/orders`;
const ORDERS_URL = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/orders`;

function fromAddress() {
  return process.env.RESEND_FROM_EMAIL || `${STORE_NAME} <onboarding@resend.dev>`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

function itemsTable(items = []) {
  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e9e0ca;">${item.name_en || item.product_name_en || item.name || "—"}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e9e0ca;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e9e0ca;text-align:right;">$${Number(item.unit_price ?? 0).toFixed(2)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e9e0ca;text-align:right;">$${Number(item.subtotal ?? (item.unit_price * item.quantity) ?? 0).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    <thead>
      <tr style="background:#f5f0e8;">
        <th style="padding:8px 12px;text-align:left;font-size:13px;color:#666;font-weight:600;">Product</th>
        <th style="padding:8px 12px;text-align:center;font-size:13px;color:#666;font-weight:600;">Qty</th>
        <th style="padding:8px 12px;text-align:right;font-size:13px;color:#666;font-weight:600;">Unit Price</th>
        <th style="padding:8px 12px;text-align:right;font-size:13px;color:#666;font-weight:600;">Subtotal</th>
      </tr>
    </thead>
    <tbody>${rows || '<tr><td colspan="4" style="padding:12px;text-align:center;color:#999;">No items</td></tr>'}</tbody>
  </table>`;
}

function emailShell(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0d0d0d;padding:24px 32px;">
            <p style="margin:0;color:#C9A84C;font-size:20px;font-weight:700;">${STORE_NAME}</p>
            <p style="margin:4px 0 0;color:#999;font-size:13px;">مؤسسة أبو العز و أولاده</p>
          </td>
        </tr>
        ${content}
        <tr>
          <td style="background:#f5f0e8;padding:16px 32px;border-top:1px solid #e9e0ca;">
            <p style="margin:0;font-size:12px;color:#999;">Automated notification — do not reply to this email.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function send({ to, subject, html }, retries = 2) {
  if (!resend || !to) return;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await resend.emails.send({ from: fromAddress(), to, subject, html });
      return;
    } catch (err) {
      console.error(`[email] Attempt ${attempt + 1}/${retries + 1} failed for "${subject}":`, err?.message ?? err);
      if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}

/**
 * Alert the admin when one or more products drop to low stock.
 */
export async function sendLowStockAlert(products) {
  if (!process.env.ADMIN_EMAIL) return;
  const rows = products
    .map(p => `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e9e0ca;">${p.product_name_en}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e9e0ca;text-align:center;font-weight:700;color:${p.stock_quantity === 0 ? "#ef4444" : "#f59e0b"};">
        ${p.stock_quantity === 0 ? "OUT OF STOCK" : p.stock_quantity + " left"}
      </td>
    </tr>`)
    .join("");

  const html = emailShell(`
    <tr><td style="background:#f59e0b;padding:12px 32px;">
      <p style="margin:0;color:#0d0d0d;font-size:15px;font-weight:700;">⚠ Low Stock Alert — ${products.length} product${products.length > 1 ? "s" : ""}</p>
    </td></tr>
    <tr><td style="padding:28px 32px 0;">
      <p style="margin:0 0 16px;font-size:14px;color:#515151;">The following products are running low and may need restocking:</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <thead><tr style="background:#f5f0e8;">
          <th style="padding:8px 12px;text-align:left;font-size:13px;color:#666;">Product</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;color:#666;">Stock</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </td></tr>
    <tr><td style="padding:24px 32px 8px;">
      <a href="${ADMIN_PANEL_URL.replace("/orders", "/products")}" style="display:inline-block;background:#C9A84C;color:#0d0d0d;font-size:14px;font-weight:700;padding:12px 24px;border-radius:6px;text-decoration:none;">Manage Products →</a>
    </td></tr>
  `);

  await send({
    to: process.env.ADMIN_EMAIL,
    subject: `Low Stock Alert — ${products.length} product${products.length > 1 ? "s" : ""} need attention`,
    html,
  });
}

/**
 * Notify the admin when a new order is placed.
 * Never throws — email failure must not fail the order.
 */
export async function sendOrderNotification(order) {
  if (!process.env.ADMIN_EMAIL) return;

  const total = order.total_amount ?? order.items?.reduce(
    (s, i) => s + Number(i.unit_price ?? 0) * Number(i.quantity ?? 1), 0
  ) ?? 0;

  const customerPhone = order.customer?.phone || "";
  const whatsappRow = customerPhone
    ? `<tr>
        <td style="padding:4px 16px 4px 0;color:#666;font-size:14px;">WhatsApp</td>
        <td style="padding:4px 0;font-size:14px;">
          <a href="https://wa.me/${customerPhone.replace(/\D/g, "")}" style="color:#25D366;font-weight:600;text-decoration:none;">Open chat →</a>
        </td>
      </tr>`
    : "";

  const notesRow = order.notes
    ? `<tr><td style="padding:20px 32px 0;" colspan="1">
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;">Customer Notes</p>
        <p style="margin:0;padding:12px 16px;background:#fffdf5;border-left:3px solid #C9A84C;font-size:14px;color:#444;">${order.notes}</p>
      </td></tr>`
    : "";

  const html = emailShell(`
    <tr><td style="background:#C9A84C;padding:12px 32px;">
      <p style="margin:0;color:#0d0d0d;font-size:15px;font-weight:700;">New Order Received — #${order.order_id}</p>
    </td></tr>
    <tr><td style="padding:28px 32px 0;">
      <p style="margin:0 0 16px;font-size:16px;font-weight:700;border-bottom:2px solid #C9A84C;padding-bottom:8px;">Customer Details</p>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:4px 16px 4px 0;color:#666;font-size:14px;">Name</td>
          <td style="padding:4px 0;font-size:14px;font-weight:600;">${order.customer?.name || order.customer_name || "—"}</td>
        </tr>
        <tr>
          <td style="padding:4px 16px 4px 0;color:#666;font-size:14px;">Phone</td>
          <td style="padding:4px 0;font-size:14px;font-weight:600;">
            <a href="tel:${customerPhone.replace(/\s/g, "")}" style="color:#C9A84C;text-decoration:none;">${customerPhone || "—"}</a>
          </td>
        </tr>
        ${whatsappRow}
        <tr>
          <td style="padding:4px 16px 4px 0;color:#666;font-size:14px;">Email</td>
          <td style="padding:4px 0;font-size:14px;">${order.customer?.email || "—"}</td>
        </tr>
        <tr>
          <td style="padding:4px 16px 4px 0;color:#666;font-size:14px;">Placed at</td>
          <td style="padding:4px 0;font-size:14px;">${formatDate(order.order_date)}</td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding:24px 32px 0;">
      <p style="margin:0 0 16px;font-size:16px;font-weight:700;border-bottom:2px solid #C9A84C;padding-bottom:8px;">Order Items</p>
      ${itemsTable(order.items)}
    </td></tr>
    <tr><td style="padding:0 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td></td>
          <td style="text-align:right;padding:12px;background:#0d0d0d;border-radius:0 0 4px 4px;">
            <span style="color:#C9A84C;font-size:16px;font-weight:700;">Total: $${Number(total).toFixed(2)}</span>
          </td>
        </tr>
      </table>
    </td></tr>
    ${notesRow}
    <tr><td style="padding:28px 32px;">
      <a href="${ADMIN_PANEL_URL}" style="display:inline-block;background:#C9A84C;color:#0d0d0d;font-size:14px;font-weight:700;padding:12px 24px;border-radius:6px;text-decoration:none;">View in Admin Panel →</a>
    </td></tr>
  `);

  await send({
    to: process.env.ADMIN_EMAIL,
    subject: `New Order #${order.order_id} — ${order.customer?.name || order.customer_name || "Customer"}`,
    html,
  });
}

/**
 * Send the customer a confirmation email when they place an order.
 */
export async function sendOrderConfirmation(order) {
  const customerEmail = order.customer?.email;
  if (!customerEmail) return;

  const total = order.total_amount ?? 0;
  const customerName = order.customer?.name || "Valued Customer";

  const html = emailShell(`
    <tr><td style="background:#C9A84C;padding:12px 32px;">
      <p style="margin:0;color:#0d0d0d;font-size:15px;font-weight:700;">Order Confirmed — #${order.order_id}</p>
    </td></tr>
    <tr><td style="padding:28px 32px 0;">
      <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1a1a1a;">Thank you, ${customerName}!</p>
      <p style="margin:0 0 24px;font-size:14px;color:#515151;line-height:1.6;">
        We've received your order and it's currently <strong>pending confirmation</strong>.
        Our team will review it shortly and contact you to arrange delivery.
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:#515151;line-height:1.6;" dir="rtl">
        شكراً لطلبك! تم استلامه وهو قيد المراجعة. سيتواصل معك فريقنا قريباً لترتيب التسليم.
      </p>
    </td></tr>
    <tr><td style="padding:0 32px 0;">
      <p style="margin:0 0 12px;font-size:16px;font-weight:700;border-bottom:2px solid #C9A84C;padding-bottom:8px;">Your Order Summary</p>
      ${itemsTable(order.items)}
    </td></tr>
    <tr><td style="padding:0 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td></td>
          <td style="text-align:right;padding:12px;background:#0d0d0d;border-radius:0 0 4px 4px;">
            <span style="color:#C9A84C;font-size:16px;font-weight:700;">Total: $${Number(total).toFixed(2)}</span>
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding:28px 32px 8px;">
      <p style="margin:0 0 12px;font-size:13px;color:#666;">Questions? Contact us:</p>
      <a href="https://wa.me/96178885719" style="display:inline-block;background:#25D366;color:#fff;font-size:14px;font-weight:700;padding:10px 20px;border-radius:6px;text-decoration:none;margin-right:8px;">WhatsApp</a>
      <a href="${ORDERS_URL}" style="display:inline-block;background:#0d0d0d;color:#C9A84C;font-size:14px;font-weight:700;padding:10px 20px;border-radius:6px;text-decoration:none;">View My Orders →</a>
    </td></tr>
  `);

  await send({
    to: customerEmail,
    subject: `Order #${order.order_id} Received — ${STORE_NAME}`,
    html,
  });
}

/**
 * Notify the customer when admin updates their order status to confirmed or completed.
 */
export async function sendOrderStatusUpdate(order) {
  const customerEmail = order.customer?.email;
  if (!customerEmail) return;
  if (!["confirmed", "completed"].includes(order.status)) return;

  const customerName = order.customer?.name || "Valued Customer";
  const isCompleted = order.status === "completed";

  const alertBar = isCompleted
    ? `<tr><td style="background:#10b981;padding:12px 32px;"><p style="margin:0;color:#fff;font-size:15px;font-weight:700;">Order #${order.order_id} — Delivered!</p></td></tr>`
    : `<tr><td style="background:#C9A84C;padding:12px 32px;"><p style="margin:0;color:#0d0d0d;font-size:15px;font-weight:700;">Order #${order.order_id} — Confirmed</p></td></tr>`;

  const bodyText = isCompleted
    ? { en: `Your order has been marked as <strong>delivered</strong>. Thank you for shopping with ${STORE_NAME} — we hope to see you again!`, ar: "تم تسليم طلبك بنجاح. شكراً لتسوقك معنا — نأمل أن نراك مجدداً!" }
    : { en: `Great news! Your order has been <strong>confirmed</strong> by our team. We'll arrange delivery and contact you shortly.`, ar: "خبر سار! تم تأكيد طلبك من قِبل فريقنا. سنرتب التسليم ونتواصل معك قريباً." };

  const html = emailShell(`
    ${alertBar}
    <tr><td style="padding:28px 32px 0;">
      <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1a1a1a;">${isCompleted ? "Thank you" : "Good news"}, ${customerName}!</p>
      <p style="margin:0 0 16px;font-size:14px;color:#515151;line-height:1.6;">${bodyText.en}</p>
      <p style="margin:0 0 24px;font-size:14px;color:#515151;line-height:1.6;" dir="rtl">${bodyText.ar}</p>
    </td></tr>
    <tr><td style="padding:0 32px 0;">
      <p style="margin:0 0 12px;font-size:16px;font-weight:700;border-bottom:2px solid #C9A84C;padding-bottom:8px;">Order Summary</p>
      ${itemsTable(order.items)}
    </td></tr>
    <tr><td style="padding:0 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td></td>
          <td style="text-align:right;padding:12px;background:#0d0d0d;border-radius:0 0 4px 4px;">
            <span style="color:#C9A84C;font-size:16px;font-weight:700;">Total: $${Number(order.total_amount ?? 0).toFixed(2)}</span>
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding:28px 32px 8px;">
      <p style="margin:0 0 12px;font-size:13px;color:#666;">Have questions? Contact us on WhatsApp:</p>
      <a href="https://wa.me/96178885719" style="display:inline-block;background:#25D366;color:#fff;font-size:14px;font-weight:700;padding:10px 20px;border-radius:6px;text-decoration:none;">WhatsApp</a>
    </td></tr>
  `);

  await send({
    to: customerEmail,
    subject: isCompleted
      ? `Order #${order.order_id} Delivered — ${STORE_NAME}`
      : `Order #${order.order_id} Confirmed — ${STORE_NAME}`,
    html,
  });
}
