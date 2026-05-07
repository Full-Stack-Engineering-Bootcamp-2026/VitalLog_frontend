"use client"

import { Bell, Settings } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-5">
        <button className="text-muted-foreground transition hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>

        <button className="text-muted-foreground transition hover:text-foreground">
          <Settings className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium">Bhargavi Thorat</p>

            <p className="text-xs text-muted-foreground">Member</p>
          </div>

          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
