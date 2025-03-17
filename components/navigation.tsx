"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Calendar,
  FileText,
  Home,
  Menu,
  StickyNote,
  X,
  ChevronDown,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Navigation = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Update layout.tsx when sidebar is collapsed or expanded
  useEffect(() => {
    document.body.classList.toggle("sidebar-collapsed", isCollapsed);
  }, [isCollapsed]);

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Journal", href: "/journal", icon: BookMarked },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Strategies", href: "/strategies", icon: FileText },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "Notes", href: "/notes", icon: StickyNote },
  ];

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background z-30 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="mr-3"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-primary/10 rounded-md p-1.5 group-hover:bg-primary/20 transition-colors">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-primary">Trade</span>Hub
          </span>
        </Link>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop always visible, Mobile conditionally visible */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-background border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-64",
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center h-16 px-4 border-b justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-primary/10 rounded-md p-1.5 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-primary">Trade</span>Hub
              </span>
            </Link>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <div className="bg-primary/10 rounded-md p-1.5">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:flex hidden"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md transition-colors",
                    isCollapsed
                      ? "justify-center py-3 px-2"
                      : "py-2.5 px-3 space-x-3",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary" : "opacity-70"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                  {!isCollapsed && item.name === "Resources" && (
                    <ChevronDown className="h-3 w-3 ml-auto opacity-70" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-muted-foreground",
              isCollapsed && "justify-center px-0"
            )}
          >
            <Settings className="h-5 w-5 opacity-70" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
