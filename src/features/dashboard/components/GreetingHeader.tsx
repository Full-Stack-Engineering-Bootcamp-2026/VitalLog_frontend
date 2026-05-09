import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus, Activity } from "lucide-react"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function GreetingHeader() {
  const user = useSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()
  const firstName = user?.name?.split(" ")[0] ?? "there"

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Your health journey is looking strong today. Here's your summary.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => navigate("/my-vitals/log")}
          className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Log Vitals
        </Button>
        <Button
          onClick={() => navigate("/fitness-log/log")}
          variant="outline"
          className="border-gray-200">
          <Activity className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </div>
    </div>
  )
}