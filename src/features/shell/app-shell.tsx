"use client";

import {
  Bell,
  Books,
  Buildings,
  ChatCircleDots,
  ClipboardText,
  FolderSimple,
  GearSix,
  GraduationCap,
  List,
  MagnifyingGlass,
  Moon,
  Package,
  Plus,
  Question,
  SealCheck,
  SignOut,
  SquaresFour,
  Sun,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { sections } from "@/features/sections/catalog";
import { BrandLogo } from "@/components/brand-logo";
import { clearSession, type Session } from "@/lib/session";
import { cn } from "@/lib/utils";

type Icon = ComponentType<{ className?: string; weight?: "regular" | "fill"; "aria-hidden"?: boolean }>;

type NavItem = {
  label: string;
  href: string;
  icon: Icon;
};

const icons: Record<string, Icon> = {
  tasks: ClipboardText,
  dashboard: SquaresFour,
  review: SealCheck,
  projects: FolderSimple,
  customers: Buildings,
  catalogue: Package,
  library: Books,
  learning: GraduationCap,
  accounts: UsersThree,
  messages: ChatCircleDots,
  help: Question,
  settings: GearSix,
};

const groupOrder = ["Workspace", "Commercial", "People", "Support"] as const;

const groups: { label: string; items: NavItem[] }[] = groupOrder.map((label) => ({
  label,
  items: [
    ...(label === "Workspace" ? [{ label: "Dashboard", href: "/dashboard", icon: icons.dashboard }] : []),
    ...sections
      .filter((item) => item.group === label)
      .map((item) => ({ label: item.label, href: `/${item.slug}`, icon: icons[item.slug] })),
  ],
}));

export function AppShell({
  session,
  onSignOut,
  onSearch,
  children,
  syncLabel = "All sent",
}: {
  session: Session;
  onSignOut: () => void;
  onSearch: () => void;
  children: ReactNode;
  syncLabel?: string;
}) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [rail, setRail] = useState(false);
  const [dialog, setDialog] = useState<"new" | "alerts" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[var(--page)] text-[var(--ink)]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-[var(--line)] bg-[var(--surface)]",
          open ? "flex" : "hidden md:flex",
          rail ? "md:w-[72px]" : "md:w-[72px] lg:w-[240px]",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-[var(--line)] px-3">
          <BrandLogo variant="mark" className={rail ? undefined : "lg:hidden"} />
          <BrandLogo className={cn("hidden h-10 w-auto shrink-0", rail ? "" : "lg:block")} />
          <span className={cn("hidden min-w-0 lg:block", rail && "lg:hidden")}>
            <span className="block truncate text-sm font-medium">Project One</span>
            <span className="block truncate text-xs text-[var(--muted)]">Internal</span>
          </span>
          <button type="button" className="ml-auto md:hidden" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X aria-hidden />
          </button>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4" aria-label="Primary">
          {groups.map((group) => (
            <div key={group.label}>
              <p className={cn("hidden px-2 pb-2 text-xs text-[var(--muted)] lg:block", rail && "lg:hidden")}>{group.label}</p>
              <ul className="grid gap-1">
                {group.items.map((item) => {
                  const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-[8px] px-2 text-sm",
                          current ? "bg-[var(--nav-active)] text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--ink)]",
                        )}
                      >
                        <item.icon weight={current ? "fill" : "regular"} aria-hidden />
                        <span className={cn("hidden truncate lg:inline", rail && "lg:hidden")}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-[var(--line)] p-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--nav-active)] text-xs font-medium text-[var(--accent)]">
              {session.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </span>
            <span className={cn("hidden min-w-0 lg:block", rail && "lg:hidden")}>
              <span className="block truncate text-sm">{session.name}</span>
              <span className="block truncate text-xs text-[var(--muted)]">{session.title}</span>
            </span>
            <button type="button" className="ml-auto grid size-8 place-items-center rounded-[8px]" aria-label="Sign out" onClick={onSignOut}>
              <SignOut aria-hidden />
            </button>
          </div>
        </div>
      </aside>

      <div className={cn("md:pl-[72px]", rail ? "lg:pl-[72px]" : "lg:pl-[240px]")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--line)] bg-[var(--surface)] px-3 md:px-5">
          <button type="button" className="grid size-9 place-items-center rounded-[8px] md:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <List aria-hidden />
          </button>
          <button
            type="button"
            className="hidden size-9 place-items-center rounded-[8px] lg:grid"
            aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setRail((value) => !value)}
          >
            <List aria-hidden />
          </button>
          <p className="hidden min-w-0 items-center gap-2 truncate text-sm md:flex">
            <span className="text-[var(--muted)]">ITCraft</span>
            <span className="text-[var(--muted)]">/</span>
            <span>Project One</span>
            <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-xs text-[var(--muted)]">Production</span>
            <span className="text-[var(--muted)]">/</span>
            <span>{groups.flatMap((group) => group.items).find((item) => item.href === pathname)?.label ?? "Dashboard"}</span>
          </p>
          <button
            type="button"
            onClick={onSearch}
            className="ml-auto flex h-10 w-full max-w-xs items-center gap-2 rounded-[8px] border border-[var(--input-line)] bg-[var(--surface-2)] px-3 text-sm text-[var(--muted)]"
          >
            <MagnifyingGlass aria-hidden />
            <span className="truncate">Search customers, projects, tasks</span>
            <span className="ml-auto hidden font-mono text-xs sm:inline">Ctrl K</span>
          </button>
          <span className="hidden items-center gap-1 rounded-full bg-[var(--good-soft)] px-2.5 py-1 text-xs text-[var(--good)] sm:inline-flex">
            <span className="size-1.5 rounded-full bg-[var(--good)]" aria-hidden />
            {syncLabel}
          </span>
          <button type="button" className="grid size-9 place-items-center rounded-[8px]" aria-label="Alerts" onClick={() => setDialog("alerts")}>
            <Bell aria-hidden />
          </button>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-[8px]"
            aria-label={mounted && resolvedTheme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
          >
            {mounted && resolvedTheme === "light" ? <Moon aria-hidden /> : <Sun aria-hidden />}
          </button>
          <button
            type="button"
            className="hidden h-10 items-center gap-1 rounded-[8px] bg-[var(--button-bg)] px-3 text-sm font-medium text-[var(--button-ink)] active:translate-y-px sm:inline-flex"
            onClick={() => setDialog("new")}
          >
            <Plus aria-hidden />
            New project
          </button>
        </header>
        <div className="hero-wash">{children}</div>
      </div>

      {open ? <button type="button" aria-label="Close menu overlay" className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} /> : null}

      {dialog ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="presentation" onClick={() => setDialog(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shell-dialog-title"
            className="w-[min(440px,calc(100%-2rem))] rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-5 text-[var(--ink)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="shell-dialog-title" className="font-display text-2xl leading-[1.1]">
                {dialog === "new" ? "New project" : "Alerts"}
              </h2>
              <button type="button" aria-label="Close dialog" onClick={() => setDialog(null)}>
                <X aria-hidden />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              {dialog === "new"
                ? "This preview does not create projects. The button is here so the layout matches the product."
                : "No new alerts. Field updates stay on the dashboard."}
            </p>
            <button type="button" className="mt-5 h-10 rounded-[8px] bg-[var(--button-bg)] px-4 text-sm text-[var(--button-ink)]" onClick={() => setDialog(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function leavePreview() {
  clearSession();
}
