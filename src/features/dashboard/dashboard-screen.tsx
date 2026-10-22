"use client";

import { DownloadSimple, Plus } from "@phosphor-icons/react";
import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { clockLabel } from "@/lib/format";
import { readSession, type Session } from "@/lib/session";
import { projectsCsv } from "./mock/query";
import { stages } from "./config/workflows";
import type { StaffMember } from "./mock/types";
import { useDashboardData } from "./hooks/use-dashboard";
import { useFilters, usePrefersReducedMotion } from "./hooks/use-filters";
import { ActivityPanel } from "./components/activity-panel";
import { CommandPalette } from "./components/command-palette";
import { EngineerWorkload, SourceMix, StageDistribution } from "./components/distribution-row";
import { EngineerQueues, EngineersTab } from "./components/engineers-tab";
import { FieldProjects } from "./components/field-projects";
import { KpiStrip } from "./components/kpi-strip";
import { LiveNowCard } from "./components/live-now-card";
import { ThroughputCard } from "./components/throughput-card";
import { TopProjects } from "./components/top-projects";
import { DeliveryVitals } from "./components/vitals-card";
import { WaitingTab } from "./components/waiting-tab";
const tabs = [
  { id: "projects", label: "Projects", count: 18 },
  { id: "waiting", label: "Waiting on", count: 4 },
  { id: "engineers", label: "Engineers", count: 4 },
  { id: "activity", label: "Activity", count: null },
] as const;

export function DashboardScreen({ staff }: { staff: StaffMember[] }) {
  const { filters, update } = useFilters();
  const { status, view, reload, paused, setPaused } = useDashboardData(filters);
  const reduced = usePrefersReducedMotion();
  const [session] = useState<Session | null>(() => (typeof window === "undefined" ? null : readSession()));
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sourceMode, setSourceMode] = useState<"entry" | "order">("entry");
  const [siteOpen, setSiteOpen] = useState(false);

  useEffect(() => {
    function onSearch(event: Event) {
      event.preventDefault();
      setPalette(true);
    }
    window.addEventListener("p1-search", onSearch);
    return () => window.removeEventListener("p1-search", onSearch);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  if (!session) return null;

  const sites = [...new Set((view?.projects ?? []).map((project) => project.site))];
  const counts = {
    projects: view?.projects.length ?? 18,
    waiting: view?.waiting.length ?? 4,
    engineers: view?.engineers.filter((engineer) => engineer.inField).length ?? 4,
    activity: null,
  };

  return (
    <div className="mx-auto grid max-w-[1400px] gap-4 px-3 py-5 md:px-6 md:py-6">
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl leading-[1.1] tracking-tight md:text-5xl">Dashboard</h1>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--good-soft)] px-2.5 py-1 text-xs text-[var(--good)]">
              <span className="pulse-dot size-1.5 rounded-full bg-[var(--good)]" aria-hidden />
              Field work active
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {counts.projects} projects across {view?.customers.length ?? 3} customers. Updated {view ? clockLabel(view.nowIso) : "14:06 IST"}.
          </p>
          <div className="mt-4 flex gap-4 border-b border-[var(--line)]" role="tablist" aria-label="Dashboard sections" onKeyDown={(event) => moveTab(event, filters.tab, (tab) => update({ tab }))}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={filters.tab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={filters.tab === tab.id ? 0 : -1}
                className={`-mb-px border-b-2 px-1 pb-2 text-sm ${filters.tab === tab.id ? "border-[var(--accent)] text-[var(--ink)]" : "border-transparent text-[var(--muted)]"}`}
                onClick={() => update({ tab: tab.id })}
              >
                {tab.label} {counts[tab.id] ?? ""}
              </button>
            ))}
          </div>
        </header>

        <div role="tabpanel" id={`panel-${filters.tab}`} aria-labelledby={`tab-${filters.tab}`} className="grid gap-4">
          {filters.tab === "projects" ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <FilterSelect label="Last" value={filters.range} options={["7d", "30d", "90d"]} onChange={(range) => update({ range: range as typeof filters.range })} />
                <FilterSelect
                  label="Stage"
                  value={filters.stage}
                  options={["all", ...stages.map((stage) => stage.id)]}
                  labels={Object.fromEntries(stages.map((stage) => [stage.id, filters.workflow === "eight-stages" ? stage.eightLabel : stage.label]))}
                  onChange={(stage) => update({ stage: stage as typeof filters.stage })}
                />
                <FilterSelect label="Workflow" value={filters.workflow} options={["five-cores", "eight-stages"]} onChange={(workflow) => update({ workflow: workflow as typeof filters.workflow })} />
                <FilterSelect
                  label="Customer"
                  value={filters.customer}
                  options={["all", ...(view?.customers.map((customer) => customer.id) ?? [])]}
                  labels={Object.fromEntries((view?.customers ?? []).map((customer) => [customer.id, customer.name]))}
                  onChange={(customer) => update({ customer })}
                />
                <FilterSelect
                  label="Status"
                  value={filters.status}
                  options={["all", "Behind plan", "On track", "Active", "Waiting on customer", "Certified", "Lost"]}
                  onChange={(status) => update({ status: status as typeof filters.status })}
                />
                {filters.site !== "all" ? (
                  <button type="button" className="rounded-full border border-[var(--line)] px-3 py-1 text-sm" onClick={() => update({ site: "all" })}>
                    Site {filters.site}
                  </button>
                ) : null}
                <span className="relative">
                  <button type="button" className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--input-line)] px-3 py-1 text-sm" onClick={() => setSiteOpen((value) => !value)}>
                    <Plus size={14} aria-hidden /> Add filter
                  </button>
                  {siteOpen ? (
                    <span className="absolute z-10 mt-1 grid rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-1 text-sm">
                      {sites.map((site) => (
                        <button
                          key={site}
                          type="button"
                          className="rounded-[6px] px-2 py-1 text-left"
                          onClick={() => {
                            update({ site });
                            setSiteOpen(false);
                          }}
                        >
                          Site {site}
                        </button>
                      ))}
                    </span>
                  ) : null}
                </span>
                <button
                  type="button"
                  className="ml-auto inline-flex h-9 items-center gap-1 rounded-[8px] border border-[var(--line)] px-3 text-sm"
                  onClick={() => {
                    if (!view) return;
                    downloadCsv(projectsCsv(view.projects));
                    setToast("Exported the current project view.");
                  }}
                >
                  <DownloadSimple aria-hidden /> Export
                </button>
              </div>
              {status === "error" ? (
                <div className="flex items-center justify-between rounded-[12px] border border-[var(--bad)] px-4 py-3 text-sm">
                  <p>The preview data source failed.</p>
                  <button type="button" className="h-9 rounded-[8px] border border-[var(--line)] px-3" onClick={reload}>
                    Try again
                  </button>
                </div>
              ) : null}
              {view ? <KpiStrip items={view.kpis} /> : <div className="h-28 animate-pulse rounded-[12px] border border-[var(--line)] bg-[var(--surface)]" />}
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.7fr)]">
                <ThroughputCard
                  status={status}
                  onRetry={reload}
                  series={view?.throughput.series ?? []}
                  priorSeries={view?.throughput.priorSeries ?? []}
                  total={view?.throughput.total ?? 0}
                  delta={view?.throughput.delta.text ?? ""}
                  metric={filters.metric}
                  range={filters.range}
                  onMetric={(metric) => update({ metric })}
                  onRange={(range) => update({ range })}
                />
                <LiveNowCard
                  status={status}
                  onRetry={reload}
                  live={view?.live ?? { inField: 0, onSite: 0, offline: 0, idle: 0, strip: [] }}
                  nowIso={view?.nowIso ?? "2026-10-22T08:36:00.000Z"}
                  paused={paused || filters.frozen}
                  onPause={() => setPaused((value) => !value)}
                  onOpenEngineers={() => update({ tab: "engineers" })}
                />
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <StageDistribution status={status} onRetry={reload} distribution={view?.distribution ?? { assigned: 0, inField: 0, checked: 0, closed: 0 }} />
                <EngineerWorkload status={status} onRetry={reload} rows={view?.workload ?? []} onViewAll={() => update({ tab: "engineers" })} />
                <SourceMix status={status} onRetry={reload} entry={view?.sources.entry ?? []} order={view?.sources.order ?? []} mode={sourceMode} onMode={setSourceMode} />
              </div>
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
                <TopProjects status={status} onRetry={reload} projects={view?.topProjects ?? []} />
                <DeliveryVitals status={status} onRetry={reload} vitals={view?.vitals ?? []} />
              </div>
              <FieldProjects
                status={status}
                onRetry={reload}
                projects={view?.fieldProjects ?? []}
                stageLine={view?.stageLine ?? (() => "")}
                sort={filters.sort}
                onSort={(sort) => update({ sort })}
                workflow={filters.workflow}
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <ActivityPanel status={status} onRetry={reload} preview={view?.activityPreview ?? []} all={view?.activity ?? []} mode="preview" onOpenAll={() => update({ tab: "activity" })} reduced={reduced} />
                <EngineerQueues engineers={view?.engineers ?? []} />
              </div>
            </>
          ) : null}

          {filters.tab === "waiting" ? <WaitingTab status={status} onRetry={reload} items={view?.waiting ?? []} onAction={setToast} /> : null}

          {filters.tab === "engineers" ? (
            <EngineersTab
              status={status}
              onRetry={reload}
              engineers={view?.engineers ?? []}
              needs={view?.needs ?? []}
              nowIso={view?.nowIso ?? "2026-10-22T08:36:00.000Z"}
              offlineCount={view?.live.offline ?? 0}
              offlineSince={view?.phonesOfflineSince ?? "14:02"}
              failedUploads={view?.failedUploads ?? 0}
              certificates={view?.certificatesToSign ?? 0}
              role={filters.role}
              onRole={(role) => update({ role })}
              paused={paused || filters.frozen}
              onPause={() => setPaused((value) => !value)}
              staffEmail={(name) => staff.find((person) => person.name === name)?.email ?? null}
            />
          ) : null}

          {filters.tab === "activity" ? (
            <div className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                <FilterSelect label="Type" value={filters.activityType} options={["all", "check-in", "evidence", "handover", "approved", "sent-back", "waiver", "acknowledged", "certificate", "po", "kickoff", "lookup", "red-flag"]} onChange={(activityType) => update({ activityType: activityType as typeof filters.activityType })} />
                <FilterSelect label="Actor" value={filters.activityActor} options={["all", ...new Set((view?.activity ?? []).map((event) => event.actor))]} onChange={(activityActor) => update({ activityActor })} />
                <FilterSelect label="Project" value={filters.activityProject} options={["all", ...new Set((view?.activity ?? []).map((event) => event.projectCode))]} onChange={(activityProject) => update({ activityProject })} />
              </div>
              <ActivityPanel status={status} onRetry={reload} preview={view?.activityPreview ?? []} all={view?.activity ?? []} mode="full" onOpenAll={() => undefined} reduced={reduced} />
            </div>
          ) : null}
        </div>
      <CommandPalette
        open={palette}
        onClose={() => setPalette(false)}
        projects={view?.projects ?? []}
        customers={view?.customers ?? []}
        tasks={view?.tasks ?? []}
        staff={staff}
        review={view?.review ?? []}
        onJump={(patch) => update({ tab: patch.tab ?? filters.tab, customer: patch.customer ?? filters.customer, activityProject: patch.project ?? filters.activityProject })}
      />
      {toast ? (
        <p role="status" className="fixed bottom-4 left-1/2 z-50 w-[min(420px,calc(100%-2rem))] -translate-x-1/2 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm shadow-[var(--shadow)]">
          {toast}
        </p>
      ) : null}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  labels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1 text-sm">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="bg-transparent outline-none">
        {options.map((option) => (
          <option key={option} value={option}>
            {labels?.[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function moveTab(event: ReactKeyboardEvent, current: string, setTab: (tab: "projects" | "waiting" | "engineers" | "activity") => void) {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const order = ["projects", "waiting", "engineers", "activity"] as const;
  const index = order.indexOf(current as (typeof order)[number]);
  const next = order[(index + (event.key === "ArrowRight" ? 1 : order.length - 1)) % order.length];
  if (next) setTab(next);
}

function downloadCsv(csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "project-one-projects.csv";
  link.click();
  URL.revokeObjectURL(url);
}
