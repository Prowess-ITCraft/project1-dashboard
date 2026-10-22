import { stageLine } from "../config/workflows";
import { FIXED_NOW_ISO } from "@/lib/format";
import {
  activity,
  customerName,
  customers,
  distribution,
  engineers,
  kpis,
  liveStrip,
  needs,
  projects,
  review,
  taskTotal,
  tasks,
  throughput,
  vitals,
  waiting,
} from "./seed";
import type {
  Band,
  Filters,
  MetricKey,
  Project,
  RangeKey,
  Snapshot,
  TaskState,
} from "./types";
import { TASK_STATES } from "./types";

export const SOURCE_DELAY_MS = 420;

export function createSnapshot(nowIso = FIXED_NOW_ISO): Snapshot {
  return {
    nowIso,
    kpis,
    distribution,
    live: {
      inField: 4,
      onSite: 3,
      offline: 1,
      idle: 0,
      strip: liveStrip,
    },
    projects,
    engineers,
    activity,
    waiting,
    needs,
    review,
    tasks,
    customers,
    throughput,
    vitals,
    phonesOfflineSince: "14:02",
    failedUploads: 1,
    certificatesToSign: 2,
  };
}

export function rangeDays(range: RangeKey) {
  if (range === "7d") return 7;
  if (range === "30d") return 30;
  return 90;
}

export function sumMetric(points: Snapshot["throughput"], metric: MetricKey, days: number) {
  return points.slice(-days).reduce((sum, point) => sum + point[metric], 0);
}

export function previousWindow(points: Snapshot["throughput"], metric: MetricKey, days: number) {
  return points.slice(-days * 2, -days).reduce((sum, point) => sum + point[metric], 0);
}

export function bandPercent(value: number, goodAt: number, poorBelow: number): Band {
  if (value >= goodAt) return "good";
  if (value < poorBelow) return "poor";
  return "needs improvement";
}

export function bandDuration(minutes: number, goodUpTo: number, poorAbove: number): Band {
  if (minutes <= goodUpTo) return "good";
  if (minutes > poorAbove) return "poor";
  return "needs improvement";
}

export function bandSeconds(seconds: number, goodUpTo: number, poorAbove: number): Band {
  if (seconds <= goodUpTo) return "good";
  if (seconds > poorAbove) return "poor";
  return "needs improvement";
}

export function delta(current: number, previous: number) {
  const diff = current - previous;
  if (diff === 0) return { text: "No change vs previous period", direction: "flat" as const };
  const sign = diff > 0 ? "+" : "";
  return { text: `${sign}${diff} vs previous period`, direction: diff > 0 ? ("up" as const) : ("down" as const) };
}

const bucketOf: Record<TaskState, "assigned" | "inField" | "checked" | "closed"> = {
  Assigned: "assigned",
  Accepted: "inField",
  "Checked in": "inField",
  Prechecks: "inField",
  Configured: "inField",
  Evidence: "inField",
  Checked: "checked",
  "Handed over": "inField",
  Closed: "closed",
};

export function distributionFromProjects(list: Project[]) {
  const totals = { assigned: 0, inField: 0, checked: 0, closed: 0 };
  for (const item of list) {
    for (const state of TASK_STATES) {
      totals[bucketOf[state]] += item.states[state] ?? 0;
    }
  }
  return totals;
}

export function projectsCsv(list: Project[]) {
  const header = ["Code", "Project", "Customer", "Site", "Stage", "Status", "Progress", "Started"];
  const lines = list.map((item) =>
    [item.code, item.name, customerName(item.customerId), item.site, item.stage, item.status, String(item.progress), item.started]
      .map((cell) => `"${cell.replaceAll('"', '""')}"`)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export function defaultFilters(): Filters {
  return {
    tab: "projects",
    range: "30d",
    stage: "all",
    customer: "all",
    status: "all",
    site: "all",
    sort: "behind",
    workflow: "five-cores",
    metric: "closed",
    activityType: "all",
    activityActor: "all",
    activityProject: "all",
    role: "director",
    mock: "ok",
    frozen: false,
  };
}

function sameProjectSet(list: Project[]) {
  return list.length === projects.length;
}

export function applyFilters(snapshot: Snapshot, filters: Filters) {
  const filteredProjects = snapshot.projects.filter((item) => {
    if (filters.stage !== "all" && item.stage !== filters.stage) return false;
    if (filters.customer !== "all" && item.customerId !== filters.customer) return false;
    if (filters.status !== "all" && item.status !== filters.status) return false;
    if (filters.site !== "all" && item.site !== filters.site) return false;
    return true;
  });

  const projectCodes = new Set(filteredProjects.map((item) => item.code));
  const narrowed = !sameProjectSet(filteredProjects);
  const days = rangeDays(filters.range);
  const currentTotal = sumMetric(snapshot.throughput, filters.metric, days);
  const priorTotal = previousWindow(snapshot.throughput, filters.metric, days);
  const series = snapshot.throughput.slice(-days);
  const priorSeries = snapshot.throughput.slice(-days * 2, -days);

  const fieldProjects = filteredProjects
    .filter((item) => item.stage === "execution")
    .slice()
    .sort((a, b) => {
      if (filters.sort === "newest") return b.started.localeCompare(a.started);
      if (a.status === "Behind plan" && b.status !== "Behind plan") return -1;
      if (b.status === "Behind plan" && a.status !== "Behind plan") return 1;
      return b.activityScore - a.activityScore;
    });

  const closed = filteredProjects.reduce((sum, item) => sum + (item.states.Closed ?? 0), 0);
  const taskCount = filteredProjects.reduce((sum, item) => sum + taskTotal(item.states), 0);
  const behind = filteredProjects.filter((item) => item.status === "Behind plan").length;
  const blocked = filteredProjects.filter((item) => item.blocked).length;

  const viewKpis = narrowed
    ? kpis.map((kpi) => {
        if (kpi.id === "behind") return { ...kpi, value: behind, of: filteredProjects.length, delta: "Filtered view" };
        if (kpi.id === "blocked") return { ...kpi, value: blocked, delta: "Filtered view" };
        if (kpi.id === "closed") return { ...kpi, value: closed, of: taskCount, delta: "Filtered view" };
        if (kpi.id === "deviations") return { ...kpi, delta: "Filtered view" };
        return { ...kpi, delta: "Filtered view" };
      })
    : snapshot.kpis;

  const visibleEngineers = snapshot.engineers.filter((engineer) => {
    if (!narrowed) return true;
    return snapshot.tasks.some(
      (task) => task.engineer === engineer.name && projectCodes.has(task.projectCode) && task.state !== "Closed",
    );
  });

  const activityItems = snapshot.activity.filter((event) => {
    if (narrowed && !projectCodes.has(event.projectCode)) return false;
    if (filters.activityType !== "all" && event.type !== filters.activityType) return false;
    if (filters.activityActor !== "all" && event.actor !== filters.activityActor) return false;
    if (filters.activityProject !== "all" && event.projectCode !== filters.activityProject) return false;
    return true;
  });

  return {
    nowIso: snapshot.nowIso,
    kpis: viewKpis,
    projects: filteredProjects,
    fieldProjects,
    topProjects: filteredProjects.slice().sort((a, b) => b.activityScore - a.activityScore).slice(0, 5),
    distribution: narrowed ? distributionFromProjects(filteredProjects) : snapshot.distribution,
    engineers: visibleEngineers.filter((engineer) => engineer.inField || !narrowed),
    workload: (narrowed ? visibleEngineers : snapshot.engineers).map((engineer) => ({
      name: engineer.name,
      open: engineer.open,
      late: engineer.late,
    })),
    sources: {
      entry: countBy(filteredProjects, (item) => item.entry),
      order: countBy(filteredProjects, (item) => item.order),
    },
    vitals: snapshot.vitals,
    throughput: {
      series,
      priorSeries,
      total: currentTotal,
      delta: delta(currentTotal, priorTotal),
    },
    activity: activityItems,
    activityPreview: activityItems.slice(0, 8),
    waiting: snapshot.waiting.filter((item) => !narrowed || projectCodes.has(item.projectCode)),
    needs: snapshot.needs.filter((item) => item.roles.includes(filters.role)),
    live: snapshot.live,
    review: snapshot.review,
    tasks: snapshot.tasks.filter((task) => !narrowed || projectCodes.has(task.projectCode)),
    customers: snapshot.customers,
    stageLine: (stage: Project["stage"]) => stageLine(stage, filters.workflow),
    phonesOfflineSince: snapshot.phonesOfflineSince,
    failedUploads: snapshot.failedUploads,
    certificatesToSign: snapshot.certificatesToSign,
    inField: snapshot.engineers.filter((engineer) => engineer.inField).length,
  };
}

function countBy<T>(list: T[], pick: (item: T) => string) {
  const map = new Map<string, number>();
  for (const item of list) {
    const key = pick(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const total = list.length || 1;
  return [...map.entries()].map(([label, count]) => ({
    label,
    count,
    percent: Math.round((count / total) * 100),
  }));
}

export type DashboardView = ReturnType<typeof applyFilters>;
