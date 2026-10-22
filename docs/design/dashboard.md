# Dashboard structure

The app is a Next.js preview. It does not call a network API. `MockDashboardSource` in `src/features/dashboard/mock/source.ts` implements `DashboardDataSource`:

- `overview`
- `throughput`
- `projects`
- `engineers`
- `waitingOn`
- `activity`
- `vitals`

Each method waits 420ms, inside the 300 to 600ms band, then returns the fixed snapshot for 22 Oct 2026, 14:06 IST. Components read a filtered view from `applyFilters`. A later API can replace `MockDashboardSource` and keep the same methods. Do not add the API client in this preview.

`?mock=error` makes the source reject. `?static=1` freezes the live simulation. `?workflow=eight-stages` changes stage labels. Filters, the active tab, and the preview role live in the URL.

## Staff

`scripts/build-staff.ts` reads `data/private/contacts.csv`, or `docs/contacts_2.csv` if the private file is missing. It writes `src/features/dashboard/mock/staff.generated.json`, which is gitignored. Company is always ITCraft. An email is kept only when the domain is `itcraft.net.in`. The app uses that file when it exists and `staff.sample.ts` otherwise, so a clone without the contacts file still builds. Sample people use the role names from the brief and do not include email addresses.

## Login

The sign-in page is local. The preview password is `preview-local`. The admin preview signs in as Aditya Kumar. A staff email from the generated file can sign in with the same preview password. Nothing is sent to a server.

## Swapping in a real source

Implement `DashboardDataSource` against the real API, pass it to `loadSnapshot`, and keep `applyFilters` on the client until the API accepts the same filters. Do not put prices, margins, or costs in the payload. The person who did a task must not be the person who verifies it. That rule is stated in the review copy, and this preview does not implement verification.
