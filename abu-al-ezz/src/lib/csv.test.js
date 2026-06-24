import { describe, it, expect } from "vitest";

// Inline the CSV escaping logic from the export route for testing
function escapeCSV(val) {
  const str = String(val ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Inline the CSV parsing logic from the import route for testing
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
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === "," && !inQuotes) { values.push(current.trim()); current = ""; }
      else { current += char; }
    }
    values.push(current.trim());
    const row = {};
    headers.forEach((h, j) => { row[h] = values[j] || ""; });
    rows.push(row);
  }
  return rows;
}

describe("escapeCSV", () => {
  it("returns plain values as-is", () => {
    expect(escapeCSV("hello")).toBe("hello");
    expect(escapeCSV(42)).toBe("42");
  });

  it("wraps values with commas in quotes", () => {
    expect(escapeCSV("a,b")).toBe('"a,b"');
  });

  it("escapes double quotes", () => {
    expect(escapeCSV('say "hi"')).toBe('"say ""hi"""');
  });

  it("handles newlines", () => {
    expect(escapeCSV("line1\nline2")).toBe('"line1\nline2"');
  });

  it("handles null/undefined", () => {
    expect(escapeCSV(null)).toBe("");
    expect(escapeCSV(undefined)).toBe("");
  });
});

describe("parseCSV", () => {
  it("parses simple CSV", () => {
    const csv = "Name,Price\nWidget,9.99\nGadget,19.99";
    const rows = parseCSV(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ name: "Widget", price: "9.99" });
    expect(rows[1]).toEqual({ name: "Gadget", price: "19.99" });
  });

  it("handles quoted fields with commas", () => {
    const csv = 'Name,Desc\n"Widget, Pro","A great, wonderful item"';
    const rows = parseCSV(csv);
    expect(rows[0].name).toBe("Widget, Pro");
    expect(rows[0].desc).toBe("A great, wonderful item");
  });

  it("returns empty for header-only CSV", () => {
    expect(parseCSV("Name,Price")).toEqual([]);
  });

  it("returns empty for empty input", () => {
    expect(parseCSV("")).toEqual([]);
  });

  it("normalizes headers to lowercase with underscores", () => {
    const csv = "Product Name,Unit Price\nTest,5";
    const rows = parseCSV(csv);
    expect(rows[0]).toHaveProperty("product_name");
    expect(rows[0]).toHaveProperty("unit_price");
  });
});
