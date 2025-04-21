import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <DashboardSidebar />
      <main className="pl-64">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
