import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { fetchVitalsApi, deleteVitalApi } from "../api/vitalsApi"
import type { VitalResponseDto, VitalFilters, PaginatedVitalsResponse } from "../types/vital.types"
import PageHeader from "@/components/common/PageHeader"
import DataTable from "@/components/common/DataTable"
import Pagination from "@/components/common/Pagination"
import StatusBadge from "@/components/common/StatusBadge"
import StatCard from "@/components/common/StatCards"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const VITAL_TYPE_OPTIONS = [
  { label: "All Vitals", value: "ALL" },
  { label: "Heart Rate", value: "HEART_RATE" },
  { label: "Blood Pressure", value: "BLOOD_PRESSURE" },
  { label: "Blood Glucose", value: "BLOOD_GLUCOSE" },
  { label: "Weight", value: "WEIGHT" },
  { label: "Sleep", value: "SLEEP" },
]

export default function VitalsPage() {
  const navigate = useNavigate()
  const [vitals, setVitals] = useState<VitalResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState<VitalFilters>({ page: 1, limit: 5 })

  const loadVitals = useCallback(async () => {
    try {
      setLoading(true)
      const response: PaginatedVitalsResponse = await fetchVitalsApi(filters)
      setVitals(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
    } catch {
      toast.error("Failed to load vitals.", { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { loadVitals() }, [loadVitals])

  const handleDelete = async (id: number) => {
    try {
      await deleteVitalApi(id)
      toast.success("Vital deleted successfully.", { duration: 3000 })
      loadVitals()
    } catch {
      toast.error("Failed to delete vital.", { duration: 3000 })
    }
  }

  const handleVitalTypeFilter = (val: string) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      vitalType: val === "ALL" ? undefined : val as VitalFilters["vitalType"],
    }))
  }

  const formatValue = (vital: VitalResponseDto) => {
    if (vital.systolicValue && vital.diastolicValue) return `${vital.systolicValue}/${vital.diastolicValue}`
    return vital.value ?? "-"
  }

  const columns = [
    {
      header: "Date",
      accessor: (row: VitalResponseDto) => (
        <span>{new Date(row.loggedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      ),
    },
    {
      header: "Vital Type",
      accessor: (row: VitalResponseDto) => (
        <span className="font-medium text-gray-800">{row.vitalType.replace(/_/g, " ")}</span>
      ),
    },
    {
      header: "Value",
      accessor: (row: VitalResponseDto) => formatValue(row),
    },
    {
      header: "Unit",
      accessor: (row: VitalResponseDto) => <span className="text-gray-400">{row.unit ?? "-"}</span>,
    },
    {
      header: "Range Status",
      accessor: (row: VitalResponseDto) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      accessor: (row: VitalResponseDto) => (
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/my-vitals/edit/${row.id}`)} className="text-gray-400 hover:text-gray-700 transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Vitals"
        subtitle="Monitor and track your health metrics over time."
        action={
          <Button onClick={() => navigate("/my-vitals/log")} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Log Vitals
          </Button>
        }/>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        {/* Filters */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Filter by</span>
            <Select defaultValue="ALL" onValueChange={handleVitalTypeFilter}>
              <SelectTrigger className="w-40 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VITAL_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={vitals}
          loading={loading}
          emptyMessage="No vitals logged yet." />

        {!loading && vitals.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-400">Showing {vitals.length} of {total} entries</p>
            <Pagination page={filters.page ?? 1} totalPages={totalPages} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
          </div>
        )}
      </div>

      {/* Bottom stat cards */}
      <div className="grid grid-cols-3 gap-4">
  <StatCard label="Weight Trend" value="-2.4 kg" subtext="this month" color="green" />
  <StatCard label="Compliance" value="92%" subtext="log frequency" color="blue" />
  <StatCard label="Next Checkup" value="Nov 12" subtext="in 15 days" color="red" />
</div>
    </div>
  )
}