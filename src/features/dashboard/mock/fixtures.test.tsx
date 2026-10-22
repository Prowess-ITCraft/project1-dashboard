import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { buildStaffFromCsv } from "./build-staff";
import { sampleStaff } from "./staff.sample";
import { activity, projects, taskTotal, tasks, throughput } from "./seed";
import { applyFilters, bandDuration, bandPercent, bandSeconds, createSnapshot, defaultFilters, previousWindow, projectsCsv, sumMetric } from "./query";
import { stepSimulation } from "./simulate";
import { KpiStrip } from "../components/kpi-strip";
import { FieldProjects } from "../components/field-projects";
import { EngineerCard } from "../components/engineers-tab";
import { DeliveryVitals } from "../components/vitals-card";
import type { StaffMember } from "./types";

describe("fixtures", () => {
  it("keeps the published totals", () => {
    expect(projects).toHaveLength(18);
    expect(projects.filter((project) => project.status === "Behind plan")).toHaveLength(2);
    expect(projects.filter((project) => project.stage === "execution")).toHaveLength(2);
    expect(tasks).toHaveLength(102);
    expect(activity).toHaveLength(40);
    for (const project of projects) {
      if (Object.keys(project.states).length === 0) continue;
      expect(taskTotal(project.states)).toBeGreaterThan(0);
    }
    const plant = projects.find((project) => project.code === "P1-2627-0002");
    const warehouse = projects.find((project) => project.code === "P1-2627-0003");
    expect(taskTotal(plant?.states ?? {})).toBe(50);
    expect(taskTotal(warehouse?.states ?? {})).toBe(51);
    const point = throughput.find((item) => item.date === "2026-10-16");
    expect(point).toMatchObject({ checkins: 3, closed: 4 });
  });

  it("bands the delivery vitals", () => {
    expect(bandPercent(91, 90, 75)).toBe("good");
    expect(bandPercent(83, 85, 70)).toBe("needs improvement");
    expect(bandPercent(60, 90, 75)).toBe("poor");
    expect(bandDuration(160, 240, 720)).toBe("good");
    expect(bandSeconds(38, 60, 300)).toBe("good");
    expect(bandSeconds(400, 60, 300)).toBe("poor");
  });

  it("recomputes a range and a filtered view", () => {
    const week = sumMetric(throughput, "closed", 7);
    const quarter = sumMetric(throughput, "closed", 90);
    expect(quarter).toBeGreaterThan(week);
    expect(previousWindow(throughput, "closed", 30)).toBeGreaterThanOrEqual(0);
    const snapshot = createSnapshot();
    const filtered = applyFilters(snapshot, { ...defaultFilters(), customer: "CUS-00003" });
    expect(filtered.kpis.find((kpi) => kpi.id === "behind")?.value).toBe(1);
    expect(filtered.projects.every((project) => project.customerId === "CUS-00003")).toBe(true);
  });

  it("exports csv without money fields", () => {
    const csv = projectsCsv(projects);
    expect(csv.split("\n")).toHaveLength(19);
    expect(csv.toLowerCase()).not.toMatch(/price|margin|cost/);
    expect(csv).toContain("P1-2627-0002");
  });

  it("steps the simulation deterministically", () => {
    const start = createSnapshot();
    expect(stepSimulation(start, 3)).toEqual(stepSimulation(start, 3));
    expect(stepSimulation(start, 3).nowIso).not.toBe(start.nowIso);
  });
});

describe("staff builder", () => {
  it("normalises company and drops other email domains", () => {
    const staff = buildStaffFromCsv("name,email,company\nAsha Menon,asha@itcraft.net.in,Other\nRavi Shah,ravi@gmail.com,Other\n");
    expect(staff).toHaveLength(2);
    expect(staff.every((person) => person.company === "ITCraft")).toBe(true);
    expect(staff[0]?.email).toBe("asha@itcraft.net.in");
    expect(staff[1]?.email).toBeNull();
    const sample: StaffMember[] = sampleStaff;
    expect(sample[0]).toHaveProperty("initials");
    expect(staff[0]).toHaveProperty("color");
  });
});

describe("cards", () => {
  it("renders the kpi strip", () => {
    render(<KpiStrip items={createSnapshot().kpis} />);
    expect(screen.getByText("Tasks blocked")).toBeInTheDocument();
    expect(screen.getByText("Tasks closed")).toBeInTheDocument();
    expect(screen.getByText("+6 this week")).toBeInTheDocument();
    expect(screen.getByText(/of 102/)).toBeInTheDocument();
  });

  it("renders the nine task states", () => {
    const plant = projects.find((project) => project.code === "P1-2627-0002");
    render(
      <FieldProjects
        status="ready"
        onRetry={() => undefined}
        projects={plant ? [plant] : []}
        stageLine={() => "Execution, stage 4 of 5"}
        sort="behind"
        onSort={() => undefined}
        workflow="five-cores"
      />,
    );
    expect(screen.getByTestId("state-bar").textContent).toContain("20");
    expect(screen.getByText(/waiting on customer change window/)).toBeInTheDocument();
  });

  it("renders engineer sync states", () => {
    const engineer = createSnapshot().engineers[1];
    render(<EngineerCard engineer={engineer!} email={null} />);
    expect(screen.getByText("Uploading 2 of 3")).toBeInTheDocument();
  });

  it("renders vital bands", () => {
    render(<DeliveryVitals status="ready" onRetry={() => undefined} vitals={createSnapshot().vitals} />);
    expect(screen.getByText("Needs improvement")).toBeInTheDocument();
    expect(screen.getAllByText("Good").length).toBeGreaterThan(0);
  });
});

describe("guards", () => {
  it("keeps Phosphor as the only icon package and avoids banned fonts", () => {
    const pkg = JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    const names = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)];
    expect(names.some((name) => name.includes("lucide") || name.includes("heroicons") || name.includes("react-icons"))).toBe(false);
    expect(names).toContain("@phosphor-icons/react");
    const files = walk(path.join(process.cwd(), "src"));
    const source = files.map((file) => file.text).join("\n");
    const branded = files
      .filter((file) => file.name !== "help-copy.ts" && file.name !== "mock-data.ts")
      .map((file) => file.text)
      .join("\n");
    expect(source).not.toMatch(/lucide-react|@heroicons|react-icons/);
    expect(source).not.toMatch(/\b(Inter|Roboto|Poppins|Fraunces|Playfair Display|Geist|Space Grotesk|DM Sans|Plus Jakarta Sans|JetBrains Mono)\b/);
    expect(branded).not.toMatch(/IITPL|PrismSuite/);
  });
});

function walk(dir: string): { name: string; text: string }[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    if (!/\.(ts|tsx|css|json)$/.test(entry) || entry.includes(".test.")) return [];
    return [{ name: entry, text: readFileSync(full, "utf8") }];
  });
}
