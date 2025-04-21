export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your trading dashboard. Track your progress and manage your
          trading activities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">Recent Trades</h2>
          <p className="text-sm text-muted-foreground">
            Your recent trading activity will appear here.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">Performance Overview</h2>
          <p className="text-sm text-muted-foreground">
            Your trading performance metrics will be displayed here.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">Trading Journal</h2>
          <p className="text-sm text-muted-foreground">
            Quick access to your recent journal entries.
          </p>
        </div>
      </div>
    </div>
  );
}
