import API from "@/api/axios"

export const getStaffMembersApi = (params: {
  page: number
  limit: number
  search?: string
}) => {
  return API.get("/staff/members", { params })
}
export const getStaffMemberDashboardApi = (
  memberId: number,
  params: { page: number; limit: number }
) => {
  return API.get(`/staff/members/${memberId}/dashboard`, { params })
}

export const getRegistrationTrendApi = () => {
  return API.get("/admin/dashboard/registrations")
}

export const getFlaggedVitalsDistributionApi = () => {
  return API.get("/admin/dashboard/flagged-vitals")
}
