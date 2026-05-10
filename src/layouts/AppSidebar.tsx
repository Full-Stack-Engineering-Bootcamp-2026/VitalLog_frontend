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

import { NavLink, useNavigate } from "react-router-dom"
import { HeartPulse, LogOut } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/app/store"
import { logout } from "@/features/auth/authSlice"
import { sidebarItems } from "./sidebarItems"

export function AppSidebar() {
  const role = useSelector((state: RootState) => state.auth.user?.role)
  const menuItems = role ? sidebarItems[role] : []
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { state, setOpenMobile } = useSidebar()
  const isCollapsed = state === "collapsed"

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      {/* Logo */}
      <SidebarHeader className="border-b border-gray-100 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500">
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm leading-tight font-bold text-gray-900">
                VitalLog
              </span>
              <span className="text-xs leading-tight text-gray-400">
                Active Calm Dashboard
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      {/* Nav items */}
      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setOpenMobile(false)}>
                  {({ isActive }) => (
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className={`w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors  ${
                        isActive
                          ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                          : "text-gray-500 hover:bg-green-50 hover:text-green-700"
                      }`}>
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-green-600" : "text-gray-500"
                        }`}/>
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="space-y-1 border-t border-gray-200 px-2 py-4">
        <SidebarMenu className="space-y-1 pt-1">
          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <LogOut className="h-4 w-4 shrink-0 text-gray-500" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
