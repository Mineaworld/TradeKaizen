"use client";

import { useState, useEffect, ReactNode } from "react";

interface ClientOnlySvgProps {
  children: ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
}

export function ClientOnlySvg({
  children,
  className,
  width,
  height,
  viewBox = "0 0 24 24",
}: ClientOnlySvgProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return empty div with same dimensions to avoid layout shifts
    return <div style={{ width, height }} className={className} />;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
      viewBox={viewBox}
    >
      {children}
    </svg>
  );
}
