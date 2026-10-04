import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

// Credentials that exist in data/users.ts
const VALID_EMAIL = "alex.morgan@example.com";
const VALID_PASSWORD = "password123";

describe("POST /auth/login", () => {
  it("returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ password: VALID_PASSWORD });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      error: "Email and password are required",
    });
  });

  it("returns 400 when password is missing", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: VALID_EMAIL });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      error: "Email and password are required",
    });
  });

  it("returns 401 for wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: VALID_EMAIL, password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      success: false,
      error: "Invalid email or password",
    });
  });

  it("returns 401 for unknown email", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "nobody@example.com", password: VALID_PASSWORD });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 200 with success:true and sets a userId cookie on valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: VALID_EMAIL, password: VALID_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });

    // Cookie should be present and httpOnly
    const setCookie = res.headers["set-cookie"] as string[] | string;
    const cookieHeader = Array.isArray(setCookie)
      ? setCookie.join("; ")
      : setCookie;
    expect(cookieHeader).toMatch(/userId=/);
    expect(cookieHeader).toMatch(/HttpOnly/i);
  });
});

describe("POST /auth/logout", () => {
  it("clears the userId cookie and returns success:true", async () => {
    // First log in to get a cookie
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: VALID_EMAIL, password: VALID_PASSWORD });

    const cookie = (loginRes.headers["set-cookie"] as string[])[0];

    const res = await request(app)
      .post("/auth/logout")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });

    // Cookie should be cleared (Max-Age=0 or Expires in the past)
    const setCookie = res.headers["set-cookie"] as string[] | string;
    const cookieHeader = Array.isArray(setCookie)
      ? setCookie.join("; ")
      : setCookie ?? "";
    // Express clearCookie sets Max-Age=0 or an expiry in the past
    expect(cookieHeader).toMatch(/userId=/);
    expect(cookieHeader).toMatch(/Expires|Max-Age=0/i);
  });
});
