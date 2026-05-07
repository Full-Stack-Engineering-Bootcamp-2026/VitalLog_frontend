"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { NavLink } from "react-router-dom"

import { HeartPulse, LogOut } from "lucide-react"

import { sidebarItems } from "./sidebarItems"

export function AppSidebar() {
  // temporary hardcoded role
  const role = "MEMBER"

  const menuItems = sidebarItems[role]

  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b">
        <div className="flex h-full items-center gap-3 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>

          <span
            className={`text-lg font-semibold transition-all duration-200 ${
              state === "collapsed"
                ? "w-0 overflow-hidden opacity-0"
                : "opacity-100"
            }`}
          >
            VitalLog
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.path} end={item.path === "/"}>
                    <Icon className="h-4 w-4" />

                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut className="h-4 w-4" />

              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
