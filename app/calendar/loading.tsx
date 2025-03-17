export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-muted rounded" />
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 bg-muted rounded" />
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded" />
        ))}
      </div>

      <div className="h-32 bg-muted rounded" />
    </div>
  )
}