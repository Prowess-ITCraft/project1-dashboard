"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLoading } from "@/components/app-loading";
import { PageTransition } from "@/components/page-transition";
import { AppShell, leavePreview } from "@/features/shell/app-shell";
import { readSession, type Session } from "@/lib/session";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const next = readSession();
    if (!next) router.replace("/");
    // Session lives in localStorage, which the server render cannot read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setSession(next);
  }, [router]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const search = new CustomEvent("p1-search", { cancelable: true });
        if (!window.dispatchEvent(search)) return;
        router.push("/dashboard");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  function openSearch() {
    const event = new CustomEvent("p1-search", { cancelable: true });
    if (!window.dispatchEvent(event)) return;
    router.push("/dashboard");
  }

  if (!session) return <AppLoading />;

  return (
    <AppShell
      session={session}
      syncLabel="All sent"
      onSearch={openSearch}
      onSignOut={() => {
        leavePreview();
        router.replace("/");
      }}
    >
      <PageTransition>{children}</PageTransition>
    </AppShell>
  );
}
