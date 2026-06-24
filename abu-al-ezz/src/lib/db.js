import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  ORDER_STATUSES,
  PRODUCT_STATUSES,
  requireNonEmptyString,
  toNonNegativeInt,
  toNonNegativeNumber,
  toOneOf,
  toPositiveInt,
  toSafeUrl,
} from "@/lib/validate";

export function validateRequired(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === "");
  return missing.length ? `Missing required fields: ${missing.join(", ")}` : null;
}

export function forbiddenError(message = "Forbidden") {
  const error = new Error(message);
  error.status = 403;
  return error;
}

function throwIfRls(error) {
  if (error?.code === "42501") throw forbiddenError();
  throw error;
}

const PRODUCT_SELECT = "*, subcategories(category_id)";

function flattenProduct(row) {
  const { subcategories, ...rest } = row;
  return {
    ...rest,
    category_id: subcategories?.category_id ?? null,
    price: Number(row.price),
    stock_quantity: Number(row.stock_quantity),
  };
}

export async function getProducts() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("product_id");

  if (error) throw error;
  return data.map(flattenProduct);
}

export async function getProduct(id) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("product_id", Number(id))
    .maybeSingle();

  if (error) throw error;
  return data ? flattenProduct(data) : null;
}

function productPayload(body) {
  return {
    subcategory_id: toPositiveInt(body.subcategory_id, "subcategory_id"),
    product_name_en: requireNonEmptyString(body.product_name_en, "product_name_en", 200),
    product_name_ar: body.product_name_ar
      ? requireNonEmptyString(body.product_name_ar, "product_name_ar", 200)
      : "",
    description_en: body.description_en
      ? requireNonEmptyString(body.description_en, "description_en", 2000)
      : "",
    description_ar: body.description_ar
      ? requireNonEmptyString(body.description_ar, "description_ar", 2000)
      : "",
    price: toNonNegativeNumber(body.price, "price"),
    stock_quantity:
      body.stock_quantity === undefined || body.stock_quantity === ""
        ? 0
        : toNonNegativeInt(body.stock_quantity, "stock_quantity"),
    availability_status: toOneOf(body.availability_status || "available", PRODUCT_STATUSES, "availability_status"),
    image_url: toSafeUrl(body.image_url, "image_url"),
  };
}

export async function createProduct(body) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .insert(productPayload(body))
    .select(PRODUCT_SELECT)
    .single();

  if (error) throwIfRls(error);
  return flattenProduct(data);
}

export async function updateProduct(id, body) {
  const supabase = getSupabaseServerClient();
  const existing = await getProduct(id);
  if (!existing) return null;

  const { data, error } = await supabase
    .from("products")
    .update(productPayload(body))
    .eq("product_id", Number(id))
    .select(PRODUCT_SELECT)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw forbiddenError();
  return flattenProduct(data);
}

export async function deleteProduct(id) {
  const supabase = getSupabaseServerClient();
  const existing = await getProduct(id);
  if (!existing) return false;

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("product_id", Number(id))
    .select("product_id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw forbiddenError();
  return true;
}

export async function getCategoriesWithSubcategories() {
  const supabase = getSupabaseServerClient();
  const [categoriesResult, subcategoriesResult] = await Promise.all([
    supabase.from("categories").select("*").order("category_id"),
    supabase.from("subcategories").select("*").order("subcategory_id"),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (subcategoriesResult.error) throw subcategoriesResult.error;

  return {
    categories: categoriesResult.data,
    subcategories: subcategoriesResult.data,
  };
}

export async function createCategory(body) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      category_name_en: requireNonEmptyString(body.category_name_en, "category_name_en"),
      category_name_ar: body.category_name_ar,
      description_en: body.description_en || "",
      description_ar: body.description_ar || "",
      icon: body.icon || "",
    })
    .select()
    .single();

  if (error) throwIfRls(error);
  return data;
}

export async function updateCategory(id, body) {
  const supabase = getSupabaseServerClient();
  const { data: existing, error: existingError } = await supabase
    .from("categories")
    .select("category_id")
    .eq("category_id", Number(id))
    .maybeSingle();

  if (existingError) throw existingError;
  if (!existing) return null;

  const { data, error } = await supabase
    .from("categories")
    .update({
      category_name_en: requireNonEmptyString(body.category_name_en, "category_name_en"),
      category_name_ar: body.category_name_ar,
      description_en: body.description_en || "",
      description_ar: body.description_ar || "",
      icon: body.icon || "",
    })
    .eq("category_id", Number(id))
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw forbiddenError();
  return data;
}

export async function deleteCategory(id) {
  const supabase = getSupabaseServerClient();
  const { data: existing, error: existingError } = await supabase
    .from("categories")
    .select("category_id")
    .eq("category_id", Number(id))
    .maybeSingle();

  if (existingError) throw existingError;
  if (!existing) return false;

  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("category_id", Number(id))
    .select("category_id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw forbiddenError();
  return true;
}

export async function createSubcategory(body) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("subcategories")
    .insert({
      category_id: toPositiveInt(body.category_id, "category_id"),
      subcategory_name_en: requireNonEmptyString(body.subcategory_name_en, "subcategory_name_en"),
      subcategory_name_ar: body.subcategory_name_ar || "",
      description_en: body.description_en || "",
      description_ar: body.description_ar || "",
    })
    .select()
    .single();

  if (error) throwIfRls(error);
  return data;
}

export async function updateSubcategory(id, body) {
  const supabase = getSupabaseServerClient();
  const { data: existing, error: existingError } = await supabase
    .from("subcategories")
    .select("subcategory_id")
    .eq("subcategory_id", Number(id))
    .maybeSingle();

  if (existingError) throw existingError;
  if (!existing) return null;

  const { data, error } = await supabase
    .from("subcategories")
    .update({
      category_id: toPositiveInt(body.category_id, "category_id"),
      subcategory_name_en: requireNonEmptyString(body.subcategory_name_en, "subcategory_name_en"),
      subcategory_name_ar: body.subcategory_name_ar || "",
      description_en: body.description_en || "",
      description_ar: body.description_ar || "",
    })
    .eq("subcategory_id", Number(id))
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw forbiddenError();
  return data;
}

export async function deleteSubcategory(id) {
  const supabase = getSupabaseServerClient();
  const { data: existing, error: existingError } = await supabase
    .from("subcategories")
    .select("subcategory_id")
    .eq("subcategory_id", Number(id))
    .maybeSingle();

  if (existingError) throw existingError;
  if (!existing) return false;

  const { data, error } = await supabase
    .from("subcategories")
    .delete()
    .eq("subcategory_id", Number(id))
    .select("subcategory_id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw forbiddenError();
  return true;
}

export async function getStoreInfo() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("store_info")
    .select("*")
    .order("store_id")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateStoreInfo(body) {
  const supabase = getSupabaseServerClient();
  const current = await getStoreInfo();
  if (!current) throw new Error("Store info not found");

  const { data, error } = await supabase
    .from("store_info")
    .update({
      store_name_en: requireNonEmptyString(body.store_name_en, "store_name_en"),
      store_name_ar: requireNonEmptyString(body.store_name_ar || current.store_name_ar, "store_name_ar"),
      tagline_en: body.tagline_en ?? current.tagline_en,
      tagline_ar: body.tagline_ar ?? current.tagline_ar,
      phone: body.phone || "",
      address_en: body.address_en || "",
      address_ar: body.address_ar || "",
      whatsapp_num: body.whatsapp_num || "",
      insta_link: toSafeUrl(body.insta_link, "insta_link"),
      facebook_link: toSafeUrl(body.facebook_link, "facebook_link"),
      open_hours_en: body.open_hours_en || "",
      open_hours_ar: body.open_hours_ar || "",
    })
    .eq("store_id", current.store_id)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw forbiddenError();
  return data;
}

const ORDER_SELECT = `
  *,
  customers ( full_name, email, phone ),
  order_items (
    order_item_id,
    product_id,
    quantity,
    unit_price,
    subtotal,
    products ( product_name_en, product_name_ar )
  )
`;

function mapOrder(order) {
  return {
    order_id: order.order_id,
    customer_id: order.customer_id,
    customer_name: order.customers?.full_name || "",
    customer: {
      name: order.customers?.full_name || "",
      email: order.customers?.email || "",
      phone: order.customers?.phone || "",
    },
    order_date: order.order_date,
    status: order.status,
    total_amount: Number(order.total_amount),
    coupon_code: order.coupon_code || "",
    discount_amount: Number(order.discount_amount || 0),
    delivery_zone_id: order.delivery_zone_id || null,
    delivery_fee: Number(order.delivery_fee || 0),
    notes: order.notes || "",
    items: (order.order_items || []).map((item) => ({
      order_item_id: item.order_item_id,
      product_id: item.product_id,
      name_en: item.products?.product_name_en || "",
      name_ar: item.products?.product_name_ar || "",
      product_name_en: item.products?.product_name_en || "",
      product_name_ar: item.products?.product_name_ar || "",
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      subtotal: Number(item.subtotal),
    })),
  };
}

export async function getOrderById(id) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("order_id", Number(id))
    .maybeSingle();

  if (error) throw error;
  return data ? mapOrder(data) : null;
}

export async function getOrders({ page = 1, limit = 25, status = "" } = {}) {
  const supabase = getSupabaseServerClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("orders")
    .select(ORDER_SELECT, { count: "exact" })
    .order("order_date", { ascending: false })
    .order("order_id", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;
  return {
    data: data.map(mapOrder),
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getAllOrders({ status = "" } = {}) {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("orders")
    .select(ORDER_SELECT)
    .order("order_date", { ascending: false })
    .order("order_id", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapOrder);
}

export async function getCustomers() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name, email, phone, created_at, orders(order_id, total_amount, status)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProductsByIds(ids) {
  if (!ids?.length) return [];
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .in("product_id", ids);
  if (error) throw error;
  return data.map(flattenProduct);
}

export async function createOrder(body) {
  const supabase = getSupabaseServerClient();

  const items = (body.items || []).map((item) => ({
    product_id: Number(item.product_id),
    quantity: Math.max(1, Number(item.quantity ?? item.qty) || 1),
  }));

  const { data: orderId, error } = await supabase.rpc("create_order", {
    items,
    notes: body.notes || "",
  });

  if (error) {
    const message = error.message || "";

    if (message === "AUTH_REQUIRED") {
      const authError = new Error("You must be logged in to place an order");
      authError.status = 401;
      throw authError;
    }

    if (message === "EMPTY_ORDER") {
      const emptyError = new Error("Your cart is empty");
      emptyError.status = 400;
      throw emptyError;
    }

    if (message.startsWith("INSUFFICIENT_STOCK:")) {
      const productName = message.slice("INSUFFICIENT_STOCK:".length);
      const stockError = new Error(`Not enough stock for ${productName}`);
      stockError.status = 400;
      throw stockError;
    }

    if (message.startsWith("PRODUCT_NOT_FOUND:")) {
      const productId = message.slice("PRODUCT_NOT_FOUND:".length);
      const notFoundError = new Error(`Product ${productId} no longer exists`);
      notFoundError.status = 400;
      throw notFoundError;
    }

    throw error;
  }

  return await getOrderById(orderId);
}

export async function createOrderCheckout(body) {
  const supabase = getSupabaseServerClient();

  const items = (body.items || []).map((item) => ({
    product_id: Number(item.product_id),
    quantity: Math.max(1, Number(item.quantity ?? item.qty) || 1),
  }));

  const { data: orderId, error } = await supabase.rpc("create_order_checkout", {
    items,
    notes: body.notes || "",
    coupon_code: body.coupon_code || "",
    delivery_zone_id: body.delivery_zone_id ? Number(body.delivery_zone_id) : null,
  });

  if (error) {
    const message = error.message || "";
    const knownErrors = {
      AUTH_REQUIRED: { message: "You must be logged in to place an order", status: 401 },
      EMPTY_ORDER: { message: "Your cart is empty", status: 400 },
      ORDER_NOT_FOUND: { message: "Order could not be updated", status: 400 },
      INVALID_COUPON: { message: "Invalid coupon code", status: 400 },
      COUPON_EXPIRED: { message: "This coupon has expired", status: 400 },
      COUPON_USAGE_LIMIT: { message: "This coupon has reached its usage limit", status: 400 },
      COUPON_ALREADY_USED: { message: "You have already used this coupon", status: 400 },
      INVALID_DELIVERY_ZONE: { message: "Invalid delivery zone", status: 400 },
    };

    const minOrderMatch = message.match(/^MIN_ORDER_AMOUNT:(.+)$/);
    if (minOrderMatch) {
      throw Object.assign(new Error(`Minimum order amount is $${Number(minOrderMatch[1]).toFixed(2)}`), { status: 400 });
    }

    if (message.startsWith("INSUFFICIENT_STOCK:")) {
      const productName = message.slice("INSUFFICIENT_STOCK:".length);
      throw Object.assign(new Error(`Not enough stock for ${productName}`), { status: 400 });
    }

    if (message.startsWith("PRODUCT_NOT_FOUND:")) {
      const productId = message.slice("PRODUCT_NOT_FOUND:".length);
      throw Object.assign(new Error(`Product ${productId} no longer exists`), { status: 400 });
    }

    if (knownErrors[message]) {
      throw Object.assign(new Error(knownErrors[message].message), { status: knownErrors[message].status });
    }

    throw error;
  }

  return await getOrderById(orderId);
}

export async function applyOrderCheckoutAdjustments(orderId, body = {}) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.rpc("apply_order_checkout_adjustments", {
    p_order_id: Number(orderId),
    p_coupon_code: body.coupon_code || "",
    p_delivery_zone_id: body.delivery_zone_id ? Number(body.delivery_zone_id) : null,
  });

  if (error) {
    const message = error.message || "";
    const knownErrors = {
      ORDER_NOT_FOUND: "Order could not be updated",
      INVALID_COUPON: "Invalid coupon code",
      COUPON_EXPIRED: "This coupon has expired",
      COUPON_USAGE_LIMIT: "This coupon has reached its usage limit",
      COUPON_ALREADY_USED: "You have already used this coupon",
      INVALID_DELIVERY_ZONE: "Invalid delivery zone",
    };

    const minOrderMatch = message.match(/^MIN_ORDER_AMOUNT:(.+)$/);
    if (minOrderMatch) {
      throw Object.assign(new Error(`Minimum order amount is $${Number(minOrderMatch[1]).toFixed(2)}`), { status: 400 });
    }

    if (knownErrors[message]) {
      throw Object.assign(new Error(knownErrors[message]), { status: 400 });
    }

    throw error;
  }
}

export async function updateOrder(id, body) {
  const supabase = getSupabaseServerClient();
  toOneOf(body.status, ORDER_STATUSES, "status");

  const { data: existing, error: existingError } = await supabase
    .from("orders")
    .select("order_id")
    .eq("order_id", Number(id))
    .maybeSingle();

  if (existingError) throw existingError;
  if (!existing) return null;

  const { data, error } = await supabase
    .from("orders")
    .update({ status: body.status })
    .eq("order_id", Number(id))
    .select("order_id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw forbiddenError();

  return await getOrderById(Number(id));
}

export async function getDashboard() {
  const supabase = getSupabaseServerClient();
  const [products, ordersResult, customersResult] = await Promise.all([
    getProducts(),
    getOrders({ page: 1, limit: 500 }),
    supabase.from("customers").select("id, full_name, email, created_at").order("created_at"),
  ]);

  if (customersResult.error) throw customersResult.error;
  return { products, orders: ordersResult.data, customers: customersResult.data };
}

// ==================== REVIEWS ====================

export async function getProductReviews(productId) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, customers(full_name)")
    .eq("product_id", Number(productId))
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((r) => ({
    review_id: r.review_id,
    product_id: r.product_id,
    customer_id: r.customer_id,
    customer_name: r.customers?.full_name || "",
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
  }));
}

export async function createReview(productId, body) {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw Object.assign(new Error("Login required"), { status: 401 });

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw Object.assign(new Error("Rating must be between 1 and 5"), { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .upsert(
      {
        product_id: Number(productId),
        customer_id: user.id,
        rating,
        comment: (body.comment || "").slice(0, 1000),
      },
      { onConflict: "product_id,customer_id" }
    )
    .select("*, customers(full_name)")
    .single();

  if (error) throw error;
  return {
    review_id: data.review_id,
    product_id: data.product_id,
    customer_id: data.customer_id,
    customer_name: data.customers?.full_name || "",
    rating: data.rating,
    comment: data.comment,
    created_at: data.created_at,
  };
}

export async function deleteReview(reviewId) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("review_id", Number(reviewId));

  if (error) throw error;
  return true;
}

// ==================== WISHLIST ====================

export async function getWishlist() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select("*, products(*, subcategories(category_id))")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((w) => ({
    wishlist_id: w.wishlist_id,
    product_id: w.product_id,
    created_at: w.created_at,
    product: w.products ? flattenProduct(w.products) : null,
  }));
}

export async function getWishlistIds() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select("product_id");

  if (error) throw error;
  return data.map((w) => w.product_id);
}

export async function toggleWishlist(productId) {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw Object.assign(new Error("Login required"), { status: 401 });

  const { data: existing } = await supabase
    .from("wishlist")
    .select("wishlist_id")
    .eq("customer_id", user.id)
    .eq("product_id", Number(productId))
    .maybeSingle();

  if (existing) {
    await supabase.from("wishlist").delete().eq("wishlist_id", existing.wishlist_id);
    return { added: false };
  }

  const { error } = await supabase
    .from("wishlist")
    .insert({ customer_id: user.id, product_id: Number(productId) });

  if (error) throw error;
  return { added: true };
}

// ==================== PROFILE ====================

export async function getProfile() {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw Object.assign(new Error("Login required"), { status: 401 });

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProfile(body) {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw Object.assign(new Error("Login required"), { status: 401 });

  const { data, error } = await supabase
    .from("customers")
    .update({
      full_name: requireNonEmptyString(body.full_name, "full_name", 200),
      phone: body.phone || "",
      address: body.address || "",
    })
    .eq("id", user.id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ==================== REPORTS ====================

export async function getRevenueByCategory() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("revenue_by_category")
    .select("*");

  if (error) throw error;
  return data.map((r) => ({
    ...r,
    total_revenue: Number(r.total_revenue),
    total_units_sold: Number(r.total_units_sold),
  }));
}

export async function getTopSellingProducts(limit = 10) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("top_selling_products")
    .select("*")
    .limit(limit);

  if (error) throw error;
  return data.map((r) => ({
    ...r,
    price: Number(r.price),
    total_sold: Number(r.total_sold),
    total_revenue: Number(r.total_revenue),
  }));
}

export async function getOrdersPerDay(days = 30) {
  const supabase = getSupabaseServerClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("orders_per_day")
    .select("*")
    .gte("order_date", since.toISOString().split("T")[0]);

  if (error) throw error;
  return data.map((r) => ({
    ...r,
    order_count: Number(r.order_count),
    daily_revenue: Number(r.daily_revenue),
  }));
}

// ==================== AUDIT LOG ====================

export async function getAuditLog({ page = 1, limit = 50, table_name = "" } = {}) {
  const supabase = getSupabaseServerClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("audit_log")
    .select("*", { count: "exact" })
    .order("changed_at", { ascending: false });

  if (table_name) query = query.eq("table_name", table_name);

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;
  return {
    data: data || [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

// ==================== PRODUCT IMAGES ====================

export async function getProductImages(productId) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", Number(productId))
    .order("display_order");

  if (error) throw error;
  return data;
}

export async function addProductImage(productId, imageUrl, displayOrder = 0) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("product_images")
    .insert({ product_id: Number(productId), image_url: imageUrl, display_order: displayOrder })
    .select()
    .single();

  if (error) throwIfRls(error);
  return data;
}

export async function deleteProductImage(imageId) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("image_id", Number(imageId));

  if (error) throw error;
  return true;
}

export async function reorderProductImages(productId, imageIds) {
  const supabase = getSupabaseServerClient();
  const updates = imageIds.map((id, i) =>
    supabase.from("product_images").update({ display_order: i }).eq("image_id", id).eq("product_id", Number(productId))
  );
  await Promise.all(updates);
  return true;
}

// ==================== COUPONS ====================

export async function getCoupons() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((c) => ({ ...c, discount_value: Number(c.discount_value), min_order_amount: Number(c.min_order_amount) }));
}

export async function createCoupon(body) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("coupons")
    .insert({
      code: requireNonEmptyString(body.code, "code", 50).toUpperCase().trim(),
      discount_type: toOneOf(body.discount_type || "percentage", ["percentage", "fixed"], "discount_type"),
      discount_value: toNonNegativeNumber(body.discount_value, "discount_value"),
      min_order_amount: body.min_order_amount ? toNonNegativeNumber(body.min_order_amount, "min_order_amount") : 0,
      max_uses: body.max_uses ? toPositiveInt(body.max_uses, "max_uses") : null,
      expires_at: body.expires_at || null,
      is_active: body.is_active !== false,
    })
    .select()
    .single();

  if (error) throwIfRls(error);
  return { ...data, discount_value: Number(data.discount_value), min_order_amount: Number(data.min_order_amount) };
}

export async function updateCoupon(id, body) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("coupons")
    .update({
      code: requireNonEmptyString(body.code, "code", 50).toUpperCase().trim(),
      discount_type: toOneOf(body.discount_type || "percentage", ["percentage", "fixed"], "discount_type"),
      discount_value: toNonNegativeNumber(body.discount_value, "discount_value"),
      min_order_amount: body.min_order_amount ? toNonNegativeNumber(body.min_order_amount, "min_order_amount") : 0,
      max_uses: body.max_uses ? toPositiveInt(body.max_uses, "max_uses") : null,
      expires_at: body.expires_at || null,
      is_active: body.is_active !== false,
    })
    .eq("coupon_id", Number(id))
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw forbiddenError();
  return { ...data, discount_value: Number(data.discount_value), min_order_amount: Number(data.min_order_amount) };
}

export async function deleteCoupon(id) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("coupons")
    .delete()
    .eq("coupon_id", Number(id));

  if (error) throw error;
  return true;
}

export async function validateCoupon(code, orderAmount) {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw Object.assign(new Error("Login required"), { status: 401 });

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!coupon) throw Object.assign(new Error("Invalid coupon code"), { status: 400 });

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    throw Object.assign(new Error("This coupon has expired"), { status: 400 });
  }

  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    throw Object.assign(new Error("This coupon has reached its usage limit"), { status: 400 });
  }

  const amt = Number(orderAmount);
  if (amt < Number(coupon.min_order_amount)) {
    throw Object.assign(new Error(`Minimum order amount is $${Number(coupon.min_order_amount).toFixed(2)}`), { status: 400 });
  }

  const { data: alreadyUsed } = await supabase
    .from("coupon_uses")
    .select("id")
    .eq("coupon_id", coupon.coupon_id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (alreadyUsed) {
    throw Object.assign(new Error("You have already used this coupon"), { status: 400 });
  }

  let discount = 0;
  if (coupon.discount_type === "percentage") {
    discount = Math.round(amt * Number(coupon.discount_value) / 100 * 100) / 100;
  } else {
    discount = Math.min(Number(coupon.discount_value), amt);
  }

  return {
    coupon_id: coupon.coupon_id,
    code: coupon.code,
    discount_type: coupon.discount_type,
    discount_value: Number(coupon.discount_value),
    discount,
    final_amount: Math.round((amt - discount) * 100) / 100,
  };
}

// ==================== STOCK NOTIFICATIONS ====================

export async function subscribeStockNotification(productId) {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw Object.assign(new Error("Login required"), { status: 401 });

  const { data: customer } = await supabase
    .from("customers")
    .select("email")
    .eq("id", user.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("stock_notifications")
    .upsert(
      { product_id: Number(productId), customer_id: user.id, email: customer?.email || user.email },
      { onConflict: "product_id,customer_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyStockNotifications() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("stock_notifications")
    .select("*, products(product_name_en, product_name_ar, availability_status)")
    .eq("notified", false);

  if (error) throw error;
  return data;
}

export async function unsubscribeStockNotification(productId) {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw Object.assign(new Error("Login required"), { status: 401 });

  const { error } = await supabase
    .from("stock_notifications")
    .delete()
    .eq("product_id", Number(productId))
    .eq("customer_id", user.id);

  if (error) throw error;
  return true;
}

// ==================== DELIVERY ZONES ====================

export async function getDeliveryZones() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) throw error;
  return data.map((z) => ({ ...z, delivery_fee: Number(z.delivery_fee) }));
}

export async function getAllDeliveryZones() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .order("display_order");

  if (error) throw error;
  return data.map((z) => ({ ...z, delivery_fee: Number(z.delivery_fee) }));
}

export async function upsertDeliveryZone(body) {
  const supabase = getSupabaseServerClient();
  const payload = {
    zone_name_en: requireNonEmptyString(body.zone_name_en, "zone_name_en", 100),
    zone_name_ar: body.zone_name_ar || "",
    estimated_days: toNonNegativeInt(body.estimated_days ?? 1, "estimated_days"),
    delivery_fee: toNonNegativeNumber(body.delivery_fee ?? 0, "delivery_fee"),
    is_active: body.is_active !== false,
    display_order: body.display_order ?? 0,
  };

  if (body.zone_id) {
    const { data, error } = await supabase
      .from("delivery_zones")
      .update(payload)
      .eq("zone_id", Number(body.zone_id))
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw forbiddenError();
    return { ...data, delivery_fee: Number(data.delivery_fee) };
  }

  const { data, error } = await supabase
    .from("delivery_zones")
    .insert(payload)
    .select()
    .single();

  if (error) throwIfRls(error);
  return { ...data, delivery_fee: Number(data.delivery_fee) };
}

// ==================== BULK PRODUCT OPERATIONS ====================

export async function bulkDeleteProducts(ids) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .in("product_id", ids.map(Number));

  if (error) throw error;
  return true;
}

export async function bulkUpdateProductStock(updates) {
  const supabase = getSupabaseServerClient();
  const results = await Promise.all(
    updates.map(({ product_id, stock_quantity }) =>
      supabase
        .from("products")
        .update({
          stock_quantity: Math.max(0, Number(stock_quantity)),
          availability_status: Number(stock_quantity) > 0 ? "available" : "out_of_stock",
        })
        .eq("product_id", Number(product_id))
    )
  );
  const failed = results.filter((r) => r.error);
  if (failed.length) throw failed[0].error;
  return true;
}

export async function bulkUpdateProductPrice(updates) {
  const supabase = getSupabaseServerClient();
  const results = await Promise.all(
    updates.map(({ product_id, price }) =>
      supabase
        .from("products")
        .update({ price: Math.max(0, Number(price)) })
        .eq("product_id", Number(product_id))
    )
  );
  const failed = results.filter((r) => r.error);
  if (failed.length) throw failed[0].error;
  return true;
}

// ==================== ADMIN: PENDING ORDER COUNT ====================

export async function getPendingOrderCount() {
  const supabase = getSupabaseServerClient();
  const { count, error } = await supabase
    .from("orders")
    .select("order_id", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) throw error;
  return count ?? 0;
}

// ==================== PRODUCTS PAGINATION ====================

export async function getProductsPaginated({ page = 1, limit = 12, search = "", category = "", status = "" } = {}) {
  const supabase = getSupabaseServerClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .order("product_id");

  if (search) {
    query = query.or(`product_name_en.ilike.%${search}%,product_name_ar.ilike.%${search}%`);
  }
  if (status) query = query.eq("availability_status", status);

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  let results = data.map(flattenProduct);
  if (category) {
    results = results.filter((p) => p.category_id === Number(category));
  }

  return {
    data: results,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}
