"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUUpLeft, Camera, Certificate, Check, CloudCheck, PaperPlaneTilt, WarningOctagon } from "@phosphor-icons/react";
import { clockLabel, formatIst } from "@/lib/format";
import type { ActivityEvent, ActivityType } from "../mock/types";
import { CardState, Panel } from "./panel";

const iconFor: Record<ActivityType, typeof Check> = {
  "check-in": Check,
  evidence: Camera,
  handover: PaperPlaneTilt,
  approved: CloudCheck,
  "sent-back": ArrowUUpLeft,
  waiver: WarningOctagon,
  acknowledged: Check,
  certificate: Certificate,
  po: PaperPlaneTilt,
  kickoff: Check,
  lookup: Check,
  "red-flag": WarningOctagon,
};

export function ActivityPanel({
  status,
  onRetry,
  preview,
  all,
  mode,
  onOpenAll,
  reduced,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  preview: ActivityEvent[];
  all: ActivityEvent[];
  mode: "preview" | "full";
  onOpenAll: () => void;
  reduced: boolean;
}) {
  const events = mode === "preview" ? preview : all;
  const [visible, setVisible] = useState(12);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "full") return;
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setVisible((count) => Math.min(all.length, count + 8));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [all.length, mode]);

  const shown = mode === "full" ? events.slice(0, visible) : events;
  const groups = new Map<string, ActivityEvent[]>();
  for (const event of shown) {
    const day = formatIst(event.at, "d MMM yyyy");
    groups.set(day, [...(groups.get(day) ?? []), event]);
  }

  return (
    <Panel
      title={mode === "full" ? "Activity" : "Recent activity"}
      action={
        mode === "preview" ? (
          <button type="button" className="text-sm text-[var(--accent)]" onClick={onOpenAll}>
            Open audit log
          </button>
        ) : null
      }
    >
      <CardState status={status} onRetry={onRetry} empty={events.length === 0} emptyText="No activity matches these filters.">
        <div aria-live="polite" className="grid gap-4">
          {[...groups.entries()].map(([day, items]) => (
            <div key={day}>
              {mode === "full" ? <h3 className="mb-2 text-sm text-[var(--muted)]">{day}</h3> : null}
              <ul className="grid gap-3">
                {items.map((event, index) => {
                  const Icon = iconFor[event.type] ?? Check;
                  return (
                    <li key={event.id} className={index === 0 && !reduced ? "rise-in" : undefined}>
                      <p className="flex gap-2 text-sm">
                        <Icon aria-hidden className="mt-0.5 shrink-0 text-[var(--muted)]" />
                        <span>
                          <span className="font-medium">{event.actor}</span> {event.verb} {event.object}
                          <span className="mt-0.5 block font-mono text-xs text-[var(--muted)]">
                            {event.projectCode} {clockLabel(event.at)}
                          </span>
                        </span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        {mode === "full" && visible < all.length ? <div ref={sentinel} className="h-8" /> : null}
      </CardState>
    </Panel>
  );
}
