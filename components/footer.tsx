"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaLinkedin, FaTwitter, FaGithub, FaFacebook } from "react-icons/fa";
import { Mail, ArrowRight } from "lucide-react";

const productLinks = [
  { name: "Features", href: "/features" },
  { name: "Analytics", href: "/analytics" },
  { name: "Trading Journal", href: "/journal" },
  { name: "Pricing", href: "/pricing" },
  { name: "Testimonials", href: "/testimonials" },
];

const resourceLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Documentation", href: "/docs" },
  { name: "Trading Guide", href: "/guide" },
  { name: "API Reference", href: "/api" },
  { name: "Support", href: "/support" },
];

const legalLinks = [
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Cookie Policy", href: "/cookies" },
  { name: "Security", href: "/security" },
];

const socialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com/tradekaizen",
    icon: FaTwitter,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/tradekaizen",
    icon: FaLinkedin,
  },
  {
    name: "GitHub",
    href: "https://github.com/tradekaizen",
    icon: FaGithub,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/tradekaizen",
    icon: FaFacebook,
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-7">
            {/* Brand and Newsletter - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              <Link href="/" className="inline-flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  <span className="text-primary">Trade</span>Kaizen
                </span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-md">
                A comprehensive trading journal platform designed to help
                traders analyze patterns, track performance, and improve their
                strategies with powerful analytics.
              </p>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Stay updated</h3>
                <div className="flex max-w-sm gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1"
                  />
                  <Button>
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Links Sections - Each takes 1 column */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold mb-3">Product</h3>
                <ul className="space-y-2.5">
                  {productLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3">Resources</h3>
                <ul className="space-y-2.5">
                  {resourceLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3">Legal</h3>
                <ul className="space-y-2.5">
                  {legalLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Section - Takes 1 column */}
            <div className="lg:col-span-1">
              <h3 className="text-sm font-semibold mb-3">Contact</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Need help? We&apos;re here to assist you with any questions.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
                <div className="flex items-center space-x-3 pt-2">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">{link.name}</span>
                        <Icon size={20} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TradeKaizen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
