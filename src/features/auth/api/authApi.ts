import API from "@/api/axios"

import type {
  LoginRequestDto,
  RegisterRequestDto,
  ForceResetPasswordRequestDto,
  CreateStaffRequestDto,
} from "../types/auth.types"

export const loginApi = (data: LoginRequestDto) => {
  return API.post("/auth/login", data)
}

export const registerApi = (data: RegisterRequestDto) => {
  return API.post("/auth/register", data)
}
export const forceResetPasswordApi = (data: ForceResetPasswordRequestDto) => {
  return API.patch("/auth/force-reset-password", data)
}
export const createStaffApi = (data: CreateStaffRequestDto) => {
  return API.post("/admin/staff", data)
}

export const changePasswordApi = (data: {
  currentPassword: string
  newPassword: string
}) => API.patch("/auth/change-password", data)
