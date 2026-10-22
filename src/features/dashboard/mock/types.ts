export type TaskState =
  | "Assigned"
  | "Accepted"
  | "Checked in"
  | "Prechecks"
  | "Configured"
  | "Evidence"
  | "Checked"
  | "Handed over"
  | "Closed";

export const TASK_STATES: TaskState[] = [
  "Assigned",
  "Accepted",
  "Checked in",
  "Prechecks",
  "Configured",
  "Evidence",
  "Checked",
  "Handed over",
  "Closed",
];

export type StageId = "intake" | "kickoff" | "planning" | "execution" | "closure";

export type ProjectStatus =
  | "Behind plan"
  | "On track"
  | "Active"
  | "Waiting on customer"
  | "Certified"
  | "Lost";

export type EntryPath = "post-audit" | "new infrastructure" | "restructuring";
export type OrderSource = "customer PO" | "proforma" | "direct order";
export type CustomerSize = "Small" | "Medium";
export type SyncState = "all-sent" | "uploading" | "offline" | "failed" | "na";
export type Band = "good" | "needs improvement" | "poor";
export type PreviewRole = "director" | "pm" | "verifier";
export type RangeKey = "7d" | "30d" | "90d";
export type MetricKey = "closed" | "checkins" | "handovers" | "evidence";
export type WorkflowId = "five-cores" | "eight-stages";

export type StaffMember = {
  name: string;
  email: string | null;
  company: string;
  initials: string;
  color: string;
  role: string;
};

export type Customer = {
  id: string;
  name: string;
  city: string;
  size: CustomerSize;
  contact: string;
};

export type ModuleProgress = {
  name: string;
  done: number;
  total: number;
  state: "done" | "progress" | "flag";
};

export type Project = {
  code: string;
  name: string;
  customerId: string;
  site: string;
  started: string;
  stage: StageId;
  status: ProjectStatus;
  progress: number;
  entry: EntryPath;
  order: OrderSource;
  states: Partial<Record<TaskState, number>>;
  closedThisWeek: number;
  activityScore: number;
  spark: number[];
  blocked: string | null;
  blockedDays: number | null;
  nextHandover: string | null;
  modules: ModuleProgress[];
};

export type Engineer = {
  name: string;
  open: number;
  late: number;
  currentTask: string | null;
  sync: SyncState;
  syncDetail: string;
  lastSync: string | null;
  waiting: number;
  uploading: number;
  failed: number;
  done: number;
  inField: boolean;
  uploadProgress: string | null;
};

export type ActivityType =
  | "check-in"
  | "evidence"
  | "handover"
  | "approved"
  | "sent-back"
  | "waiver"
  | "acknowledged"
  | "certificate"
  | "po"
  | "kickoff"
  | "lookup"
  | "red-flag";

export type ActivityEvent = {
  id: string;
  at: string;
  actor: string;
  verb: string;
  object: string;
  projectCode: string;
  type: ActivityType;
};

export type WaitingItem = {
  id: string;
  item: string;
  who: string;
  projectCode: string;
  waiting: string;
  kind: string;
};

export type NeedItem = {
  id: string;
  title: string;
  detail: string;
  tone: "certificate" | "offline" | "failed" | "handover";
  roles: PreviewRole[];
};

export type ReviewItem = {
  id: string;
  task: string;
  device: string;
  model: string;
  engineer: string;
  sentBack: number;
  handedOver: string;
  projectCode: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  projectCode: string;
  state: TaskState;
  engineer: string | null;
};

export type ThroughputPoint = {
  date: string;
  closed: number;
  checkins: number;
  handovers: number;
  evidence: number;
};

export type Vital = {
  id: string;
  label: string;
  value: string;
  numeric: number;
  unit: "percent" | "duration" | "seconds";
  band: Band;
  delta: string;
  goodHint: string;
};

export type Kpi = {
  id: string;
  label: string;
  value: number;
  of: number | null;
  delta: string;
  tone: "neutral" | "good" | "warn" | "bad";
  spark: number[];
  note: string | null;
};

export type LiveSplit = {
  inField: number;
  onSite: number;
  offline: number;
  idle: number;
  strip: number[];
};

export type Distribution = {
  assigned: number;
  inField: number;
  checked: number;
  closed: number;
};

export type Snapshot = {
  nowIso: string;
  kpis: Kpi[];
  distribution: Distribution;
  live: LiveSplit;
  projects: Project[];
  engineers: Engineer[];
  activity: ActivityEvent[];
  waiting: WaitingItem[];
  needs: NeedItem[];
  review: ReviewItem[];
  tasks: TaskRecord[];
  customers: Customer[];
  throughput: ThroughputPoint[];
  vitals: Vital[];
  phonesOfflineSince: string;
  failedUploads: number;
  certificatesToSign: number;
};

export type Filters = {
  tab: "projects" | "waiting" | "engineers" | "activity";
  range: RangeKey;
  stage: StageId | "all";
  customer: string;
  status: ProjectStatus | "all";
  site: string;
  sort: "behind" | "newest";
  workflow: WorkflowId;
  metric: MetricKey;
  activityType: ActivityType | "all";
  activityActor: string;
  activityProject: string;
  role: PreviewRole;
  mock: "ok" | "error";
  frozen: boolean;
};
