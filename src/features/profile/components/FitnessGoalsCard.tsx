import { Target, Flame } from "lucide-react"
import type { StreakResponseDto } from "@/features/vitals/api/streakApi"

interface Props {
  goals: string[]
  streak: StreakResponseDto
  onAddClick: () => void
}

function TagBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      {label}
    </span>
  )
}

export default function FitnessGoalsCard({ goals, streak, onAddClick }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-green-600" />
          <h3 className="font-semibold">Fitness Goals</h3>
        </div>
        <button onClick={onAddClick} className="text-xs text-green-600 hover:underline">
          + Add Goal
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {goals.length > 0
          ? goals.map((g) => <TagBadge key={g} label={g} />)
          : <p className="text-xs text-muted-foreground">No goals added yet.</p>
        }
      </div>

      {streak.currentStreak > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-orange-500" />
            <div>
              <p className="text-sm font-semibold text-orange-700">{streak.currentStreak} Day Streak!</p>
              <p className="text-xs text-orange-500">Keep going strong.</p>
            </div>
          </div>
          <span className="text-xs font-semibold uppercase text-orange-600">Keep Going</span>
        </div>
      )}
    </div>
  )
}