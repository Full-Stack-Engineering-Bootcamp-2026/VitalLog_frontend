import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

type Props = {
  title: string
  value: string | number
  icon: LucideIcon
  danger?: boolean
}

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  danger = false,
}: Props) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <Icon className={danger ? "text-red-600" : "text-primary"} />

        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}
