"use client";

import { Certificate, CloudCheck, CloudSlash, DeviceMobile, Pulse, Warning, WarningOctagon, WifiSlash } from "@phosphor-icons/react";
import { clockLabel } from "@/lib/format";
import { roleByName } from "../config/people-states";
import type { Engineer, NeedItem } from "../mock/types";
import { initials, avatarColor } from "../mock/build-staff";
import { CardState } from "./panel";
import { previewRoles } from "../config/people-states";
import type { PreviewRole } from "../mock/types";

export function EngineersTab({
  status,
  onRetry,
  engineers,
  needs,
  nowIso,
  offlineCount,
  offlineSince,
  failedUploads,
  certificates,
  role,
  onRole,
  paused,
  onPause,
  staffEmail,
}: {
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  engineers: Engineer[];
  needs: NeedItem[];
  nowIso: string;
  offlineCount: number;
  offlineSince: string;
  failedUploads: number;
  certificates: number;
  role: PreviewRole;
  onRole: (role: PreviewRole) => void;
  paused: boolean;
  onPause: () => void;
  staffEmail: (name: string) => string | null;
}) {
  const field = engineers.filter((engineer) => engineer.inField);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl leading-[1.1] tracking-tight">Live field view</h2>
          <p className="mt-2 max-w-[52ch] text-sm text-[var(--muted)]">Where every engineer is, what is queued on each phone, and what needs you.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--good-soft)] px-3 py-1 text-sm text-[var(--good)]">
            <span className="pulse-dot size-2 rounded-full bg-[var(--good)]" aria-hidden />
            Live, {clockLabel(nowIso)}
          </span>
          <button type="button" className="text-sm text-[var(--accent)]" onClick={onPause}>
            {paused ? "Resume live updates" : "Pause live updates"}
          </button>
        </div>
      </div>
      <label className="flex w-fit items-center gap-2 text-sm">
        Preview role
        <select
          value={role}
          onChange={(event) => onRole(event.target.value as PreviewRole)}
          className="h-9 rounded-[8px] border border-[var(--input-line)] bg-[var(--surface)] px-2"
        >
          {previewRoles.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <CardState status={status} onRetry={onRetry}>
        <div className="grid gap-px overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={Pulse} label="Engineers in the field" value={String(field.length)} />
          <Stat
            icon={DeviceMobile}
            label="Phones offline"
            value={String(offlineCount)}
            detail={offlineCount > 0 ? `since ${offlineSince === "none" ? "just now" : offlineSince}` : "all phones online"}
          />
          <Stat icon={Warning} label="Failed uploads" value={String(failedUploads)} detail="retrying" />
          <Stat icon={Certificate} label="Certificates to sign" value={String(certificates)} />
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {engineers.map((engineer) => (
              <EngineerCard key={engineer.name} engineer={engineer} email={staffEmail(engineer.name)} />
            ))}
          </div>
          <section className="rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-4">
            <h3 className="font-display text-xl">Needs you</h3>
            {needs.length === 0 ? <p className="mt-3 text-sm text-[var(--muted)]">Nothing in this role needs you right now.</p> : null}
            <ul className="mt-3 grid gap-3">
              {needs.map((item) => (
                <li key={item.id} className="border-t border-[var(--line)] pt-3 first:border-t-0 first:pt-0">
                  <p className="flex gap-2 text-sm font-medium">
                    <NeedIcon tone={item.tone} />
                    {item.title}
                  </p>
                  <p className="mt-1 pl-6 font-mono text-xs text-[var(--muted)]">{item.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </CardState>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Pulse;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="bg-[var(--surface)] p-4">
      <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <Icon aria-hidden />
        {label}
      </p>
      <p className="mt-2 font-display text-4xl leading-none tabular-nums">{value}</p>
      {detail ? <p className="mt-1 text-xs text-[var(--muted)]">{detail}</p> : null}
    </div>
  );
}

export function EngineerCard({ engineer, email }: { engineer: Engineer; email: string | null }) {
  const syncIcon =
    engineer.sync === "offline" ? WifiSlash : engineer.sync === "failed" ? CloudSlash : engineer.sync === "uploading" ? CloudSlash : CloudCheck;
  const SyncIcon = syncIcon;
  return (
    <article data-testid={`engineer-${engineer.name}`} className="rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="group relative flex items-start gap-3">
        <span className="relative grid size-10 place-items-center rounded-full text-xs text-white" style={{ background: avatarColor(engineer.name) }}>
          {initials(engineer.name)}
          <span
            className={`absolute right-0 bottom-0 size-2.5 rounded-full border border-[var(--surface)] ${engineer.sync === "offline" || !engineer.inField ? "bg-[var(--muted)]" : "bg-[var(--good)]"}`}
            aria-hidden
          />
        </span>
        <div>
          <button type="button" className="text-left font-medium">
            {engineer.name}
          </button>
          <p className="text-sm text-[var(--muted)]">{engineer.currentTask ?? "Not in the field today"}</p>
          <span
            role="tooltip"
            className="absolute left-0 top-full z-10 hidden w-56 rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-2 text-xs group-hover:block group-focus-within:block"
          >
            {engineer.name}. {roleByName[engineer.name] ?? "ITCraft"}. ITCraft.
            {email ? ` ${email}` : ""}
          </span>
        </div>
      </div>
      <p className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${engineer.sync === "failed" ? "bg-[var(--bad-soft)] text-[var(--bad)]" : engineer.sync === "offline" ? "bg-[var(--warn-soft)] text-[var(--warn)]" : "bg-[var(--good-soft)] text-[var(--good)]"}`}>
        <SyncIcon size={14} aria-hidden />
        {engineer.syncDetail}
      </p>
      {engineer.inField ? (
        <dl className="mt-3 grid grid-cols-4 gap-2 text-center">
          {[
            ["Waiting", engineer.waiting],
            ["Uploading", engineer.uploading],
            ["Failed", engineer.failed],
            ["Done", engineer.done],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-[8px] bg-[var(--surface-2)] px-1 py-2">
              <dt className="text-[10px] text-[var(--muted)]">{label}</dt>
              <dd className="font-mono text-sm tabular">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </article>
  );
}

function NeedIcon({ tone }: { tone: NeedItem["tone"] }) {
  if (tone === "certificate") return <Certificate aria-hidden className="mt-0.5 shrink-0" />;
  if (tone === "offline") return <WifiSlash aria-hidden className="mt-0.5 shrink-0" />;
  if (tone === "failed") return <WarningOctagon aria-hidden className="mt-0.5 shrink-0 text-[var(--bad)]" />;
  return <Warning aria-hidden className="mt-0.5 shrink-0" />;
}

export function EngineerQueues({
  engineers,
}: {
  engineers: Engineer[];
}) {
  const queued = engineers.filter((engineer) => engineer.inField && (engineer.waiting > 0 || engineer.sync === "offline" || engineer.failed > 0));
  return (
    <section className="rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl">Engineer queues</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--good-soft)] px-2 py-0.5 text-xs text-[var(--good)]">
          <span className="pulse-dot size-1.5 rounded-full bg-[var(--good)]" aria-hidden />
          Live
        </span>
      </header>
      <p className="mb-3 text-sm text-[var(--muted)]">Offline items waiting on each phone</p>
      <ul className="grid gap-2 text-sm">
        {queued.map((engineer) => (
          <li key={engineer.name} className="flex justify-between gap-3 border-t border-[var(--line)] py-2">
            <span>{engineer.name}</span>
            <span className="font-mono text-xs text-[var(--muted)]">
              {engineer.waiting} waiting, {engineer.failed} failed
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
