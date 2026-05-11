export interface FitnessLogResponseDto {
  id: number
  activityType: string
  duration: number
  caloriesBurned: number
  date: string
  notes?: string
  createdAt: string
}

export interface CreateFitnessLogDto {
  activityType: string
  duration: number
  caloriesBurned: number
  date: string
  notes?: string
}

export interface UpdateFitnessLogDto {
  activityType?: string
  duration?: number
  caloriesBurned?: number
  date?: string
  notes?: string
}

export interface FitnessFilters {
  activityType?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface PaginatedFitnessResponse {
  data: FitnessLogResponseDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
