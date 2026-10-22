import { Suspense } from "react";
import { DashboardScreen } from "@/features/dashboard/dashboard-screen";
import { loadStaff } from "@/features/dashboard/mock/load-staff";

export default function DashboardPage() {
  const staff = loadStaff();
  return (
    <Suspense fallback={<p className="p-6 text-sm">Loading the preview</p>}>
      <DashboardScreen staff={staff} />
    </Suspense>
  );
}
