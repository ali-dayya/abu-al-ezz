-- ============================================================
-- Abu Al-Ezz Store — performance indexes on FK columns
-- PostgreSQL only auto-indexes primary keys, not foreign keys.
-- Run once in Supabase SQL editor.
-- ============================================================

-- subcategories.category_id: used in JOIN when loading products
create index if not exists idx_subcategories_category_id
  on public.subcategories (category_id);

-- products.subcategory_id: JOIN in PRODUCT_SELECT, FK constraint checks
create index if not exists idx_products_subcategory_id
  on public.products (subcategory_id);

-- orders.customer_id: RLS policy filters by auth.uid()
create index if not exists idx_orders_customer_id
  on public.orders (customer_id);

-- order_items.order_id: JOIN in ORDER_SELECT (most frequent join)
create index if not exists idx_order_items_order_id
  on public.order_items (order_id);

-- order_items.product_id: FK constraint check on product delete
create index if not exists idx_order_items_product_id
  on public.order_items (product_id);

-- orders.order_date DESC: used in getOrders() ORDER BY
create index if not exists idx_orders_order_date_desc
  on public.orders (order_date desc, order_id desc);
