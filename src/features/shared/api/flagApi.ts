import API from "@/api/axios"

import type {
  GetFlagsRequestDto,
  ResolveFlagRequestDto,
} from "../types/flag.types"

export const getFlagsApi = (params: GetFlagsRequestDto) => {
  return API.get("/flag", { params })
}

export const resolveFlagApi = (flagId: number, data: ResolveFlagRequestDto) => {
  return API.patch(`/flag/${flagId}/resolve`, data)
}
