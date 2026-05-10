import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "sonner"

import type { RootState } from "@/app/store"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { getStaffMemberDashboardApi } from "../api/staffApi"
import MemberDashboardStats from "../components/MemberDashboardStats"

import type { StaffMemberDashboardResponseDto } from "../types/staff.types"

export default function StaffMemberDashboardPage() {
  const { id } = useParams()

  const user = useSelector((state: RootState) => state.auth.user)

  const isStaff = user?.role === "STAFF"

  const [data, setData] = useState<StaffMemberDashboardResponseDto | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(5)

  const fetchDashboard = async () => {
    if (!id) return

    try {
      const response = await getStaffMemberDashboardApi(Number(id), {
        page,
        limit,
      })

      setData(response.data.data)
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch member dashboard")
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [id, page])

  if (!data) {
    return <p className="p-6 text-sm text-muted-foreground">Loading...</p>
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{data.member.name}</h1>

          <p className="text-sm text-muted-foreground">{data.member.email}</p>
        </div>

        {isStaff && (
          <Button onClick={() => console.log("open raise flag modal")}>
            Raise Flag
          </Button>
        )}
      </div>

      <MemberDashboardStats data={data} />

      <Card>
        <CardHeader>
          <CardTitle>Latest Vitals</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {data.vitals.data.map((vital) => (
                  <tr key={vital.id} className="border-b">
                    <td className="px-4 py-3">{vital.vitalType}</td>

                    <td className="px-4 py-3">
                      {vital.systolicValue && vital.diastolicValue
                        ? `${vital.systolicValue}/${vital.diastolicValue}`
                        : `${vital.value || "-"} ${vital.unit || ""}`}
                    </td>

                    <td className="px-4 py-3">{vital.status}</td>

                    <td className="px-4 py-3">{vital.loggedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.vitals.data.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No vitals found.
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <p className="text-sm text-muted-foreground">
              Page {data.vitals.page} of {data.vitals.totalPages}
            </p>

            <Button
              variant="outline"
              disabled={page === data.vitals.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Flags</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {data.activeFlags.length === 0 && (
            <p className="text-sm text-muted-foreground">No active flags.</p>
          )}

          {data.activeFlags.map((flag) => (
            <div key={flag.id} className="rounded-lg border p-3">
              <p className="font-medium">{flag.reason}</p>

              <p className="text-sm text-muted-foreground">
                {flag.category || "-"} {flag.severity} {flag.source}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
