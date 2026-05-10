import { AlertTriangle, Flame, HeartPulse, User } from "lucide-react"

import DashboardStatCard from "./DashboardStatCard"

import type { StaffMemberDashboardResponseDto } from "../types/staff.types"

type Props = {
  data: StaffMemberDashboardResponseDto
}

export default function MemberDashboardStats({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <DashboardStatCard
        title="Age"
        value={data.profile?.age || "-"}
        icon={User}
      />

      <DashboardStatCard
        title="Weight"
        value={data.profile?.weight ? `${data.profile.weight} kg` : "-"}
        icon={HeartPulse}
      />

      <DashboardStatCard
        title="Current Streak"
        value={`${data.streak.currentStreak} days`}
        icon={Flame}
      />

      <DashboardStatCard
        title="Active Flags"
        value={data.activeFlags.length}
        icon={AlertTriangle}
        danger
      />
    </div>
  )
}
