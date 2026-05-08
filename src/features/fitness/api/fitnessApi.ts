import API from "@/api/axios"
import type {
  CreateFitnessLogDto,
  UpdateFitnessLogDto,
  FitnessFilters,
  PaginatedFitnessResponse,
  FitnessLogResponseDto,
} from "../types/fitness.types"

export const fetchFitnessLogsApi = async (
  filters: FitnessFilters
): Promise<PaginatedFitnessResponse> => {
  const response = await API.get("/fitness", { params: filters })
  return response.data.data
}

export const createFitnessLogApi = async (
  data: CreateFitnessLogDto
): Promise<FitnessLogResponseDto> => {
  const response = await API.post("/fitness", data)
  return response.data.data
}

export const updateFitnessLogApi = async (
  id: number,
  data: UpdateFitnessLogDto
): Promise<FitnessLogResponseDto> => {
  const response = await API.patch(`/fitness/${id}`, data)
  return response.data.data
}

export const deleteFitnessLogApi = async (id: number): Promise<void> => {
  await API.delete(`/fitness/${id}`)
}
