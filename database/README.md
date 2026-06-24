# Abu Al-Ezz Store - Deployment Guide (Supabase + Vercel)

This guide walks through putting the store online using Supabase for the database,
login, and photo storage, and Vercel for hosting the website.

---

## 1. Create the database (Supabase)

1. Go to [supabase.com](https://supabase.com) and sign up for a free account.
2. Click **New Project**. Pick a name, choose a strong database password, and pick a
   region close to Lebanon, such as Europe.
3. Wait for the project to finish setting up.
4. Open **SQL Editor** > **New query**.
5. Run every SQL file in [`migrations/`](migrations/) in filename order, starting with
   `0001_schema.sql`, then `0002_seed.sql`, and continuing through the latest numbered
   migration. Copy the full contents of one file, paste it into the SQL editor, click
   **Run**, then move to the next file.
6. `0001_schema.sql` creates the core tables, security rules, and product-photo storage
   bucket. `0002_seed.sql` adds starter categories, products, and store info. The later
   migrations add production features such as indexes, reviews, wishlist, audit log,
   product galleries, coupons, stock notifications, delivery zones, and secure checkout
   adjustments.
7. If a migration says an object already exists, confirm you did not skip or reorder a
   previous migration. For a brand-new Supabase project, run the files once, in order.

### Get your project keys

1. In the Supabase dashboard, go to **Project Settings** > **API**.
2. Copy the **Project URL** and the **anon / public** key. Never share the
   **service_role** key. It is not needed for this app.

---

## 2. Run the site locally

1. In the `abu-al-ezz` folder, copy `.env.example` to `.env.local`.
2. Fill in the Supabase values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

3. Optional email notification variables:

   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ADMIN_EMAIL=your-admin-email@example.com
   RESEND_FROM_EMAIL=Abu Al-Ezz <noreply@your-domain.com>
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

4. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

---

## 3. Put the site online (Vercel)

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign up or log in with GitHub, and choose
   **Add New Project**.
3. Select the repository.
4. Set the **Root Directory** to `abu-al-ezz`.
5. Add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `RESEND_API_KEY` if email notifications are enabled
   - `ADMIN_EMAIL` if email notifications are enabled
   - `RESEND_FROM_EMAIL` if email notifications are enabled
6. Click **Deploy**.

---

## 4. Configure password reset emails

1. In Supabase, go to **Authentication** > **URL Configuration**.
2. Set **Site URL** to the live Vercel URL, for example:
   `https://abu-al-ezz.vercel.app`.
3. Under **Redirect URLs**, add:
   - `https://abu-al-ezz.vercel.app/reset-password`
   - `http://localhost:3000/reset-password` for local testing
4. Click **Save**.

Without this step, password-reset emails may redirect to the wrong page.

---

## 5. Create the admin account

The website has no admin account by default. Create one and promote it:

1. Open the live website and register a normal account.
2. In Supabase SQL Editor, run:

   ```sql
   insert into public.admins (id, full_name)
   select id, 'Store Owner'
   from auth.users
   where email = 'your-email@example.com';
   ```

3. Replace `your-email@example.com` with the registered email.
4. Log out and log back in through `/admin-login`.

You can repeat the SQL command for other admin users.

---

## 6. Day-to-day use

- **Products** (`/admin/products`): add, edit, delete, upload images, update prices,
  and manage stock.
- **Categories** (`/admin/categories`): manage categories and subcategories.
- **Orders** (`/admin/orders`): review order requests and update status.
- **Coupons** (`/admin/coupons`): create discount codes and usage limits.
- **Delivery zones** (`/admin/delivery-zones`): manage delivery fees and estimated days.
- **Reports** (`/admin/reports`): view sales and product performance.
- **Store Info** (`/admin/store-info`): edit contact details, opening hours, and social
  links.

---

## 7. Production checklist

- Run all migrations in order on the production Supabase project.
- Confirm Vercel has all required environment variables.
- Register and promote the store owner account to admin.
- Test registration, login, password reset, product image upload, cart checkout,
  coupon application, delivery fee application, order status update, and email
  notifications.
- Export a Supabase backup after the first production setup.

---

## 8. Important notes

- Supabase free projects may pause after inactivity. Resume the project from the
  Supabase dashboard if the site stops loading data.
- Security is enforced with Row Level Security. Regular customers can only see their
  own account/order data, while admin actions require an account in the `admins` table.
- For long-term safety, periodically export backups from the Supabase dashboard.
