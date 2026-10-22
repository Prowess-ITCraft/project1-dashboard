"use client";

import { Pulse } from "@phosphor-icons/react";
import { clockLabel } from "@/lib/format";
import type { DashboardView } from "../mock/query";
import { CardState, Panel } from "./panel";

export function LiveNowCard({
  status,
  onRetry,
  live,
  nowIso,
  paused,
  onPause,
  onOpenEngineers,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  live: DashboardView["live"];
  nowIso: string;
  paused: boolean;
  onPause: () => void;
  onOpenEngineers: () => void;
}) {
  const max = Math.max(...live.strip, 1);
  return (
    <Panel
      title="Live now"
      action={
        <button type="button" className="text-sm text-[var(--accent)]" onClick={onPause}>
          {paused ? "Resume live updates" : "Pause live updates"}
        </button>
      }
    >
      <CardState status={status} onRetry={onRetry}>
        <div className="flex items-center gap-2 text-sm text-[var(--good)]">
          <span className="pulse-dot size-2 rounded-full bg-[var(--good)]" aria-hidden />
          <Pulse aria-hidden />
          Live, {clockLabel(nowIso)}
        </div>
        <p className="mt-3 font-display text-5xl leading-none tabular-nums">{live.inField}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Engineers in the field</p>
        <ul className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <li>
            <span className="block text-[var(--muted)]">On site</span>
            <span className="font-mono tabular">{live.onSite}</span>
          </li>
          <li>
            <span className="block text-[var(--muted)]">Offline</span>
            <span className="font-mono tabular">{live.offline}</span>
          </li>
          <li>
            <span className="block text-[var(--muted)]">Idle</span>
            <span className="font-mono tabular">{live.idle}</span>
          </li>
        </ul>
        <div className="mt-4 flex h-10 items-end gap-0.5" aria-hidden>
          {live.strip.map((value, index) => (
            <span key={`${index}-${value}`} className="flex-1 rounded-sm bg-[var(--accent)]" style={{ height: `${Math.max(8, (value / max) * 100)}%`, opacity: 0.35 + (value / max) * 0.65 }} />
          ))}
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">Last 30 minutes of activity</p>
        <button type="button" className="mt-3 text-sm text-[var(--accent)]" onClick={onOpenEngineers}>
          Open engineers
        </button>
      </CardState>
    </Panel>
  );
}
