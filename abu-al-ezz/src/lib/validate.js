export const PRODUCT_STATUSES = ["available", "out_of_stock"];
export const ORDER_STATUSES = ["pending", "confirmed", "cancelled", "completed"];

export function validationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

export function toPositiveInt(value, field) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) {
    throw validationError(`${field} must be a positive whole number`);
  }
  return n;
}

export function toNonNegativeInt(value, field) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw validationError(`${field} must be a whole number that is 0 or greater`);
  }
  return n;
}

export function toNonNegativeNumber(value, field) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) {
    throw validationError(`${field} must be a number that is 0 or greater`);
  }
  return Math.round(n * 100) / 100;
}

export function toOneOf(value, allowed, field) {
  if (!allowed.includes(value)) {
    throw validationError(`${field} must be one of: ${allowed.join(", ")}`);
  }
  return value;
}

export function requireNonEmptyString(value, field, maxLength) {
  if (typeof value !== "string" || value.trim() === "") {
    throw validationError(`${field} is required`);
  }
  if (maxLength && value.length > maxLength) {
    throw validationError(`${field} must be ${maxLength} characters or fewer`);
  }
  return value;
}

export function toSafeUrl(value, field) {
  if (!value) return "";
  if (typeof value !== "string") throw validationError(`${field} must be a string`);
  const trimmed = value.trim();
  if (trimmed === "") return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    throw validationError(`${field} must be a valid http/https URL`);
  }
  if (trimmed.length > 2048) {
    throw validationError(`${field} must be 2048 characters or fewer`);
  }
  return trimmed;
}
