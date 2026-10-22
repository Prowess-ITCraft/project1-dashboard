import { applyFilters, createSnapshot, SOURCE_DELAY_MS, type DashboardView } from "./query";
import type { Filters, Snapshot } from "./types";

export interface DashboardDataSource {
  overview(): Promise<Pick<Snapshot, "nowIso" | "kpis" | "distribution" | "live" | "needs" | "review" | "customers" | "vitals" | "phonesOfflineSince" | "failedUploads" | "certificatesToSign">>;
  throughput(): Promise<Snapshot["throughput"]>;
  projects(): Promise<Snapshot["projects"]>;
  engineers(): Promise<Snapshot["engineers"]>;
  waitingOn(): Promise<Snapshot["waiting"]>;
  activity(): Promise<Snapshot["activity"]>;
  vitals(): Promise<Snapshot["vitals"]>;
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class MockDashboardSource implements DashboardDataSource {
  constructor(
    private readonly snapshot: Snapshot = createSnapshot(),
    private readonly delay = SOURCE_DELAY_MS,
    private readonly failing = false,
  ) {}

  private async gate<T>(value: T): Promise<T> {
    await wait(this.delay);
    if (this.failing) throw new Error("The preview data source failed.");
    return value;
  }

  overview() {
    const snapshot = this.snapshot;
    return this.gate({
      nowIso: snapshot.nowIso,
      kpis: snapshot.kpis,
      distribution: snapshot.distribution,
      live: snapshot.live,
      needs: snapshot.needs,
      review: snapshot.review,
      customers: snapshot.customers,
      vitals: snapshot.vitals,
      phonesOfflineSince: snapshot.phonesOfflineSince,
      failedUploads: snapshot.failedUploads,
      certificatesToSign: snapshot.certificatesToSign,
    });
  }

  throughput() {
    return this.gate(this.snapshot.throughput);
  }

  projects() {
    return this.gate(this.snapshot.projects);
  }

  engineers() {
    return this.gate(this.snapshot.engineers);
  }

  waitingOn() {
    return this.gate(this.snapshot.waiting);
  }

  activity() {
    return this.gate(this.snapshot.activity);
  }

  vitals() {
    return this.gate(this.snapshot.vitals);
  }
}

export async function loadSnapshot(source: DashboardDataSource): Promise<Snapshot> {
  const [overview, throughput, projects, engineers, waiting, activity, vitalRows] = await Promise.all([
    source.overview(),
    source.throughput(),
    source.projects(),
    source.engineers(),
    source.waitingOn(),
    source.activity(),
    source.vitals(),
  ]);
  return {
    ...overview,
    throughput,
    projects,
    engineers,
    waiting,
    activity,
    vitals: vitalRows,
    tasks: createSnapshot().tasks,
  };
}

export function viewFrom(snapshot: Snapshot, filters: Filters): DashboardView {
  return applyFilters(snapshot, filters);
}
