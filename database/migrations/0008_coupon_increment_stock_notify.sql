-- ============================================================
-- Abu Al-Ezz Store — Coupon usage increment + stock restock notification trigger
-- Run once in Supabase SQL editor after 0007
-- ============================================================

-- Helper to atomically increment coupon used_count
create or replace function public.increment_coupon_usage(cid int)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.coupons
  set used_count = used_count + 1
  where coupon_id = cid;
end;
$$;

grant execute on function public.increment_coupon_usage(int) to authenticated;

-- Trigger: when a product's stock_quantity goes from 0 to >0,
-- mark pending stock_notifications as notified.
-- (The actual email sending is done by the app via a cron or API check.)
create or replace function public.on_product_restocked()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if OLD.stock_quantity <= 0 and NEW.stock_quantity > 0 then
    update public.stock_notifications
    set notified = true
    where product_id = NEW.product_id
      and notified = false;
  end if;
  return NEW;
end;
$$;

create trigger product_restocked
  after update of stock_quantity on public.products
  for each row execute function public.on_product_restocked();
