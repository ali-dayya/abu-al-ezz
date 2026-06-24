import { getProducts } from "@/lib/db";

const STATIC_ROUTES = ["", "/products", "/categories", "/about", "/contact"];

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  let productEntries = [];
  try {
    const products = await getProducts();
    productEntries = products.map((product) => ({
      url: `${siteUrl}/product/${product.product_id}`,
      lastModified: product.created_at ? new Date(product.created_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // Database unreachable during sitemap generation — fall back to static routes only.
  }

  return [...staticEntries, ...productEntries];
}
