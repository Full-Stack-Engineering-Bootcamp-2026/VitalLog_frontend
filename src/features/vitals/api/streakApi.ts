import API from "@/api/axios"

export interface StreakResponseDto {
  currentStreak: number
  longestStreak: number
  lastLoggedDate: string | null
}

export const fetchStreakApi = async (): Promise<StreakResponseDto> => {
  const response = await API.get("/streak")
  return response.data.data
}