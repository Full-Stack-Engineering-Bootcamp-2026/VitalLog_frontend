import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import AdminDashboardStatCard from "../components/admin-dashboard/AdminDashboardStatCard"
import RegistrationTrendChart from "../components/admin-dashboard/RegistrationTrendChart"
import FlaggedVitalsDistribution from "../components/admin-dashboard/FlaggedVitalsDistribution"
import AdminQuickActions from "../components/admin-dashboard/QuickActions"

import {
  getFlaggedVitalsDistributionApi,
  getRegistrationTrendApi,
} from "@/features/shared/api/dashboardApi"

import type {
  FlaggedVitalsDistributionItemDto,
  RegistrationTrendItemDto,
} from "@/features/shared/types/dashboard.types"

export default function AdminDashboardPage() {
  const [registrations, setRegistrations] = useState<
    RegistrationTrendItemDto[]
  >([])

  const [flaggedVitals, setFlaggedVitals] = useState<
    FlaggedVitalsDistributionItemDto[]
  >([])

  const [loading, setLoading] = useState(false)

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const [registrationRes, flaggedRes] = await Promise.all([
        getRegistrationTrendApi(),
        getFlaggedVitalsDistributionApi(),
      ])

      setRegistrations(registrationRes.data.data.days)
      setFlaggedVitals(flaggedRes.data.data.items)
    } catch (error) {
      console.error("Failed to load dashboard", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  return (
    <div className="min-h-screen bg-[#f3faf5] p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Platform Overview
            </h1>
            <p className="text-sm text-gray-500">
              Real-time health administration and member logistics.
            </p>
          </div>

          <Button onClick={loadDashboard} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {loading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminDashboardStatCard
            label="Total Members"
            value="12,482"
            subtext="+12% this month"
            color="green"
          />

          <AdminDashboardStatCard
            label="Active This Week"
            value="10,210"
            subtext="84% activity rate"
            color="blue"
          />

          <AdminDashboardStatCard
            label="Total Staff"
            value="342"
            subtext="Steady"
            color="green"
          />

          <AdminDashboardStatCard
            label="Flagged Profiles"
            value="24"
            subtext="High priority"
            color="red"
          />

          <AdminDashboardStatCard
            label="Most Logged Vital"
            value="Pulse"
            subtext="Highest activity"
            color="amber"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <RegistrationTrendChart data={registrations} />
          <AdminQuickActions />
        </div>

        <FlaggedVitalsDistribution data={flaggedVitals} />
      </div>
    </div>
  )
}
