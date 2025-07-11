import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, User, LogIn, UserPlus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Pricing", href: "#pricing" },
];

export function Nav() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              TradeKaizen
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, idx) => (
              <motion.div
                key={item.name}
                whileTap={{ scale: 0.92, rotate: -2 }}
                animate={activeIdx === idx ? { scale: 1.1, color: "#0070f3" } : { scale: 1, color: "#222" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => setActiveIdx(idx)}
                style={{ display: "inline-block", cursor: "pointer" }}
              >
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isLoading ? null : !user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span>Account</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      <span>Login</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/register"
                      className="flex items-center text-primary font-medium"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span>Create Account</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      localStorage.setItem('tk-logging-out', '1');
                      await signOut();
                      router.replace("/");
                    }}
                    className="flex items-center text-destructive"
                  >
                    <LogIn className="h-4 w-4 mr-2 rotate-180" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] mt-2">
                {navItems.map((item, idx) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <motion.div
                      whileTap={{ scale: 0.92, rotate: -2 }}
                      animate={activeIdx === idx ? { scale: 1.1, color: "#0070f3" } : { scale: 1, color: "#222" }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      onClick={() => setActiveIdx(idx)}
                      style={{ display: "inline-block", width: "100%" }}
                    >
                      <Link
                        href={item.href}
                        className="w-full cursor-pointer font-medium"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
