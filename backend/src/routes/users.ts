import { Router, Request, Response } from "express";
import { USERS } from "../data/users";

const router = Router();

// Middleware — all /users routes require a valid userId cookie
function requireAuth(req: Request, res: Response, next: () => void) {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

router.use(requireAuth);

// GET /users/me
// Returns the authenticated user (password omitted)
router.get("/me", (req: Request, res: Response) => {
  const id = parseInt(req.cookies.userId as string, 10);
  const user = USERS.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const { password: _omit, ...safeUser } = user;
  res.json(safeUser);
});

// GET /users/me/accounts
// Returns only the accounts for the authenticated user
router.get("/me/accounts", (req: Request, res: Response) => {
  const id = parseInt(req.cookies.userId as string, 10);
  const user = USERS.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user.accounts);
});

export default router;
