import API from "@/api/axios"
import type {
  RegistrationTrendResponseDto,
  FlaggedVitalsDistributionResponseDto,
} from "../types/dashboard.types"
export const getRegistrationTrendApi = () => {
  return API.get<{
    data: RegistrationTrendResponseDto
  }>("/admin/dashboard/registrations")
}

export const getFlaggedVitalsDistributionApi = () => {
  return API.get<{
    data: FlaggedVitalsDistributionResponseDto
  }>("/admin/dashboard/flagged-vitals")
}
