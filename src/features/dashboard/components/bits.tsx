"use client";

export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const width = 96;
  const height = 32;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-8 w-24" role="img" aria-label={label}>
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={points} />
    </svg>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Behind plan" || status === "Lost"
      ? "bg-[var(--bad-soft)] text-[var(--bad)]"
      : status === "On track" || status === "Certified"
        ? "bg-[var(--good-soft)] text-[var(--good)]"
        : status === "Waiting on customer"
          ? "bg-[var(--warn-soft)] text-[var(--warn)]"
          : "bg-[var(--accent-soft)] text-[var(--accent)]";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${tone}`}>{status}</span>;
}
