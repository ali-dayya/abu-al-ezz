import { describe, it, expect } from 'vitest'
import {
  PRODUCT_STATUSES,
  ORDER_STATUSES,
  validationError,
  toPositiveInt,
  toNonNegativeInt,
  toNonNegativeNumber,
  toOneOf,
  requireNonEmptyString,
  toSafeUrl,
} from './validate'

describe('validationError', () => {
  it('creates an Error with status 400', () => {
    const err = validationError('bad input')
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('bad input')
    expect(err.status).toBe(400)
  })
})

describe('toPositiveInt', () => {
  it('accepts positive integers', () => {
    expect(toPositiveInt(5, 'field')).toBe(5)
    expect(toPositiveInt('10', 'field')).toBe(10)
  })

  it('rejects zero, negatives, decimals, and non-numbers', () => {
    expect(() => toPositiveInt(0, 'field')).toThrow('field must be a positive whole number')
    expect(() => toPositiveInt(-1, 'field')).toThrow('field must be a positive whole number')
    expect(() => toPositiveInt(1.5, 'field')).toThrow('field must be a positive whole number')
    expect(() => toPositiveInt('abc', 'field')).toThrow('field must be a positive whole number')
  })
})

describe('toNonNegativeInt', () => {
  it('accepts zero and positive integers', () => {
    expect(toNonNegativeInt(0, 'field')).toBe(0)
    expect(toNonNegativeInt('7', 'field')).toBe(7)
  })

  it('rejects negatives, decimals, and non-numbers', () => {
    expect(() => toNonNegativeInt(-1, 'field')).toThrow('field must be a whole number that is 0 or greater')
    expect(() => toNonNegativeInt(2.2, 'field')).toThrow('field must be a whole number that is 0 or greater')
    expect(() => toNonNegativeInt('abc', 'field')).toThrow('field must be a whole number that is 0 or greater')
  })
})

describe('toNonNegativeNumber', () => {
  it('accepts zero and positive numbers, rounding to 2 decimals', () => {
    expect(toNonNegativeNumber(0, 'field')).toBe(0)
    expect(toNonNegativeNumber('12.345', 'field')).toBe(12.35)
    expect(toNonNegativeNumber(9.999, 'field')).toBe(10)
  })

  it('rejects negatives and non-numbers', () => {
    expect(() => toNonNegativeNumber(-0.01, 'field')).toThrow('field must be a number that is 0 or greater')
    expect(() => toNonNegativeNumber('abc', 'field')).toThrow('field must be a number that is 0 or greater')
    expect(() => toNonNegativeNumber(Infinity, 'field')).toThrow('field must be a number that is 0 or greater')
  })
})

describe('toOneOf', () => {
  it('accepts values in the allowed list', () => {
    expect(toOneOf('available', PRODUCT_STATUSES, 'status')).toBe('available')
    expect(toOneOf('pending', ORDER_STATUSES, 'status')).toBe('pending')
  })

  it('rejects values outside the allowed list', () => {
    expect(() => toOneOf('shipped', ORDER_STATUSES, 'status')).toThrow(
      `status must be one of: ${ORDER_STATUSES.join(', ')}`
    )
  })
})

describe('requireNonEmptyString', () => {
  it('accepts non-empty strings', () => {
    expect(requireNonEmptyString('hello', 'field')).toBe('hello')
  })

  it('rejects empty, whitespace-only, and non-string values', () => {
    expect(() => requireNonEmptyString('', 'field')).toThrow('field is required')
    expect(() => requireNonEmptyString('   ', 'field')).toThrow('field is required')
    expect(() => requireNonEmptyString(null, 'field')).toThrow('field is required')
    expect(() => requireNonEmptyString(undefined, 'field')).toThrow('field is required')
    expect(() => requireNonEmptyString(5, 'field')).toThrow('field is required')
  })

  it('rejects strings exceeding maxLength', () => {
    expect(() => requireNonEmptyString('a'.repeat(201), 'field', 200)).toThrow('field must be 200 characters or fewer')
  })

  it('accepts strings exactly at maxLength', () => {
    expect(requireNonEmptyString('a'.repeat(200), 'field', 200)).toBe('a'.repeat(200))
  })
})

describe('toSafeUrl', () => {
  it('accepts http and https URLs', () => {
    expect(toSafeUrl('https://example.com/img.jpg', 'url')).toBe('https://example.com/img.jpg')
    expect(toSafeUrl('http://cdn.test/img.png', 'url')).toBe('http://cdn.test/img.png')
  })

  it('trims whitespace', () => {
    expect(toSafeUrl('  https://example.com  ', 'url')).toBe('https://example.com')
  })

  it('returns empty string for falsy values', () => {
    expect(toSafeUrl('', 'url')).toBe('')
    expect(toSafeUrl(null, 'url')).toBe('')
    expect(toSafeUrl(undefined, 'url')).toBe('')
  })

  it('rejects javascript: and data: URIs', () => {
    expect(() => toSafeUrl('javascript:alert(1)', 'url')).toThrow('url must be a valid http/https URL')
    expect(() => toSafeUrl('data:text/html,<h1>xss</h1>', 'url')).toThrow('url must be a valid http/https URL')
  })

  it('rejects plain paths with no protocol', () => {
    expect(() => toSafeUrl('/relative/path.jpg', 'url')).toThrow('url must be a valid http/https URL')
  })
})

describe('status constants', () => {
  it('PRODUCT_STATUSES contains expected values', () => {
    expect(PRODUCT_STATUSES).toEqual(['available', 'out_of_stock'])
  })

  it('ORDER_STATUSES contains expected values', () => {
    expect(ORDER_STATUSES).toEqual(['pending', 'confirmed', 'cancelled', 'completed'])
  })
})
