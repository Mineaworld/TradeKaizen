"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import { ClientOnlyIcon } from "@/components/client-only-icon";
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
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

export function Navigation() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Update layout.tsx when sidebar is collapsed or expanded
  useEffect(() => {
    document.body.classList.toggle("sidebar-collapsed", isCollapsed);
  }, [isCollapsed]);

  const navigation = [
    { name: "Home", href: "#hero", icon: Home },
    { name: "Journal", href: "/journal", icon: BookMarked },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Strategies", href: "/strategies", icon: FileText },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "Notes", href: "/notes", icon: StickyNote },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
          <ClientOnlyIcon>
            <Menu className="h-5 w-5" />
          </ClientOnlyIcon>
        </Button>
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-primary/10 rounded-md p-1.5 group-hover:bg-primary/20 transition-colors">
            <ClientOnlyIcon>
              <BarChart3 className="h-5 w-5 text-primary" />
            </ClientOnlyIcon>
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-primary">Trade</span>Kaizen
          </span>
        </Link>

        {/* Theme toggle in mobile header */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="ml-auto"
        >
          {theme === "dark" ? (
            <ClientOnlyIcon>
              <Sun className="h-5 w-5" />
            </ClientOnlyIcon>
          ) : (
            <ClientOnlyIcon>
              <Moon className="h-5 w-5" />
            </ClientOnlyIcon>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
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
          "translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center h-16 px-4 border-b justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-primary/10 rounded-md p-1.5 group-hover:bg-primary/20 transition-colors">
                <ClientOnlyIcon>
                  <BarChart3 className="h-5 w-5 text-primary" />
                </ClientOnlyIcon>
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-primary">Trade</span>Kaizen
              </span>
            </Link>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <div className="bg-primary/10 rounded-md p-1.5">
                <ClientOnlyIcon>
                  <BarChart3 className="h-5 w-5 text-primary" />
                </ClientOnlyIcon>
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
              <ClientOnlyIcon>
                <ChevronRight className="h-4 w-4" />
              </ClientOnlyIcon>
            ) : (
              <ClientOnlyIcon>
                <ChevronLeft className="h-4 w-4" />
              </ClientOnlyIcon>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <ClientOnlyIcon>
              <X className="h-5 w-5" />
            </ClientOnlyIcon>
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
                  <ClientOnlyIcon>
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-primary" : "opacity-70"
                      )}
                    />
                  </ClientOnlyIcon>
                  {!isCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                  {!isCollapsed && item.name === "Resources" && (
                    <ClientOnlyIcon>
                      <ChevronDown className="h-3 w-3 ml-auto opacity-70" />
                    </ClientOnlyIcon>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              className={cn(
                "justify-start text-muted-foreground",
                isCollapsed && "justify-center px-0 w-full"
              )}
            >
              <ClientOnlyIcon>
                <Settings className="h-5 w-5 opacity-70" />
              </ClientOnlyIcon>
              {!isCollapsed && <span className="ml-3">Settings</span>}
            </Button>

            {/* Theme toggle in sidebar footer */}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground"
              >
                {theme === "dark" ? (
                  <ClientOnlyIcon>
                    <Sun className="h-5 w-5 opacity-70" />
                  </ClientOnlyIcon>
                ) : (
                  <ClientOnlyIcon>
                    <Moon className="h-5 w-5 opacity-70" />
                  </ClientOnlyIcon>
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </div>

          {/* Theme toggle when collapsed - centered */}
          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-full text-muted-foreground mt-2"
            >
              {theme === "dark" ? (
                <ClientOnlyIcon>
                  <Sun className="h-5 w-5 opacity-70" />
                </ClientOnlyIcon>
              ) : (
                <ClientOnlyIcon>
                  <Moon className="h-5 w-5 opacity-70" />
                </ClientOnlyIcon>
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {/* Logout button */}
          {user && (
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-muted-foreground mt-2",
                isCollapsed && "justify-center px-0"
              )}
              onClick={() => signOut()}
            >
              <ClientOnlyIcon>
                <LogOut className="h-5 w-5 opacity-70" />
              </ClientOnlyIcon>
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          )}

          {/* Login/Register buttons if not logged in */}
          {!user && !isCollapsed && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {!user && isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="w-full text-muted-foreground mt-2"
              asChild
            >
              <Link href="/login">
                <ClientOnlyIcon>
                  <LogOut className="h-5 w-5 opacity-70 rotate-180" />
                </ClientOnlyIcon>
                <span className="sr-only">Login</span>
              </Link>
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}

export default Navigation;
