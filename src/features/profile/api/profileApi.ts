import API from "@/api/axios"
import type { ProfileResponseDto, UpdateProfileRequestDto } from "../types/profile.types"

export const fetchProfileApi = async (): Promise<ProfileResponseDto> => {
  const res = await API.get("/profile")
  return res.data.data
}

export const updateProfileApi = async (data: UpdateProfileRequestDto): Promise<ProfileResponseDto> => {
  const res = await API.patch("/profile", data)
  return res.data.data
}

export const uploadProfileImageApi = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("image", file)
  const res = await API.post("/profile/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data.data.profileImageUrl
}