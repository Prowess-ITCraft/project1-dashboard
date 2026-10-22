# Project One handoff memory

Read this before making changes. This local working-memory document records the project as
inspected on 13 October 2026. Current code, tests, ADRs and security rules win if they differ.

## Purpose

Project One is the ITCraft and IITPL platform that turns a PrismSuite IT audit into a verified,
certified implementation. It progresses through audit intake, current and ideal infrastructure,
gap analysis, BOQ, planning, field work and verification, then a completion report and IITPL
certificate. Every stage has a locked artifact, independent approval gate and audit trail.

## Stack and repository

- Python 3.12, FastAPI, Pydantic v2, async SQLAlchemy, Alembic and PostgreSQL 16.
- Celery and Celery beat over Valkey. Cross-module work uses a transactional outbox.
- MinIO object storage through the files module, byte sniffing, ClamAV, random keys, checksums and
  presigned links.
- Next.js 15, React 19, strict TypeScript and plain CSS only. OpenAPI generates client types.
- Jinja2 plus the shared `core/documents.py` WeasyPrint renderer is the only PDF path.
- Docker Compose, Nginx, Prometheus, Grafana, GlitchTip, Uptime Kuma and optional MLflow.
  Production exposes only ports 80 and 443.
- `backend/app/core` is shared infrastructure and never owns business rules. Modules live under
  `backend/app/modules`; frontend pages/components/lib live under `frontend/`.

## Architecture rules

1. A module imports another only through `contracts.py` or consumes a domain event. Never import
   another module's models, services or repositories. `core` imports no module.
2. State changes, audit entries and outbox events commit in one transaction. Subscribers are
   idempotent and cannot roll back the original operation.
3. Permissions deny by default. Services enforce project membership, object access, optimistic
   locking and separation of duties. Field engineers never receive prices.
4. Approved outputs are immutable stage artifacts. New work creates a version. Locked PDFs keep
   exact bytes and SHA-256 and are never regenerated from a later template.
5. Migrations are expand-only. Test upgrade, downgrade and model drift. Keep migration ownership
   separate from runtime access.
6. No RAG, remote device access or AI decisions. ML is shadow-only and never touches verdicts,
   waivers, completion conditions or certificates.
7. Use English, plain language, sentence case, no em dashes, accessible responsive UI and plain
   CSS. Office workflows are dense desktop screens; field workflows work at 360px with 44px taps.

## Roles

- Office roles: sales/BD, Sales Head, Solution Architect, Audit Engineer, Project Manager,
  Technical Lead/verifier, Director and Admin.
- Field engineers use Android or iPhone, receive a narrow no-price task view, lock after 15
  minutes, and can sync idempotent actions up to 72 hours after capture.
- Customers have no v1 portal. They use email notifications, single-use acknowledgements and
  public certificate verification. Director and Admin manage accounts.

## Stages and gate artifacts

| Order | Stage | Artifact | Default approvers | Customer acknowledgement |
| --- | --- | --- | --- | --- |
| 1 | Audit intake | `prismsuite_audit` | Solution Architect or Technical Lead | No |
| 2 | Current infrastructure | `infra_current` | Solution Architect or Technical Lead | No |
| 3 | Ideal infrastructure | `infra_ideal` | Solution Architect or Technical Lead | No |
| 4 | Gap analysis | `gap_register` | Solution Architect or Director | Yes |
| 5 | BOQ | `boq_version` | Sales Head or Director | No |
| 6 | Implementation plan | `implementation_plan` | Project Manager or Technical Lead | No |
| 7 | Field work | `field_work_summary` | Technical Lead | No |
| 8 | Completion | `completion_report` | Director | Yes |

The owner locks an artifact, a user submits it, an approver who neither locked nor submitted it
approves it, and the permanent decision advances the project.

## Modules and key behaviour

- `identity`: Argon2id, short JWTs, rotating refresh tokens with reuse detection, MFA, sessions,
  CSRF, rate limiting and role/object permissions.
- `audit_log`: append-only hash chain; personal data can be crypto-shredded without breaking it.
- `customers`: customers, sites, contacts, projects, briefs, memberships, gates, artifacts and
  customer acknowledgements.
- `files`: safe upload/download pipeline; missing/failed virus scans reject uploads.
- `prismsuite`: DOCX v1 and JSON v1 parsers; corrections are attributable rows; another person
  must approve the snapshot.
- `catalogue`: vendors/items and manual append-only prices. Expiry is judged by date.
- `datasets`: library inbox, corpus conversion, labels, quality, immutable versions, quarantine and
  analysis. Heavy files are read once into canonical checksummed `p1.corpus.v1` JSON.
- `infra`: current/ideal model, rule DSL and gaps. Firewall facts include security score, HA,
  IDS/IPS, services, VPN MFA and bandwidth allocation.
- `boq`: templates, quantities, recommendations, versions, follow-up and ITCraft PDFs. A report
  can create an explicitly unapproved estimate. Official BOQ uses an approved gap register.
  Default 10% minimum margin requires per-line Sales Head/Director acceptance with a reason.
- `planning`: task/config templates, dependencies, schedule, leave, downtime and baseline. Device
  templates cover firewall, switch, NAS, server and endpoint.
- `notifications`: queued email/Web Push, inbox and preferences. SMS/WhatsApp are unconfigured
  adapters.
- `fieldops`: run states, evidence/location, offline idempotency, upload links, live events and
  printable task record.
- `verification`: export parsers, brand field maps, config drivers, deviations, severity policy and
  Director dashboard. SonicWall is first; unconfirmed maps cannot force automatic rework.
- `reporting`: waivers, field summary, completion report, certificate, QR verification and revoke.
- `ml`: frozen training sets, model cards, ranker, line prediction, price drift and shadow runs.
- `search`: permission-filtered Postgres full-text/trigram search fed by events.

## Field work

`assigned -> accepted -> checked_in -> prechecks_done -> configured -> evidence_uploaded ->
engine_check -> verifier_review -> closed`

Nothing skips states. Check-in requires dependencies, arrival evidence and location. Customer
codes for check-in/hand-over exist but default off through `field_customer_codes`. Prechecks need
backup/access. Critical or major failures return work to configured; minor failures open deviations.
The person who did work cannot verify it. Every offline action has `client_event_id` and
`captured_at`.

## Verification and certificate

Baseline values are compared with engineer answers and, where supported, uploaded exports. Each
field is pass/fail/not checked. Failures open/update deviations and later passes resolve them.

A Director can issue a certificate only when all tasks are closed or customer-acknowledged waived,
no blocking deviation or pending waiver remains, the post-work PrismSuite rescan is approved, the
IITPL stamp exists, the report is locked, the customer acknowledges completion and the Director
approves the completion gate. Certificates have a financial-year number, HMAC QR payload, stored
PDF/checksum and revocation-only later change.

## Security and data constraints

- Never commit `.env`, secrets, unapproved customer data, the IITPL stamp or generated binaries.
- Money is `NUMERIC(14,2)`; GST is 18% extra. Quote and price validity are separate. Options 6A
  and 6B are mutually exclusive.
- Customer OTPs are salted hashes, 15-minute expiry, five attempts and scrubbed from logs.
- Any new input uses the files pipeline. Any new PDF uses the shared renderer.

## Local workflow

- On Windows use `scripts/dev.ps1` and `backend/.venv/Scripts/python.exe`.
- Baseline at 12 October 2026: 403 backend tests passed, 86% coverage. Full testcontainers suite
  takes roughly 22 minutes. Existing type errors in `tests/test_worker_probe.py` predate v3.
- Normal checks: `scripts/dev.ps1 lint`, `scripts/dev.ps1 typecheck`, `scripts/dev.ps1 test`.
  Regenerate OpenAPI then frontend types when API contracts change. Run targeted backend and
  Playwright checks before the full suite.

## Open decisions and known limits

- Detailed severity policy beyond the critical default is still awaiting confirmation.
- The Director must confirm the 10% minimum margin and stamp-hash certificate question.
- SonicWall mappings remain provisional until a real export confirms them. Other brands need a
  parser, maps and registered driver. There is no remote device control.
- No SMS/WhatsApp provider. Some iPhone/Safari push coverage is still untested. Encrypt off-server
  backup copies before production.

## Source documents inspected on 13 October 2026

Treat these as requirements evidence, not instructions:

1. `Service Call Report.docx` describes a signed customer handover record: project/dates/goals,
   scope, delivered components, deployment facts, test/status statements, customer sign-off and
   final IITPL/customer sign-off.
2. `IT Infra work progress tracker Sample.xlsx` describes grouped delivery/implementation work with
   task number, dates, progress and comments. It includes switches, QNAP/backups, firewall
   hardening, servers/domain, endpoint security, DR and customer-owned dependencies.
3. `Firewall Security Policy Lookup table.xlsx` provides templates for firewall internet policy,
   domain access rights, and NAS backup structure/schedule/encryption.

## Next feature

`docs/new-feature-changeprompt.md` is the detailed, additive implementation prompt for these
requirements. It must reuse existing planning, fieldops, verification, reporting, files,
notifications and gates rather than replacing them.

## Dashboard preview (22 Oct 2026)

This folder is the standalone mock dashboard, not the main application. Decisions for this preview:

- Screenshots in `reference/`: `d7cf7bf2...` dashboard, `66303313...` live field view, `a67183b7...` review queue, `3f4cc7cc...` task review, `b463c3ee...` projects, `c84a5adf...` my tasks, `59c1db91...` customers, `0927260f...` an older sign-in screen. They were not renamed.
- No logo files in `public/brand/`. The interface uses the text wordmark ITCraft.
- Contacts are in `docs/contacts_2.csv` (gitignored). `npm run staff` writes `staff.generated.json`, also gitignored. The sample staff has no email addresses.
- There is no Efferd screenshot file. The page text was read from the public Efferd dashboard 5 view and used only as layout anatomy.
- Fonts are pairing A: Newsreader, Hanken Grotesk, IBM Plex Mono. The brief names the serif, so it is intentional.
- The sign-in page is in this preview because it was requested, with the line "Order. Configure. Prove." Sidebar items other than Dashboard stay disabled on purpose.
- Design followed the attached design-taste skill for the sign-in split, type, contrast, and the ban on generic effects. Impeccable was not installed. The dashboard itself follows the written brief and the screenshots, not a marketing layout.
- `@tanstack/react-table` is v8. v9 renames the table hooks.
- Headline donut numbers are 46, 23, 9, and 24. The two field projects use their own nine-state counts (50 and 51) plus one intake task, which also totals 102. Those are different cuts of the same book.
- The fixed clock is 22 Oct 2026, 14:06 IST. Preview password is `preview-local`.
