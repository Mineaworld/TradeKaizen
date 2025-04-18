import { Navigation } from "@/components/navigation";
import { MobileNav } from "@/components/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block">
        <Navigation />
      </div>

      {/* Mobile Navigation - Hidden on desktop */}
      <MobileNav />

      {/* Main Content */}
      <main className="min-h-screen md:pl-[70px] lg:pl-64 pt-0 md:pt-4">
        {children}
      </main>
    </>
  );
}
