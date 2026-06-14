# Abu Al-Ezz Store — Deployment Guide (Supabase + Vercel)

This guide walks through putting the store online for free, using **Supabase** for the
database/login/photo storage and **Vercel** for hosting the website. No coding required —
just copying and pasting a few things.

---

## 1. Create the database (Supabase)

1. Go to [supabase.com](https://supabase.com) and sign up for a free account.
2. Click **New Project**. Pick any name (e.g. "abu-al-ezz"), choose a strong database
   password (save it somewhere safe — you won't need it day-to-day, but keep it), and
   pick a region close to Lebanon (e.g. Europe).
3. Wait a minute or two for the project to finish setting up.
4. In the left sidebar, open **SQL Editor** → **New query**.
5. Open [`migrations/0001_schema.sql`](migrations/0001_schema.sql) from this repo, copy
   its entire contents, paste it into the SQL editor, and click **Run**.
   This creates all the tables, security rules, and the product-photo storage bucket.
6. Repeat step 4–5 with [`migrations/0002_seed.sql`](migrations/0002_seed.sql). This adds
   the starter categories, subcategories, products, and store info so the site isn't
   empty when it first goes live.

### Get your project keys

1. In the Supabase dashboard, go to **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon / public** key — you'll need both in the next
   steps. (Never share the **service_role** key — it's not needed for this app.)

---

## 2. Run the site locally (optional, for testing)

1. In the `abu-al-ezz` folder, copy `.env.example` to `.env.local`.
2. Fill in the two values from Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

---

## 3. Put the site online (Vercel)

1. Push this project to a GitHub repository (Vercel deploys from GitHub).
2. Go to [vercel.com](https://vercel.com), sign up/log in with GitHub, and click
   **Add New Project** → select your repository.
3. When asked for the **Root Directory**, choose `abu-al-ezz`.
4. Under **Environment Variables**, add the same two values from Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. After a minute, Vercel gives you a live URL (e.g.
   `https://abu-al-ezz.vercel.app`) — this is the real website.

---

## 4. Create the admin (owner) account

The website has no admin account by default — you create your own and promote it.

1. Open the live website and **Register** a normal account with your own email and
   password (this is the account you'll use to manage the store).
2. In Supabase, go to **SQL Editor** → **New query** and run:
   ```sql
   insert into public.admins (id, full_name)
   select id, 'Store Owner'
   from auth.users
   where email = 'your-email@example.com';
   ```
   Replace `your-email@example.com` with the email you registered with.
3. Log out and log back in via **Admin Login** (`/admin-login`) on the website. You now
   have access to `/admin/dashboard` to manage products, categories, orders, and store
   info.

You can repeat step 2 for any other email address to give more people admin access.

---

## 5. Day-to-day use

- **Products** (`/admin/products`): add/edit/delete products, set price, stock,
  category/subcategory, and bilingual (English/Arabic) name & description. To add a
  photo, click **Upload Image** and pick a file — it's stored in Supabase and shown on
  the site automatically. You can also paste a direct image URL instead.
- **Categories** (`/admin/categories`): manage categories and subcategories.
- **Orders** (`/admin/orders`): customers submit an order request from the cart; the
  owner reviews it here, contacts the customer (phone/WhatsApp from their order), and
  updates the status to *Confirmed*, *Completed*, or *Cancelled*. There is no online
  payment — payment/delivery is arranged directly with the customer.
- **Store Info** (`/admin/store-info`): edit the phone number, WhatsApp number, address,
  opening hours, and Instagram link shown across the site.

---

## 6. Important notes

- **Free tier pausing**: Supabase free projects pause automatically after about a week
  with no activity. If the site stops loading data, go to the Supabase dashboard and
  click **Restore/Resume project** — it takes a minute and no data is lost.
- **Security**: All security is enforced by the database itself (Row Level Security).
  Only logged-in admins (accounts listed in the `admins` table) can add/edit/delete
  products, categories, and orders. Regular customers can only see their own orders.
- **Backups**: Supabase keeps automatic backups on the free tier for a few days. For
  long-term safety, periodically export your data from **Database** → **Backups** in
  the Supabase dashboard.
