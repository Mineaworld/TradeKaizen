"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const PROTECTED_PATHS = [
  "/dashboard",
  "/journal",
  "/analytics",
  "/calendar",
  "/strategies",
  "/resources",
  "/notes",
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Prevent redirect to login if logging out
    if (typeof window !== 'undefined' && localStorage.getItem('tk-logging-out')) {
      localStorage.removeItem('tk-logging-out');
      return;
    }
    if (!isLoading && !user) {
      // Only redirect to login if still on a protected route
      if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
        router.replace("/login?redirectTo=" + encodeURIComponent(pathname));
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary" />
          <span className="text-lg font-semibold text-primary">Loading your dashboard...</span>
          <span className="text-muted-foreground text-sm">TradeKaizen</span>
        </div>
      </main>
    );
  }

  if (!user && !isLoading) return null;

  return (
    <div className="relative min-h-screen">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
