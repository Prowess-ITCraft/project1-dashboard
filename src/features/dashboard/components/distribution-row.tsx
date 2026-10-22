"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { formatCount } from "@/lib/format";
import type { DashboardView } from "../mock/query";
import { CardState, Panel } from "./panel";

const segmentColor: Record<string, string> = {
  Assigned: "var(--muted)",
  "In field": "var(--accent)",
  Checked: "var(--warn)",
  Closed: "var(--good)",
};

export function StageDistribution({
  status,
  onRetry,
  distribution,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  distribution: DashboardView["distribution"];
}) {
  const data = [
    { name: "Assigned", value: distribution.assigned },
    { name: "In field", value: distribution.inField },
    { name: "Checked", value: distribution.checked },
    { name: "Closed", value: distribution.closed },
  ];
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <Panel title="Stage distribution" testId="stage-distribution">
      <CardState status={status} onRetry={onRetry} empty={total === 0} emptyText="No tasks in this filter.">
        <p className="text-sm text-[var(--muted)]">{formatCount(total)} tasks, all projects</p>
        <div className="mt-2 grid items-center gap-4 sm:grid-cols-[140px_1fr]">
          <div className="relative h-36" role="img" aria-label={`Stage distribution, ${total} tasks`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62} stroke="none" isAnimationActive>
                  {data.map((item) => (
                    <Cell key={item.name} fill={segmentColor[item.name]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <p className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <span>
                <span className="block font-display text-2xl leading-none tabular-nums">{formatCount(total)}</span>
                <span className="text-xs text-[var(--muted)]">tasks</span>
              </span>
            </p>
          </div>
          <ul className="grid gap-2 text-sm">
            {data.map((item) => (
              <li key={item.name} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: segmentColor[item.name] }} aria-hidden />
                  {item.name}
                </span>
                <span className="font-mono tabular">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardState>
    </Panel>
  );
}

export function EngineerWorkload({
  status,
  onRetry,
  rows,
  onViewAll,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  rows: { name: string; open: number; late: number }[];
  onViewAll: () => void;
}) {
  const max = Math.max(...rows.map((row) => row.open), 1);
  return (
    <Panel
      title="Engineer workload"
      action={
        <button type="button" className="text-sm text-[var(--accent)]" onClick={onViewAll}>
          View all
        </button>
      }
    >
      <CardState status={status} onRetry={onRetry} empty={rows.length === 0} emptyText="No engineers match this filter.">
        <p className="mb-3 text-sm text-[var(--muted)]">Open tasks per engineer</p>
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li key={row.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{row.name}</span>
                <span className="font-mono text-xs">
                  {row.open}
                  {row.late ? <span className="text-[var(--bad)]">, {row.late} late</span> : null}
                </span>
              </div>
              <div className="flex h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden>
                <span className="h-full bg-[var(--accent)]" style={{ width: `${((row.open - row.late) / max) * 100}%` }} />
                <span className="h-full bg-[var(--bad)]" style={{ width: `${(row.late / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </CardState>
    </Panel>
  );
}

export function SourceMix({
  status,
  onRetry,
  entry,
  order,
  mode,
  onMode,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  entry: { label: string; count: number; percent: number }[];
  order: { label: string; count: number; percent: number }[];
  mode: "entry" | "order";
  onMode: (mode: "entry" | "order") => void;
}) {
  const rows = mode === "entry" ? entry : order;
  return (
    <Panel title="Where projects come from">
      <CardState status={status} onRetry={onRetry} empty={rows.length === 0} emptyText="No projects in this filter.">
        <div className="mb-3 flex gap-2 text-sm">
          <button type="button" aria-pressed={mode === "entry"} className={mode === "entry" ? "text-[var(--accent)]" : "text-[var(--muted)]"} onClick={() => onMode("entry")}>
            Entry path
          </button>
          <button type="button" aria-pressed={mode === "order"} className={mode === "order" ? "text-[var(--accent)]" : "text-[var(--muted)]"} onClick={() => onMode("order")}>
            Order source
          </button>
        </div>
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="capitalize">{row.label}</span>
                <span className="font-mono text-xs">
                  {row.count} ({row.percent}%)
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--surface-2)]" aria-hidden>
                <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${row.percent}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </CardState>
    </Panel>
  );
}
