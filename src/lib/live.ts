import { cookies } from "next/headers";

export type LiveCell = { label: string; value: string };

export type LiveRow = { id: string; cells: LiveCell[] };

export type LiveResult = {
  ok: boolean;
  status: number;
  rows: LiveRow[];
  message: string | null;
  source: string;
};

const HIDDEN = /password|secret|token|hash|totp|cookie|authorization/i;
const PREFERRED = [
  "task_ref",
  "title",
  "name",
  "legal_name",
  "display_name",
  "code",
  "number",
  "email",
  "asset",
  "stage",
  "status",
  "state",
  "kind",
  "stock",
  "role",
  "designation",
  "city",
  "rework_count",
  "handed_over_at",
  "started_at",
  "created_at",
  "updated_at",
  "read_at",
  "body",
  "message",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function labelFor(key: string) {
  return key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function textValue(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (isRecord(value)) {
    const named = value.name ?? value.title ?? value.label ?? value.email ?? value.code;
    if (typeof named === "string") return named;
  }
  return null;
}

function collectRecords(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (!isRecord(payload)) return [];
  const arrays = Object.values(payload).filter(Array.isArray) as unknown[][];
  const longest = arrays.sort((a, b) => b.length - a.length)[0];
  if (longest && longest.some(isRecord)) return longest.filter(isRecord);
  return [payload];
}

function cellsFor(record: Record<string, unknown>): LiveCell[] {
  const keys = Object.keys(record).filter((key) => !HIDDEN.test(key) && textValue(record[key]));
  keys.sort((a, b) => {
    const ai = PREFERRED.indexOf(a);
    const bi = PREFERRED.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  return keys.slice(0, 6).map((key) => ({ label: labelFor(key), value: textValue(record[key]) ?? "" }));
}

export async function liveList(path: string): Promise<LiveResult> {
  const source = `http://127.0.0.1:9595${path}`;
  const jar = await cookies();
  const cookie = jar
    .getAll()
    .map((item) => `${item.name}=${item.value}`)
    .join("; ");

  try {
    const response = await fetch(source, {
      headers: {
        accept: "application/json",
        ...(cookie ? { cookie } : {}),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const text = await response.text();
    let payload: unknown = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = null;
    }
    if (!response.ok) {
      const detail = isRecord(payload) && typeof payload.detail === "string" ? payload.detail : null;
      return {
        ok: false,
        status: response.status,
        rows: [],
        source,
        message:
          response.status === 401
            ? "This view could not read the live service from this browser session."
            : detail ?? `The live service returned ${response.status}.`,
      };
    }
    const rows = collectRecords(payload)
      .map((record, index) => ({
        id: String(record.id ?? record.number ?? record.code ?? index),
        cells: cellsFor(record),
      }))
      .filter((row) => row.cells.length > 0)
      .slice(0, 80);
    return { ok: true, status: response.status, rows, source, message: rows.length ? null : "The service returned no rows." };
  } catch {
    return {
      ok: false,
      status: 0,
      rows: [],
      source,
      message: "The live service on port 9595 is not responding.",
    };
  }
}
