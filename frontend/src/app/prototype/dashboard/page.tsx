// PROTOTYPE — delete before merging to main
// Three variants of the finance dashboard, switchable via ?variant=A/B/C

import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VariantA, VariantB, VariantC } from "./variants";
import { PrototypeSwitcher } from "@/components/prototype-switcher";
import type { ApiUser } from "@/lib/api.types";

const VARIANTS = [
  { key: "A", label: "Card grid" },
  { key: "B", label: "Sidebar + detail" },
  { key: "C", label: "Statement strip" },
];

export default async function DashboardPrototypePage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  // Read userId cookie set by the backend on login
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/");  // not logged in — back to login page
  }

  // Fetch user data from backend (server-to-server, cookie forwarded manually)
  const res = await fetch("http://127.0.0.1:4000/users/me", {
    headers: { Cookie: `userId=${userId}` },
    cache: "no-store",   // always fresh — don't cache financial data
  });

  if (!res.ok) {
    redirect("/");  // cookie invalid or user not found
  }

  const user = await res.json() as ApiUser;
  const { variant = "A" } = await searchParams;

  return (
    <>
      {variant === "A" && <VariantA user={user} />}
      {variant === "B" && <VariantB user={user} />}
      {variant === "C" && <VariantC user={user} />}
      <Suspense>
        <PrototypeSwitcher variants={VARIANTS} current={variant} />
      </Suspense>
    </>
  );
}
