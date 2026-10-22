"use client";

import { useEffect, useState } from "react";
import { applyFilters } from "../mock/query";
import { createSnapshot, SOURCE_DELAY_MS } from "../mock/query";
import { stepSimulation } from "../mock/simulate";
import { loadSnapshot, MockDashboardSource } from "../mock/source";
import type { Filters, Snapshot } from "../mock/types";

export function useDashboardData(filters: Filters) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [token, setToken] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancel = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");
    const source = new MockDashboardSource(createSnapshot(), SOURCE_DELAY_MS, filters.mock === "error");
    loadSnapshot(source)
      .then((data) => {
        if (cancel) return;
        setSnapshot(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancel) setStatus("error");
      });
    return () => {
      cancel = true;
    };
  }, [token, filters.mock]);

  useEffect(() => {
    if (status !== "ready" || paused || filters.frozen) return;
    let tick = 0;
    const id = window.setInterval(() => {
      tick += 1;
      const step = tick;
      setSnapshot((current) => (current ? stepSimulation(current, step) : current));
    }, 5000);
    return () => window.clearInterval(id);
  }, [status, paused, filters.frozen, token]);

  return {
    status,
    view: snapshot ? applyFilters(snapshot, filters) : null,
    reload: () => setToken((value) => value + 1),
    paused,
    setPaused,
  };
}
