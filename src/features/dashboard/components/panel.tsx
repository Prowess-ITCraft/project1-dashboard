"use client";

import type { ReactNode } from "react";

export function Panel({
  title,
  action,
  testId,
  children,
}: {
  title: string;
  action?: ReactNode;
  testId?: string;
  children: ReactNode;
}) {
  return (
    <section data-testid={testId} className="rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-4 md:p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <h2 className="font-display text-xl leading-[1.1] tracking-tight">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export function CardState({
  status,
  onRetry,
  empty,
  emptyText,
  children,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  empty?: boolean;
  emptyText?: string;
  children: ReactNode;
}) {
  if (status === "loading") {
    return (
      <div className="grid gap-3" aria-hidden>
        <div className="h-8 w-1/3 rounded-[8px] bg-[var(--surface-2)]" />
        <div className="h-24 rounded-[8px] bg-[var(--surface-2)]" />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-[var(--bad)]">This card could not load.</p>
        <button type="button" className="h-9 w-fit rounded-[8px] border border-[var(--line)] px-3 text-sm" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }
  if (empty) {
    return (
      <div className="grid gap-3 py-6">
        <p className="text-sm text-[var(--muted)]">{emptyText ?? "Nothing matches these filters."}</p>
        <p className="text-sm text-[var(--muted)]">Clear a filter to see the full preview.</p>
      </div>
    );
  }
  return children;
}
