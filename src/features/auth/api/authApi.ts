import API from "@/api/axios"

import type { LoginRequestDto, RegisterRequestDto } from "../types/auth.types"

export const loginApi = (data: LoginRequestDto) => {
  return API.post("/auth/login", data)
}

export const registerApi = (data: RegisterRequestDto) => {
  return API.post("/auth/register", data)
}
