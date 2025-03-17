"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Journal</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Your trading journal entries will appear here
          </div>
        </CardContent>
      </Card>
    </div>
  )
}