import { NextResponse } from "next/server";

export function ok(data, init) {
  return NextResponse.json(data, init);
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Resource not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function tooManyRequests(message = "Too many requests. Please try again in a moment.") {
  return NextResponse.json({ error: message }, { status: 429 });
}

export function errorResponse(error, fallbackMessage = "Something went wrong") {
  const status = error?.status || 500;
  return NextResponse.json({ error: error?.message || fallbackMessage }, { status });
}
