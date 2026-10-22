"use client";

import { useState } from "react";
import { DotsThree, FolderSimple, Warning } from "@phosphor-icons/react";
import { customerName } from "../mock/seed";
import { TASK_STATES, type Project } from "../mock/types";
import { StatusPill } from "./bits";
import { CardState, Panel } from "./panel";

export function FieldProjects({
  status,
  onRetry,
  projects,
  stageLine,
  sort,
  onSort,
  workflow,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  projects: Project[];
  stageLine: (stage: Project["stage"]) => string;
  sort: "behind" | "newest";
  onSort: (sort: "behind" | "newest") => void;
  workflow: "five-cores" | "eight-stages";
}) {
  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl leading-[1.1]">
          Projects in field work <span className="text-[var(--muted)]">{projects.length}</span>
        </h2>
        <div className="flex rounded-[8px] border border-[var(--line)] p-0.5 text-sm">
          <button type="button" aria-pressed={sort === "behind"} className={`rounded-[6px] px-2 py-1 ${sort === "behind" ? "bg-[var(--nav-active)]" : ""}`} onClick={() => onSort("behind")}>
            Behind plan first
          </button>
          <button type="button" aria-pressed={sort === "newest"} className={`rounded-[6px] px-2 py-1 ${sort === "newest" ? "bg-[var(--nav-active)]" : ""}`} onClick={() => onSort("newest")}>
            Newest
          </button>
        </div>
      </div>
      <CardState status={status} onRetry={onRetry} empty={projects.length === 0} emptyText="No projects are in field work for this filter.">
        <div className="grid gap-4 xl:grid-cols-2">
          {projects.map((project) => (
            <FieldCard key={project.code} project={project} stageLine={stageLine(project.stage)} showModules={workflow === "five-cores"} />
          ))}
        </div>
      </CardState>
    </section>
  );
}

function FieldCard({ project, stageLine, showModules }: { project: Project; stageLine: string; showModules: boolean }) {
  const [menu, setMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const total = TASK_STATES.reduce((sum, state) => sum + (project.states[state] ?? 0), 0);
  const closed = project.states.Closed ?? 0;
  return (
    <article data-testid={`field-${project.code}`} className="rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <header className="flex items-start gap-3">
        <FolderSimple aria-hidden className="mt-1 text-[var(--muted)]" />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium">{project.name}</h3>
          <p className="font-mono text-xs text-[var(--muted)]">
            {project.code} {customerName(project.customerId)} {project.site}
          </p>
        </div>
        <StatusPill status={project.status} />
        <span className="relative">
          <button type="button" aria-label={`Actions for ${project.name}`} className="grid size-8 place-items-center rounded-[8px]" onClick={() => setMenu((value) => !value)}>
            <DotsThree aria-hidden />
          </button>
          {menu ? (
            <span className="absolute right-0 z-10 grid w-40 rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-1 text-sm shadow-[var(--shadow)]">
              <button
                type="button"
                className="rounded-[6px] px-2 py-1 text-left"
                onClick={async () => {
                  await navigator.clipboard.writeText(project.code);
                  setNotice("Code copied");
                  setMenu(false);
                }}
              >
                Copy code
              </button>
            </span>
          ) : null}
        </span>
      </header>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span>
          {closed} of {total} closed
        </span>
        <span className="text-[var(--muted)]">{stageLine}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-9 sm:gap-1" data-testid="state-bar">
        {TASK_STATES.map((state) => {
          const count = project.states[state] ?? 0;
          return (
            <div key={state} className="min-w-0">
              <div className="h-2 rounded-full bg-[var(--surface-2)]" aria-hidden>
                <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: total ? `${(count / total) * 100}%` : "0%" }} />
              </div>
              <p className="mt-1 text-center font-mono text-[10px] tabular">{count}</p>
              <p className="truncate text-center text-[10px] text-[var(--muted)]">{state}</p>
            </div>
          );
        })}
      </div>
      {project.blocked ? (
        <p className="mt-4 flex items-start justify-between gap-3 rounded-[8px] bg-[var(--bad-soft)] px-3 py-2 text-sm text-[var(--bad)]">
          <span className="flex gap-2">
            <Warning aria-hidden className="mt-0.5 shrink-0" />
            {project.blocked}
          </span>
          <span className="shrink-0">{project.blockedDays} days</span>
        </p>
      ) : project.nextHandover ? (
        <p className="mt-4 text-sm text-[var(--good)]">{project.nextHandover}</p>
      ) : null}
      {showModules && project.modules.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.modules.map((module) => (
            <li
              key={module.name}
              className={`rounded-full border px-2 py-1 text-xs ${
                module.state === "done"
                  ? "border-[var(--good)] text-[var(--good)]"
                  : module.state === "flag"
                    ? "border-[var(--bad)] text-[var(--bad)]"
                    : "border-[var(--line)] text-[var(--muted)]"
              }`}
            >
              {module.name} {module.done}/{module.total}
              {module.state === "flag" ? ", red flag" : module.state === "done" ? ", done" : ", in progress"}
            </li>
          ))}
        </ul>
      ) : null}
      {notice ? <p className="mt-2 text-xs text-[var(--muted)]">{notice}</p> : null}
    </article>
  );
}
