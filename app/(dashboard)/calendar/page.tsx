"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - replace with actual data from your backend
const mockTradeData = {
  "2024-04-01": { profit: 250 },
  "2024-04-02": { profit: -150 },
  "2024-04-05": { profit: 480 },
  "2024-04-08": { profit: -320 },
  "2024-04-15": { profit: 890 },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf("month").day();
  const lastDayOfMonth = currentDate.endOf("month").day();

  const previousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const nextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const getDayProfit = (day: number) => {
    const dateStr = currentDate.date(day).format("YYYY-MM-DD");
    return mockTradeData[dateStr as keyof typeof mockTradeData]?.profit || null;
  };

  const monthlyTotal = Object.values(mockTradeData).reduce(
    (sum, day) => sum + day.profit,
    0
  );

  const renderDayCell = (day: number) => {
    const profit = getDayProfit(day);
    const dateStr = currentDate.date(day).format("YYYY-MM-DD");

    return (
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={`
              min-h-[100px] p-2 border rounded-lg cursor-pointer
              transition-colors hover:bg-accent
              ${
                profit !== null && profit > 0
                  ? "bg-green-50 dark:bg-green-950/30"
                  : ""
              }
              ${
                profit !== null && profit < 0
                  ? "bg-red-50 dark:bg-red-950/30"
                  : ""
              }
            `}
          >
            <div className="font-medium">{day}</div>
            {profit !== null && (
              <div
                className={`
                mt-2 font-semibold
                ${profit > 0 ? "text-green-600 dark:text-green-400" : ""}
                ${profit < 0 ? "text-red-600 dark:text-red-400" : ""}
              `}
              >
                {profit > 0 ? "+" : ""}
                {profit.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Trades for {currentDate.date(day).format("MMMM D, YYYY")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {profit !== null ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Daily Summary</div>
                    <div className="text-sm text-muted-foreground">
                      3 trades
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      profit > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {profit > 0 ? "+" : ""}
                    {profit.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Click to add new trades for this day
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No trades recorded for this day
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financial Calendar</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {currentDate.format("MMMM YYYY")}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 text-center font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div
            key={`empty-start-${index}`}
            className="min-h-[100px] p-2 border rounded-lg bg-muted/20"
          />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => (
          <div key={`day-${index + 1}`}>{renderDayCell(index + 1)}</div>
        ))}

        {Array.from({ length: 6 - lastDayOfMonth }).map((_, index) => (
          <div
            key={`empty-end-${index}`}
            className="min-h-[100px] p-2 border rounded-lg bg-muted/20"
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">
                Total Profit/Loss
              </div>
              <div
                className={`text-2xl font-bold ${
                  monthlyTotal >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {monthlyTotal >= 0 ? "+" : ""}
                {monthlyTotal.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Trading Days</div>
              <div className="text-2xl font-bold">
                {Object.keys(mockTradeData).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
