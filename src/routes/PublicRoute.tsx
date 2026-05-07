import { Navigate } from "react-router-dom"

import { useSelector } from "react-redux"

import type { RootState } from "@/app/store"

interface Props {
  children: React.ReactNode
}

export default function PublicRoute({ children }: Props) {
  const token = useSelector((state: RootState) => state.auth.token)

  if (token) {
    return <Navigate to="/" replace />
  }

  return children
}
