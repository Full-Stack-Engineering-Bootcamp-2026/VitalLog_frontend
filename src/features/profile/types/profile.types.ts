export interface ProfileResponseDto {
  id: number
  name: string
  email: string
  age: number | null
  gender: "MALE" | "FEMALE" | "OTHER" | null
  height: number | null
  weight: number | null
  medicalConditions: string | null
  fitnessGoal: string | null
  profileImageUrl: string | null
}

export interface UpdateProfileRequestDto {
  age?: number
  gender?: "MALE" | "FEMALE" | "OTHER"
  height?: number
  weight?: number
  medicalConditions?: string
  fitnessGoal?: string
}