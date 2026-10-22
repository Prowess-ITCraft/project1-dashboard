import type { ActivityEvent, Engineer, Snapshot, SyncState } from "./types";

function addMinutes(iso: string, minutes: number) {
  return new Date(new Date(iso).getTime() + minutes * 60000).toISOString();
}

const cycle: SyncState[] = ["offline", "uploading", "all-sent", "failed"];

function nextSync(current: SyncState, tick: number): { sync: SyncState; detail: string } {
  if (current === "na") return { sync: "na", detail: "Not in the field" };
  const start = Math.max(0, cycle.indexOf(current));
  const sync = cycle[(start + (tick % 2 === 0 ? 1 : 0)) % cycle.length] ?? current;
  if (sync === "all-sent") return { sync, detail: "All sent" };
  if (sync === "uploading") return { sync, detail: "Uploading 2 of 3" };
  if (sync === "offline") return { sync, detail: "Offline, last sync 14:02" };
  return { sync, detail: "1 failed" };
}

const templates = [
  { actor: "Yash Raikar", verb: "checked in with customer OTP at", object: "Plant network refresh", projectCode: "P1-2627-0002", type: "check-in" },
  { actor: "Sakshi Rajbhar", verb: "uploaded evidence for", object: "T04 Set up access points", projectCode: "P1-2627-0003", type: "evidence" },
  { actor: "Ajit Dubey", verb: "retried the evidence upload for", object: "T11 Firewall handover", projectCode: "P1-2627-0002", type: "evidence" },
  { actor: "Bhakti Pawar", verb: "queued another photo on", object: "T09 Cable survey, plant 2", projectCode: "P1-2627-0002", type: "evidence" },
] as const;

export function stepSimulation(snapshot: Snapshot, tick: number): Snapshot {
  const nowIso = addMinutes(snapshot.nowIso, 1);
  const engineers: Engineer[] = snapshot.engineers.map((engineer, index) => {
    if (!engineer.inField) return engineer;
    if (index !== tick % 4) {
      return { ...engineer, done: engineer.done + (tick % 3 === 0 ? 1 : 0) };
    }
    const moved = nextSync(engineer.sync, tick + index);
    return {
      ...engineer,
      sync: moved.sync,
      syncDetail: moved.detail,
      uploading: moved.sync === "uploading" ? 2 : 0,
      failed: moved.sync === "failed" ? 1 : 0,
      waiting: moved.sync === "offline" ? Math.max(engineer.waiting, 1) : engineer.waiting,
      done: engineer.done + 1,
    };
  });

  const template = templates[tick % templates.length];
  const event: ActivityEvent = {
    id: `live-${tick}`,
    at: nowIso,
    actor: template?.actor ?? "Yash Raikar",
    verb: template?.verb ?? "updated",
    object: template?.object ?? "a task",
    projectCode: template?.projectCode ?? "P1-2627-0002",
    type: template?.type ?? "evidence",
  };

  const inField = engineers.filter((engineer) => engineer.inField);
  const offline = inField.filter((engineer) => engineer.sync === "offline").length;
  const strip = snapshot.live.strip.slice(1).concat((tick % 4) + 1);

  return {
    ...snapshot,
    nowIso,
    engineers,
    activity: [event, ...snapshot.activity].slice(0, 48),
    live: {
      ...snapshot.live,
      inField: inField.length,
      offline,
      onSite: inField.length - offline,
      strip,
    },
    phonesOfflineSince: offline > 0 ? snapshot.phonesOfflineSince : "none",
    failedUploads: engineers.filter((engineer) => engineer.sync === "failed").length,
  };
}
