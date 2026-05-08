import { createBrowserRouter } from "react-router-dom"

import AppLayout from "@/layouts/AppLayout"

import DashboardPage from "@/features/dashboard/pages/MemberDashboardPage"
import MyVitalsPage from "@/features/vitals/pages/MyVitalsPage"
import FitnessLogPage from "@/features/fitness/pages/FitnessLogPage"
import MembersPage from "@/pages/MembersPage"
import FlaggedMembersPage from "@/features/members/pages/FlaggedMembers"
import StaffPage from "@/features/staff/StaffPage"
import LoginPage from "@/features/auth/pages/LoginPage"
export const router = createBrowserRouter([
  {
    path: "/login",

    element: <LoginPage />,
  },
  {
    path: "/",
    element: <AppLayout />,

    children: [
      {
        index: true,
        element: <DashboardPage />,
      },

      {
        path: "my-vitals",
        element: <MyVitalsPage />,
      },

      {
        path: "fitness-log",
        element: <FitnessLogPage />,
      },

      {
        path: "members",
        element: <MembersPage />,
      },

      {
        path: "flagged-members",
        element: <FlaggedMembersPage />,
      },

      {
        path: "staff",
        element: <StaffPage />,
      },
    ],
  },
])
