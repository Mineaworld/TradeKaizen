import { LucideIcon } from "lucide-react";
import {
  Home,
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  BookMarked,
  StickyNote,
  Settings,
  LogIn,
  UserPlus,
  User,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
}

export const MARKETING_NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "#hero", icon: Home, description: "Return to home" },
  {
    name: "Features",
    href: "#features",
    icon: BookOpen,
    description: "Explore our features",
  },
  {
    name: "Testimonials",
    href: "#testimonials",
    icon: StickyNote,
    description: "What others say",
  },
  {
    name: "Pricing",
    href: "#pricing",
    icon: BarChart3,
    description: "View pricing plans",
  },
];

export const USER_NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Your trading dashboard",
  },
  {
    name: "Journal",
    href: "/journal",
    icon: BookMarked,
    description: "Track your trades",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "View performance",
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "Trading schedule",
  },
  {
    name: "Strategies",
    href: "/strategies",
    icon: FileText,
    description: "Manage strategies",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account settings",
  },
];

export const AUTH_NAV_ITEMS: NavItem[] = [
  {
    name: "Login",
    href: "/login",
    icon: LogIn,
    description: "Sign in to your account",
  },
  {
    name: "Register",
    href: "/register",
    icon: UserPlus,
    description: "Create new account",
  },
];
