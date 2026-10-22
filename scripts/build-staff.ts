import fs from "fs";
import path from "path";
import { buildStaffFromCsv } from "../src/features/dashboard/mock/build-staff.ts";

const candidates = [
  path.join(process.cwd(), "data", "private", "contacts.csv"),
  path.join(process.cwd(), "docs", "contacts_2.csv"),
];
const output = path.join(process.cwd(), "src", "features", "dashboard", "mock", "staff.generated.json");

const source = candidates.find((candidate) => fs.existsSync(candidate));
if (!source) {
  console.log("No contacts file found. The app will use the sample staff.");
  process.exit(0);
}

const staff = buildStaffFromCsv(fs.readFileSync(source, "utf8")).map((person) => {
  const roles: Record<string, string> = {
    "Sattish Agadii": "Director",
    "Charmi Shah": "Project manager",
    "Akash Agadii": "Sales and BD",
    "Sheshadri Chintakindi": "Technical lead (verifier)",
    "Shruti Satam": "Audit engineer",
    "Ashwini Sawant": "Solution architect",
    "Yash Raikar": "Field engineer",
    "Sakshi Rajbhar": "Field engineer",
    "Bhakti Pawar": "Field engineer",
    "Neeta Darge": "Field engineer",
    "Ajit Dubey": "Field engineer",
  };
  return { ...person, role: roles[person.name] ?? "ITCraft" };
});

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(staff, null, 2));
console.log(`Wrote ${staff.length} people to staff.generated.json`);
