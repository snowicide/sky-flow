"use client";

import { ReactNode, startTransition, useEffect, useState } from "react";

export default function HydrationStore({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    startTransition(() => setIsHydrated(true));
  }, []);

  return isHydrated ? <>{children}</> : null;
}
