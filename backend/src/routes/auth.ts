import { Router, Request, Response } from "express";
import { USERS } from "../data/users";

const router = Router();

const COOKIE_NAME = "userId";
const COOKIE_OPTIONS = {
  httpOnly: true,   // not accessible via JS — prevents XSS theft
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 1000, // 24 hours in ms
};

// POST /auth/login
// Body: { email: string; password: string }
// On success: sets httpOnly userId cookie, returns { success: true }
// On failure: returns { success: false, error: string }
router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ success: false, error: "Email and password are required" });
    return;
  }

  const user = USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    res.status(401).json({ success: false, error: "Invalid email or password" });
    return;
  }

  res.cookie(COOKIE_NAME, String(user.id), COOKIE_OPTIONS);
  res.json({ success: true });
});

// POST /auth/logout
// Clears the userId cookie
router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

export default router;
