import {
  Activity,
  HeartPulse,
  Home,
  ShieldAlert,
  UserCog,
  Users,
} from "lucide-react"

import type { LucideIcon } from "lucide-react"

export interface SidebarItem {
  title: string
  path: string
  icon: LucideIcon
}

export const sidebarItems = {
  MEMBER: [
    {
      title: "Overview",
      path: "/dashboard/member",
      icon: Home,
    },
    {
      title: "My Vitals",
      path: "/my-vitals",
      icon: HeartPulse,
    },
    {
      title: "Fitness Log",
      path: "/fitness-log",
      icon: Activity,
    },
  ],

  STAFF: [
    {
      title: "Dashboard",
      path: "/dashboard/staff",
      icon: Home,
    },
    {
      title: "Members",
      path: "/members",
      icon: Users,
    },
    {
      title: "Flagged Members",
      path: "/flagged-members",
      icon: ShieldAlert,
    },
  ],

  ADMIN: [
    {
      title: "Dashboard",
      path: "/dashboard/admin",
      icon: Home,
    },
    {
      title: "Members",
      path: "/members",
      icon: Users,
    },
    {
      title: "Staff Management",
      path: "/admin/manage-staff",
      icon: UserCog,
    },
  ],
}
