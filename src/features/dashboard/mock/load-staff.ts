import { readFileSync, existsSync } from "fs";
import path from "path";
import { sampleStaff } from "./staff.sample";
import type { StaffMember } from "./types";

const generatedPath = path.join(process.cwd(), "src/features/dashboard/mock/staff.generated.json");

export function loadStaff(): StaffMember[] {
  if (!existsSync(generatedPath)) return sampleStaff;
  const parsed = JSON.parse(readFileSync(generatedPath, "utf8")) as StaffMember[];
  return parsed.length > 0 ? parsed : sampleStaff;
}
