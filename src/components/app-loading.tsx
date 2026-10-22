export function AppLoading() {
  return (
    <div className="flex min-h-screen bg-[var(--page)] text-[var(--ink)]" aria-busy="true" aria-live="polite" suppressHydrationWarning>
      <p className="sr-only">Loading Project One</p>
      <aside className="hidden w-[248px] shrink-0 border-r border-[var(--line)] bg-[var(--surface)] p-4 md:block">
        <span className="bone h-8 w-32" />
        <div className="mt-8 grid gap-2">
          {Array.from({ length: 9 }, (_, index) => (
            <span key={index} className="bone h-8 w-full" />
          ))}
        </div>
      </aside>
      <div className="min-w-0 flex-1 px-4 py-6 md:px-6">
        <span className="bone h-8 w-40" />
        <span className="bone mt-3 h-4 w-full max-w-md" />
        <ContentSkeleton />
      </div>
    </div>
  );
}

export function ContentSkeleton({ kind = "table" }: { kind?: "table" | "cards" | "prose" }) {
  if (kind === "cards") {
    return (
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="panel grid gap-3 p-4">
            <span className="bone h-5 w-40" />
            <span className="bone h-4 w-full" />
            <span className="bone h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }
  if (kind === "prose") {
    return (
      <div className="mt-6 grid max-w-3xl gap-3">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} className="bone h-4" style={{ width: `${88 - (index % 3) * 12}%` }} />
        ))}
      </div>
    );
  }
  return (
    <div className="panel mt-6 overflow-hidden">
      <div className="grid grid-cols-4 gap-3 border-b border-[var(--line)] bg-[var(--surface-2)] px-4 py-3">
        {Array.from({ length: 4 }, (_, index) => (
          <span key={index} className="bone h-3 w-20" />
        ))}
      </div>
      {Array.from({ length: 7 }, (_, index) => (
        <div key={index} className="grid grid-cols-4 gap-3 border-t border-[var(--line)] px-4 py-4">
          <span className="bone h-4 w-40" />
          <span className="bone h-4 w-28" />
          <span className="bone h-4 w-16" />
          <span className="bone h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
