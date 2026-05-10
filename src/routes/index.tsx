import { createBrowserRouter, Navigate } from "react-router-dom"

import AppLayout from "@/layouts/AppLayout"
import PublicRoute from "./PublicRoute"

import LoginPage from "@/features/auth/pages/LoginPage"
import RegisterPage from "@/features/auth/pages/RegisterPage"
import ForceResetPasswordPage from "@/features/auth/pages/ForceResetPasswordPage"

import MyVitalsPage from "@/features/vitals/pages/VitalsPage"
import LogVitalsForm from "@/features/vitals/components/LogVitalsForm"
import EditVitalForm from "@/features/vitals/components/EditVitalForm"

import FitnessLogPage from "@/features/fitness/pages/FitnessLogPage"
import LogActivityForm from "@/features/fitness/components/LogActivityForm"
import EditActivityForm from "@/features/fitness/components/EditActivityForm"
import ChangePasswordPage from "@/features/auth/pages/ChangePasswordPage"
import ProfilePage from "@/features/profile/pages/ProfilePage"

import MembersPage from "@/pages/MembersPage"
import FlaggedMembersPage from "@/features/shared/pages/FlaggedMembersPage"

import AdminDashboardPage from "@/features/shared/pages/AdminDashboardPage"
import MemberDashboardPage from "@/features/member/pages/MemberDashboardPage"
import StaffManagementPage from "@/features/admin/pages/StaffManagementPage"
import CreateStaffPage from "@/features/admin/pages/CreateStaffPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
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
    path: "change-password",
    element: <ChangePasswordPage />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard/member",
        element: <MemberDashboardPage />,
      },

      {
        path: "/my-vitals",
        element: <MyVitalsPage />,
      },

      {
        path: "/my-vitals/log",
        element: <LogVitalsForm />,
      },

      {
        path: "/my-vitals/edit/:id",
        element: <EditVitalForm />,
      },

      {
        path: "/fitness-log",
        element: <FitnessLogPage />,
      },

      {
        path: "/fitness-log/log",
        element: <LogActivityForm />,
      },

      {
        path: "/fitness-log/edit/:id",
        element: <EditActivityForm />,
      },

      {
        path: "/members",
        element: <MembersPage />,
      },

      {
        path: "/flagged-members",
        element: <FlaggedMembersPage />,
      },

      {
        path: "/staff",
        children: [
          {
            path: "dashboard",
            element: <AdminDashboardPage />,
          },
        ],
      },

      {
        path: "/admin",
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
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
])
