import { createBrowserRouter } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
// import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRoute"
import LoginPage from "@/features/auth/pages/LoginPage"
import DashboardPage from "@/features/dashboard/pages/MemberDashboardPage"
import MyVitalsPage from "@/features/vitals/pages/VitalsPage"
import LogVitalsForm from "@/features/vitals/components/LogVitalsForm"
import FitnessLogPage from "@/features/fitness/pages/FitnessLogPage"
import MembersPage from "@/pages/MembersPage"
import FlaggedMembersPage from "@/features/members/pages/FlaggedMembers"
import StaffPage from "@/features/staff/StaffPage"
// import LoginPage from "@/features/auth/pages/LoginPage"
import RegisterPage from "@/features/auth/pages/RegisterPage"
import ForceResetPasswordPage from "@/features/auth/pages/ForceResetPasswordPage"
export const router = createBrowserRouter([
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
        path: "my-vitals/log",
        element: <LogVitalsForm />,
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
