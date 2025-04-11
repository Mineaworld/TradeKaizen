"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  BarChart3,
  BookOpen,
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const menuItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    description: "Return to the homepage",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "View your trading performance",
  },
  {
    name: "Learn",
    href: "/learn",
    icon: BookOpen,
    description: "Trading education resources",
  },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background/80 backdrop-blur-lg z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="w-full h-full flex flex-col items-center justify-center py-2 px-1"
              >
                <Menu className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left font-bold text-xl tracking-tight">
                  <span className="text-primary">Trade</span>Kaizen
                </SheetTitle>
              </SheetHeader>
              <div className="py-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 hover:bg-accent transition-colors",
                        isActive && "text-primary"
                      )}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>

              {/* Auth Buttons */}
              {!user && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for content to not get hidden behind the navigation bar */}
      <div className="h-[68px] md:h-0" />
    </>
  );
}
