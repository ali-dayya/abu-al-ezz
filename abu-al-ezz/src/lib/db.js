import { getSupabaseServerClient } from "@/lib/supabase/server";

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

export async function createProduct(body) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      subcategory_id: Number(body.subcategory_id),
      product_name_en: body.product_name_en,
      product_name_ar: body.product_name_ar,
      description_en: body.description_en || "",
      description_ar: body.description_ar || "",
      price: Number(body.price),
      stock_quantity: Number(body.stock_quantity) || 0,
      availability_status: body.availability_status || "available",
      image_url: body.image_url || "",
    })
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
    .update({
      subcategory_id: Number(body.subcategory_id),
      product_name_en: body.product_name_en,
      product_name_ar: body.product_name_ar,
      description_en: body.description_en || "",
      description_ar: body.description_ar || "",
      price: Number(body.price),
      stock_quantity: Number(body.stock_quantity) || 0,
      availability_status: body.availability_status || "available",
      image_url: body.image_url || "",
    })
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
      category_name_en: body.category_name_en,
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
      category_name_en: body.category_name_en,
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
      category_id: Number(body.category_id),
      subcategory_name_en: body.subcategory_name_en,
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
      category_id: Number(body.category_id),
      subcategory_name_en: body.subcategory_name_en,
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
      store_name_en: body.store_name_en,
      store_name_ar: body.store_name_ar,
      tagline_en: body.tagline_en ?? current.tagline_en,
      tagline_ar: body.tagline_ar ?? current.tagline_ar,
      phone: body.phone || "",
      address_en: body.address_en || "",
      address_ar: body.address_ar || "",
      whatsapp_num: body.whatsapp_num || "",
      insta_link: body.insta_link || "",
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
  customers ( full_name ),
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
    order_date: order.order_date,
    status: order.status,
    total_amount: Number(order.total_amount),
    notes: order.notes || "",
    items: (order.order_items || []).map((item) => ({
      order_item_id: item.order_item_id,
      product_id: item.product_id,
      product_name_en: item.products?.product_name_en || "",
      product_name_ar: item.products?.product_name_ar || "",
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      subtotal: Number(item.subtotal),
    })),
  };
}

export async function getOrders() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .order("order_date", { ascending: false })
    .order("order_id", { ascending: false });

  if (error) throw error;
  return data.map(mapOrder);
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

  const orders = await getOrders();
  return orders.find((order) => order.order_id === orderId);
}

export async function updateOrder(id, body) {
  const supabase = getSupabaseServerClient();
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

  const orders = await getOrders();
  return orders.find((order) => order.order_id === Number(id)) || null;
}

export async function getDashboard() {
  const supabase = getSupabaseServerClient();
  const [products, orders, customersResult] = await Promise.all([
    getProducts(),
    getOrders(),
    supabase.from("customers").select("id, full_name, email, created_at").order("created_at"),
  ]);

  if (customersResult.error) throw customersResult.error;
  return { products, orders, customers: customersResult.data };
}
