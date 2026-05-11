import { Flame, AlertTriangle } from "lucide-react"
import type { StreakResponseDto } from "@/features/vitals/api/streakApi"

interface Props {
  streak: StreakResponseDto
}

export default function AlertBanners({ streak }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Streak banner */}
      <div className="flex items-start gap-3 rounded-xl bg-orange-50 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
          <Flame className="h-4 w-4 text-orange-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-orange-700">
            {streak.currentStreak}-day logging streak!
          </p>
          <p className="text-xs text-orange-500">You're on fire! Keep logging to reach your monthly goal.</p>
        </div>
      </div>

      {/* Action required banner */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-700">Action Required</p>
          <p className="text-xs text-amber-500">Stay consistent with your daily logging goals.</p>
        </div>
      </div>
    </div>
  )
}