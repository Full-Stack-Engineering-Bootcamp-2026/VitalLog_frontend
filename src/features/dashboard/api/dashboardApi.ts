import API from "@/api/axios"
import type { VitalResponseDto, PaginatedVitalsResponse } from "@/features/vitals/types/vital.types"
import type { FitnessLogResponseDto } from "@/features/fitness/types/fitness.types"
import type { StreakResponseDto } from "@/features/vitals/api/streakApi"
export interface DashboardSummary {
  latestVitals: VitalResponseDto[]
  recentFitness: FitnessLogResponseDto[]
  streak: StreakResponseDto
}

export const fetchLatestVitalsApi = async (): Promise<VitalResponseDto[]> => {
  const response = await API.get("/vitals", { params: { page: 1, limit: 10 } })
  const data: PaginatedVitalsResponse = response.data.data
  return data.data
}

export const fetchRecentFitnessApi = async (): Promise<FitnessLogResponseDto[]> => {
  const response = await API.get("/fitness", { params: { page: 1, limit: 3 } })
  return response.data.data.data
}
export const fetchVitalsTrendApi = async (from: string, to: string): Promise<VitalResponseDto[]> => {
  const response = await API.get("/vitals", { params: { from, to, page: 1, limit: 100 } })
  const data: PaginatedVitalsResponse = response.data.data
  return data.data
}