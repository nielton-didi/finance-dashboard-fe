export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="flex h-24 items-center justify-center rounded-xl bg-muted/50"
        >
          <p className="text-sm text-muted-foreground">Section {i + 1}</p>
        </div>
      ))}
    </div>
  )
}
