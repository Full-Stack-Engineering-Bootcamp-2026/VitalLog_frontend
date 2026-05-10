import API from "@/api/axios"

export const getStaffMembersApi = (params: {
  page: number
  limit: number
  search?: string
}) => {
  return API.get("/staff/members", { params })
}
