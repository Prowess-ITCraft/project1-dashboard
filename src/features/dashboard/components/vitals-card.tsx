"use client";

import type { Band, Vital } from "../mock/types";
import { CardState, Panel } from "./panel";

const bandLabel: Record<Band, string> = {
  good: "Good",
  "needs improvement": "Needs improvement",
  poor: "Poor",
};

export function DeliveryVitals({
  status,
  onRetry,
  vitals,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  vitals: Vital[];
}) {
  return (
    <Panel title="Delivery vitals" testId="vitals">
      <CardState status={status} onRetry={onRetry} empty={vitals.length === 0}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {vitals.map((vital) => (
            <li key={vital.id} className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-2)] p-3" data-band={vital.band}>
              <p className="text-sm text-[var(--muted)]">{vital.label}</p>
              <p className="mt-1 font-display text-3xl leading-none tabular-nums">{vital.value}</p>
              <p className={`mt-2 text-xs ${vital.band === "good" ? "text-[var(--good)]" : vital.band === "poor" ? "text-[var(--bad)]" : "text-[var(--warn)]"}`}>
                {bandLabel[vital.band]}
              </p>
              <BandGauge band={vital.band} />
              <p className="mt-2 text-xs text-[var(--muted)]">{vital.delta}</p>
              <p className="text-xs text-[var(--muted)]">{vital.goodHint}</p>
            </li>
          ))}
        </ul>
      </CardState>
    </Panel>
  );
}

function BandGauge({ band }: { band: Band }) {
  const active = band === "good" ? 0 : band === "needs improvement" ? 1 : 2;
  const colors = ["var(--good)", "var(--warn)", "var(--bad)"];
  return (
    <div className="mt-2 flex gap-1" aria-hidden>
      {colors.map((color, index) => (
        <span key={color} className="h-1 flex-1 rounded-full" style={{ background: color, opacity: index === active ? 1 : 0.25 }} />
      ))}
    </div>
  );
}
