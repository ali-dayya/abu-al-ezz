-- ============================================================
-- Abu Al-Ezz Store — Product Images, Coupons, Stock Notifications, Delivery Zones
-- Run once in Supabase SQL editor after 0006_reviews_wishlist_audit.sql
-- ============================================================

-- ==================== PRODUCT IMAGES (gallery) ====================

create table public.product_images (
  image_id serial primary key,
  product_id int not null references public.products (product_id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.product_images enable row level security;

create policy "product_images_select_all" on public.product_images
  for select using (true);

create policy "product_images_admin_write" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

create index if not exists idx_product_images_product_id
  on public.product_images (product_id, display_order);

-- ==================== COUPONS / DISCOUNT CODES ====================

create table public.coupons (
  coupon_id serial primary key,
  code text not null unique,
  discount_type text not null default 'percentage' check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10, 2) not null check (discount_value > 0),
  min_order_amount numeric(10, 2) not null default 0,
  max_uses int,
  used_count int not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.coupons enable row level security;

-- anyone can validate a coupon code (read by code), only admins manage
create policy "coupons_select_active" on public.coupons
  for select using (true);

create policy "coupons_admin_write" on public.coupons
  for all using (public.is_admin()) with check (public.is_admin());

create index if not exists idx_coupons_code on public.coupons (code);

-- track which customer used which coupon
create table public.coupon_uses (
  id serial primary key,
  coupon_id int not null references public.coupons (coupon_id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  order_id int references public.orders (order_id) on delete set null,
  used_at timestamptz not null default now(),
  unique (coupon_id, customer_id)
);

alter table public.coupon_uses enable row level security;

create policy "coupon_uses_select_own_or_admin" on public.coupon_uses
  for select using (customer_id = auth.uid() or public.is_admin());

create policy "coupon_uses_insert_own" on public.coupon_uses
  for insert with check (customer_id = auth.uid());

-- ==================== STOCK NOTIFICATIONS ====================

create table public.stock_notifications (
  notification_id serial primary key,
  product_id int not null references public.products (product_id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  email text not null,
  notified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, customer_id)
);

alter table public.stock_notifications enable row level security;

create policy "stock_notifications_select_own" on public.stock_notifications
  for select using (customer_id = auth.uid() or public.is_admin());

create policy "stock_notifications_insert_own" on public.stock_notifications
  for insert with check (customer_id = auth.uid());

create policy "stock_notifications_delete_own" on public.stock_notifications
  for delete using (customer_id = auth.uid());

create policy "stock_notifications_admin_update" on public.stock_notifications
  for update using (public.is_admin());

create index if not exists idx_stock_notifications_product_id
  on public.stock_notifications (product_id);

-- ==================== DELIVERY ZONES ====================

create table public.delivery_zones (
  zone_id serial primary key,
  zone_name_en text not null,
  zone_name_ar text not null default '',
  estimated_days int not null default 1 check (estimated_days >= 0),
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  is_active boolean not null default true,
  display_order int not null default 0
);

alter table public.delivery_zones enable row level security;

create policy "delivery_zones_select_all" on public.delivery_zones
  for select using (true);

create policy "delivery_zones_admin_write" on public.delivery_zones
  for all using (public.is_admin()) with check (public.is_admin());

-- Add coupon_code and delivery_zone_id to orders
alter table public.orders
  add column if not exists coupon_code text not null default '',
  add column if not exists discount_amount numeric(10, 2) not null default 0,
  add column if not exists delivery_zone_id int references public.delivery_zones (zone_id),
  add column if not exists delivery_fee numeric(10, 2) not null default 0;

-- ==================== SEED DELIVERY ZONES ====================

insert into public.delivery_zones (zone_name_en, zone_name_ar, estimated_days, delivery_fee, display_order) values
  ('Beirut',           'بيروت',            1, 0,    1),
  ('Mount Lebanon',    'جبل لبنان',        1, 2.00, 2),
  ('North Lebanon',    'شمال لبنان',       2, 4.00, 3),
  ('South Lebanon',    'جنوب لبنان',       2, 4.00, 4),
  ('Bekaa Valley',     'البقاع',           2, 3.50, 5),
  ('Nabatieh',         'النبطية',          2, 4.00, 6)
on conflict do nothing;
