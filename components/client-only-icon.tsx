"use client";

import { useState, useEffect, ReactNode } from "react";

interface ClientOnlyIconProps {
  children: ReactNode;
}

export function ClientOnlyIcon({ children }: ClientOnlyIconProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
