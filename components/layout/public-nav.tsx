"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

const navVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0 },
};

const navItems = [
  { name: "Home", href: "hero" },
  { name: "Features", href: "features" },
  { name: "Testimonials", href: "testimonials" },
  { name: "Pricing", href: "pricing" },
];

export default function PublicNav() {
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      transition={{ duration: 0.3 }}
      className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50"
    >
      <div className="container flex h-16 items-center justify-between px-6 md:px-10">
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            <BarChart className="h-6 w-6" />
            <span className="text-xl font-bold">TradeKaizen</span>
          </Link>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 mr-4">
            {navItems.map((item, i) => (
              <motion.div
                key={item.href}
                variants={itemVariants}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
              >
                <a
                  href={`#${item.href}`}
                  onClick={(e) => handleScroll(e, item.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
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
            <Button
              variant="ghost"
              asChild
              className="hover:scale-105 transition-transform"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="hover:scale-105 transition-transform">
              <Link href="/register">Sign Up</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
