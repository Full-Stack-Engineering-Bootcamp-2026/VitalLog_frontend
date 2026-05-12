import { Users, UserCheck, Clock3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { StaffResponseDto } from "@/features/auth/types/auth.types"

interface Props {
  staff: StaffResponseDto[] //full staff array is received from api

  loading: boolean
}

//each card's shape
interface StatCardData {
  label: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
}

export default function StaffStatCards({ staff, loading }: Props) {
  const total = staff.length
  const active = staff.filter((s) => s.isActive).length
  const pending = staff.filter((s) => s.mustChangePassword).length

  const cards: StatCardData[] = [
    {
      label: "Total Staff",
      value: loading ? "-" : total,
      icon: <Users size={18} />,
      iconBg: "bg-green-100 text-green-700",
    },
    {
      label: "Active Now",
      value: loading ? "-" : active,
      icon: <UserCheck size={18} />,
      iconBg: "bg-blue-100 text-blue-700",
    },
    {
      label: "Pending Invites",
      value: loading ? "-" : pending,
      icon: <Clock3 size={18} />,
      iconBg: "bg-orange-100 text-orange-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-full p-3 ${card.iconBg}`}>{card.icon}</div>
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <h2 className="text-2xl font-bold">{card.value}</h2>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
