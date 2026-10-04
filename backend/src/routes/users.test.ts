import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

// Helper: log in and return the session cookie string
async function loginAs(email: string, password: string): Promise<string> {
  const res = await request(app)
    .post("/auth/login")
    .send({ email, password });
  const cookies = res.headers["set-cookie"] as string[];
  return cookies[0]; // "userId=1; Path=/; HttpOnly; ..."
}

describe("GET /users/me — authentication guard", () => {
  it("returns 401 when no cookie is present", async () => {
    const res = await request(app).get("/users/me");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Not authenticated" });
  });
});

describe("GET /users/me — authenticated", () => {
  it("returns the user profile without the password field", async () => {
    const cookie = await loginAs("alex.morgan@example.com", "password123");
    const res = await request(app).get("/users/me").set("Cookie", cookie);

    expect(res.status).toBe(200);

    // Password must never be exposed
    expect(res.body).not.toHaveProperty("password");

    // Core fields should be present
    expect(res.body).toMatchObject({
      id: 1,
      name: "Alex Morgan",
      email: "alex.morgan@example.com",
    });
  });

  it("returns the correct user for a different account", async () => {
    const cookie = await loginAs("jamie.lee@example.com", "letmein456");
    const res = await request(app).get("/users/me").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
    expect(res.body.name).toBe("Jamie Lee");
    expect(res.body).not.toHaveProperty("password");
  });
});

describe("GET /users/me/accounts — authentication guard", () => {
  it("returns 401 when no cookie is present", async () => {
    const res = await request(app).get("/users/me/accounts");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Not authenticated" });
  });
});

describe("GET /users/me/accounts — authenticated", () => {
  it("returns savings account and credit cards for the logged-in user", async () => {
    const cookie = await loginAs("alex.morgan@example.com", "password123");
    const res = await request(app)
      .get("/users/me/accounts")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);

    // Savings account shape
    expect(res.body.savings).toMatchObject({
      label: expect.any(String),
      number: expect.any(String),
      balance: expect.any(Number),
      currency: "USD",
    });

    // At least one credit card
    expect(Array.isArray(res.body.creditCards)).toBe(true);
    expect(res.body.creditCards.length).toBeGreaterThan(0);

    // Each credit card has the right shape
    for (const card of res.body.creditCards) {
      expect(card).toMatchObject({
        label: expect.any(String),
        number: expect.any(String),
        used: expect.any(Number),
        limit: expect.any(Number),
        dueDate: expect.any(String),
      });
    }
  });

  it("returns Alex's specific savings balance", async () => {
    const cookie = await loginAs("alex.morgan@example.com", "password123");
    const res = await request(app)
      .get("/users/me/accounts")
      .set("Cookie", cookie);

    expect(res.body.savings.balance).toBe(24530.75);
  });

  it("does not mix up accounts between users", async () => {
    const alexCookie = await loginAs("alex.morgan@example.com", "password123");
    const jamieCookie = await loginAs("jamie.lee@example.com", "letmein456");

    const alexRes = await request(app)
      .get("/users/me/accounts")
      .set("Cookie", alexCookie);
    const jamieRes = await request(app)
      .get("/users/me/accounts")
      .set("Cookie", jamieCookie);

    expect(alexRes.body.savings.balance).not.toBe(
      jamieRes.body.savings.balance
    );
    expect(alexRes.body.savings.number).toBe("**** 4821");
    expect(jamieRes.body.savings.number).toBe("**** 2293");
  });
});
