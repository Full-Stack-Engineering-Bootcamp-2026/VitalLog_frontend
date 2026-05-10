import {
  Activity,
  HeartPulse,
  Home,
  ShieldAlert,
  UserCog,
  Users,
  UserCircle,
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
      path: "/",
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
    {
      title: "My Profile",
      path: "/profile",
      icon: UserCircle,
    },
  ],

  STAFF: [
    {
      title: "Dashboard",
      path: "/",
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
      path: "/",
      icon: Home,
    },
    {
      title: "Members",
      path: "/members",
      icon: Users,
    },
    {
      title: "Staff",
      path: "/staff",
      icon: UserCog,
    },
  ],
}
