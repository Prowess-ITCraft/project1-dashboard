"use client";

import { useState } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type SortingState } from "@tanstack/react-table";
import { CaretUpDown } from "@phosphor-icons/react";
import { customerName } from "../mock/seed";
import type { Project } from "../mock/types";
import { Sparkline, StatusPill } from "./bits";
import { CardState, Panel } from "./panel";

const helper = createColumnHelper<Project>();

export function TopProjects({
  status,
  onRetry,
  projects,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  projects: Project[];
}) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "closedThisWeek", desc: true }]);
  const columns = [
    helper.display({ id: "rank", header: "Rank", cell: (info) => info.row.index + 1 }),
    helper.accessor("name", {
      header: "Project",
      cell: (info) => (
        <span className="group relative">
          <span className="font-medium">{info.getValue()}</span>
          <span className="mt-0.5 block font-mono text-xs text-[var(--muted)]">{info.row.original.code}</span>
          <span role="tooltip" className="absolute left-0 top-full z-10 hidden w-56 rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-2 text-xs group-hover:block group-focus-within:block">
            {info.row.original.code}, {customerName(info.row.original.customerId)}, {info.row.original.site}
          </span>
        </span>
      ),
    }),
    helper.accessor((row) => customerName(row.customerId), { id: "customer", header: "Customer" }),
    helper.accessor("closedThisWeek", { header: "Closed this week" }),
    helper.accessor((row) => Object.values(row.states).reduce((sum, value) => sum + (value ?? 0), 0) - (row.states.Closed ?? 0), {
      id: "open",
      header: "Open tasks",
    }),
    helper.accessor("status", { header: "Status", cell: (info) => <StatusPill status={info.getValue()} /> }),
    helper.display({
      id: "trend",
      header: "Trend",
      cell: (info) => <Sparkline values={info.row.original.spark} label={`${info.row.original.name} trend`} />,
    }),
  ];
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: projects,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Panel title="Top projects">
      <CardState status={status} onRetry={onRetry} empty={projects.length === 0} emptyText="No projects match these filters.">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Projects ranked by activity this week</caption>
            <thead className="text-xs text-[var(--muted)]">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th key={header.id} className="pb-2 font-medium">
                      {header.column.getCanSort() ? (
                        <button type="button" className="inline-flex items-center gap-1" onClick={header.column.getToggleSortingHandler()}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <CaretUpDown size={12} aria-hidden />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--line)]">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="grid gap-3 lg:hidden">
          {projects.map((project, index) => (
            <li key={project.code} className="rounded-[8px] border border-[var(--line)] p-3">
              <p className="text-xs text-[var(--muted)]">{index + 1}</p>
              <p className="font-medium">{project.name}</p>
              <p className="font-mono text-xs text-[var(--muted)]">{project.code}</p>
              <p className="mt-2 text-sm">{customerName(project.customerId)}</p>
              <div className="mt-2 flex items-center justify-between">
                <StatusPill status={project.status} />
                <span className="text-sm">{project.closedThisWeek} closed this week</span>
              </div>
            </li>
          ))}
        </ul>
      </CardState>
    </Panel>
  );
}
