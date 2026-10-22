"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readSession } from "@/lib/session";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!readSession()) router.replace("/");
    // Session lives in localStorage, which the server render cannot read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setAllowed(true);
  }, [router]);

  if (!allowed) return <p className="p-6 text-sm text-[var(--muted)]">Loading the preview</p>;
  return children;
}
