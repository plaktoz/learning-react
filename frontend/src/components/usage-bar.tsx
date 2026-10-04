// Shared utility component — extracted from variants.tsx so it can be tested.

export function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.round((used / limit) * 100);
  const colour =
    pct >= 80 ? "bg-red-500" : pct >= 50 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>
          {used.toLocaleString("en-US", { style: "currency", currency: "USD" })} used
        </span>
        <span>
          {pct}% of{" "}
          {limit.toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          data-testid="usage-fill"
          className={`h-full rounded-full ${colour}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
