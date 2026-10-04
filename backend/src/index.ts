import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";

const app = express();
const PORT = 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",  // Next.js dev server
  credentials: true,                // allow cookies cross-origin
}));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend running on http://127.0.0.1:${PORT}`);
});
