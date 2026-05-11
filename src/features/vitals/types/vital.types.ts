export type VitalType =
  | "HEART_RATE"
  | "BLOOD_PRESSURE"
  | "BLOOD_GLUCOSE"
  | "WEIGHT"
  | "SLEEP"

export type RangeStatus = "NORMAL" | "WARNING" | "CRITICAL"

export interface VitalResponseDto {
  id: number
  vitalType: VitalType
  value?: number
  systolicValue?: number
  diastolicValue?: number
  unit?: string
  status: RangeStatus
  loggedDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateVitalDto {
  vitalType: VitalType
  value?: number
  systolicValue?: number
  diastolicValue?: number
  loggedDate: string
}

export interface VitalFilters {
  vitalType?: VitalType
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface PaginatedVitalsResponse {
  data: VitalResponseDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface VitalsState {
  vitals: VitalResponseDto[]
  total: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null
  filters: VitalFilters
}
