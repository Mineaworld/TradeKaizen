"use client";

import { useState } from "react";
import { useStrategies } from "@/contexts/strategy-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Percent, TrendingUp, Timer, BarChart } from "lucide-react"; // Adding missing icon imports

// Sample strategy data
const strategies = [
  {
    name: "Trend Following",
    description:
      "Follow established market trends using moving averages and momentum indicators.",
    winRate: 72,
    avgReturn: 1.8,
    timeframe: "4h-1d",
    type: "Trend",
    metrics: [
      { label: "Win Rate", value: "72%", icon: Percent },
      { label: "Avg Return", value: "1.8%", icon: TrendingUp },
      { label: "Timeframe", value: "4h-1d", icon: Timer },
      { label: "Type", value: "Trend", icon: BarChart },
    ],
  },
  {
    name: "Mean Reversion",
    description:
      "Trade price returns to the statistical mean after periods of extreme movement.",
    winRate: 65,
    avgReturn: 1.5,
    timeframe: "15m-1h",
    type: "Mean Reversion",
    metrics: [
      { label: "Win Rate", value: "65%", icon: Percent },
      { label: "Avg Return", value: "1.5%", icon: TrendingUp },
      { label: "Timeframe", value: "15m-1h", icon: Timer },
      { label: "Type", value: "Mean Reversion", icon: BarChart },
    ],
  },
  {
    name: "Range Trading",
    description:
      "Trade bounces between established support and resistance levels in sideways markets.",
    winRate: 70,
    avgReturn: 1.2,
    timeframe: "1h-4h",
    type: "Range",
    metrics: [
      { label: "Win Rate", value: "70%", icon: Percent },
      { label: "Avg Return", value: "1.2%", icon: TrendingUp },
      { label: "Timeframe", value: "1h-4h", icon: Timer },
      { label: "Type", value: "Range", icon: BarChart },
    ],
  },
  {
    name: "Momentum Trading",
    description:
      "Capture strong price movements with high volume and market sentiment.",
    winRate: 63,
    avgReturn: 2.8,
    timeframe: "5m-30m",
    type: "Momentum",
    metrics: [
      { label: "Win Rate", value: "63%", icon: Percent },
      { label: "Avg Return", value: "2.8%", icon: TrendingUp },
      { label: "Timeframe", value: "5m-30m", icon: Timer },
      { label: "Type", value: "Momentum", icon: BarChart },
    ],
  },
  {
    name: "Swing Trading",
    description:
      "Capture medium-term moves in the market over several days or weeks.",
    winRate: 75,
    avgReturn: 3.2,
    timeframe: "1d-1w",
    type: "Swing",
    metrics: [
      { label: "Win Rate", value: "75%", icon: Percent },
      { label: "Avg Return", value: "3.2%", icon: TrendingUp },
      { label: "Timeframe", value: "1d-1w", icon: Timer },
      { label: "Type", value: "Swing", icon: BarChart },
    ],
  },
];

export default function StrategiesPage() {
  // Use the context strategies if needed
  const { strategies: contextStrategies, isLoading, error } = useStrategies();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newStrategy, setNewStrategy] = useState({ name: "", description: "" });
  const { toast } = useToast();

  // For now, using the mock data above instead of context strategies

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Strategies</h1>
        <Button onClick={() => setShowCreateDialog(true)}>Add Strategy</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy) => (
          <Card
            key={strategy.name}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{strategy.name}</CardTitle>
                <Badge variant="secondary">{strategy.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {strategy.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {Array.isArray(strategy.metrics) &&
                  strategy.metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={metric.label}
                        className="flex items-center space-x-2"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <p className="text-xs text-muted-foreground">
                            {metric.label}
                          </p>
                          <p className="font-medium">{metric.value}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for adding a new strategy */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Strategy</DialogTitle>
            <DialogDescription>
              Create a new trading strategy to categorize your trades.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Strategy name"
                value={newStrategy.name}
                onChange={(e) =>
                  setNewStrategy({ ...newStrategy, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your strategy"
                value={newStrategy.description}
                onChange={(e) =>
                  setNewStrategy({
                    ...newStrategy,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Add your strategy creation logic here
                toast({
                  title: "Strategy Created",
                  description:
                    "Your new strategy has been created successfully.",
                });
                setShowCreateDialog(false);
              }}
            >
              Save Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
