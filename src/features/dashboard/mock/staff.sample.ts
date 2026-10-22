import { avatarColor, initials } from "./build-staff";
import type { StaffMember } from "./types";

const names = [
  ["Sattish Agadii", "Director"],
  ["Charmi Shah", "Project manager"],
  ["Akash Agadii", "Sales and BD"],
  ["Sheshadri Chintakindi", "Technical lead (verifier)"],
  ["Shruti Satam", "Audit engineer"],
  ["Ashwini Sawant", "Solution architect"],
  ["Yash Raikar", "Field engineer"],
  ["Sakshi Rajbhar", "Field engineer"],
  ["Bhakti Pawar", "Field engineer"],
  ["Neeta Darge", "Field engineer"],
  ["Ajit Dubey", "Field engineer"],
] as const;

export const sampleStaff: StaffMember[] = names.map(([name, role]) => ({
  name,
  email: null,
  company: "ITCraft",
  initials: initials(name),
  color: avatarColor(name),
  role,
}));

export const signedInUser = {
  name: "Aditya Kumar",
  email: "aditya@itcraft.net.in",
  company: "ITCraft",
  initials: "AK",
  color: avatarColor("Aditya Kumar"),
  role: "Admin",
  title: "Admin, 3 roles",
};
