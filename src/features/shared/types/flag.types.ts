export type FlagSeverityType = "LOW" | "MEDIUM" | "HIGH"

export type FlagSourceType = "SYSTEM" | "MANUAL"

export type FlagStatusType = "OPEN" | "RESOLVED"

export type RoleType = "MEMBER" | "STAFF" | "ADMIN"

export interface FlagUserResponseDto {
  id: number
  name: string
  email: string
  role?: RoleType
}

export interface FlagVitalResponseDto {
  id: number
  vitalType: string
  value?: number | null
  systolicValue?: number | null
  diastolicValue?: number | null
  unit?: string | null
  status: string
  loggedDate: string
}

export interface CreateManualFlagRequestDto {
  userId: number
  sourceVitalId?: number
  reason: string
  category?: string
  severity: FlagSeverityType
}

export interface CreateFlagResponseDto {
  id: number
  source: FlagSourceType
  reason: string
  category?: string | null
  severity: FlagSeverityType
  status: FlagStatusType
  resolutionNote?: string | null
  resolvedAt?: string | null
  createdAt: string

  user: FlagUserResponseDto
  sourceVital?: FlagVitalResponseDto | null
}

export interface ResolveFlagRequestDto {
  resolutionNote: string
}

export interface ResolveFlagResponseDto {
  id: number
  status: FlagStatusType
  resolutionNote: string
  resolvedAt: string

  resolvedBy: FlagUserResponseDto
}

export interface GetFlagsRequestDto {
  page: number
  limit: number
  status?: FlagStatusType
  search?: string
}

export interface FlagListItemResponseDto {
  id: number
  source: FlagSourceType
  reason: string
  category?: string | null
  severity: FlagSeverityType
  status: FlagStatusType
  createdAt: string
  resolvedAt?: string | null

  user: {
    id: number
    name: string
    email: string
  }

  resolvedBy?: {
    id: number
    name: string
    email: string
  } | null
}

export interface GetFlagsResponseDto {
  flags: FlagListItemResponseDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
