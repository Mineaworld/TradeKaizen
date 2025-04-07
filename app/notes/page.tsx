"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Note Creation Section */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Note</CardTitle>
            <CardDescription>Add a new trading note or insight</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="Note title..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forex">Forex</SelectItem>
                    <SelectItem value="commodities">Commodities</SelectItem>
                    <SelectItem value="indices">Indices</SelectItem>
                    <SelectItem value="ict">ICT Concepts</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="psychology">
                      Trading Psychology
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Write your trading notes here..."
                  className="min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input placeholder="Add tags (comma separated)" />
              </div>

              <Button className="w-full">Save Note</Button>
            </form>
          </CardContent>
        </Card>

        {/* Notes List Section */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your Notes</CardTitle>
            <CardDescription>Recent trading notes and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input placeholder="Search notes..." />
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {/* Example Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      ICT Order Block Strategy
                    </CardTitle>
                    <CardDescription>Category: ICT Concepts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Key points about identifying and trading order blocks in
                      the market structure...
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                        order-blocks
                      </span>
                      <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                        ict
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Gold Trading Setup
                    </CardTitle>
                    <CardDescription>Category: Commodities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Analysis of gold price action during London session...
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                        gold
                      </span>
                      <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                        london-session
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">US30 Price Action</CardTitle>
                    <CardDescription>Category: Indices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Key levels and market structure analysis for Dow Jones...
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                        us30
                      </span>
                      <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                        indices
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
