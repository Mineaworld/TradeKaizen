"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React, { useEffect, useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely use browser-only code
 */
export function useClientOnly<T>(callback: () => T, initialState: T): T {
  const [value, setValue] = useState<T>(initialState);

  useEffect(() => {
    setValue(callback());
  }, [callback]);

  return value;
}

/**
 * Detect if code is running on client side
 */
export const isClient = typeof window !== "undefined";

/**
 * Component that only renders its children on the client side
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  if (!isClientSide) {
    return fallback;
  }

  return <>{children}</>;
}
