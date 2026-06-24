# Client Handoff Checklist

Use this checklist before showing the store as production-ready.

## Technical Verification

- Run `npm run verify`.
- Run `npm run smoke:prod` after deploying the latest code to Vercel.
- Confirm `https://abu-al-ezz.vercel.app/api/health` returns `{ "status": "ok" }`.
- Confirm all SQL migrations in `database/migrations/` were run in order on Supabase.
- Confirm Vercel environment variables match the Supabase project:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`
  - `RESEND_API_KEY`, if email notifications are enabled
  - `ADMIN_EMAIL`, if email notifications are enabled
  - `RESEND_FROM_EMAIL`, if email notifications are enabled
- Confirm GitHub Actions has these repository secrets for production deploys:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`
  - `RESEND_API_KEY`, if email notifications are enabled
  - `ADMIN_EMAIL`, if email notifications are enabled
  - `RESEND_FROM_EMAIL`, if email notifications are enabled

## Business Flow Verification

- Register a customer account.
- Promote the owner account in Supabase and log in through `/admin-login`.
- Add a category, subcategory, product, stock quantity, and product image.
- Place an order as a customer.
- Place an order with a coupon and delivery zone.
- Confirm stock decreases only after successful checkout.
- Confirm invalid coupons do not create orders or reduce stock.
- Update order status from the admin dashboard.
- Test password reset redirect from Supabase Auth.
- Test new-order email notification if Resend is configured.

## Launch Tasks

- Buy and connect the custom domain in Vercel.
- Set `NEXT_PUBLIC_SITE_URL` to the custom domain.
- Add the custom domain reset-password URL in Supabase Auth redirect settings.
- Verify Resend domain authentication for production email.
- Export a Supabase backup after final setup.
- Commit all project files and tag the handoff version.
