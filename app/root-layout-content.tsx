"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/navigation";
import { cn } from "@/lib/utils";

// Array of public routes that should not show the main navigation
const publicRoutes = ["/home", "/login", "/register"];

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <div className="flex min-h-screen bg-background">
      {!isPublicRoute && <Navigation />}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          !isPublicRoute && "md:ml-64 sidebar-collapsed:md:ml-[70px]"
        )}
      >
        <div className="md:pt-0 pt-16">
          <main
            className={cn("mx-auto px-4 py-6", !isPublicRoute && "container")}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
