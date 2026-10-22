# Master prompt: Project One dashboard (standalone Next.js mock-data app)

Paste this whole file into Cursor or Claude Code. The workspace is a **new, empty folder** for a standalone Next.js app. Nothing here depends on the main Project One codebase.

---

## 0. Context files you need in this folder

This project lives in its own folder, so the agent cannot see the main repo. Put these files in place **before** you run the prompt. Everything else the agent needs is written into this file (glossary in section 4, tokens in section 5, data in section 7).

```
project-one-dashboard/
  docs/design-prompt.md
    reference/                screenshots (table below)
  data/private/contacts.csv          the team contacts file (kept out of git)
  public/brand/                      ITCraft logo files (mark and wordmark) instead use itcraft.net.in for images of logo 
```

| File | Where it goes | Required | Why |
| --- | --- | --- | --- |
| This prompt | `docs/DASHBOARD_PROMPT.md` | Yes | The agent re-reads it at the start of every session |
| Dashboard screenshot (`d7cf7bf2...png`) | `docs/design/reference/dashboard.png` | Yes | Main layout and visual target |
| Live field view (`66303313...png`) | `docs/design/reference/live-field-view.png` | Yes | Engineers tab |
| Review queue (`a67183b7...png`) | `docs/design/reference/review-queue.png` | Yes | Review counts and table style |
| Task review (`3f4cc7cc...png`) | `docs/design/reference/task-review.png` | Yes | Stepper, evidence cards, status pills |
| Projects list (`b463c3ee...png`) | `docs/design/reference/projects.png` | Yes | Stage chips, progress bars |
| My tasks (`c84a5adf...png`) | `docs/design/reference/my-tasks.png` | Yes | Task row style |
| Customers (`59c1db91...png`) | `docs/design/reference/customers.png` | Yes | Card style |
| Efferd Dashboard 5 screenshot | `docs/design/reference/efferd-dashboard-5.png` | Strongly recommended | The agent could not load that page, so a screenshot is the only way to match its layout exactly |
| Team contacts CSV | `data/private/contacts.csv` | Yes | Source of the staff names in the mock data |
| ITCraft logo (SVG or PNG, light and dark) and a favicon | `public/brand/` | Yes | Used in the sidebar and top bar |
| Login screenshot | not needed | No | The login page is out of scope, and the screenshot carries old wording |

**Folder layout is flexible.** The screenshots may sit in `docs/design/reference/`, `docs/reference/` or any folder under `docs/`, and their filenames may be the original ones. The agent searches `docs/` recursively, identifies each image by what it shows, and records the mapping (original filename to screen name) in `docs/MEMORY.md`. It does not rename or move your files.

Do **not** copy the main project's context file, build prompt, logic maps or flowcharts into this folder. They carry backend rules and wording this app does not need.

Impeccable (section 5.4) writes `PRODUCT.md` and `DESIGN.md` in the project root. Leave them there. They are separate from the `docs/` folder.

`docs/MEMORY.md` (decisions, assumptions, baseline results) and `docs/TASKS.md` (what is done and what is next) may already exist, empty or not. The agent keeps whatever is in them, creates either one only if it is missing, reads both at the start of every session, and updates both at the end.

## 1. Goal

Build a polished, fully working **dashboard for Project One that runs entirely on mock data**, so the team can click through the finished experience before any real API exists.

The layout takes its anatomy from the Efferd "Dashboard 5" block (https://efferd.com/view/dashboard-5), described as a web analytics dashboard with a visitors chart, live users, top pages, traffic sources and Core Web Vitals. The look and feel match the Project One screenshots: dark, calm, serif display headings, quiet cards, restrained colour.

Efferd is a **layout reference only**. Do not copy its code unless I confirm I hold a licence and paste it to you. If `efferd-dashboard-5.png` is present, match its layout and use section 3 only for the data mapping.

## 2. Rules

1. Run `git init` and work on a branch named `feat/dashboard`. Commit in small steps with clear messages.
2. Brand text is limited to **ITCraft** and **Project One**. No other company or certification names appear in code, data, tests, docs, commit messages or UI copy. The certificate is called the "completion certificate".
3. No network calls from the app at runtime. Mock data only. No price, margin or cost field anywhere in the data or UI.
4. Free and open-source dependencies only. Record each one in `docs/LICENSES.md` with its licence.
5. No placeholder code and no TODO comments. Everything shipped works.
6. No em dashes anywhere: code, copy, tests, docs, commit messages. Sentence case for all UI text.
7. The contacts CSV is personal data. It must never be committed (section 7.1), and emails are shown only where section 7.1 allows.
8. Before building, run the checks in section 13 step 1. Stop and tell me if a required file is missing. If only the logo is missing, use a plain text wordmark "ITCraft" and tell me. Do not draw or imitate a logo.
9. **Icons are Phosphor only** (section 5.3). No other icon library, and no emoji as icons.
10. **Use Impeccable for design quality** (section 5.4), and choose distinctive fonts, not the usual AI defaults (section 5.2).

## 3. Reference anatomy and data mapping

| Analytics block | Project One equivalent |
| --- | --- |
| Visitors chart with metric switcher and period comparison | **Throughput chart**: tasks closed, check-ins, handovers, evidence uploads, previous period dashed |
| Live users | **Live now**: engineers in the field, pulsing dot, last 30 minutes of activity |
| Top pages | **Top projects** ranked by activity this week |
| Traffic sources | **Where projects come from**: entry paths and order sources |
| Core Web Vitals (good, needs improvement, poor) | **Delivery vitals** with the same banding |

## 4. Domain glossary (so you need no other docs)

Project One is an internal platform that turns a customer's purchase order into a verified delivery.

- **Five cores (stages):** Intake, Kick-off, Planning, Execution, Closure. Intake captures the order and products. Kick-off captures the purpose of each product and a short questionnaire. Planning maps products to modules, fills customer lookup tables and builds checklists. Execution is field work. Closure produces the completion report, customer sign-off and payment request.
- **Modules:** Firewall, Server, EPS (endpoint protection), NAS, Domain controller. Each has titled stages with checkboxes that must be ticked in order. Ticking out of order raises a red flag and sends the engineer back to the missing step. A finished module turns green.
- **Task states:** Assigned, Accepted, Checked in, Prechecks, Configured, Evidence, Checked, Handed over, Closed.
- **Roles:** Admin, Director, Project manager, Technical lead (verifier), Sales and BD, Solution architect, Audit engineer, Field engineer. The person who did a task can never verify it. Field engineers work on phones and never see prices.
- **Entry paths:** post-audit, new infrastructure, restructuring. **Order sources:** customer PO, proforma, direct order.
- **Deviation:** a recorded difference from the standard. **Waiver:** a deviation the customer acknowledged. **Completion certificate:** issued only when every mandatory item is verified.

## 5. Stack and project setup

Create the project with the current stable Next.js release (15 or newer):

- Next.js App Router, TypeScript strict, `src/` directory, import alias `@/*`, ESLint, Tailwind CSS.
- shadcn/ui (dark theme default) with its Recharts-based chart component, `@phosphor-icons/react` (section 5.3), `cmdk` through the shadcn `Command`, `next-themes`, TanStack Table, `date-fns` with `date-fns-tz`.
- Fonts: distinctive free families, chosen through the process in section 5.2.
- Testing: Vitest and React Testing Library, Playwright, `@axe-core/playwright`.
- Node 20 or newer, `.nvmrc`, and scripts `dev`, `build`, `lint`, `typecheck`, `test`, `e2e`. The dev server runs on port **9610**.
- State: React state plus URL search params. No global store library.

### 5.1 Design tokens (sampled from the screenshots; starting values)

| Token | Value |
| --- | --- |
| Page background | `#0a0a0a` |
| Surface (sidebar, cards, top bar) | `#111111` |
| Border | `#1f1f1f` |
| Input border | `#404040` |
| Text | `#ededed` |
| Muted text | `#a1a1a1` |
| Active nav item | background `#14233a`, text blue |
| Blue | `#6aa0dc` |
| Green | `#45b151` (badge background `#0f2414`, sync pill background `#205328`) |
| Amber | `#bf8f38` |
| Red | `#d05a5a` (banner background `#2c1212`) |
| Hero wash | indigo `#1f1d2f` top-left, warm `#1e1916` top-right, teal `#13201f` bottom-right, all as soft radial gradients fading to the page background |

Define these as CSS variables and wire them into the Tailwind theme and shadcn tokens. Provide a light theme with AA contrast. Cards use a 12 to 14 px radius, a 1px border, and generous padding. Big numbers use the display face with `tabular-nums`. Codes, IDs and times use the mono face. Status colours always come with text or an icon. Impeccable may suggest tinting the neutrals slightly or refining the hero wash. Accept changes that keep the overall look of the screenshots.

### 5.2 Typography (not the usual AI picks)

The look is calm and precise with an editorial touch: a display face for page titles and big numbers, a text sans for the interface, and a mono for codes and times. Three families at most.

- **Do not use the common defaults:** Inter, Roboto, Arial, system-ui as the main face, Geist, Space Grotesk, DM Sans, Poppins, Plus Jakarta Sans, Instrument Serif, Playfair Display, Fraunces, JetBrains Mono. If Impeccable's guidance or the specimen test gives a strong reason to use one, record it as a decision in `docs/MEMORY.md`.
- **Requirements:** free (Google Fonts through `next/font/google`, Fontsource, or Fontshare files self-hosted with the licence recorded in `docs/LICENSES.md`), Latin subset, lining tabular figures that work with `font-variant-numeric: tabular-nums`, no more than four weights per family, `display: swap`, and no layout shift.
- **Shortlist to evaluate (pick one pairing):**
  - **A:** Newsreader (display, use its optical size axis at large sizes), Hanken Grotesk (interface), IBM Plex Mono (codes).
  - **B:** Young Serif (display), Schibsted Grotesk (interface), Martian Mono (codes).
  - **C:** Gloock (display), Albert Sans (interface), Fragment Mono (codes).
- **Process:** use Impeccable's typography guidance (`/impeccable typeset` or the typography reference). Build a dev-only `/typography` specimen route, excluded from production builds, that renders each pairing with a page title, KPI numbers (102, 91%, 2h 40m, 24 of 102), table rows, mono codes like `P1-2627-0002`, and 12 px labels, in dark and light. Show me the specimen. Use pairing A until I choose, then record the choice and reasons in `docs/design/typography.md` and `docs/MEMORY.md`.
- Define a type scale as CSS variables with line height and letter spacing tuned per size. Use sentence case, and no tracked all-caps except for tiny section labels.

### 5.3 Icons: Phosphor

- Use `@phosphor-icons/react` (MIT) as the **only** icon library. Remove `lucide-react`, including from shadcn-generated components. If the shadcn `components.json` offers a Phosphor icon library option, use it. Otherwise swap the imports by hand.
- Set defaults once with `IconContext.Provider`: size 18, weight `regular`. Use `fill` only for the active or selected state. Never use `duotone`. Decorative icons are `aria-hidden`, and icon-only buttons always have an accessible label.
- Use tinted icon tiles only in the KPI strip. Everywhere else, use plain inline icons.
- Suggested mapping (verify each name exists in the installed version, use the nearest match otherwise, and note substitutions in `docs/MEMORY.md`):

| Use | Phosphor icon |
| --- | --- |
| Dashboard, My tasks, Review | `SquaresFour`, `ClipboardText`, `SealCheck` |
| Projects, Customers, Catalogue, Library | `FolderSimple`, `Buildings`, `Package`, `Books` |
| Learning, Accounts, Messages, Help, Settings | `GraduationCap`, `UsersThree`, `ChatCircleDots`, `Question`, `GearSix` |
| Search, Bell, Theme, New, Export | `MagnifyingGlass`, `Bell`, `Sun` and `Moon`, `Plus`, `DownloadSimple` |
| Synced, Offline, Failed upload, Blocked | `CloudCheck`, `WifiSlash`, `CloudSlash`, `WarningOctagon` |
| Live, Handover, Send back, Certificate | `Pulse`, `PaperPlaneTilt`, `ArrowUUpLeft`, `Certificate` |
| Calendar, Camera, File, QR code, Phone | `CalendarBlank`, `Camera`, `FileText`, `QrCode`, `DeviceMobile` |
| Check, Menu, Chevron, Sort | `Check`, `DotsThree`, `CaretRight`, `CaretUpDown` |

### 5.4 Design quality with Impeccable

Impeccable (https://github.com/pbakaus/impeccable) is a design skill for AI coding tools that pushes away from generic AI-generated interfaces. Its commands run through `/impeccable`. Use it throughout this build.

1. **Install** from the project root with `npx impeccable install` and choose Cursor (or pass `--providers=cursor`). Cursor needs Agent Skills enabled. Follow the Impeccable README if the skill does not appear. Command names change between versions, so check the README or run `/impeccable` to list what is available.
2. **Set up context** with `/impeccable init` (older versions call it `/impeccable teach`). It writes `PRODUCT.md` and `DESIGN.md` in the project root. Answer its questions like this: an internal operations dashboard for an IT services company; users are directors, project managers and verifiers; the feel is calm, precise, trustworthy and information-dense but readable; the visual references are the screenshots in `docs/`. If it needs a decision from me, ask me.
3. **Before building:** run `/impeccable shape` for the dashboard layout and `/impeccable typeset` for the fonts (section 5.2).
4. **While building:** run `/impeccable critique` after each major section and fix what it raises.
5. **Before finishing:** run `/impeccable audit` and `/impeccable polish`, and `/impeccable harden` and `/impeccable adapt` if they exist in the installed version. Also run Impeccable's standalone detector CLI as the README describes. Fix every finding or record why you did not.
6. **Priority:** Impeccable's guidance wins on typography, colour use, spacing, motion and copy. This prompt's hard requirements win on data, layout, accessibility, brand text and the no-price rule.
7. **Avoid the usual AI tells:** gradient text, glowing neon borders, glassmorphism, emoji as icons, every card the same size with a coloured icon tile, everything centred, oversized pill radii, decorative sparklines that mean nothing, and vague placeholder-sounding copy.

## 6. Structure

```
src/app/(app)/layout.tsx            app shell
src/app/(app)/dashboard/page.tsx    the dashboard
src/features/dashboard/
  mock/        types.ts, seed.ts, fixtures.ts, staff.ts, simulate.ts, source.ts
  components/  one file per card or panel (section 8)
  hooks/       useDashboardData.ts, useFilters.ts, useLiveSimulation.ts
  config/      workflows.ts, people-states.ts
scripts/build-staff.ts              reads the contacts CSV (section 7.1)
```

### 6.1 App shell (build it here)

- Left sidebar with the Project One mark and "ITCraft · Internal". Groups: Workspace (My tasks 3, Dashboard, Review 3, Projects, Customers), Commercial (Catalogue, Library), People (Learning, Accounts), Support (Messages 2, Help, Settings). Collapsible to an icon rail. A user card at the bottom: **Aditya Kumar, Admin · 3 roles** with initials and a sign-out icon.
- Only **Dashboard** is active. Every other item renders disabled with the tooltip "Not part of this preview". This is intentional and is not a placeholder.
- Top bar: logo mark, breadcrumb `ITCraft / Project One [Production] / Dashboard`, a search field with a ⌘K hint, a green "All sent" sync pill, a bell, a theme toggle, and a white "New project" button. The button opens a small dialog that explains this is a preview and creates nothing.

### 6.2 Data source contract

Define a `DashboardDataSource` interface in `mock/source.ts` with typed async methods (overview, throughput, projects, engineers, waitingOn, activity, vitals). Ship **one implementation, the mock**, with 300 to 600 ms simulated latency. Components depend only on the interface, so a real API source can replace it later. Do not write the API source now.

### 6.3 Workflow presets

`config/workflows.ts` exports two presets. Default is `five-cores`. `?workflow=eight-stages` switches.

| Preset | Stages |
| --- | --- |
| `five-cores` | Intake, Kick-off, Planning, Execution, Closure |
| `eight-stages` | Audit intake, Current IT, Ideal IT, Gap analysis, Quotation, Plan, Field work, Certified |

Every stage label, "stage N of M" string and stage colour comes from the active preset. Task states are the same in both.

## 7. Mock data

All data is deterministic: a seeded generator and a fixed "now" of **22 Oct 2026, 14:06 IST**. No `Math.random` or `Date.now()` in fixtures. The counts below must match exactly.

### 7.1 Staff from the contacts file

`scripts/build-staff.ts` reads `data/private/contacts.csv` (columns `name,email,company`) and writes `src/features/dashboard/mock/staff.generated.ts`. Rules:

- Display every person's company as **ITCraft**, whatever the CSV says.
- Keep an email only when its domain is `itcraft.net.in`. Omit every other address. Emails appear only in a person's hover card, never in tables, feeds or exports.
- Derive initials and a stable avatar colour from the name. Use the names exactly as spelled in the CSV.
- Add `data/private/` and `staff.generated.ts` to `.gitignore`.
- Commit a fallback `staff.sample.ts` with fictional people and the same shape. The app uses the generated file when it exists and the sample otherwise, so a fresh clone still builds and runs. Add a unit test that both files satisfy the same type.

**Demo role assignment** (invented for the mock only, easy to change in `config/people-states.ts`). The signed-in user is Aditya Kumar (Admin), who is not in the CSV.

| Person | Mock role |
| --- | --- |
| Sattish Agadii | Director |
| Aditya Kumar | Admin |
| Charmi Shah | Project manager |
| Sheshadri Chintakindi | Technical lead (verifier) |
| Akash Agadii | Sales and BD |
| Ashwini Sawant | Solution architect |
| Shruti Satam | Audit engineer |
| Yash Raikar | Field engineer |
| Sakshi Rajbhar | Field engineer |
| Bhakti Pawar | Field engineer |
| Ajit Dubey | Field engineer |
| Neeta Darge | Field engineer (not in the field today) |

Which engineer is offline, late, failed or idle is controlled from `config/people-states.ts` alone, so I can reassign those states in one place.

### 7.2 Customers (fictional)

Shakti Equipments Pvt Ltd (CUS-00001, Thane, Small), Nirmal Pharma Pvt Ltd (CUS-00002, Pune, Medium), Vardhan Logistics (CUS-00003, Navi Mumbai, Small). Customer contacts are fictional. Never use staff names for customer contacts.

### 7.3 Projects (18)

Codes `P1-2627-0001` onward, spread across the three customers. Include:

- `P1-2627-0002` Plant network refresh, Shakti, Thane, started 02 Oct, Execution, **Behind plan**, 56%.
- `P1-2627-0003` Warehouse network refresh, Shakti, Bhiwandi, started 08 Oct, Execution, **On track**, 72%.
- `P1-2627-0011` IT audit 2026, Shakti, started 20 Oct, first stage, **Active**, 8%.
- One certified project, one lost project, and the rest spread across stages with statuses on track, behind plan, active, or waiting on customer.
- Exactly **2 behind plan** and **2 in Execution** overall.

### 7.4 Tasks, KPIs and states

- **102 tasks:** Assigned 46, In field 23, Checked 9, Closed 24.
- Plant network refresh, 50 tasks: Assigned 20, Accepted 4, Checked in 6, Prechecks 3, Configured 4, Evidence 0, Checked 1, Handed over 2, Closed 10.
- Warehouse network refresh, 51 tasks: Assigned 26, Accepted 6, Checked in 1, Prechecks 0, Configured 0, Evidence 0, Checked 3, Handed over 1, Closed 14.
- **Blocked:** T05 Replace core switch uplinks, waiting on customer change window, 2 days, on Plant network refresh. The Warehouse project has none, and its next handover is T08 tomorrow at 11:00.
- **KPIs:** open critical deviations 0 (no change); tasks blocked 1 (+1 vs last week); projects behind plan 2 of 18 (+1 vs last week); check-ins today 0 (none yet, 14:06); tasks closed 24 of 102 (+6 this week). Each has a 14 to 30 point sparkline.

### 7.5 Engineers

| Engineer | Open | Late | Current task | Sync state | Waiting / Uploading / Failed / Done |
| --- | --- | --- | --- | --- | --- |
| Yash Raikar | 9 | 2 | T02 Configure the managed switch | All sent | 0 / 0 / 0 / 14 |
| Sakshi Rajbhar | 7 | 1 | T04 Set up access points | Uploading 2 of 3 | 3 / 2 / 0 / 9 |
| Bhakti Pawar | 11 | 4 | T09 Cable survey, plant 2 | Offline, last sync 14:02 | 5 / 0 / 0 / 11 |
| Ajit Dubey | 5 | 0 | T11 Firewall handover | 1 failed | 1 / 0 / 1 / 7 |
| Neeta Darge | 3 | 0 | none (not in the field) | n/a | n/a |

### 7.6 Needs you, review, waiting on

- **Needs you (director view):** Sign completion certificate for Plant network refresh (all 28 tasks closed, 13:55); Bhakti offline for 4 minutes (5 items queued); Ajit has a failed evidence upload (retrying 14:05); Yash handed over T02 for review (13:42).
- **Live field KPIs:** 4 engineers in the field, 1 phone offline since 14:02, 1 failed upload retrying, 2 certificates to sign.
- **Review queue (3):** T02 Core switch SW-01 (Aruba 2930F, Yash, 0 sent back, today 13:42); T04 AP-03 and AP-04 (Ubiquiti U6 Pro, Sakshi, sent back once, today 11:15); T07 Firewall FW-01 (Fortinet 60F, Yash, yesterday 17:05).
- **Waiting on (4):** a customer acknowledgement of a gap register, a customer change window for T05, a Director waiver approval, and a PO confirmation (proforma sent, no PO yet).

### 7.7 Sources and vitals

- **Entry paths:** post-audit 9, new infrastructure 5, restructuring 4. **Order source:** customer PO 11, proforma 4, direct order 3.
- **Delivery vitals** (bands in brackets):
  - First-time-right 91% (good at 90% or more, needs improvement 75 to 89, poor below 75).
  - Verifier turnaround, median 2h 40m (good up to 4h, needs improvement up to 12h, poor above).
  - On-time starts 83% (good at 85% or more, needs improvement 70 to 84, poor below 70).
  - Sync lag, median 38 s (good up to 60 s, needs improvement up to 5 min, poor above).

  Each shows the value, the band label, a small three-band gauge, and the change against the previous period.

### 7.8 Series, feed and modules

- **Throughput:** 90 days of daily values for tasks closed, check-ins, handovers and evidence uploads, with a weekly rhythm (quiet weekends). The 30-day tooltip at 16 Oct 2026 reads "Checked in 3, Closed 4".
- **Activity feed, 40 events**, newest first, each with actor, verb, object, time and a type icon. Cover: check-in with customer OTP, evidence uploaded, handover, verifier approved, sent back with a note, waiver requested, customer acknowledged, certificate signed, PO captured, kick-off questionnaire completed, lookup table confirmed, and **red flag events**, for example "Bhakti tried to tick Install EPS agent before Remove conflicting antivirus. Sent back to the missing step."
- **Module progress** (project cards in the `five-cores` preset): Firewall, Server, EPS, NAS, Domain controller, each with stages done of total and a state of green, in progress, or red flag.

## 8. Page anatomy

Build top to bottom in this order. Every card has a loading skeleton, an empty state and an error state.

1. **Hero and tabs.** Display-face title "Dashboard", a green "Field work active" badge, and the subtitle "18 projects across 3 customers. Updated 14:06 IST." Tabs: **Projects 18**, **Waiting on 4**, **Engineers 4**, **Activity**. The active tab lives in the URL.
2. **Filter bar (Projects tab).** Pills for date range (Last 30 days), Stage, Customer, Status, and a dashed "Add filter". An Export button downloads the current view as CSV, generated client-side. Filters change every card and live in the URL.
3. **KPI strip.** Five metrics in one bordered container with dividers: icon tile, label, big number, optional "of N", delta chip, sparkline. Hover shows the exact value.
4. **Throughput and live row.**
   - *Throughput card (wide):* big total for the selected metric, delta against the previous period, metric tabs (Tasks closed, Check-ins, Handovers, Evidence uploads), period toggle 7d, 30d, 90d, an area chart with a dashed previous-period line, a crosshair tooltip, and a legend.
   - *Live now card:* pulsing dot, number of engineers in the field, a split (on site, offline, idle), a 30-minute activity strip, and a link to the Engineers tab.
5. **Distribution row.**
   - *Stage distribution:* donut with 102 at the centre and a legend (Assigned, In field, Checked, Closed).
   - *Engineer workload:* horizontal bars with the open count and a red "late" segment, for example "11 · 4 late". "View all" opens the Engineers tab.
   - *Where projects come from:* a donut or ranked bars for entry paths, with a switch for order source, showing counts and percentages.
6. **Top projects and vitals row.**
   - *Top projects:* ranked table with rank, project and code, customer, closed this week, open tasks, status pill and a trend sparkline.
   - *Delivery vitals:* four cards using the banding in 7.7.
7. **Projects in field work.** Heading with a count and a sort toggle ("Behind plan first", "Newest"). Each card shows: name, code · customer · site, a status pill, an overflow menu, "10 of 50 closed", the stage line from the active preset, and a **nine-segment bar** of the task states with counts under each label. Under it, either the red banner "T05 Replace core switch uplinks is blocked: waiting on customer change window" with "2 days", or the green line "No blocked tasks. Next handover T08 tomorrow, 11:00". In the `five-cores` preset, add module progress chips.
8. **Recent activity** (latest eight events, "Open audit log" link) and **Engineer queues** (a "Live" badge and offline items waiting on each phone).

**Waiting on tab:** a list of what waits on someone else: item, who it waits on, project, how long, and an action (Send reminder, Open) with a count per type at the top. The actions only show a confirmation toast.

**Engineers tab (live field view):**
- Title "Live field view", subtitle "Where every engineer is, what is queued on each phone, and what needs you.", and a green "Live · 14:06 IST" pill.
- Four KPIs: Engineers in the field, Phones offline (since time), Failed uploads (retrying), Certificates to sign.
- A grid of engineer cards: avatar with initials and presence dot, name, current task, a sync chip (All sent, Uploading 2 of 3, Offline with last sync, 1 failed), and four counters (Waiting, Uploading, Failed, Done).
- A **Needs you** panel with an icon, a bold line and a mono detail line for each item in 7.6.

**Activity tab:** the full feed with filters (type, actor, project), grouped by day, with infinite scroll over the 40 events.

## 9. Live simulation

`useLiveSimulation` advances the mock state every 4 to 6 seconds, using the seeded generator:

- engineer sync states change (offline to uploading to all sent; a failed upload retries and recovers);
- counters on engineer cards tick;
- a new activity event slides in at the top;
- the Live now count, queue totals and the relevant sparklines update;
- the "Live" pill shows the simulated clock.

Add a "Pause live updates" control. `?static=1` freezes everything for stable screenshots and tests. Under reduced motion, skip the slide-ins and only update values.

## 10. Interactions

- ⌘K opens a command palette that searches mock customers, projects, tasks and staff, and jumps to the right tab or filter.
- Hover cards on avatars (name, mock role, company ITCraft, work email when allowed) and on project names.
- Keyboard: every control is reachable, tabs use arrow keys, and every chart has a "View as table" toggle.
- Dark and light themes both work. Dark is the primary design.
- A dev-only role switcher (Director, Project manager, Verifier) changes which "Needs you" items show.
- Motion is subtle: number count-up on first load, a pulsing live dot, chart draw-in. All of it stops under `prefers-reduced-motion`.

## 11. States, responsive and accessibility

- Skeletons shaped like each card, empty states with one plain sentence and one action, and an error state with retry (`?mock=error` forces it).
- Responsive at 1440, 1024 and 390. Below 1024 the sidebar becomes an icon rail, below 768 a menu sheet. KPI cards become a 2-column grid, tables become stacked cards, and there is no horizontal page scroll at any width.
- WCAG AA contrast, visible focus rings, labels on every chart and icon button, `aria-live="polite"` on the live feed, and no information carried by colour alone.
- Indian digit grouping above 999, times in IST, dates like "22 Oct 2026".

## 12. Tests and acceptance

**Tests**
- Vitest: fixture invariants (tasks sum to 102, per-project states sum to their totals, behind-plan count is 2), vitals banding, delta maths, range recompute, simulation determinism for a given seed, CSV export, and the staff builder rules from 7.1 (company normalised, emails filtered, sample and generated files share a type).
- Component tests: KPI strip, stage bar, engineer card sync states, vitals banding.
- Playwright: every tab renders with no console errors or failed requests, filters change the numbers, the range toggle updates the chart, the palette opens, `?static=1` is stable, screenshots at 1440 and 390 widths. Add an axe check with no serious or critical violations.
- A test that scans the source tree, data files and built output for any brand text other than ITCraft and Project One.
- A test that fails if `lucide-react` or any icon package other than Phosphor appears in `package.json` or in imports.
- A test that fails if the font stack contains any family from the banned list in section 5.2 (unless a recorded decision allows it).

**Acceptance**
1. The dashboard matches the screenshot language and section 8 layout, with every number in section 7 reproduced exactly.
2. All four tabs work on mock data, with filters, range toggles, export, palette and live simulation.
3. `npm run build`, `lint`, `typecheck`, `test` and `e2e` all pass from a fresh clone **without** the contacts file (sample fallback) and with it.
4. No runtime network requests and no price field anywhere.
5. Reduced motion, keyboard use, both themes and the 390 px layout all work.
6. Impeccable is installed and configured, its `critique`, `audit` and `polish` passes have been run, and every finding is fixed or explained in `docs/MEMORY.md`.
7. Icons are Phosphor only, and the fonts follow section 5.2 with the chosen pairing recorded.
8. `docs/design/dashboard.md` explains the structure, the data source contract, the staff builder, and how to swap in a real API source later.

## 13. Start now

1. **Check inputs.** Search `docs/` recursively for the screenshots and match each to a screen (section 0). List what is present, plus `data/private/contacts.csv`, `public/brand/` and `docs/DASHBOARD_PROMPT.md`. Stop and tell me about anything required that is missing.
2. Read `docs/MEMORY.md` and `docs/TASKS.md` (create them only if missing), record the screenshot mapping, initialise git, and scaffold the Next.js project (section 5) in the folder root without touching `docs/`.
3. **Install Impeccable and run its setup** (section 5.4). Build the dev-only `/typography` specimen (section 5.2) and show it to me. Continue with pairing A unless I choose another.
4. Send me a short plan: what you will build in what order, and anything in the screenshots you cannot match.
5. Build in this order: tokens and shell, types and fixtures, staff builder, data source and hooks, KPI strip, throughput and live row, distribution row, top projects and vitals, field work cards, tabs, simulation, palette, tests, docs. Run `/impeccable critique` after each major section.
6. Run the final Impeccable passes (section 5.4, step 5) and fix what they find.
7. Finish with a report: files added, test results, the chosen fonts and why, the icon substitutions, Impeccable findings fixed or deferred, anything you could not match, and screenshots at 1440 and 390 widths.