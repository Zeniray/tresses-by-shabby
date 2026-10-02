-- Tresses by Shabby — guest checkout via a single secure RPC function.
-- Run this in the Supabase SQL Editor AFTER the earlier
-- guest-checkout-policies.sql was applied.
--
-- Why: anonymous users have NO SELECT and the RLS delete rollback cannot work
-- without SELECT. So orders + items are created atomically inside one
-- SECURITY DEFINER function, and the raw INSERT/DELETE grants are revoked.

-- 1. Remove the old direct-insert grants/policies (orders can only be
--    created through the checkout function now).
revoke insert on public.orders from anon;
revoke insert on public.order_items from anon;
revoke delete on public.orders from anon;

drop policy if exists "guests can place orders" on public.orders;
drop policy if exists "guests can add order items" on public.order_items;
drop policy if exists "guests can roll back an unconfirmed order" on public.orders;

-- 2. Atomic checkout function
create or replace function public.create_order(
  p_email text,
  p_customer_name text,
  p_phone text,
  p_delivery_address text,
  p_items jsonb -- [{"product_variant_id": "<uuid>", "quantity": 2}, ...]
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total numeric;
  v_item jsonb;
  v_variant record;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'empty_bag';
  end if;

  -- Validate every variant exists, quantity valid, stock sufficient
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    if (v_item->>'quantity')::int is null or (v_item->>'quantity')::int <= 0 then
      raise exception 'invalid_quantity';
    end if;

    select id, price, stock into v_variant
    from public.product_variants
    where id = (v_item->>'product_variant_id')::uuid;

    if not found then
      raise exception 'variant_unavailable';
    end if;

    if v_variant.stock < (v_item->>'quantity')::int then
      raise exception 'insufficient_stock';
    end if;
  end loop;

  -- Authoritative total from current Supabase prices
  select coalesce(sum(v.price * (item->>'quantity')::numeric), 0)
  into v_total
  from jsonb_array_elements(p_items) item
  join public.product_variants v
    on v.id = (item->>'product_variant_id')::uuid;

  insert into public.orders
    (user_id, email, customer_name, phone, delivery_address, total, status)
  values
    (null, p_email, p_customer_name, p_phone, p_delivery_address, v_total, 'pending')
  returning id into v_order_id;

  insert into public.order_items
    (order_id, product_variant_id, quantity, unit_price, subtotal)
  select
    v_order_id,
    (item->>'product_variant_id')::uuid,
    (item->>'quantity')::int,
    v.price,
    v.price * (item->>'quantity')::int
  from jsonb_array_elements(p_items) item
  join public.product_variants v
    on v.id = (item->>'product_variant_id')::uuid;

  return json_build_object('id', v_order_id, 'total', v_total);
end;
$$;

revoke all on function public.create_order(text, text, text, text, jsonb) from public;
grant execute on function public.create_order(text, text, text, text, jsonb) to anon;
