"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { defaultFilters } from "../mock/query";
import type { ActivityType, Filters, MetricKey, PreviewRole, ProjectStatus, RangeKey, StageId, WorkflowId } from "../mock/types";

const tabs = new Set(["projects", "waiting", "engineers", "activity"]);
const ranges = new Set(["7d", "30d", "90d"]);
const stages = new Set(["intake", "kickoff", "planning", "execution", "closure"]);
const statuses = new Set(["Behind plan", "On track", "Active", "Waiting on customer", "Certified", "Lost"]);
const metrics = new Set(["closed", "checkins", "handovers", "evidence"]);
const roles = new Set(["director", "pm", "verifier"]);

export function useFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const filters = readFilters(params);

  function update(patch: Partial<Filters>) {
    const next = { ...filters, ...patch };
    const query = new URLSearchParams();
    if (next.tab !== "projects") query.set("tab", next.tab);
    if (next.range !== "30d") query.set("range", next.range);
    if (next.stage !== "all") query.set("stage", next.stage);
    if (next.customer !== "all") query.set("customer", next.customer);
    if (next.status !== "all") query.set("status", next.status);
    if (next.site !== "all") query.set("site", next.site);
    if (next.sort !== "behind") query.set("sort", next.sort);
    if (next.workflow !== "five-cores") query.set("workflow", next.workflow);
    if (next.metric !== "closed") query.set("metric", next.metric);
    if (next.activityType !== "all") query.set("type", next.activityType);
    if (next.activityActor !== "all") query.set("actor", next.activityActor);
    if (next.activityProject !== "all") query.set("project", next.activityProject);
    if (next.role !== "director") query.set("role", next.role);
    if (next.mock === "error") query.set("mock", "error");
    if (next.frozen) query.set("static", "1");
    const suffix = query.toString();
    router.replace(suffix ? `/dashboard?${suffix}` : "/dashboard", { scroll: false });
  }

  return { filters, update };
}

export function readFilters(params: { get(name: string): string | null }): Filters {
  const filters = defaultFilters();
  const tab = params.get("tab");
  const range = params.get("range");
  const stage = params.get("stage");
  const status = params.get("status");
  const metric = params.get("metric");
  const role = params.get("role");
  const activityType = params.get("type");
  if (tab && tabs.has(tab)) filters.tab = tab as Filters["tab"];
  if (range && ranges.has(range)) filters.range = range as RangeKey;
  if (stage && stages.has(stage)) filters.stage = stage as StageId;
  if (status && statuses.has(status)) filters.status = status as ProjectStatus;
  if (metric && metrics.has(metric)) filters.metric = metric as MetricKey;
  if (role && roles.has(role)) filters.role = role as PreviewRole;
  if (activityType) filters.activityType = activityType as ActivityType;
  filters.customer = params.get("customer") ?? "all";
  filters.site = params.get("site") ?? "all";
  filters.sort = params.get("sort") === "newest" ? "newest" : "behind";
  filters.workflow = params.get("workflow") === "eight-stages" ? "eight-stages" : "five-cores";
  filters.activityActor = params.get("actor") ?? "all";
  filters.activityProject = params.get("project") ?? "all";
  filters.mock = params.get("mock") === "error" ? "error" : "ok";
  filters.frozen = params.get("static") === "1";
  const workflow = params.get("workflow");
  if (workflow === "eight-stages") filters.workflow = "eight-stages" satisfies WorkflowId;
  return filters;
}

export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);
  return reduce;
}
