export interface RegistrationTrendItemDto {
  date: string
  count: number
}

export interface RegistrationTrendResponseDto {
  days: RegistrationTrendItemDto[]
}

export interface FlaggedVitalsDistributionItemDto {
  vitalType: string
  count: number
}

export interface FlaggedVitalsDistributionResponseDto {
  items: FlaggedVitalsDistributionItemDto[]
}
