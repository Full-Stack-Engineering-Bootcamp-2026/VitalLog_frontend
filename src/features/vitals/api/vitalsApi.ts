import API from "@/api/axios"
import type {
  CreateVitalDto,
  VitalFilters,
  PaginatedVitalsResponse,
  VitalResponseDto,
} from "../types/vital.types"

export const fetchVitalsApi = async (
  filters: VitalFilters,
): Promise<PaginatedVitalsResponse> => {
  const response = await API.get("/vitals", { params: filters })
  return response.data.data
}

export const createVitalApi = async (
  data: CreateVitalDto,
): Promise<VitalResponseDto> => {
  const response = await API.post("/vitals", data)
  return response.data.data
}

export const updateVitalApi = async (
  id: number,
  data: Partial<CreateVitalDto>,
): Promise<VitalResponseDto> => {
  const response = await API.patch(`/vitals/${id}`, data)
  return response.data.data
}

export const deleteVitalApi = async (id: number): Promise<void> => {
  await API.delete(`/vitals/${id}`)
}