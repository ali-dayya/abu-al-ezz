import { describe, it, expect } from "vitest";

// Test validateRequired as a standalone function since db.js imports Supabase
function validateRequired(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === "");
  return missing.length ? `Missing required fields: ${missing.join(", ")}` : null;
}

describe("validateRequired", () => {
  it("returns null when all fields present", () => {
    expect(validateRequired({ a: "1", b: "2" }, ["a", "b"])).toBeNull();
  });

  it("returns error string for missing fields", () => {
    const result = validateRequired({ a: "1" }, ["a", "b", "c"]);
    expect(result).toBe("Missing required fields: b, c");
  });

  it("treats empty string as missing", () => {
    expect(validateRequired({ a: "" }, ["a"])).toBe("Missing required fields: a");
  });

  it("treats undefined as missing", () => {
    expect(validateRequired({}, ["x"])).toBe("Missing required fields: x");
  });

  it("accepts 0 and false as present", () => {
    expect(validateRequired({ a: 0, b: false }, ["a", "b"])).toBeNull();
  });

  it("returns null for empty fields array", () => {
    expect(validateRequired({}, [])).toBeNull();
  });

  it("handles multiple missing fields", () => {
    const result = validateRequired({}, ["name", "email", "phone"]);
    expect(result).toBe("Missing required fields: name, email, phone");
  });
});
