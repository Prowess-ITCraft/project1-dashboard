import type { StaffMember } from "./types";

export const AVATAR_PALETTE = ["#3d6f8f", "#2f7d57", "#8a6232", "#8a4450", "#3f5f8a", "#5c6b3a", "#3e6e6a"];

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
}

export function avatarColor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length] ?? AVATAR_PALETTE[0];
}

export function buildStaffFromCsv(csv: string): StaffMember[] {
  const lines = csv
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const [header, ...rows] = lines;
  if (!header) return [];
  const columns = header.split(",").map((column) => column.trim().toLowerCase());
  const nameIndex = columns.indexOf("name");
  const emailIndex = columns.indexOf("email");
  if (nameIndex < 0) return [];

  return rows.map((row) => {
    const cells = row.split(",").map((cell) => cell.trim());
    const name = cells[nameIndex] ?? "";
    const rawEmail = emailIndex >= 0 ? cells[emailIndex] ?? "" : "";
    const domain = rawEmail.split("@")[1]?.toLowerCase() ?? "";
    return {
      name,
      email: domain === "itcraft.net.in" ? rawEmail : null,
      company: "ITCraft",
      initials: initials(name),
      color: avatarColor(name),
      role: "ITCraft",
    };
  });
}
