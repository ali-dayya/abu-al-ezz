import { getProduct, getProductReviews } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id).catch(() => null);
  if (!product) {
    return { title: "Product Not Found — Abu Al-Ezz Institution" };
  }

  const reviews = await getProductReviews(params.id).catch(() => []);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const nameEn = product.product_name_en;
  const nameAr = product.product_name_ar;
  const desc = product.description_en || `Buy ${nameEn} from Abu Al-Ezz Institution in Lebanon.`;
  const image = product.image_url || `${siteUrl}/og-image.jpg`;
  const url = `${siteUrl}/product/${product.product_id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: nameEn,
    description: desc,
    image: product.image_url || undefined,
    url,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability: product.availability_status === "available"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(avgRating ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating,
        reviewCount: reviews.length,
        bestRating: "5",
        worstRating: "1",
      },
    } : {}),
  };

  return {
    title: `${nameEn} — Abu Al-Ezz Institution`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: nameAr ? `${nameEn} | ${nameAr}` : nameEn,
      description: desc,
      url,
      images: [{ url: image, alt: nameEn, width: 800, height: 800 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${nameEn} — Abu Al-Ezz Institution`,
      description: desc,
      images: [image],
    },
    other: {
      "product:price:amount": product.price.toFixed(2),
      "product:price:currency": "USD",
      "product:availability": product.availability_status === "available" ? "in stock" : "out of stock",
      ...(avgRating ? { "product:rating": avgRating } : {}),
      "script:ld+json": JSON.stringify(jsonLd),
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
