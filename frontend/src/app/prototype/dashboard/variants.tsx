// PROTOTYPE — throwaway variants for finance dashboard UI exploration
// Three structurally different layouts, switchable via ?variant=A/B/C
// Question: "What should a personal finance dashboard look like?"

"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { ApiUser } from "@/lib/api.types";

// ─── Shared UI ───────────────────────────────────────────────────────────────

function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className={buttonVariants({ variant: "outline", size: "sm" })}
    >
      Log out
    </button>
  );
}

function fmt(n: number, currency = "USD") {
  return n.toLocaleString("en-US", { style: "currency", currency });
}

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.round((used / limit) * 100);
  const colour = pct >= 80 ? "bg-red-500" : pct >= 50 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{fmt(used)} used</span>
        <span>{pct}% of {fmt(limit)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${colour}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Variant A — Classic card grid ───────────────────────────────────────────

export function VariantA({ user }: { user: ApiUser }) {
  const { name, accounts: { savings, creditCards: cards } } = user;
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Welcome back</p>
          <h1 className="text-2xl font-semibold">Hello, {name} 👋</h1>
        </div>
        <LogoutButton />
      </div>

      <Card className="mb-6 bg-primary text-primary-foreground ring-0">
        <CardHeader>
          <CardDescription className="text-primary-foreground/70">{savings.label} · {savings.number}</CardDescription>
          <CardTitle className="text-4xl font-bold">{fmt(savings.balance, savings.currency)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-primary-foreground/70">Available balance</p>
        </CardContent>
      </Card>

      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Credit Cards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Card key={c.number}>
            <CardHeader>
              <CardTitle className="text-base">{c.label}</CardTitle>
              <CardDescription>{c.number} · Due {c.dueDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <UsageBar used={c.used} limit={c.limit} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Variant B — Sidebar + main panel ────────────────────────────────────────

export function VariantB({ user }: { user: ApiUser }) {
  const { name, accounts: { savings, creditCards: cards } } = user;
  const all = [
    { id: "savings", label: savings.label, sub: savings.number, amount: fmt(savings.balance, savings.currency), active: true },
    ...cards.map((c, i) => ({
      id: `card-${i}`,
      label: c.label,
      sub: c.number,
      amount: fmt(c.used, savings.currency),
      active: false,
    })),
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r bg-muted/30 flex flex-col p-4 gap-1 shrink-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-2 mb-3">My Accounts</p>
        {all.map((a) => (
          <div
            key={a.id}
            className={`rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
              a.active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <p className="text-sm font-medium">{a.label}</p>
            <p className={`text-xs ${a.active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {a.sub}
            </p>
          </div>
        ))}
        <div className="mt-auto pt-4">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Hello, {name}</p>
            <h1 className="text-2xl font-semibold">{savings.label}</h1>
          </div>
        </div>

        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
          <p className="text-5xl font-bold tracking-tight">{fmt(savings.balance, savings.currency)}</p>
          <p className="text-xs text-muted-foreground mt-1">{savings.number}</p>
        </div>

        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Credit Cards</h2>
        <div className="flex flex-col gap-4 max-w-xl">
          {cards.map((c) => (
            <div key={c.number} className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{c.label}</span>
                <span className="text-xs text-muted-foreground">{c.number} · Due {c.dueDate}</span>
              </div>
              <UsageBar used={c.used} limit={c.limit} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── Variant C — Single-page scrolling summary strip ─────────────────────────

export function VariantC({ user }: { user: ApiUser }) {
  const { name, accounts: { savings, creditCards: cards } } = user;
  return (
    <div className="min-h-screen bg-background max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between border-b pb-6 mb-8">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Finance Overview</p>
          <h1 className="text-xl font-semibold">Hello, {name}</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="flex items-start justify-between py-5 border-b">
        <div>
          <p className="font-medium">{savings.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{savings.number}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{fmt(savings.balance, savings.currency)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Available</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-8 mb-4">Credit Cards</p>
      {cards.map((c, i) => (
        <div key={c.number} className={`py-5 ${i < cards.length - 1 ? "border-b" : ""}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-medium">{c.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.number} · Due {c.dueDate}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{fmt(c.used, savings.currency)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">of {fmt(c.limit, savings.currency)}</p>
            </div>
          </div>
          <UsageBar used={c.used} limit={c.limit} />
        </div>
      ))}
    </div>
  );
}
