"use client"

import { Outlet } from "react-router-dom"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar } from "./AppSidebar"
import { Navbar } from "./Navbar"

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex min-h-screen flex-col bg-[#cad1cd]">
        <Navbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
