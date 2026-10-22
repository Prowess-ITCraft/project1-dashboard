export type SectionKind = "table" | "help" | "settings";

export type SectionSpec = {
  slug: string;
  label: string;
  group: "Workspace" | "Commercial" | "People" | "Support";
  path: string | null;
  hint: string;
  empty: string;
  kind: SectionKind;
};

export const sections: SectionSpec[] = [
  {
    slug: "tasks",
    label: "My tasks",
    group: "Workspace",
    path: "/api/v1/field/my",
    hint: "When a project manager starts field work, your tasks appear here with their dates.",
    empty: "No tasks for you right now.",
    kind: "table",
  },
  {
    slug: "review",
    label: "Review",
    group: "Workspace",
    path: "/api/v1/field/review-queue",
    hint: "Work the customer has accepted and the configuration check passed. Approve it to close the task, or send it back with what must be fixed. Your own work never appears here.",
    empty: "Nothing waiting for review.",
    kind: "table",
  },
  {
    slug: "projects",
    label: "Projects",
    group: "Workspace",
    path: "/api/v1/projects",
    hint: "Every project, and the stage it is at.",
    empty: "No projects yet.",
    kind: "table",
  },
  {
    slug: "customers",
    label: "Customers",
    group: "Workspace",
    path: "/api/v1/customers",
    hint: "The companies we audit and work for, with their sites and contacts.",
    empty: "No customers yet.",
    kind: "table",
  },
  {
    slug: "catalogue",
    label: "Catalogue",
    group: "Commercial",
    path: "/api/v1/catalogue/items",
    hint: "Products and services that can go on a quotation, with their current prices.",
    empty: "No items match.",
    kind: "table",
  },
  {
    slug: "library",
    label: "Library",
    group: "Commercial",
    path: "/api/v1/library/files",
    hint: "Old BOQs and audit reports. Each file is read once, cleaned, labelled and kept as compact data for suggestions and, later, training.",
    empty: "The library is empty.",
    kind: "table",
  },
  {
    slug: "learning",
    label: "Learning",
    group: "People",
    path: "/api/v1/ml/report",
    hint: "Classical models that learn from what customers accepted and from the price book. They run in shadow mode next to the rules and are compared here; nothing they say changes a BOQ, a verdict or a certificate.",
    empty: "No models yet.",
    kind: "table",
  },
  {
    slug: "accounts",
    label: "Accounts",
    group: "People",
    path: "/api/v1/users",
    hint: "Who can sign in, and what each person can do.",
    empty: "No accounts yet.",
    kind: "table",
  },
  {
    slug: "messages",
    label: "Messages",
    group: "Support",
    path: "/api/v1/account/notifications?limit=100",
    hint: "What Project One told you, newest first.",
    empty: "No messages yet.",
    kind: "table",
  },
  {
    slug: "help",
    label: "Help",
    group: "Support",
    path: null,
    hint: "How to use Project One, from the audit report to the certificate.",
    empty: "",
    kind: "help",
  },
  {
    slug: "settings",
    label: "Settings",
    group: "Support",
    path: "/api/v1/gates",
    hint: "How Project One works for the whole company.",
    empty: "There are no settings for your role.",
    kind: "settings",
  },
];

export const helpSteps = [
  ["Audit intake", "Upload the audit report and check what was read from it."],
  ["Questionnaire", "Answer the questions the report cannot: budget, priorities, what the customer wants."],
  ["Infrastructure", "Confirm the current IT and agree the ideal IT for this customer."],
  ["Gaps", "The difference between current and ideal, as a list of gaps to close."],
  ["BOQ", "The products and services to close the gaps, with prices."],
  ["Plan", "Turn the accepted BOQ into tasks, dates and engineers."],
  ["Field work", "Engineers do each task on site. The technical lead verifies it."],
  ["Completion", "Lock the completion report. The Director signs the certificate."],
];

export const settingCards = [
  ["Company and quotation", "Letterhead, GSTIN, terms, quote numbers, price validity and the minimum margin."],
  ["Templates", "What each audit finding turns into on a BOQ, and the steps and evidence of each field task."],
  ["Stage approvals", "Who approves each stage, and which ones the customer acknowledges."],
  ["Certificate", "The completion certificate wording and the stamp."],
  ["Switches", "Turn parts of Project One on or off: customer codes, learning, customer sign-in."],
];
