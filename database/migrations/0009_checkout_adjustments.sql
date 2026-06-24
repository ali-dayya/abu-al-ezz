-- ============================================================
-- Abu Al-Ezz Store - secure checkout adjustments
-- Run once in Supabase SQL editor after 0008_coupon_increment_stock_notify.sql
-- ============================================================

create or replace function public.apply_order_checkout_adjustments(
  p_order_id int,
  p_coupon_code text default '',
  p_delivery_zone_id int default null
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_coupon public.coupons%rowtype;
  v_discount numeric(10, 2) := 0;
  v_delivery_fee numeric(10, 2) := 0;
begin
  select *
  into v_order
  from public.orders
  where order_id = p_order_id
    and customer_id = auth.uid()
    and status = 'pending'
  for update;

  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if p_coupon_code is not null and btrim(p_coupon_code) <> '' then
    select *
    into v_coupon
    from public.coupons
    where code = upper(btrim(p_coupon_code))
      and is_active = true
    for update;

    if not found then
      raise exception 'INVALID_COUPON';
    end if;

    if v_coupon.expires_at is not null and v_coupon.expires_at < now() then
      raise exception 'COUPON_EXPIRED';
    end if;

    if v_coupon.max_uses is not null and v_coupon.used_count >= v_coupon.max_uses then
      raise exception 'COUPON_USAGE_LIMIT';
    end if;

    if v_order.total_amount < v_coupon.min_order_amount then
      raise exception 'MIN_ORDER_AMOUNT:%', v_coupon.min_order_amount;
    end if;

    if exists (
      select 1
      from public.coupon_uses
      where coupon_id = v_coupon.coupon_id
        and customer_id = auth.uid()
    ) then
      raise exception 'COUPON_ALREADY_USED';
    end if;

    if v_coupon.discount_type = 'percentage' then
      v_discount := round(v_order.total_amount * v_coupon.discount_value / 100, 2);
    else
      v_discount := least(v_coupon.discount_value, v_order.total_amount);
    end if;

    insert into public.coupon_uses (coupon_id, customer_id, order_id)
    values (v_coupon.coupon_id, auth.uid(), v_order.order_id);

    update public.coupons
    set used_count = used_count + 1
    where coupon_id = v_coupon.coupon_id;
  end if;

  if p_delivery_zone_id is not null then
    select delivery_fee
    into v_delivery_fee
    from public.delivery_zones
    where zone_id = p_delivery_zone_id
      and is_active = true;

    if not found then
      raise exception 'INVALID_DELIVERY_ZONE';
    end if;
  end if;

  update public.orders
  set coupon_code = coalesce(v_coupon.code, ''),
      discount_amount = v_discount,
      delivery_zone_id = p_delivery_zone_id,
      delivery_fee = v_delivery_fee,
      total_amount = greatest(0, v_order.total_amount - v_discount + v_delivery_fee)
  where order_id = v_order.order_id
  returning * into v_order;

  return v_order;
end;
$$;

grant execute on function public.apply_order_checkout_adjustments(int, text, int) to authenticated;

create or replace function public.create_order_checkout(
  items jsonb,
  notes text default '',
  coupon_code text default '',
  delivery_zone_id int default null
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id int;
begin
  v_order_id := public.create_order(items, notes);

  perform public.apply_order_checkout_adjustments(
    v_order_id,
    coupon_code,
    delivery_zone_id
  );

  return v_order_id;
end;
$$;

grant execute on function public.create_order_checkout(jsonb, text, text, int) to authenticated;
