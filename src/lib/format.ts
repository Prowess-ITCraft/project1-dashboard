import { formatInTimeZone } from "date-fns-tz";

export const TIME_ZONE = "Asia/Kolkata";
export const FIXED_NOW_ISO = "2026-10-22T08:36:00.000Z";

const numberFormat = new Intl.NumberFormat("en-IN");

export function formatCount(value: number) {
  return numberFormat.format(value);
}

export function formatIst(iso: string, pattern = "d MMM yyyy") {
  return formatInTimeZone(iso, TIME_ZONE, pattern);
}

export function clockLabel(iso: string) {
  return `${formatIst(iso, "HH:mm")} IST`;
}
