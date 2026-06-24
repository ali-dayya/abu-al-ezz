import { createProduct } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/responses";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((h, j) => { row[h] = values[j] || ""; });
    rows.push(row);
  }

  return rows;
}

const FIELD_MAP = {
  product_name_en: ["product_name_en", "name_en", "name__en_", "product_name", "name"],
  product_name_ar: ["product_name_ar", "name_ar", "name__ar_"],
  description_en: ["description_en", "description", "desc_en"],
  description_ar: ["description_ar", "desc_ar"],
  price: ["price"],
  stock_quantity: ["stock_quantity", "stock", "quantity"],
  subcategory_id: ["subcategory_id", "subcategory"],
  image_url: ["image_url", "image"],
};

function mapRow(row) {
  const mapped = {};
  for (const [field, aliases] of Object.entries(FIELD_MAP)) {
    for (const alias of aliases) {
      if (row[alias] !== undefined && row[alias] !== "") {
        mapped[field] = row[alias];
        break;
      }
    }
  }
  return mapped;
}

export async function POST(request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body;
  try { body = await request.json(); } catch { return badRequest("Invalid JSON body"); }

  if (!body.csv || typeof body.csv !== "string") {
    return badRequest("csv field (string) is required");
  }

  const rows = parseCSV(body.csv);
  if (rows.length === 0) return badRequest("No data rows found in CSV");

  const results = { imported: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const mapped = mapRow(rows[i]);
    if (!mapped.product_name_en) {
      results.errors.push({ row: i + 2, error: "Missing product name" });
      continue;
    }
    if (!mapped.subcategory_id) {
      results.errors.push({ row: i + 2, error: "Missing subcategory_id" });
      continue;
    }

    try {
      await createProduct(mapped);
      results.imported++;
    } catch (err) {
      results.errors.push({ row: i + 2, error: err.message });
    }
  }

  return ok(results, { status: 201 });
}
