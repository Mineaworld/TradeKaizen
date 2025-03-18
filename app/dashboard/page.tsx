import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/journal/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> New Trade Entry
          </Button>
        </Link>
      </div>

      {/* Rest of dashboard content */}
    </div>
  );
}
