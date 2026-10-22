"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCount, formatIst } from "@/lib/format";
import type { MetricKey, RangeKey, ThroughputPoint } from "../mock/types";
import { CardState, Panel } from "./panel";

const metrics: { id: MetricKey; label: string }[] = [
  { id: "closed", label: "Tasks closed" },
  { id: "checkins", label: "Check-ins" },
  { id: "handovers", label: "Handovers" },
  { id: "evidence", label: "Evidence uploads" },
];

const ranges: RangeKey[] = ["7d", "30d", "90d"];

export function ThroughputCard({
  status,
  onRetry,
  series,
  priorSeries,
  total,
  delta,
  metric,
  range,
  onMetric,
  onRange,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  series: ThroughputPoint[];
  priorSeries: ThroughputPoint[];
  total: number;
  delta: string;
  metric: MetricKey;
  range: RangeKey;
  onMetric: (metric: MetricKey) => void;
  onRange: (range: RangeKey) => void;
}) {
  const [table, setTable] = useState(false);
  const rows = series.map((point, index) => ({
    ...point,
    previous: priorSeries[index]?.[metric] ?? 0,
    label: formatIst(`${point.date}T08:36:00.000Z`, "d MMM"),
  }));

  return (
    <Panel
      title="Throughput"
      testId="throughput"
      action={
        <div className="flex rounded-[8px] border border-[var(--line)] p-0.5 text-xs">
          {ranges.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={item === range}
              className={`rounded-[6px] px-2 py-1 ${item === range ? "bg-[var(--nav-active)] text-[var(--accent)]" : ""}`}
              onClick={() => onRange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      }
    >
      <CardState status={status} onRetry={onRetry}>
        <p className="font-display text-4xl leading-none tabular-nums">{formatCount(total)}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{delta}</p>
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Throughput metric">
          {metrics.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === metric}
              className={`rounded-full border px-3 py-1 text-sm ${item.id === metric ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)] text-[var(--muted)]"}`}
              onClick={() => onMetric(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <button type="button" className="text-sm text-[var(--accent)]" onClick={() => setTable((value) => !value)}>
            {table ? "View as chart" : "View as table"}
          </button>
        </div>
        {table ? (
          <div className="mt-3 max-h-64 overflow-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Throughput values</caption>
              <thead className="text-[var(--muted)]">
                <tr>
                  <th className="py-1 font-medium">Date</th>
                  <th className="py-1 font-medium">Value</th>
                  <th className="py-1 font-medium">Previous</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.date} className="border-t border-[var(--line)]">
                    <td className="py-1 font-mono text-xs">{row.label}</td>
                    <td className="py-1 tabular">{row[metric]}</td>
                    <td className="py-1 tabular text-[var(--muted)]">{row.previous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-2 h-64" role="img" aria-label="Throughput chart with previous period">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows}>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const row = payload[0].payload as (typeof rows)[number];
                    return (
                      <div className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm">
                        <p className="font-mono text-xs text-[var(--muted)]">{row.date}</p>
                        <p>Checked in {row.checkins}, Closed {row.closed}</p>
                      </div>
                    );
                  }}
                />
                <Area type="monotone" dataKey="previous" stroke="var(--muted)" strokeDasharray="4 4" fill="transparent" isAnimationActive />
                <Area type="monotone" dataKey={metric} stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.16} isAnimationActive />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="mt-2 text-xs text-[var(--muted)]">Solid line is this period. Dashed line is the previous period.</p>
      </CardState>
    </Panel>
  );
}
