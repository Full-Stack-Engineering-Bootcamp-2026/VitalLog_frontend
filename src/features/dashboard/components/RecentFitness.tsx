import { useNavigate } from "react-router-dom"
import { Activity } from "lucide-react"
import type { FitnessLogResponseDto } from "@/features/fitness/types/fitness.types"

interface Props {
  logs: FitnessLogResponseDto[]
}

const activityColors: Record<string, string> = {
  Running: "bg-green-100 text-green-600",
  Cycling: "bg-blue-100 text-blue-600",
  Yoga: "bg-purple-100 text-purple-600",
  Strength: "bg-orange-100 text-orange-600",
  Swim: "bg-cyan-100 text-cyan-600",
  Walking: "bg-teal-100 text-teal-600",
}

export default function RecentFitness({ logs }: Props) {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Recent Fitness</p>
        <button
          onClick={() => navigate("/fitness-log")}
          className="text-xs font-medium text-green-600 hover:text-green-700 transition-colors">
          View All
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">
          No recent activity.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activityColors[log.activityType] ?? "bg-gray-100 text-gray-500"}`}>
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{log.activityType}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {log.duration} min
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{log.caloriesBurned}</p>
                <p className="text-xs text-gray-400">KCAL</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}