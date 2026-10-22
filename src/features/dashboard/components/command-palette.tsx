"use client";

import { Command } from "cmdk";
import { useEffect } from "react";
import type { Customer, Project, ReviewItem, StaffMember, TaskRecord } from "../mock/types";

export function CommandPalette({
  open,
  onClose,
  projects,
  customers,
  tasks,
  staff,
  review,
  onJump,
}: {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  customers: Customer[];
  tasks: TaskRecord[];
  staff: StaffMember[];
  review: ReviewItem[];
  onJump: (patch: { tab?: "projects" | "engineers" | "waiting" | "activity"; customer?: string; project?: string }) => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/50 px-4 pt-[12vh]" onClick={onClose}>
      <div className="w-full max-w-xl" onClick={(event) => event.stopPropagation()}>
      <Command
        label="Search"
        className="overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
      >
        <Command.Input autoFocus placeholder="Search customers, projects, tasks" className="h-12 w-full border-b border-[var(--line)] bg-transparent px-4 outline-none" />
        <Command.List className="max-h-80 overflow-auto p-2">
          <Command.Empty className="px-2 py-6 text-sm text-[var(--muted)]">No matches in this preview.</Command.Empty>
          <Command.Group heading="Projects" className="text-xs text-[var(--muted)]">
            {projects.slice(0, 8).map((project) => (
              <Command.Item
                key={project.code}
                value={`${project.name} ${project.code}`}
                className="cursor-pointer rounded-[8px] px-2 py-2 text-sm text-[var(--ink)] aria-selected:bg-[var(--nav-active)]"
                onSelect={() => {
                  onJump({ tab: "projects", customer: project.customerId });
                  onClose();
                }}
              >
                {project.name}
                <span className="ml-2 font-mono text-xs text-[var(--muted)]">{project.code}</span>
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Customers">
            {customers.map((customer) => (
              <Command.Item
                key={customer.id}
                value={customer.name}
                className="cursor-pointer rounded-[8px] px-2 py-2 text-sm aria-selected:bg-[var(--nav-active)]"
                onSelect={() => {
                  onJump({ tab: "projects", customer: customer.id });
                  onClose();
                }}
              >
                {customer.name}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Tasks">
            {tasks.slice(0, 12).map((task) => (
              <Command.Item
                key={`${task.projectCode}-${task.id}`}
                value={`${task.id} ${task.title}`}
                className="cursor-pointer rounded-[8px] px-2 py-2 text-sm aria-selected:bg-[var(--nav-active)]"
                onSelect={() => {
                  onJump({ tab: "projects", project: task.projectCode });
                  onClose();
                }}
              >
                {task.id} {task.title}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="People">
            {staff.map((person) => (
              <Command.Item
                key={person.name}
                value={person.name}
                className="cursor-pointer rounded-[8px] px-2 py-2 text-sm aria-selected:bg-[var(--nav-active)]"
                onSelect={() => {
                  onJump({ tab: "engineers" });
                  onClose();
                }}
              >
                {person.name}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Review">
            {review.map((item) => (
              <Command.Item
                key={item.id}
                value={`${item.task} ${item.model}`}
                className="cursor-pointer rounded-[8px] px-2 py-2 text-sm aria-selected:bg-[var(--nav-active)]"
                onSelect={() => {
                  onJump({ tab: "engineers" });
                  onClose();
                }}
              >
                {item.task}, {item.model}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
      </div>
    </div>
  );
}
