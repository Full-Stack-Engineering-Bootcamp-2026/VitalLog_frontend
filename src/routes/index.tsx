import { createBrowserRouter } from "react-router-dom"

import AppLayout from "@/layouts/AppLayout"

import DashboardPage from "@/features/dashboard/pages/DashboardPage"
import MyVitalsPage from "@/features/vitals/pages/MyVitalsPage"
import FitnessLogPage from "@/pages/FitnessLogPage"
import MembersPage from "@/pages/MembersPage"
import FlaggedMembersPage from "@/pages/FlaggedMembersPage"
import StaffPage from "@/pages/StaffPage"

export const router = createBrowserRouter([
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
