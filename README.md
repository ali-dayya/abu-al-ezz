# Abu Al-Ezz Institution — Online Store

A bilingual (English/Arabic) e-commerce storefront and admin panel for **Abu Al-Ezz
Institution**, a household-goods, heaters & hookah retailer in Lebanon. Customers browse
the catalog and submit order requests; the store owner manages products, categories,
orders, and store info from a dedicated admin dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router, React 18)
- **Database & Auth**: [Supabase](https://supabase.com) (Postgres, Auth, Storage)
- **Styling**: Tailwind CSS
- **Hosting**: [Vercel](https://vercel.com)

## Features

- Bilingual EN/AR storefront with full RTL support
- Product catalog with categories, subcategories, search & filters
- Cart and order-request checkout (no payment gateway — owner confirms via phone/WhatsApp)
- Customer accounts with order history, registration, login, and password reset
- Admin dashboard: manage products (with image upload), categories/subcategories, orders,
  and store contact info
- Row-Level Security enforced at the database level — admin actions require an
  authenticated admin account

## Project Structure

```
abu-al-ezz/        Next.js application (the actual app)
database/          SQL migrations + step-by-step deployment guide
```

## Getting Started (Local Development)

```bash
cd abu-al-ezz
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

See [`database/README.md`](database/README.md) for the full step-by-step guide to:

1. Create a free Supabase project and run the SQL migrations
2. Deploy the app to Vercel
3. Configure Auth settings (incl. password reset redirect URLs)
4. Promote your account to admin
