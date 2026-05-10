export interface StaffMemberListItemDto {
  id: number
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string

  profile?: {
    age?: number | null
    gender?: string | null
    height?: number | null
    weight?: number | null
    profileImageUrl?: string | null
  } | null
}

export interface GetStaffMembersResponseDto {
  members: StaffMemberListItemDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
