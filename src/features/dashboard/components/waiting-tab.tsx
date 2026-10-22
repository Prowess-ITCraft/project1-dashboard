"use client";

import { customerName, projects } from "../mock/seed";
import type { WaitingItem } from "../mock/types";
import { CardState, Panel } from "./panel";

export function WaitingTab({
  status,
  onRetry,
  items,
  onAction,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  items: WaitingItem[];
  onAction: (message: string) => void;
}) {
  const kinds = [...new Set(items.map((item) => item.kind))];
  return (
    <Panel title="Waiting on">
      <CardState status={status} onRetry={onRetry} empty={items.length === 0} emptyText="Nothing is waiting on someone else.">
        <ul className="mb-4 flex flex-wrap gap-2 text-sm">
          {kinds.map((kind) => (
            <li key={kind} className="rounded-full border border-[var(--line)] px-2 py-1">
              {kind} {items.filter((item) => item.kind === kind).length}
            </li>
          ))}
        </ul>
        <ul className="grid gap-3">
          {items.map((item) => (
            <li key={item.id} className="grid gap-2 rounded-[12px] border border-[var(--line)] p-3 md:grid-cols-[1.4fr_0.8fr_0.8fr_auto] md:items-center">
              <div>
                <p className="font-medium">{item.item}</p>
                <p className="font-mono text-xs text-[var(--muted)]">{item.projectCode}</p>
              </div>
              <p className="text-sm">{item.who}</p>
              <p className="text-sm text-[var(--muted)]">
                {customerName(projects.find((project) => project.code === item.projectCode)?.customerId ?? "")}, {item.waiting}
              </p>
              <div className="flex gap-2">
                <button type="button" className="h-9 rounded-[8px] border border-[var(--line)] px-3 text-sm" onClick={() => onAction(`Reminder noted for ${item.who}. Nothing was sent.`)}>
                  Send reminder
                </button>
                <button type="button" className="h-9 rounded-[8px] bg-[var(--button-bg)] px-3 text-sm text-[var(--button-ink)]" onClick={() => onAction(`${item.item} stays on this dashboard.`)}>
                  Open
                </button>
              </div>
            </li>
          ))}
        </ul>
      </CardState>
    </Panel>
  );
}
