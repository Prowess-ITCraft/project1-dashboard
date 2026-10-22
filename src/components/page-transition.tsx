"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait until the client knows the motion preference so the first paint matches the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  const animate = ready && !reduce;

  return (
    <motion.div
      key={pathname}
      initial={animate ? { opacity: 0.72, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease }}
    >
      {children}
    </motion.div>
  );
}
