"use client";

import { motion } from "motion/react";
import { useMemo, useState, type ReactNode } from "react";
import { readSession, type Session } from "@/lib/session";
import { settingCards, type SectionSpec } from "./catalog";
import {
  firstSignIn,
  gettingAround,
  glossary,
  helpIntro,
  helpRoles,
  projectSteps,
  whenWrong,
} from "./help-copy";
import {
  accounts as seedAccounts,
  catalogue,
  customers as seedCustomers,
  libraryFiles,
  libraryLine,
  messages as seedMessages,
  projects as seedProjects,
  reviewTasks,
  roleFilters,
  type Account,
  type CustomerRow,
  type ProjectRow,
} from "./mock-data";

const ease = [0.16, 1, 0.3, 1] as const;

export function SectionScreen({ spec }: { spec: SectionSpec }) {
  const animate = false;
  const [session] = useState<Session | null>(() => (typeof window === "undefined" ? null : readSession()));

  if (!session) return null;

  return (
    <div className="mx-auto grid min-w-0 max-w-[1400px] gap-5 px-3 py-5 md:px-6 md:py-6">
      <header>
        <h1 className="font-display text-[1.6rem] leading-tight tracking-tight text-[var(--text)] sm:text-[1.75rem]">{spec.slug === "help" ? "How to use Project One" : spec.label}</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--muted)]">{spec.hint}</p>
      </header>
      {spec.slug === "tasks" ? <TasksView animate={animate} /> : null}
      {spec.slug === "review" ? <ReviewView animate={animate} /> : null}
      {spec.slug === "projects" ? <ProjectsView animate={animate} /> : null}
      {spec.slug === "customers" ? <CustomersView animate={animate} /> : null}
      {spec.slug === "catalogue" ? <CatalogueView animate={animate} /> : null}
      {spec.slug === "library" ? <LibraryView animate={animate} /> : null}
      {spec.slug === "learning" ? <LearningView animate={animate} /> : null}
      {spec.slug === "accounts" ? <AccountsView animate={animate} /> : null}
      {spec.slug === "messages" ? <MessagesView animate={animate} /> : null}
      {spec.slug === "help" ? <HelpView name={session.name} animate={animate} /> : null}
      {spec.slug === "settings" ? <SettingsView animate={animate} /> : null}
    </div>
  );
}

function TasksView({ animate }: { animate: boolean }) {
  const [open, setOpen] = useState<string | null>("t02a");
  return (
    <div className="grid gap-3">
      {reviewTasks.map((task, index) => (
        <Fade key={task.id} index={index} animate={animate}>
          <button type="button" onClick={() => setOpen(task.id)} className="panel w-full px-4 py-3 text-left transition-colors hover:bg-[var(--surface-2)]">
            <span className="font-medium text-[var(--accent)]">{task.ref} {task.title}</span>
            <span className="mt-1 block text-sm text-[var(--muted)]">{task.customer}, {task.project}</span>
          </button>
        </Fade>
      ))}
      {open ? <TaskDetail id={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function ReviewView({ animate }: { animate: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState<Record<string, string>>({});
  const waiting = reviewTasks.filter((task) => !done[task.id]);
  return (
    <div className="grid gap-4">
      {waiting.length === 0 ? <Empty>Nothing waiting for review. Handed over tasks arrive here, oldest first.</Empty> : (
        <Table
          columns={["Task", "Device", "Sent back", "Handed over"]}
          rows={waiting.map((task) => ({
            id: task.id,
            cells: [
              <button key="t" type="button" className="text-left font-medium text-[var(--accent)]" onClick={() => setOpen(task.id)}>{task.ref} {task.title}</button>,
              task.device,
              task.sentBack,
              task.handedOver,
            ],
          }))}
          animate={animate}
        />
      )}
      {open ? (
        <TaskDetail
          id={open}
          onClose={() => setOpen(null)}
          note={note}
          onNote={setNote}
          onApprove={() => {
            setDone((current) => ({ ...current, [open]: "Approved and closed" }));
            setOpen(null);
            setNote("");
          }}
          onSendBack={() => {
            if (!note.trim()) return;
            setDone((current) => ({ ...current, [open]: "Sent back" }));
            setOpen(null);
            setNote("");
          }}
        />
      ) : null}
    </div>
  );
}

function TaskDetail({
  id,
  onClose,
  note,
  onNote,
  onApprove,
  onSendBack,
}: {
  id: string;
  onClose: () => void;
  note?: string;
  onNote?: (value: string) => void;
  onApprove?: () => void;
  onSendBack?: () => void;
}) {
  const task = reviewTasks.find((item) => item.id === id);
  if (!task) return null;
  const steps = ["Assigned", "Accepted", "Checked in", "Prechecks", "Configured", "Evidence", "Checked", "Handed over", "Closed"];
  return (
    <section className="grid gap-4 panel p-4">
      <button type="button" onClick={onClose} className="w-fit text-sm text-[var(--muted)]">← Back</button>
      <div>
        <h2 className="font-display text-2xl text-[var(--text)]">{task.ref} {task.title}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{task.customer}, {task.project}. No device. Planned 5 Oct 2026, 12:15 pm.</p>
      </div>
      <Pill tone="ok">Handed over</Pill>
      <ol className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
        {steps.map((step) => (
          <li key={step} className={step === "Handed over" ? "font-medium text-[var(--accent)]" : ""}>{step}</li>
        ))}
      </ol>
      <p className="text-sm text-[var(--text)]">Waiting for a verifier.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onApprove} disabled={!onApprove} className="btn-primary disabled:opacity-40">Approve and close</button>
        <button type="button" onClick={onSendBack} disabled={!onSendBack || !note?.trim()} className="btn-ghost disabled:opacity-40">Send back</button>
      </div>
      {onNote ? (
        <label className="grid gap-1 text-sm">
          What must be fixed
          <textarea value={note} onChange={(event) => onNote(event.target.value)} className="min-h-24 w-full rounded-lg border border-[var(--line)] bg-[var(--page)] px-3 py-2 text-sm" />
        </label>
      ) : null}
      <div>
        <h3 className="text-sm font-medium">Configuration check 1: passed</h3>
        <Table columns={["Setting", "Target", "Found", "Result"]} rows={[{ id: "vlan", cells: ["Management VLAN", "20", "20", "Pass"] }]} animate={false} />
      </div>
      <p className="text-sm text-[var(--muted)]">Evidence: Photo of the site on arrival. <span className="text-[var(--good)]">Added</span></p>
    </section>
  );
}

function ProjectsView({ animate }: { animate: boolean }) {
  const [rows, setRows] = useState<ProjectRow[]>(seedProjects);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const shown = rows.filter((row) => `${row.name} ${row.code} ${row.customer}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" className="field max-w-sm" />
        <button type="button" onClick={() => setAdding(true)} className="btn-primary">New project</button>
      </div>
      {adding ? (
        <form
          className="grid gap-2 panel p-4 sm:grid-cols-[1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            setRows((current) => [{ id: name, name, code: `P1-2627-${String(20 + current.length).padStart(4, "0")}`, customer: "Shakti Equipments Pvt Ltd", stage: "Audit intake", status: "active", started: "22 Oct 2026" }, ...current]);
            setName("");
            setAdding(false);
          }}
        >
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Project name" className="field bg-[var(--page)]" />
          <button type="submit" className="btn-primary">Create</button>
        </form>
      ) : null}
      <Table
        columns={["Project", "Customer", "Stage", "Status", "Started"]}
        rows={shown.map((row) => ({
          id: row.id,
          cells: [<span key="n"><span className="block font-medium text-[var(--accent)]">{row.name}</span><span className="text-xs text-[var(--muted)]">{row.code}</span></span>, row.customer, row.stage, <Pill key="s" tone="ok">{row.status}</Pill>, row.started],
        }))}
        animate={animate}
      />
    </div>
  );
}

function CustomersView({ animate }: { animate: boolean }) {
  const [rows, setRows] = useState<CustomerRow[]>(seedCustomers);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", city: "", gstin: "" });
  const shown = rows.filter((row) => `${row.name} ${row.code} ${row.gstin}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">Find a customer</p>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, code or GSTIN" className="field mt-1 max-w-sm" />
        </div>
        <button type="button" onClick={() => setAdding((value) => !value)} className="btn-primary">New customer</button>
      </div>
      {adding ? (
        <form
          className="grid gap-2 panel p-4 sm:grid-cols-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!draft.name.trim()) return;
            setRows((current) => [...current, { id: draft.name, name: draft.name, code: `CUS-${String(current.length + 1).padStart(5, "0")}`, city: draft.city || "Thane, Maharashtra", size: "small", gstin: draft.gstin }]);
            setDraft({ name: "", city: "", gstin: "" });
            setAdding(false);
          }}
        >
          <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Company" className="field bg-[var(--page)]" />
          <input value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} placeholder="City" className="field bg-[var(--page)]" />
          <input value={draft.gstin} onChange={(event) => setDraft({ ...draft, gstin: event.target.value })} placeholder="GSTIN" className="field bg-[var(--page)]" />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      ) : null}
      <Table
        columns={["Customer", "City", "Size", "GSTIN"]}
        rows={shown.map((row) => ({
          id: row.id,
          cells: [<span key="n"><span className="block font-medium text-[var(--accent)]">{row.name}</span><span className="text-xs text-[var(--muted)]">{row.code}</span></span>, row.city, <Pill key="s">{row.size}</Pill>, row.gstin || ""],
        }))}
        animate={animate}
      />
    </div>
  );
}

function CatalogueView({ animate }: { animate: boolean }) {
  const [tab, setTab] = useState<"all" | "refresh">("all");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [category, setCategory] = useState("All categories");
  const categories = ["All categories", ...new Set(catalogue.map((item) => item.category))];
  const rows = catalogue.filter((item) => {
    if (tab === "refresh" && item.priceState === "Valid") return false;
    if (kind === "product" && item.kind !== "product") return false;
    if (kind === "service" && item.kind !== "service") return false;
    if (category !== "All categories" && item.category !== category) return false;
    return `${item.name} ${item.code}`.toLowerCase().includes(query.toLowerCase());
  });
  return (
    <div className="grid gap-3">
      <div className="flex min-w-0 gap-4 overflow-x-auto border-b border-[var(--line)] text-sm">
        <TabButton active={tab === "all"} onClick={() => setTab("all")}>All items</TabButton>
        <TabButton active={tab === "refresh"} onClick={() => setTab("refresh")}>Prices to refresh</TabButton>
      </div>
      <div className="flex flex-wrap gap-2">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or code" className="field min-w-56 flex-1" />
        <select value={kind} onChange={(event) => setKind(event.target.value)} className="field field-limit">
          <option value="all">Products and services</option>
          <option value="product">Products</option>
          <option value="service">Services</option>
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="field field-limit">
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <Table
        columns={["Item", "Category", "Stock", "Selling price", "Price"]}
        rows={rows.map((item) => ({
          id: item.id,
          cells: [
            <span key="n"><span className="block font-medium text-[var(--accent)]">{item.name}</span><span className="text-xs text-[var(--muted)]">{item.code}</span></span>,
            item.category,
            <Pill key="s" tone="ok">{item.stock}</Pill>,
            item.price,
            <Pill key="p" tone={item.priceState === "Valid" ? "ok" : "bad"}>{item.priceState}</Pill>,
          ],
        }))}
        animate={animate}
      />
    </div>
  );
}

function LibraryView({ animate }: { animate: boolean }) {
  const [tab, setTab] = useState<"files" | "corpus" | "quality">("files");
  const [held, setHeld] = useState(true);
  const [notice, setNotice] = useState("");
  return (
    <div className="grid gap-4">
      <div
        className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-4 text-sm"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          setNotice(file ? `${file.name} is queued in this preview. The same file is never added twice.` : "");
        }}
      >
        <p className="font-medium">Drop files here, or <button type="button" className="text-[var(--accent)]" onClick={() => setNotice("Choose a BOQ or a report. This preview keeps the two files already read.")}>choose files</button></p>
        <p className="mt-1 text-[var(--muted)]">BOQ as PDF or Excel. Report as Word or JSON. The same file is never added twice. Many files at once? Copy them into the inbox folder on the server.</p>
        {notice ? <p className="mt-2 text-[var(--text)]">{notice}</p> : null}
      </div>
      <div className="flex min-w-0 gap-4 overflow-x-auto border-b border-[var(--line)] text-sm">
        <TabButton active={tab === "files"} onClick={() => setTab("files")}>Files <span className="ml-1 rounded-full bg-[var(--surface-2)] px-1.5 text-xs">2</span></TabButton>
        <TabButton active={tab === "corpus"} onClick={() => setTab("corpus")}>Corpus</TabButton>
        <TabButton active={tab === "quality"} onClick={() => setTab("quality")}>Data quality</TabButton>
      </div>
      {tab === "files" ? (
        <div className="grid gap-4">
          {held ? (
            <section className="grid gap-2">
              <h2 className="font-display text-xl">Lines waiting for a person</h2>
              <p className="text-sm text-[var(--muted)]">The reader was not sure about these lines. Check the text against the original, correct it if needed, and confirm.</p>
              <div className="panel p-4 text-sm">
                <p className="text-[var(--muted)]">{libraryLine.file}</p>
                <p className="mt-1 font-medium">Component {libraryLine.component}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span>{libraryLine.qty}</span>
                  <button type="button" className="btn-primary" onClick={() => setHeld(false)}>Confirm</button>
                  <button type="button" className="text-sm text-[var(--muted)]" onClick={() => setHeld(false)}>Discard</button>
                </div>
                <p className="mt-2 text-[var(--muted)]">{libraryLine.note}</p>
              </div>
            </section>
          ) : <Empty>No lines are waiting.</Empty>}
          <Table
            columns={["File", "Kind", "Status", "Added to data", "Held"]}
            rows={libraryFiles.map((file) => ({
              id: file.id,
              cells: [file.name, file.kind, <Pill key="s" tone="warn">{file.status}</Pill>, file.added, file.id === "boq" && !held ? "0" : file.held],
            }))}
            animate={animate}
          />
          <p className="text-sm text-[var(--muted)]">0 required field(s) unread and 1 conflict(s). The facts were added; check them in the audit review.</p>
        </div>
      ) : null}
      {tab === "corpus" ? <Empty>63 facts from the Shakti report are labelled and kept as compact data for suggestions.</Empty> : null}
      {tab === "quality" ? <Empty>1 line was held for a person. 0 required fields are unread. The old BOQ has 1 conflict.</Empty> : null}
    </div>
  );
}

function LearningView({ animate }: { animate: boolean }) {
  const [tab, setTab] = useState("ranker");
  const [frozen, setFrozen] = useState(false);
  return (
    <div className="grid gap-4">
      <div className="flex min-w-0 gap-4 overflow-x-auto border-b border-[var(--line)] text-sm">
        <TabButton active={tab === "ranker"} onClick={() => setTab("ranker")}>Product ranker</TabButton>
        <TabButton active={tab === "lines"} onClick={() => setTab("lines")}>BOQ lines</TabButton>
        <TabButton active={tab === "prices"} onClick={() => setTab("prices")}>Prices</TabButton>
      </div>
      {tab === "ranker" ? (
        <section className="grid gap-3">
          <h2 className="font-display text-xl">What there is to learn from</h2>
          <p className="text-sm text-[var(--muted)]">Which of the products the recommender suggested the customer actually took.</p>
          <div className="h-1.5 max-w-xl rounded-full bg-[var(--surface-2)]"><div className="h-full w-0 rounded-full bg-[var(--accent)]" /></div>
          <p className="text-sm font-medium">0 of 20 accepted recommendations needed before a model can be trained.</p>
          <dl className="grid max-w-md gap-1 text-sm">
            <div className="flex justify-between"><dt className="text-[var(--muted)]">Candidates recorded</dt><dd>6</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--muted)]">With the customer&apos;s decision</dt><dd>6</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--muted)]">Rules picked what the customer took</dt><dd>not enough data</dd></div>
          </dl>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">Training sets</h3>
              <p className="text-sm text-[var(--muted)]">A frozen copy of the examples so far. Models train on one of these, never on live data, so each model can be traced to exactly what it learned from.</p>
            </div>
            <button type="button" onClick={() => setFrozen(true)} className="btn-ghost shrink-0">Freeze a new training set</button>
          </div>
          <Fade index={0} animate={animate}>
            {frozen ? <Empty>Training set frozen on 22 Oct 2026. It holds the 6 recorded candidates. Nothing is trained yet.</Empty> : <Empty>No training sets yet. Freeze one when you are ready to train.</Empty>}
          </Fade>
        </section>
      ) : null}
      {tab === "lines" ? <Empty>6 BOQ line candidates are recorded. There is not enough accepted work to compare a model with the rules.</Empty> : null}
      {tab === "prices" ? <Empty>Price suggestions stay beside the price book. 0 of 20 accepted prices are in, so no price model is trained.</Empty> : null}
    </div>
  );
}

function AccountsView({ animate }: { animate: boolean }) {
  const [rows, setRows] = useState<Account[]>(seedAccounts);
  const [role, setRole] = useState("Everyone");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", role: "Field engineer" });
  const [selected, setSelected] = useState<string | null>(null);
  const counts = useMemo(() => {
    const map: Record<string, number> = { Everyone: rows.length };
    for (const item of roleFilters.slice(1)) map[item] = rows.filter((row) => row.roles.includes(item)).length;
    return map;
  }, [rows]);
  const shown = rows.filter((row) => {
    if (role !== "Everyone" && !row.roles.includes(role)) return false;
    return `${row.name} ${row.email} ${row.designation}`.toLowerCase().includes(query.toLowerCase());
  });
  const person = rows.find((row) => row.id === selected);
  return (
    <div className="grid gap-3">
      <div className="flex justify-end">
        <button type="button" onClick={() => setAdding((value) => !value)} className="btn-primary">New account</button>
      </div>
      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 text-sm">
        {roleFilters.map((item) => (
          <button key={item} type="button" onClick={() => setRole(item)} className={`shrink-0 rounded-full px-3 py-1 ${role === item ? "bg-[var(--accent-soft)] text-[var(--ink)]" : "text-[var(--muted)]"}`}>
            {item} {counts[item] ?? 0}
          </button>
        ))}
      </div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email or designation" className="field" />
      {adding ? (
        <form
          className="grid gap-2 panel p-4 sm:grid-cols-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!draft.name.trim() || !draft.email.trim()) return;
            setRows((current) => [...current, { id: draft.email, name: draft.name, email: draft.email, designation: draft.role, roles: [draft.role], status: "Active", lastSignIn: "Never" }]);
            setDraft({ name: "", email: "", role: "Field engineer" });
            setAdding(false);
          }}
        >
          <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Name" className="field bg-[var(--page)]" />
          <input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="Email" className="field bg-[var(--page)]" />
          <select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} className="field bg-[var(--page)]">
            {roleFilters.slice(1).map((item) => <option key={item}>{item}</option>)}
          </select>
          <button type="submit" className="btn-primary">Create</button>
        </form>
      ) : null}
      <Table
        columns={["Person", "Roles", "Status", "Last sign-in"]}
        rows={shown.map((row) => ({
          id: row.id,
          cells: [
            <button key="n" type="button" className="text-left" onClick={() => setSelected(row.id)}>
              <span className="block font-medium text-[var(--accent)]">{row.name}</span>
              <span className="text-xs text-[var(--muted)]">{row.email}, {row.designation}</span>
            </button>,
            row.roles.join(", "),
            <Pill key="s" tone={row.status === "Active" ? "ok" : "bad"}>{row.status}</Pill>,
            row.lastSignIn,
          ],
        }))}
        animate={animate}
      />
      {person ? (
        <div className="flex flex-wrap gap-2 panel p-4 text-sm">
          <p className="w-full font-medium">{person.name}</p>
          <button type="button" className="btn-ghost" onClick={() => setRows((current) => current.map((row) => row.id === person.id ? { ...row, lastSignIn: "Reset. Temporary password issued." } : row))}>Reset password</button>
          <button type="button" className="btn-ghost" onClick={() => setRows((current) => current.map((row) => row.id === person.id ? { ...row, designation: `${row.designation}. Authenticator reset.` } : row))}>Reset authenticator</button>
          <button type="button" className="btn-ghost" onClick={() => setRows((current) => current.map((row) => row.id === person.id ? { ...row, status: "Active" } : row))}>Unlock</button>
          <button type="button" className="btn-ghost" onClick={() => setRows((current) => current.map((row) => row.id === person.id ? { ...row, status: row.status === "Active" ? "Deactivated" : "Active" } : row))}>{person.status === "Active" ? "Deactivate account" : "Activate account"}</button>
        </div>
      ) : null}
    </div>
  );
}

function MessagesView({ animate }: { animate: boolean }) {
  const [rows, setRows] = useState(seedMessages);
  return (
    <div className="grid gap-2">
      {rows.map((row, index) => (
        <Fade key={row.id} index={index} animate={animate}>
          <article className="panel p-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-medium">{row.title}</h2>
              {row.unread ? <Pill tone="warn">Unread</Pill> : <Pill>Read</Pill>}
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">{row.body}</p>
            {row.unread ? (
              <button type="button" className="mt-3 text-sm text-[var(--accent)]" onClick={() => setRows((current) => current.map((item) => item.id === row.id ? { ...item, unread: false } : item))}>Mark read</button>
            ) : null}
          </article>
        </Fade>
      ))}
    </div>
  );
}

function HelpView({ name, animate }: { name: string; animate: boolean }) {
  return (
    <div className="grid max-w-3xl gap-4 text-sm leading-6">
      <p>{helpIntro}</p>
      <section className="panel p-5">
        <h2 className="font-display text-xl">Your part</h2>
        <p className="mt-1 text-[var(--muted)]">You are signed in as {name}. These are the steps for your roles.</p>
      </section>
      {helpRoles.map((role, index) => (
        <Fade key={role.title} index={index} animate={animate}>
          <section className="panel p-5">
            <h2 className="font-display text-xl">{role.title}</h2>
            <ol className="mt-2 grid list-decimal gap-2 pl-5">
              {role.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </section>
        </Fade>
      ))}
      <section className="panel p-5">
        <h2 className="font-display text-xl">A project, step by step</h2>
        <p className="mt-1 text-[var(--muted)]">A project moves to the next step only when the current one is approved. If a step is sent back, the reason is shown at the top of the project.</p>
        <ol className="mt-3 grid gap-3">
          {projectSteps.map((step) => (
            <li key={step.title}>
              <span className="font-medium">{step.title}</span>
              <span className="text-[var(--muted)]"> {step.who}</span>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="panel p-5">
        <h2 className="font-display text-xl">Getting around</h2>
        <ul className="mt-2 grid list-disc gap-2 pl-5">{gettingAround.map((line) => <li key={line}>{line}</li>)}</ul>
      </section>
      <section className="panel p-5">
        <h2 className="font-display text-xl">First sign-in</h2>
        <ul className="mt-2 grid list-disc gap-2 pl-5">{firstSignIn.map((line) => <li key={line}>{line}</li>)}</ul>
      </section>
      <section className="panel p-5">
        <h2 className="font-display text-xl">When something goes wrong</h2>
        <dl className="mt-2 grid gap-3">
          {whenWrong.map((item) => (
            <div key={item.title}>
              <dt className="font-medium">{item.title}</dt>
              <dd className="text-[var(--muted)]">{item.body}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="panel p-5">
        <h2 className="font-display text-xl">Words used in the app</h2>
        <dl className="mt-2 grid gap-3">
          {glossary.map((item) => (
            <div key={item.title}>
              <dt className="font-medium">{item.title}</dt>
              <dd className="text-[var(--muted)]">{item.body}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function SettingsView({ animate }: { animate: boolean }) {
  const [saved, setSaved] = useState("");
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {settingCards.map(([title, body], index) => (
        <Fade key={title} index={index} animate={animate}>
          <article className="grid gap-3 panel p-4">
            <h2 className="font-display text-xl">{title}</h2>
            <p className="text-sm leading-6 text-[var(--muted)]">{body}</p>
            <button type="button" className="btn-ghost w-fit" onClick={() => setSaved(title)}>Save {title.toLowerCase()}</button>
          </article>
        </Fade>
      ))}
      {saved ? <p className="text-sm text-[var(--good)] md:col-span-2">{saved} saved for this preview.</p> : null}
    </div>
  );
}

function Table({ columns, rows, animate }: { columns: string[]; rows: { id: string; cells: ReactNode[] }[]; animate: boolean }) {
  if (rows.length === 0) return <Empty>Nothing matches.</Empty>;
  return (
    <>
      <div className="grid gap-2 lg:hidden">
        {rows.map((row) => (
          <article key={row.id} className="panel grid gap-2 p-3">
            {columns.map((column, cellIndex) => (
              <div key={column} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-2 text-sm">
                <span className="text-[var(--muted)]">{column}</span>
                <span className="min-w-0 break-words">{row.cells[cellIndex]}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
      <div className="panel hidden overflow-x-auto lg:block">
      <table className="data-table">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={animate ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.24), ease }}
            >
              {row.cells.map((cell, cellIndex) => <td key={columns[cellIndex]}>{cell}</td>)}
            </motion.tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}

function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "ok" | "bad" | "warn" | "neutral" }) {
  const toneClass = tone === "ok" ? "pill-ok" : tone === "bad" ? "pill-bad" : tone === "warn" ? "pill-warn" : "";
  return <span className={`pill ${toneClass}`}>{children}</span>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`shrink-0 whitespace-nowrap border-b-2 pb-2 ${active ? "border-[var(--accent)] text-[var(--text)]" : "border-transparent text-[var(--muted)]"}`}>
      {children}
    </button>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="panel p-4 text-sm text-[var(--muted)]">{children}</p>;
}

function Fade({ children, index, animate }: { children: ReactNode; index: number; animate: boolean }) {
  return (
    <motion.div initial={animate ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.28), ease }}>
      {children}
    </motion.div>
  );
}
