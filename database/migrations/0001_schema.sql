-- ============================================================
-- Abu Al-Ezz Store — Supabase schema
-- Run this once in the Supabase SQL editor (SQL Editor > New query > Run)
-- ============================================================

-- ---------- Profile tables (linked to Supabase Auth users) ----------

create table public.customers (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create table public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now()
);

-- ---------- Catalog ----------

create table public.categories (
  category_id serial primary key,
  category_name_en text not null,
  category_name_ar text not null,
  description_en text not null default '',
  description_ar text not null default '',
  icon text not null default ''
);

create table public.subcategories (
  subcategory_id serial primary key,
  category_id int not null references public.categories (category_id) on delete cascade,
  subcategory_name_en text not null,
  subcategory_name_ar text not null,
  description_en text not null default '',
  description_ar text not null default ''
);

create table public.products (
  product_id serial primary key,
  subcategory_id int not null references public.subcategories (subcategory_id) on delete cascade,
  product_name_en text not null,
  product_name_ar text not null,
  description_en text not null default '',
  description_ar text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  availability_status text not null default 'available' check (availability_status in ('available', 'out_of_stock')),
  image_url text not null default '',
  created_at date not null default current_date
);

create table public.store_info (
  store_id serial primary key,
  store_name_en text not null,
  store_name_ar text not null,
  tagline_en text not null default '',
  tagline_ar text not null default '',
  phone text not null default '',
  address_en text not null default '',
  address_ar text not null default '',
  whatsapp_num text not null default '',
  insta_link text not null default '',
  open_hours_en text not null default '',
  open_hours_ar text not null default ''
);

-- ---------- Orders ----------

create table public.orders (
  order_id serial primary key,
  customer_id uuid not null references public.customers (id) on delete cascade,
  order_date date not null default current_date,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount numeric(10, 2) not null default 0 check (total_amount >= 0),
  notes text not null default ''
);

create table public.order_items (
  order_item_id serial primary key,
  order_id int not null references public.orders (order_id) on delete cascade,
  product_id int not null references public.products (product_id),
  quantity int not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  subtotal numeric(10, 2) not null check (subtotal >= 0)
);

-- ============================================================
-- Helper: is the current user an admin?
-- security definer so it can read public.admins regardless of
-- the caller's own RLS visibility into that table.
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

-- ============================================================
-- New auth user -> create matching customer profile row
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customers (id, full_name, email, phone, address)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'address'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- create_order: atomic order placement with stock validation
-- items shape: [{ "product_id": 1, "quantity": 2 }, ...]
-- ============================================================

create or replace function public.create_order(items jsonb, notes text default '')
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_order_id int;
  v_total numeric(10, 2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty int;
  v_subtotal numeric(10, 2);
begin
  if v_customer_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if items is null or jsonb_array_length(items) = 0 then
    raise exception 'EMPTY_ORDER';
  end if;

  -- Lock and validate every product row before writing anything.
  for v_item in select * from jsonb_array_elements(items) loop
    select * into v_product from public.products
      where product_id = (v_item ->> 'product_id')::int
      for update;

    if v_product.product_id is null then
      raise exception 'PRODUCT_NOT_FOUND:%', (v_item ->> 'product_id');
    end if;

    v_qty := greatest(1, coalesce((v_item ->> 'quantity')::int, 1));

    if v_product.stock_quantity < v_qty then
      raise exception 'INSUFFICIENT_STOCK:%', v_product.product_name_en;
    end if;
  end loop;

  insert into public.orders (customer_id, status, total_amount, notes)
  values (v_customer_id, 'pending', 0, coalesce(notes, ''))
  returning order_id into v_order_id;

  for v_item in select * from jsonb_array_elements(items) loop
    select * into v_product from public.products
      where product_id = (v_item ->> 'product_id')::int;

    v_qty := greatest(1, coalesce((v_item ->> 'quantity')::int, 1));
    v_subtotal := round(v_product.price * v_qty, 2);
    v_total := v_total + v_subtotal;

    insert into public.order_items (order_id, product_id, quantity, unit_price, subtotal)
    values (v_order_id, v_product.product_id, v_qty, v_product.price, v_subtotal);

    update public.products
      set stock_quantity = stock_quantity - v_qty,
          availability_status = case when stock_quantity - v_qty <= 0 then 'out_of_stock' else availability_status end
      where product_id = v_product.product_id;
  end loop;

  update public.orders set total_amount = v_total where order_id = v_order_id;

  return v_order_id;
end;
$$;

grant execute on function public.create_order(jsonb, text) to authenticated;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.customers enable row level security;
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.products enable row level security;
alter table public.store_info enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- customers: see/update your own profile; admins can see everyone
create policy "customers_select_own_or_admin" on public.customers
  for select using (id = auth.uid() or public.is_admin());

create policy "customers_update_own" on public.customers
  for update using (id = auth.uid());

-- admins: a user can check whether *they* are an admin
create policy "admins_select_own" on public.admins
  for select using (id = auth.uid());

-- catalog tables: anyone can read, only admins can write
create policy "categories_select_all" on public.categories
  for select using (true);
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "subcategories_select_all" on public.subcategories
  for select using (true);
create policy "subcategories_admin_write" on public.subcategories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "products_select_all" on public.products
  for select using (true);
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "store_info_select_all" on public.store_info
  for select using (true);
create policy "store_info_admin_write" on public.store_info
  for all using (public.is_admin()) with check (public.is_admin());

-- orders: customers see their own, admins see everything; only admins update status
create policy "orders_select_own_or_admin" on public.orders
  for select using (customer_id = auth.uid() or public.is_admin());

create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- order_items: visible if the parent order is visible
create policy "order_items_select_own_or_admin" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.order_id = order_items.order_id
        and (o.customer_id = auth.uid() or public.is_admin())
    )
  );

-- Note: there are no INSERT policies on orders/order_items — every order
-- must go through create_order(), which runs as security definer and
-- performs the stock check atomically.

-- ============================================================
-- Storage: product images bucket
-- ============================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "product_images_admin_write" on storage.objects
  for all using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
