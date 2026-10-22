"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  MapPin,
  WarningCircle,
  Timer,
  Warning,
} from "@phosphor-icons/react";
import { formatCount } from "@/lib/format";
import type { Kpi } from "../mock/types";
import { Sparkline } from "./bits";
import { usePrefersReducedMotion } from "../hooks/use-filters";

const icons = {
  deviations: CheckCircle,
  blocked: Warning,
  behind: WarningCircle,
  checkins: MapPin,
  closed: Timer,
};

export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <section data-testid="kpi-strip" aria-label="Key figures" className="grid grid-cols-1 overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--surface)] sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = icons[item.id as keyof typeof icons] ?? CheckCircle;
        return (
          <article key={item.id} className="border-[var(--line)] p-4 sm:border-r sm:border-b xl:border-b-0" title={item.note ?? item.delta}>
            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <span className="grid size-7 place-items-center rounded-[8px] bg-[var(--surface-2)] text-[var(--accent)]">
                <Icon size={16} aria-hidden />
              </span>
              {item.label}
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="font-display text-4xl leading-none tabular-nums tracking-tight">
                <CountUp value={item.value} />
                {item.of !== null ? <span className="ml-1 text-lg text-[var(--muted)]">of {formatCount(item.of)}</span> : null}
              </p>
              <span className="text-[var(--good)]">
                <Sparkline values={item.spark} label={`${item.label} trend`} />
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">{item.delta}</p>
          </article>
        );
      })}
    </section>
  );
}

function CountUp({ value }: { value: number }) {
  const reduce = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(value);
      return;
    }
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, Math.max(0, (now - start) / 500));
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce, value]);
  return <span className="tabular">{formatCount(shown)}</span>;
}
