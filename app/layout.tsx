import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { StrategyProvider } from "@/contexts/strategy-context";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TradeKaizen - Master Your Trading Journey",
  description:
    "Your all-in-one trading journal platform for analyzing patterns, tracking performance, and refining trading strategies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <StrategyProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <MobileNav />
              <main className="min-h-screen">{children}</main>
              <Toaster />
            </ThemeProvider>
          </StrategyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
