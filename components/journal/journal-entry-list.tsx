"use client";

import { JournalEntry } from "@/types/supabase";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, ChevronDown, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface JournalEntryListProps {
  entries: JournalEntry[];
  loading: boolean;
  onEdit: (entry: JournalEntry | null) => void;
  onDelete: (id: number) => void;
}

export default function JournalEntryList({
  entries,
  loading,
  onEdit,
  onDelete,
}: JournalEntryListProps) {
  const [sortField, setSortField] = useState<keyof JournalEntry>("trade_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const sortedEntries = [...entries].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleSort = (field: keyof JournalEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-full h-16" />
          ))}
        </div>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="p-8 text-center flex flex-col items-center gap-4">
        <PlusCircle className="w-12 h-12 text-primary mb-2" aria-hidden="true" />
        <h3 className="text-lg font-medium">No journal entries found</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Start by adding your first trade journal entry.
        </p>
        <Button onClick={() => onEdit(null)} variant="default" className="gap-2" aria-label="Add new journal entry">
          <PlusCircle className="w-5 h-5" /> Add Entry
        </Button>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("trade_date")}
              >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("trade_pair")}
              >
                Pair
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Direction</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("entry_price")}
              >
                Entry
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("exit_price")}
              >
                Exit
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("profit_loss")}
              >
                P/L
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Net PnL</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {format(new Date(entry.trade_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{entry.trade_pair}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      entry.trade_direction === "LONG"
                        ? "border-green-500 text-green-500"
                        : entry.trade_direction === "SHORT"
                        ? "border-red-500 text-red-500"
                        : ""
                    }
                  >
                    {entry.trade_direction === "LONG"
                      ? "Long"
                      : entry.trade_direction === "SHORT"
                      ? "Short"
                      : "-"}
                  </Badge>
                </TableCell>
                <TableCell>{entry.entry_price.toFixed(2)}</TableCell>
                <TableCell>{entry.exit_price.toFixed(2)}</TableCell>
                <TableCell
                  className={
                    (entry.net_pnl !== undefined && entry.net_pnl !== null
                      ? entry.net_pnl
                      : entry.profit_loss) > 0
                      ? "text-green-600"
                      : (entry.net_pnl !== undefined && entry.net_pnl !== null
                          ? entry.net_pnl
                          : entry.profit_loss) < 0
                      ? "text-red-600"
                      : ""
                  }
                >
                  {entry.net_pnl !== undefined && entry.net_pnl !== null
                    ? entry.net_pnl.toFixed(2)
                    : entry.profit_loss.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      entry.trade_outcome === "WIN"
                        ? "success"
                        : entry.trade_outcome === "LOSS"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {entry.trade_outcome}
                  </Badge>
                </TableCell>
                <TableCell>{entry.net_pnl !== undefined && entry.net_pnl !== null ? entry.net_pnl.toFixed(2) : "-"}</TableCell>
                <TableCell>{entry.trade_notes || ""}</TableCell>
                <TableCell>{entry.session || ""}</TableCell>
                <TableCell>{entry.account_id || ""}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(entry)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteConfirm(entry.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this journal entry? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirm) {
                  onDelete(deleteConfirm);
                  setDeleteConfirm(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
