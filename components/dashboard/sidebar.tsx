"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  Calendar,
  Home,
  LayoutDashboard,
  LightbulbIcon,
  LineChart,
  LogOut,
  Menu,
  Moon,
  Notebook,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Journal",
    href: "/journal",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Strategies",
    href: "/strategies",
    icon: LightbulbIcon,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: LineChart,
  },
  {
    title: "Notes",
    href: "/notes",
    icon: Notebook,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logout clicked");
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg text-foreground hover:opacity-80"
        >
          <Home className="h-5 w-5" />
          <span>TradeKaizen</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.href}
                asChild
                variant={pathname === link.href ? "secondary" : "ghost"}
                className={cn(
                  "justify-start gap-2 px-4",
                  pathname === link.href && "bg-secondary"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Link href={link.href}>
                  <Icon className="h-4 w-4" />
                  {link.title}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4 space-y-2">
        <Link href="/settings" onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Dark Mode
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 border-r motion-safe:transition-transform motion-safe:duration-200"
            >
              <div className="flex h-full flex-col">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-medium">
            {sidebarLinks.find((link) => link.href === pathname)?.title ||
              "Dashboard"}
          </span>
        </div>
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Home className="h-5 w-5" />
          <span>TradeKaizen</span>
        </Link>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r bg-background transition-transform lg:flex">
        <SidebarContent />
      </aside>
    </>
  );
}
