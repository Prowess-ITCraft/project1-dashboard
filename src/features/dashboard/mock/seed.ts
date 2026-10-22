import type {
  ActivityEvent,
  Customer,
  Engineer,
  Kpi,
  ModuleProgress,
  NeedItem,
  Project,
  ReviewItem,
  TaskRecord,
  TaskState,
  ThroughputPoint,
  Vital,
  WaitingItem,
} from "./types";
import { TASK_STATES } from "./types";

export const customers: Customer[] = [
  { id: "CUS-00001", name: "Shakti Equipments Pvt Ltd", city: "Thane", size: "Small", contact: "Meera Kulkarni" },
  { id: "CUS-00002", name: "Nirmal Pharma Pvt Ltd", city: "Pune", size: "Medium", contact: "Farhan Qureshi" },
  { id: "CUS-00003", name: "Vardhan Logistics", city: "Navi Mumbai", size: "Small", contact: "Leela Patil" },
];

const plantModules: ModuleProgress[] = [
  { name: "Firewall", done: 4, total: 6, state: "progress" },
  { name: "Server", done: 3, total: 5, state: "progress" },
  { name: "EPS", done: 2, total: 4, state: "flag" },
  { name: "NAS", done: 5, total: 5, state: "done" },
  { name: "Domain controller", done: 1, total: 4, state: "progress" },
];

const warehouseModules: ModuleProgress[] = [
  { name: "Firewall", done: 5, total: 6, state: "progress" },
  { name: "Server", done: 4, total: 5, state: "progress" },
  { name: "EPS", done: 4, total: 4, state: "done" },
  { name: "NAS", done: 3, total: 5, state: "progress" },
  { name: "Domain controller", done: 2, total: 4, state: "progress" },
];

function spark(seed: number, length = 16): number[] {
  const values: number[] = [];
  let current = 8 + (seed % 7);
  for (let index = 0; index < length; index += 1) {
    const step = ((seed * (index + 3)) % 5) - 2;
    current = Math.max(1, current + step);
    values.push(current);
  }
  return values;
}

type ProjectInput = Omit<Project, "spark" | "modules" | "blocked" | "blockedDays" | "nextHandover"> & {
  spark?: number[];
  modules?: ModuleProgress[];
  blocked?: string | null;
  blockedDays?: number | null;
  nextHandover?: string | null;
};

function project(input: ProjectInput): Project {
  return {
    ...input,
    spark: input.spark ?? spark(Number(input.code.slice(-4))),
    modules: input.modules ?? [],
    blocked: input.blocked ?? null,
    blockedDays: input.blockedDays ?? null,
    nextHandover: input.nextHandover ?? null,
  };
}

export const projects: Project[] = [
  project({
    code: "P1-2627-0001",
    name: "Head office firewall",
    customerId: "CUS-00002",
    site: "Pune",
    started: "2026-09-12",
    stage: "closure",
    status: "On track",
    progress: 88,
    entry: "new infrastructure",
    order: "customer PO",
    states: {},
    closedThisWeek: 0,
    activityScore: 12,
  }),
  project({
    code: "P1-2627-0002",
    name: "Plant network refresh",
    customerId: "CUS-00001",
    site: "Thane",
    started: "2026-10-02",
    stage: "execution",
    status: "Behind plan",
    progress: 56,
    entry: "post-audit",
    order: "customer PO",
    states: {
      Assigned: 20,
      Accepted: 4,
      "Checked in": 6,
      Prechecks: 3,
      Configured: 4,
      Evidence: 0,
      Checked: 1,
      "Handed over": 2,
      Closed: 10,
    },
    closedThisWeek: 4,
    activityScore: 40,
    modules: plantModules,
    blocked: "T05 Replace core switch uplinks is blocked: waiting on customer change window",
    blockedDays: 2,
  }),
  project({
    code: "P1-2627-0003",
    name: "Warehouse network refresh",
    customerId: "CUS-00001",
    site: "Bhiwandi",
    started: "2026-10-08",
    stage: "execution",
    status: "On track",
    progress: 72,
    entry: "post-audit",
    order: "customer PO",
    states: {
      Assigned: 26,
      Accepted: 6,
      "Checked in": 1,
      Prechecks: 0,
      Configured: 0,
      Evidence: 0,
      Checked: 3,
      "Handed over": 1,
      Closed: 14,
    },
    closedThisWeek: 2,
    activityScore: 36,
    modules: warehouseModules,
    nextHandover: "No blocked tasks. Next handover T08 tomorrow, 11:00",
  }),
  project({
    code: "P1-2627-0004",
    name: "Branch server build",
    customerId: "CUS-00003",
    site: "Navi Mumbai",
    started: "2026-09-18",
    stage: "planning",
    status: "Waiting on customer",
    progress: 41,
    entry: "new infrastructure",
    order: "proforma",
    states: {},
    closedThisWeek: 0,
    activityScore: 8,
  }),
  project({
    code: "P1-2627-0005",
    name: "Endpoint rollout",
    customerId: "CUS-00002",
    site: "Pune",
    started: "2026-09-01",
    stage: "closure",
    status: "Certified",
    progress: 100,
    entry: "post-audit",
    order: "customer PO",
    states: {},
    closedThisWeek: 0,
    activityScore: 6,
  }),
  project({
    code: "P1-2627-0006",
    name: "NAS backup design",
    customerId: "CUS-00001",
    site: "Thane",
    started: "2026-09-22",
    stage: "planning",
    status: "On track",
    progress: 48,
    entry: "post-audit",
    order: "customer PO",
    states: {},
    closedThisWeek: 0,
    activityScore: 9,
  }),
  project({
    code: "P1-2627-0007",
    name: "Domain cutover",
    customerId: "CUS-00003",
    site: "Navi Mumbai",
    started: "2026-10-05",
    stage: "kickoff",
    status: "Active",
    progress: 18,
    entry: "restructuring",
    order: "proforma",
    states: {},
    closedThisWeek: 0,
    activityScore: 7,
  }),
  project({
    code: "P1-2627-0008",
    name: "Retail firewall",
    customerId: "CUS-00002",
    site: "Pune",
    started: "2026-08-28",
    stage: "planning",
    status: "Lost",
    progress: 22,
    entry: "restructuring",
    order: "direct order",
    states: {},
    closedThisWeek: 0,
    activityScore: 2,
  }),
  project({
    code: "P1-2627-0009",
    name: "Plant Wi-Fi survey",
    customerId: "CUS-00001",
    site: "Thane",
    started: "2026-10-14",
    stage: "kickoff",
    status: "On track",
    progress: 24,
    entry: "new infrastructure",
    order: "customer PO",
    states: {},
    closedThisWeek: 0,
    activityScore: 10,
  }),
  project({
    code: "P1-2627-0010",
    name: "DC hardening",
    customerId: "CUS-00003",
    site: "Navi Mumbai",
    started: "2026-09-09",
    stage: "planning",
    status: "Behind plan",
    progress: 33,
    entry: "post-audit",
    order: "customer PO",
    states: {},
    closedThisWeek: 0,
    activityScore: 14,
  }),
  project({
    code: "P1-2627-0011",
    name: "IT audit 2026",
    customerId: "CUS-00001",
    site: "Thane",
    started: "2026-10-20",
    stage: "intake",
    status: "Active",
    progress: 8,
    entry: "post-audit",
    order: "customer PO",
    states: { Assigned: 1 },
    closedThisWeek: 0,
    activityScore: 18,
  }),
  project({
    code: "P1-2627-0012",
    name: "Warehouse cameras",
    customerId: "CUS-00001",
    site: "Bhiwandi",
    started: "2026-10-11",
    stage: "intake",
    status: "Active",
    progress: 12,
    entry: "new infrastructure",
    order: "proforma",
    states: {},
    closedThisWeek: 0,
    activityScore: 5,
  }),
  project({
    code: "P1-2627-0013",
    name: "Lab server",
    customerId: "CUS-00002",
    site: "Pune",
    started: "2026-10-03",
    stage: "kickoff",
    status: "Waiting on customer",
    progress: 20,
    entry: "restructuring",
    order: "direct order",
    states: {},
    closedThisWeek: 0,
    activityScore: 4,
  }),
  project({
    code: "P1-2627-0014",
    name: "Site link",
    customerId: "CUS-00003",
    site: "Navi Mumbai",
    started: "2026-09-16",
    stage: "planning",
    status: "On track",
    progress: 52,
    entry: "post-audit",
    order: "customer PO",
    states: {},
    closedThisWeek: 0,
    activityScore: 11,
  }),
  project({
    code: "P1-2627-0015",
    name: "Mail and files",
    customerId: "CUS-00002",
    site: "Pune",
    started: "2026-09-25",
    stage: "closure",
    status: "On track",
    progress: 91,
    entry: "post-audit",
    order: "customer PO",
    states: {},
    closedThisWeek: 0,
    activityScore: 9,
  }),
  project({
    code: "P1-2627-0016",
    name: "Guest network",
    customerId: "CUS-00001",
    site: "Thane",
    started: "2026-10-19",
    stage: "intake",
    status: "Active",
    progress: 6,
    entry: "restructuring",
    order: "proforma",
    states: {},
    closedThisWeek: 0,
    activityScore: 3,
  }),
  project({
    code: "P1-2627-0017",
    name: "Switch refresh",
    customerId: "CUS-00003",
    site: "Navi Mumbai",
    started: "2026-10-07",
    stage: "kickoff",
    status: "On track",
    progress: 27,
    entry: "new infrastructure",
    order: "customer PO",
    states: {},
    closedThisWeek: 0,
    activityScore: 8,
  }),
  project({
    code: "P1-2627-0018",
    name: "Backup rehearsal",
    customerId: "CUS-00002",
    site: "Pune",
    started: "2026-09-30",
    stage: "planning",
    status: "On track",
    progress: 44,
    entry: "post-audit",
    order: "direct order",
    states: {},
    closedThisWeek: 0,
    activityScore: 7,
  }),
];

export const distribution = { assigned: 46, inField: 23, checked: 9, closed: 24 };

export const kpis: Kpi[] = [
  {
    id: "deviations",
    label: "Open critical deviations",
    value: 0,
    of: null,
    delta: "No change",
    tone: "good",
    note: null,
    spark: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "blocked",
    label: "Tasks blocked",
    value: 1,
    of: null,
    delta: "+1 vs last week",
    tone: "bad",
    note: null,
    spark: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
  },
  {
    id: "behind",
    label: "Projects behind plan",
    value: 2,
    of: 18,
    delta: "+1 vs last week",
    tone: "warn",
    note: null,
    spark: [1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2],
  },
  {
    id: "checkins",
    label: "Check-ins today",
    value: 0,
    of: null,
    delta: "None yet, 14:06",
    tone: "neutral",
    note: "None yet, 14:06",
    spark: [2, 1, 0, 3, 2, 0, 0, 4, 1, 2, 0, 1, 3, 0, 0, 2, 1, 0],
  },
  {
    id: "closed",
    label: "Tasks closed",
    value: 24,
    of: 102,
    delta: "+6 this week",
    tone: "good",
    note: null,
    spark: [8, 9, 10, 11, 11, 12, 12, 14, 15, 16, 16, 18, 19, 20, 21, 22, 23, 24],
  },
];

export const engineers: Engineer[] = [
  {
    name: "Yash Raikar",
    open: 9,
    late: 2,
    currentTask: "T02 Configure the managed switch",
    sync: "all-sent",
    syncDetail: "All sent",
    lastSync: null,
    waiting: 0,
    uploading: 0,
    failed: 0,
    done: 14,
    inField: true,
    uploadProgress: null,
  },
  {
    name: "Sakshi Rajbhar",
    open: 7,
    late: 1,
    currentTask: "T04 Set up access points",
    sync: "uploading",
    syncDetail: "Uploading 2 of 3",
    lastSync: null,
    waiting: 3,
    uploading: 2,
    failed: 0,
    done: 9,
    inField: true,
    uploadProgress: "2 of 3",
  },
  {
    name: "Bhakti Pawar",
    open: 11,
    late: 4,
    currentTask: "T09 Cable survey, plant 2",
    sync: "offline",
    syncDetail: "Offline, last sync 14:02",
    lastSync: "14:02",
    waiting: 5,
    uploading: 0,
    failed: 0,
    done: 11,
    inField: true,
    uploadProgress: null,
  },
  {
    name: "Ajit Dubey",
    open: 5,
    late: 0,
    currentTask: "T11 Firewall handover",
    sync: "failed",
    syncDetail: "1 failed",
    lastSync: null,
    waiting: 1,
    uploading: 0,
    failed: 1,
    done: 7,
    inField: true,
    uploadProgress: null,
  },
  {
    name: "Neeta Darge",
    open: 3,
    late: 0,
    currentTask: null,
    sync: "na",
    syncDetail: "Not in the field",
    lastSync: null,
    waiting: 0,
    uploading: 0,
    failed: 0,
    done: 0,
    inField: false,
    uploadProgress: null,
  },
];

export const needs: NeedItem[] = [
  {
    id: "cert-plant",
    title: "Sign completion certificate for Plant network refresh",
    detail: "All 28 tasks closed, 13:55",
    tone: "certificate",
    roles: ["director"],
  },
  {
    id: "bhakti-offline",
    title: "Bhakti offline for 4 minutes",
    detail: "5 items queued",
    tone: "offline",
    roles: ["director", "pm"],
  },
  {
    id: "ajit-failed",
    title: "Ajit has a failed evidence upload",
    detail: "Retrying 14:05",
    tone: "failed",
    roles: ["director", "pm", "verifier"],
  },
  {
    id: "yash-handover",
    title: "Yash handed over T02 for review",
    detail: "13:42",
    tone: "handover",
    roles: ["director", "verifier"],
  },
];

export const waiting: WaitingItem[] = [
  {
    id: "gap",
    item: "Customer acknowledgement of a gap register",
    who: "Meera Kulkarni",
    projectCode: "P1-2627-0006",
    waiting: "3 days",
    kind: "Acknowledgement",
  },
  {
    id: "window",
    item: "Customer change window for T05",
    who: "Meera Kulkarni",
    projectCode: "P1-2627-0002",
    waiting: "2 days",
    kind: "Change window",
  },
  {
    id: "waiver",
    item: "Director waiver approval",
    who: "Sattish Agadii",
    projectCode: "P1-2627-0010",
    waiting: "1 day",
    kind: "Waiver",
  },
  {
    id: "po",
    item: "PO confirmation (proforma sent, no PO yet)",
    who: "Akash Agadii",
    projectCode: "P1-2627-0012",
    waiting: "6 days",
    kind: "Purchase order",
  },
];

export const review: ReviewItem[] = [
  {
    id: "T02",
    task: "T02 Core switch SW-01",
    device: "Core switch SW-01",
    model: "Aruba 2930F",
    engineer: "Yash Raikar",
    sentBack: 0,
    handedOver: "Today, 13:42",
    projectCode: "P1-2627-0002",
  },
  {
    id: "T04",
    task: "T04 AP-03 and AP-04",
    device: "AP-03 and AP-04",
    model: "Ubiquiti U6 Pro",
    engineer: "Sakshi Rajbhar",
    sentBack: 1,
    handedOver: "Today, 11:15",
    projectCode: "P1-2627-0003",
  },
  {
    id: "T07",
    task: "T07 Firewall FW-01",
    device: "Firewall FW-01",
    model: "Fortinet 60F",
    engineer: "Yash Raikar",
    sentBack: 0,
    handedOver: "Yesterday, 17:05",
    projectCode: "P1-2627-0002",
  },
];

const titledTasks: { id: string; title: string; projectCode: string; state: TaskState; engineer: string | null }[] = [
  { id: "T02", title: "Configure the managed switch", projectCode: "P1-2627-0002", state: "Handed over", engineer: "Yash Raikar" },
  { id: "T04", title: "Set up access points", projectCode: "P1-2627-0003", state: "Checked in", engineer: "Sakshi Rajbhar" },
  { id: "T05", title: "Replace core switch uplinks", projectCode: "P1-2627-0002", state: "Assigned", engineer: "Yash Raikar" },
  { id: "T07", title: "Firewall FW-01", projectCode: "P1-2627-0002", state: "Handed over", engineer: "Yash Raikar" },
  { id: "T08", title: "Warehouse handover", projectCode: "P1-2627-0003", state: "Accepted", engineer: "Sakshi Rajbhar" },
  { id: "T09", title: "Cable survey, plant 2", projectCode: "P1-2627-0002", state: "Prechecks", engineer: "Bhakti Pawar" },
  { id: "T11", title: "Firewall handover", projectCode: "P1-2627-0002", state: "Checked", engineer: "Ajit Dubey" },
];

function expandTasks(): TaskRecord[] {
  const records: TaskRecord[] = [];
  const used = new Set(titledTasks.map((task) => `${task.projectCode}:${task.state}:${task.id}`));
  for (const task of titledTasks) records.push(task);

  for (const item of projects) {
    for (const state of TASK_STATES) {
      const count = item.states[state] ?? 0;
      const already = records.filter((task) => task.projectCode === item.code && task.state === state).length;
      for (let index = already; index < count; index += 1) {
        const id = `${item.code.slice(-4)}-${state.slice(0, 3)}-${index + 1}`;
        if (used.has(id)) continue;
        records.push({
          id,
          title: `${state} task ${index + 1}`,
          projectCode: item.code,
          state,
          engineer: null,
        });
      }
    }
  }
  return records;
}

export const tasks: TaskRecord[] = expandTasks();

function hash(value: string) {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function isoDate(daysBeforeEnd: number) {
  const end = Date.UTC(2026, 9, 22);
  const date = new Date(end - daysBeforeEnd * 86400000);
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildThroughput(): ThroughputPoint[] {
  const points: ThroughputPoint[] = [];
  for (let ago = 179; ago >= 0; ago -= 1) {
    const date = isoDate(ago);
    const day = new Date(`${date}T00:00:00Z`).getUTCDay();
    const weekend = day === 0 || day === 6;
    if (date === "2026-10-16") {
      points.push({ date, closed: 4, checkins: 3, handovers: 1, evidence: 2 });
      continue;
    }
    if (weekend) {
      points.push({ date, closed: 0, checkins: 0, handovers: 0, evidence: 0 });
      continue;
    }
    const mixed = hash(date);
    points.push({
      date,
      closed: mixed % 3,
      checkins: (mixed >> 3) % 4,
      handovers: (mixed >> 6) % 2,
      evidence: (mixed >> 8) % 3,
    });
  }
  return points;
}

export const throughput = buildThroughput();

export const vitals: Vital[] = [
  {
    id: "ftr",
    label: "First-time-right",
    value: "91%",
    numeric: 91,
    unit: "percent",
    band: "good",
    delta: "+2 pts vs previous period",
    goodHint: "Good at 90% or more",
  },
  {
    id: "turnaround",
    label: "Verifier turnaround",
    value: "2h 40m",
    numeric: 160,
    unit: "duration",
    band: "good",
    delta: "18m faster vs previous period",
    goodHint: "Good up to 4h",
  },
  {
    id: "starts",
    label: "On-time starts",
    value: "83%",
    numeric: 83,
    unit: "percent",
    band: "needs improvement",
    delta: "-2 pts vs previous period",
    goodHint: "Good at 85% or more",
  },
  {
    id: "sync",
    label: "Sync lag",
    value: "38 s",
    numeric: 38,
    unit: "seconds",
    band: "good",
    delta: "6 s lower vs previous period",
    goodHint: "Good up to 60 s",
  },
];

export const liveStrip = [
  0, 1, 0, 2, 1, 0, 1, 3, 1, 0, 2, 1, 0, 1, 2, 4, 1, 0, 1, 2, 0, 1, 3, 1, 0, 2, 1, 0, 1, 2,
];

const activitySeed: Omit<ActivityEvent, "id">[] = [
  { at: "2026-10-22T08:35:00.000Z", actor: "Ajit Dubey", verb: "is retrying a failed evidence upload for", object: "T11 Firewall handover", projectCode: "P1-2627-0002", type: "evidence" },
  { at: "2026-10-22T08:25:00.000Z", actor: "Charmi Shah", verb: "prepared the completion certificate for", object: "Plant network refresh", projectCode: "P1-2627-0002", type: "certificate" },
  { at: "2026-10-22T08:12:00.000Z", actor: "Yash Raikar", verb: "handed over", object: "T02 Configure the managed switch", projectCode: "P1-2627-0002", type: "handover" },
  { at: "2026-10-22T07:40:00.000Z", actor: "Sakshi Rajbhar", verb: "uploaded evidence for", object: "T04 Set up access points", projectCode: "P1-2627-0003", type: "evidence" },
  { at: "2026-10-22T06:20:00.000Z", actor: "Yash Raikar", verb: "checked in with customer OTP at", object: "Plant network refresh", projectCode: "P1-2627-0002", type: "check-in" },
  { at: "2026-10-22T05:45:00.000Z", actor: "Sheshadri Chintakindi", verb: "sent back", object: "T04 AP-03 and AP-04", projectCode: "P1-2627-0003", type: "sent-back" },
  { at: "2026-10-22T04:10:00.000Z", actor: "Bhakti Pawar", verb: "tried to tick Install EPS agent before Remove conflicting antivirus. Sent back to the missing step on", object: "Plant network refresh", projectCode: "P1-2627-0002", type: "red-flag" },
  { at: "2026-10-22T03:05:00.000Z", actor: "Meera Kulkarni", verb: "acknowledged the gap register for", object: "NAS backup design", projectCode: "P1-2627-0006", type: "acknowledged" },
  { at: "2026-10-21T11:35:00.000Z", actor: "Yash Raikar", verb: "handed over", object: "T07 Firewall FW-01", projectCode: "P1-2627-0002", type: "handover" },
  { at: "2026-10-21T10:15:00.000Z", actor: "Sheshadri Chintakindi", verb: "approved", object: "T01 Core switch baseline", projectCode: "P1-2627-0003", type: "approved" },
  { at: "2026-10-21T08:00:00.000Z", actor: "Sattish Agadii", verb: "was asked for a waiver on", object: "DC hardening", projectCode: "P1-2627-0010", type: "waiver" },
  { at: "2026-10-21T06:30:00.000Z", actor: "Akash Agadii", verb: "captured a customer PO for", object: "Switch refresh", projectCode: "P1-2627-0017", type: "po" },
  { at: "2026-10-21T04:45:00.000Z", actor: "Ashwini Sawant", verb: "confirmed the lookup table for", object: "Site link", projectCode: "P1-2627-0014", type: "lookup" },
  { at: "2026-10-20T12:10:00.000Z", actor: "Charmi Shah", verb: "completed the kick-off questionnaire for", object: "IT audit 2026", projectCode: "P1-2627-0011", type: "kickoff" },
  { at: "2026-10-20T09:20:00.000Z", actor: "Shruti Satam", verb: "checked in with customer OTP at", object: "Plant Wi-Fi survey", projectCode: "P1-2627-0009", type: "check-in" },
  { at: "2026-10-20T07:05:00.000Z", actor: "Sakshi Rajbhar", verb: "uploaded evidence for", object: "Warehouse access points", projectCode: "P1-2627-0003", type: "evidence" },
  { at: "2026-10-19T11:40:00.000Z", actor: "Sheshadri Chintakindi", verb: "approved", object: "T12 Server baseline", projectCode: "P1-2627-0002", type: "approved" },
  { at: "2026-10-19T08:25:00.000Z", actor: "Yash Raikar", verb: "handed over", object: "T03 Label the patch panel", projectCode: "P1-2627-0002", type: "handover" },
  { at: "2026-10-18T10:00:00.000Z", actor: "Bhakti Pawar", verb: "checked in with customer OTP at", object: "Plant network refresh", projectCode: "P1-2627-0002", type: "check-in" },
  { at: "2026-10-18T06:15:00.000Z", actor: "Ajit Dubey", verb: "uploaded evidence for", object: "Firewall notes", projectCode: "P1-2627-0002", type: "evidence" },
  { at: "2026-10-17T12:30:00.000Z", actor: "Charmi Shah", verb: "requested a waiver on", object: "Guest network", projectCode: "P1-2627-0016", type: "waiver" },
  { at: "2026-10-17T09:10:00.000Z", actor: "Farhan Qureshi", verb: "acknowledged the gap register for", object: "Mail and files", projectCode: "P1-2627-0015", type: "acknowledged" },
  { at: "2026-10-17T05:50:00.000Z", actor: "Sheshadri Chintakindi", verb: "sent back", object: "T06 NTP drift", projectCode: "P1-2627-0002", type: "sent-back" },
  { at: "2026-10-16T10:20:00.000Z", actor: "Yash Raikar", verb: "checked in with customer OTP at", object: "Plant network refresh", projectCode: "P1-2627-0002", type: "check-in" },
  { at: "2026-10-16T08:40:00.000Z", actor: "Sakshi Rajbhar", verb: "closed", object: "four warehouse tasks", projectCode: "P1-2627-0003", type: "approved" },
  { at: "2026-10-16T04:15:00.000Z", actor: "Akash Agadii", verb: "sent a proforma for", object: "Warehouse cameras", projectCode: "P1-2627-0012", type: "po" },
  { at: "2026-10-15T11:05:00.000Z", actor: "Ashwini Sawant", verb: "confirmed the lookup table for", object: "Head office firewall", projectCode: "P1-2627-0001", type: "lookup" },
  { at: "2026-10-15T07:30:00.000Z", actor: "Charmi Shah", verb: "completed the kick-off questionnaire for", object: "Domain cutover", projectCode: "P1-2627-0007", type: "kickoff" },
  { at: "2026-10-14T09:45:00.000Z", actor: "Sattish Agadii", verb: "signed the completion certificate for", object: "Endpoint rollout", projectCode: "P1-2627-0005", type: "certificate" },
  { at: "2026-10-14T06:00:00.000Z", actor: "Neeta Darge", verb: "uploaded evidence for", object: "Backup rehearsal notes", projectCode: "P1-2627-0018", type: "evidence" },
  { at: "2026-10-13T10:25:00.000Z", actor: "Sheshadri Chintakindi", verb: "approved", object: "T14 NAS share map", projectCode: "P1-2627-0003", type: "approved" },
  { at: "2026-10-13T05:35:00.000Z", actor: "Yash Raikar", verb: "handed over", object: "T15 Management VLAN", projectCode: "P1-2627-0002", type: "handover" },
  { at: "2026-10-12T08:50:00.000Z", actor: "Leela Patil", verb: "acknowledged the schedule for", object: "Site link", projectCode: "P1-2627-0014", type: "acknowledged" },
  { at: "2026-10-12T04:20:00.000Z", actor: "Bhakti Pawar", verb: "tried to tick a later EPS step before the antivirus removal. Sent back to the missing step on", object: "Plant network refresh", projectCode: "P1-2627-0002", type: "red-flag" },
  { at: "2026-10-10T09:00:00.000Z", actor: "Shruti Satam", verb: "checked in with customer OTP at", object: "DC hardening", projectCode: "P1-2627-0010", type: "check-in" },
  { at: "2026-10-09T07:40:00.000Z", actor: "Akash Agadii", verb: "captured a customer PO for", object: "Plant network refresh", projectCode: "P1-2627-0002", type: "po" },
  { at: "2026-10-08T11:15:00.000Z", actor: "Charmi Shah", verb: "completed the kick-off questionnaire for", object: "Warehouse network refresh", projectCode: "P1-2627-0003", type: "kickoff" },
  { at: "2026-10-07T06:55:00.000Z", actor: "Ashwini Sawant", verb: "confirmed the lookup table for", object: "NAS backup design", projectCode: "P1-2627-0006", type: "lookup" },
  { at: "2026-10-06T08:05:00.000Z", actor: "Sheshadri Chintakindi", verb: "sent back", object: "T18 Cable labels", projectCode: "P1-2627-0003", type: "sent-back" },
  { at: "2026-10-05T04:30:00.000Z", actor: "Sattish Agadii", verb: "was asked for a waiver on", object: "Lab server", projectCode: "P1-2627-0013", type: "waiver" },
];

export const activity: ActivityEvent[] = activitySeed.map((event, index) => ({
  ...event,
  id: `evt-${index + 1}`,
}));

export function taskTotal(states: Partial<Record<TaskState, number>>) {
  return TASK_STATES.reduce((sum, state) => sum + (states[state] ?? 0), 0);
}

export function customerName(id: string) {
  return customers.find((customer) => customer.id === id)?.name ?? id;
}
