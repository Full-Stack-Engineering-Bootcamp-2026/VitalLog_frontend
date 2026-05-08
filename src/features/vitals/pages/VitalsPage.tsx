import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { fetchVitalsApi, deleteVitalApi } from "../api/vitalsApi"
import type {
  VitalResponseDto,
  VitalFilters,
  PaginatedVitalsResponse,
} from "../types/vital.types"
import PageHeader from "@/components/common/PageHeader"
import DataTable from "@/components/common/DataTable"
import Pagination from "@/components/common/Pagination"
import StatusBadge from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"

export default function VitalsPage() {
  const navigate = useNavigate()

  const [vitals, setVitals] = useState<VitalResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState<VitalFilters>({
    page: 1,
    limit: 10,
  })

  const loadVitals = useCallback(async () => {
    try {
      setLoading(true)
      const response: PaginatedVitalsResponse = await fetchVitalsApi(filters)
      setVitals(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
    } catch {
      toast.error("Failed to load vitals.")
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadVitals()
  }, [loadVitals])

  const handleDelete = async (id: number) => {
    try {
      await deleteVitalApi(id)
      toast.success("Vital deleted successfully.")
      loadVitals()
    } catch {
      toast.error("Failed to delete vital.")
    }
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const formatValue = (vital: VitalResponseDto) => {
    if (vital.systolicValue && vital.diastolicValue) {
      return `${vital.systolicValue}/${vital.diastolicValue}`
    }
    return vital.value ?? "-"
  }

  const columns = [
    {
      header: "Date",
      accessor: (row: VitalResponseDto) => (
        <span>
          {new Date(row.loggedDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Vital Type",
      accessor: (row: VitalResponseDto) => (
        <span className="font-medium text-gray-800">
          {row.vitalType.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Value",
      accessor: (row: VitalResponseDto) => formatValue(row),
    },
    {
      header: "Unit",
      accessor: (row: VitalResponseDto) => (
        <span className="text-gray-400">{row.unit ?? "-"}</span>
      ),
    },
    {
      header: "Range Status",
      accessor: (row: VitalResponseDto) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      accessor: (row: VitalResponseDto) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/my-vitals/edit/${row.id}`)}
            className="text-gray-400 transition-colors hover:text-gray-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-gray-400 transition-colors hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="My Vitals"
        subtitle="Monitor and track your health metrics over time."
        action={
          <Button
            onClick={() => navigate("/my-vitals/log")}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Log Vitals
          </Button>
        }
      />

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={vitals}
          loading={loading}
          emptyMessage="No vitals logged yet."
        />

        {!loading && vitals.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-400">
              Showing {vitals.length} of {total} entries
            </p>
            <Pagination
              page={filters.page ?? 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
