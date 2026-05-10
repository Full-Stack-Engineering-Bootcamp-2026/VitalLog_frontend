import type { LucideIcon } from "lucide-react"

type Props = {
  title: string
  value: string | number
  icon: LucideIcon
}

export default function FlagStatCard({ title, value, icon: Icon }: Props) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Icon size={18} />
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        </div>
      </div>
    </div>
  )
}
