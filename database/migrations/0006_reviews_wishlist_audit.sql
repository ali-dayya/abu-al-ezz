-- ============================================================
-- Abu Al-Ezz Store — Reviews, Wishlist, Audit Log
-- Run once in Supabase SQL editor after 0005_facebook_link.sql
-- ============================================================

-- ==================== REVIEWS ====================

create table public.reviews (
  review_id serial primary key,
  product_id int not null references public.products (product_id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (product_id, customer_id)
);

alter table public.reviews enable row level security;

create policy "reviews_select_all" on public.reviews
  for select using (true);

create policy "reviews_insert_own" on public.reviews
  for insert with check (customer_id = auth.uid());

create policy "reviews_update_own" on public.reviews
  for update using (customer_id = auth.uid());

create policy "reviews_delete_own_or_admin" on public.reviews
  for delete using (customer_id = auth.uid() or public.is_admin());

-- ==================== WISHLIST ====================

create table public.wishlist (
  wishlist_id serial primary key,
  customer_id uuid not null references public.customers (id) on delete cascade,
  product_id int not null references public.products (product_id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

alter table public.wishlist enable row level security;

create policy "wishlist_select_own" on public.wishlist
  for select using (customer_id = auth.uid());

create policy "wishlist_insert_own" on public.wishlist
  for insert with check (customer_id = auth.uid());

create policy "wishlist_delete_own" on public.wishlist
  for delete using (customer_id = auth.uid());

-- ==================== AUDIT LOG ====================

create table public.audit_log (
  log_id serial primary key,
  table_name text not null,
  record_id text not null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  changed_by uuid references auth.users (id),
  changed_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

create policy "audit_log_admin_select" on public.audit_log
  for select using (public.is_admin());

-- Audit trigger function: logs INSERT/UPDATE/DELETE on any attached table.
-- Uses TG_ARGV[0] as the primary key column name.
create or replace function public.audit_trigger_fn()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pk_col text := TG_ARGV[0];
  v_record_id text;
begin
  if TG_OP = 'DELETE' then
    execute format('select ($1).%I::text', v_pk_col) into v_record_id using OLD;
    insert into public.audit_log (table_name, record_id, action, old_data, changed_by)
    values (TG_TABLE_NAME, v_record_id, 'DELETE', to_jsonb(OLD), auth.uid());
    return OLD;
  elsif TG_OP = 'UPDATE' then
    execute format('select ($1).%I::text', v_pk_col) into v_record_id using NEW;
    insert into public.audit_log (table_name, record_id, action, old_data, new_data, changed_by)
    values (TG_TABLE_NAME, v_record_id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    return NEW;
  elsif TG_OP = 'INSERT' then
    execute format('select ($1).%I::text', v_pk_col) into v_record_id using NEW;
    insert into public.audit_log (table_name, record_id, action, new_data, changed_by)
    values (TG_TABLE_NAME, v_record_id, 'INSERT', to_jsonb(NEW), auth.uid());
    return NEW;
  end if;
  return null;
end;
$$;

-- Attach audit triggers to key tables
create trigger audit_products
  after insert or update or delete on public.products
  for each row execute function public.audit_trigger_fn('product_id');

create trigger audit_categories
  after insert or update or delete on public.categories
  for each row execute function public.audit_trigger_fn('category_id');

create trigger audit_orders
  after insert or update or delete on public.orders
  for each row execute function public.audit_trigger_fn('order_id');

create trigger audit_store_info
  after insert or update or delete on public.store_info
  for each row execute function public.audit_trigger_fn('store_id');

-- ==================== INDEXES for new tables ====================

create index if not exists idx_reviews_product_id on public.reviews (product_id);
create index if not exists idx_reviews_customer_id on public.reviews (customer_id);
create index if not exists idx_wishlist_customer_id on public.wishlist (customer_id);
create index if not exists idx_wishlist_product_id on public.wishlist (product_id);
create index if not exists idx_audit_log_table_name on public.audit_log (table_name);
create index if not exists idx_audit_log_changed_at on public.audit_log (changed_at desc);

-- ==================== Reporting views ====================

-- Revenue by category (uses GROUP BY)
create or replace view public.revenue_by_category as
select
  c.category_id,
  c.category_name_en,
  c.category_name_ar,
  coalesce(sum(oi.subtotal), 0) as total_revenue,
  coalesce(sum(oi.quantity), 0) as total_units_sold
from public.categories c
left join public.subcategories sc on sc.category_id = c.category_id
left join public.products p on p.subcategory_id = sc.subcategory_id
left join public.order_items oi on oi.product_id = p.product_id
left join public.orders o on o.order_id = oi.order_id and o.status in ('confirmed', 'completed')
group by c.category_id, c.category_name_en, c.category_name_ar
order by total_revenue desc;

-- Top selling products
create or replace view public.top_selling_products as
select
  p.product_id,
  p.product_name_en,
  p.product_name_ar,
  p.price,
  p.image_url,
  coalesce(sum(oi.quantity), 0) as total_sold,
  coalesce(sum(oi.subtotal), 0) as total_revenue
from public.products p
left join public.order_items oi on oi.product_id = p.product_id
left join public.orders o on o.order_id = oi.order_id and o.status in ('confirmed', 'completed')
group by p.product_id, p.product_name_en, p.product_name_ar, p.price, p.image_url
order by total_sold desc;

-- Orders per day (for charts)
create or replace view public.orders_per_day as
select
  order_date,
  count(*) as order_count,
  sum(total_amount) as daily_revenue
from public.orders
where status in ('confirmed', 'completed')
group by order_date
order by order_date desc;
