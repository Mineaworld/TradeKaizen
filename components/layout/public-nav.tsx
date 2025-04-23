"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart, User, LogIn, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { MARKETING_NAV_ITEMS } from "@/config/navigation";

// Constants
const BUTTON_STYLES = {
  base: "gap-2 hover:scale-105 transition-transform",
  icon: "h-4 w-4",
  chevron: "h-3 w-3 opacity-50",
};

const navVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0 },
};

/**
 * PublicNav component - Main navigation for the public facing pages
 * @returns JSX.Element
 */
export default function PublicNav(): JSX.Element {
  const { user } = useAuth();

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      transition={{ duration: 0.3 }}
      className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container flex h-16 items-center justify-between px-6 md:px-10">
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            aria-label="TradeKaizen Home"
          >
            <BarChart className="h-6 w-6" aria-hidden="true" />
            <span className="text-xl font-bold">TradeKaizen</span>
          </Link>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 mr-4">
            {MARKETING_NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.href}
                variants={itemVariants}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
              >
                <a
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  aria-label={`Go to ${item.name} section`}
                >
                  {item.name}
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex items-center gap-2"
            variants={itemVariants}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <ThemeToggle />
            {!user ? (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={BUTTON_STYLES.base}
                  aria-label="Login to your account"
                >
                  <LogIn className={BUTTON_STYLES.icon} aria-hidden="true" />
                  <span className="hidden sm:inline">Login</span>
                  <ChevronRight
                    className={BUTTON_STYLES.chevron}
                    aria-hidden="true"
                  />
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className={BUTTON_STYLES.base}
                  aria-label="Go to your dashboard"
                >
                  <User className={BUTTON_STYLES.icon} aria-hidden="true" />
                  <span className="hidden sm:inline">Profile</span>
                  <ChevronRight
                    className={BUTTON_STYLES.chevron}
                    aria-hidden="true"
                  />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
