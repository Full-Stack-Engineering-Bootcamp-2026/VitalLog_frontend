import { createBrowserRouter } from "react-router-dom"

import AppLayout from "@/layouts/AppLayout"

import MyVitalsPage from "@/features/vitals/pages/VitalsPage"
import FitnessLogPage from "@/features/fitness/pages/FitnessLogPage"
import MembersPage from "@/pages/MembersPage"
import FlaggedMembersPage from "@/features/members/pages/FlaggedMembers"
import StaffPage from "@/features/staff/StaffPage"
import LoginPage from "@/features/auth/pages/LoginPage"
import RegisterPage from "@/features/auth/pages/RegisterPage"
import ForceResetPasswordPage from "@/features/auth/pages/ForceResetPasswordPage"
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage"
import MemberDashboardPage from "@/features/members/pages/MemberDashboardPage"
import StaffManagementPage from "@/features/admin/pages/StaffManagementPage"
import CreateStaffPage from "@/features/admin/pages/CreateStaffPage"
export const router = createBrowserRouter([
  {
    path: "/login",

    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/force-reset-password",
    element: <ForceResetPasswordPage />,
  },
  {
    path: "/",
    element: <AppLayout />,

    children: [
      {
        path: "dashboard/admin",
        element: <AdminDashboardPage />,
      },

      {
        path: "dashboard/member",
        element: <MemberDashboardPage />,
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
      {
        path: "admin",
        children: [
          {
            path: "dashboard",
            element: <AdminDashboardPage />,
          },

          {
            path: "manage-staff",
            element: <StaffManagementPage />,
          },

          {
            path: "add-staff",
            element: <CreateStaffPage />,
          },
        ],
      },
    ],
  },
])
