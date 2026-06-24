import { describe, it, expect } from "vitest";
import { ok, unauthorized, badRequest, notFound, forbidden, tooManyRequests, errorResponse } from "./responses";

describe("response helpers", () => {
  it("ok returns 200 with data", async () => {
    const res = ok({ hello: "world" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ hello: "world" });
  });

  it("ok respects custom status", async () => {
    const res = ok({ id: 1 }, { status: 201 });
    expect(res.status).toBe(201);
  });

  it("unauthorized returns 401", async () => {
    const res = unauthorized("Not logged in");
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Not logged in");
  });

  it("badRequest returns 400", async () => {
    const res = badRequest("Invalid");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid");
  });

  it("notFound returns 404", async () => {
    const res = notFound();
    expect(res.status).toBe(404);
  });

  it("forbidden returns 403", async () => {
    const res = forbidden();
    expect(res.status).toBe(403);
  });

  it("tooManyRequests returns 429", async () => {
    const res = tooManyRequests();
    expect(res.status).toBe(429);
  });

  it("errorResponse uses error.status when available", async () => {
    const err = new Error("Custom");
    err.status = 422;
    const res = errorResponse(err);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("Custom");
  });

  it("errorResponse defaults to 500", async () => {
    const res = errorResponse(new Error("Oops"));
    expect(res.status).toBe(500);
  });
});
