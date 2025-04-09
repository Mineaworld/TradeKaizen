import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { StrategyProvider } from "@/contexts/strategy-context";
import { RootLayoutContent } from "./root-layout-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trading Journal",
  description:
    "Your comprehensive trading journal and data management platform",
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
              <RootLayoutContent>{children}</RootLayoutContent>
              <Toaster />
            </ThemeProvider>
          </StrategyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
