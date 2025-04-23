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
import { Menu, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  MARKETING_NAV_ITEMS,
  USER_NAV_ITEMS,
  AUTH_NAV_ITEMS,
} from "@/config/navigation";
import { LucideIcon } from "lucide-react";

const BUTTON_STYLES = {
  base: "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors",
  icon: "h-5 w-5 mb-1",
  text: "text-xs font-medium",
};

/**
 * MobileNav component - Mobile navigation for the application
 * @returns JSX.Element
 */
export function MobileNav(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {/* Top Mobile Navigation Bar */}
      <div
        className="fixed top-0 left-0 right-0 md:hidden border-b bg-background/80 backdrop-blur-lg z-50"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-4 h-14">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="TradeKaizen Home"
          >
            <span className="font-bold text-xl">
              <span className="text-primary">Trade</span>Kaizen
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            {!user ? (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  aria-label="Login to your account"
                >
                  <span>Login</span>
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  aria-label="Go to your dashboard"
                >
                  <span>Profile</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Mobile Navigation Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background/80 backdrop-blur-lg z-50"
        role="navigation"
        aria-label="Bottom navigation"
      >
        <div className="grid grid-cols-4 gap-1 p-2">
          {USER_NAV_ITEMS.slice(0, 3).map((item) => {
            const Icon = item.icon as LucideIcon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  BUTTON_STYLES.base,
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                aria-label={item.description}
              >
                <Icon className={BUTTON_STYLES.icon} aria-hidden="true" />
                <span className={BUTTON_STYLES.text}>{item.name}</span>
              </Link>
            );
          })}

          {/* Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className={cn(BUTTON_STYLES.base, "w-full h-full")}
                aria-label="Open menu"
                aria-expanded={isOpen}
              >
                <Menu className={BUTTON_STYLES.icon} aria-hidden="true" />
                <span className={BUTTON_STYLES.text}>Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left font-bold text-xl tracking-tight">
                  <span className="text-primary">Trade</span>Kaizen
                </SheetTitle>
              </SheetHeader>
              <div className="py-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
                {/* Marketing Menu Items */}
                {MARKETING_NAV_ITEMS.map((item) => {
                  const Icon = item.icon as LucideIcon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 hover:bg-accent transition-colors"
                      aria-label={item.description}
                    >
                      <Icon className="h-5 w-5 mr-3" aria-hidden="true" />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                      <ChevronRight
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="h-px bg-border my-2" />

                {/* User Menu Items */}
                {USER_NAV_ITEMS.map((item) => {
                  const Icon = item.icon as LucideIcon;
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
                      aria-label={item.description}
                    >
                      <Icon className="h-5 w-5 mr-3" aria-hidden="true" />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                      <ChevronRight
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Auth Buttons */}
              {!user && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
                  <div className="grid grid-cols-2 gap-2">
                    {AUTH_NAV_ITEMS.map((item) => {
                      const Icon = item.icon as LucideIcon;
                      return (
                        <Button
                          key={item.name}
                          variant={
                            item.name === "Login" ? "outline" : "default"
                          }
                          asChild
                          className="w-full"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            aria-label={item.description}
                          >
                            <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                            {item.name}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for content to not get hidden behind the navigation bars */}
      <div className="h-[calc(68px+56px)] md:h-0" />
    </>
  );
}
