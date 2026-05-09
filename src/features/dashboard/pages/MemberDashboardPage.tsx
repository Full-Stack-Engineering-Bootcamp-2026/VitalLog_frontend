import { useEffect, useState } from "react"
import { toast } from "sonner"
import { fetchLatestVitalsApi, fetchRecentFitnessApi } from "../api/dashboardApi"
import { fetchStreakApi } from "@/features/vitals/api/streakApi"
import type { VitalResponseDto } from "@/features/vitals/types/vital.types"
import type { FitnessLogResponseDto } from "@/features/fitness/types/fitness.types"
import type { StreakResponseDto } from "@/features/vitals/api/streakApi"
import GreetingHeader from "../components/GreetingHeader"
import AlertBanners from "../components/AlertBanners"
import VitalStatCards from "../components/VitalStatCards"
import VitalsTrendChart from "../components/VitalsTrendChart"
import RecentFitness from "../components/RecentFitness"

export default function MemberDashboardPage() {
  const [vitals, setVitals] = useState<VitalResponseDto[]>([])
  const [recentFitness, setRecentFitness] = useState<FitnessLogResponseDto[]>([])
  const [streak, setStreak] = useState<StreakResponseDto>({
    currentStreak: 0,
    longestStreak: 0,
    lastLoggedDate: null,
  })

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [vitalsData, fitnessData, streakData] = await Promise.all([
          fetchLatestVitalsApi(),
          fetchRecentFitnessApi(),
          fetchStreakApi(),
        ])
        setVitals(vitalsData)
        setRecentFitness(fitnessData)
        setStreak(streakData)
      } catch {
        toast.error("Failed to load dashboard.", { duration: 3000 })
      }
    }
    loadDashboard()
  }, [])

  return (
    <div className="space-y-4">
      <GreetingHeader />
      <AlertBanners streak={streak} />
      <VitalStatCards vitals={vitals} />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <VitalsTrendChart />
        </div>
        <RecentFitness logs={recentFitness} />
      </div>
    </div>
  )
}