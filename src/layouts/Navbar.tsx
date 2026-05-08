"use client"

import { Bell, Clock, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"

export function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">

      {/* Left — sidebar trigger */}
      <div className="flex items-center">
        <SidebarTrigger className="text-gray-500 hover:text-gray-900 cursor-pointer" />
      </div>

      {/* Center — search bar */}
      <div className="flex flex-1 items-center justify-end px-6">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search data..."
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
          />
        </div>
      </div>

      {/* Right — icons + user */}
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-700 transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        <button className="text-gray-400 hover:text-gray-700 transition-colors">
          <Clock className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
          />
        </div>
      </div>

    </header>
  )
}