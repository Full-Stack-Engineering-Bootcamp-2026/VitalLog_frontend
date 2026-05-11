import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { fetchFitnessLogsApi, deleteFitnessLogApi } from "../api/fitnessApi"
import { fetchStreakApi } from "@/features/vitals/api/streakApi"
import type { StreakResponseDto } from "@/features/vitals/api/streakApi"
import type {
  FitnessLogResponseDto,
  FitnessFilters,
  PaginatedFitnessResponse,
} from "../types/fitness.types"
import PageHeader from "@/components/common/PageHeader"
import DataTable from "@/components/common/DataTable"
import Pagination from "@/components/common/Pagination"
import StatCard from "@/components/common/StatCards"
import ActivityFrequencyChart from "../components/ActivityFrequencyChart"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ACTIVITY_OPTIONS = [
  { label: "All Activities", value: "ALL" },
  { label: "Running", value: "Running" },
  { label: "Cycling", value: "Cycling" },
  { label: "Strength", value: "Strength" },
  { label: "Yoga", value: "Yoga" },
  { label: "Swim", value: "Swim" },
]

export default function FitnessLogPage() {
  const navigate = useNavigate()
  const [logs, setLogs] = useState<FitnessLogResponseDto[]>([])
  const [allLogs, setAllLogs] = useState<FitnessLogResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState<FitnessFilters>({ page: 1, limit: 5 })
  const [streak, setStreak] = useState<StreakResponseDto>({
    currentStreak: 0,
    longestStreak: 0,
    lastLoggedDate: null,
  })

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true)
      const [tableData, chartData, streakData]: [
        PaginatedFitnessResponse,
        PaginatedFitnessResponse,
        StreakResponseDto,
      ] = await Promise.all([
        fetchFitnessLogsApi(filters),
        fetchFitnessLogsApi({ page: 1, limit: 100 }),
        fetchStreakApi(),
      ])
      setLogs(tableData.data) //streak for table
      setAllLogs(chartData.data) //over all
      setTotal(tableData.total)
      setTotalPages(tableData.totalPages)
      setStreak(streakData)
    } catch {
      toast.error("Failed to load fitness logs.", { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  const handleDelete = async (id: number) => {
    try {
      await deleteFitnessLogApi(id)
      toast.success("Activity deleted successfully.", { duration: 3000 })
      loadLogs()
    } catch {
      toast.error("Failed to delete activity.", { duration: 3000 })
    }
  }

  const totalCalories = allLogs.reduce(
    (sum, log) => sum + log.caloriesBurned,
    0
  )

  const columns = [
    {
      header: "Date",
      accessor: (row: FitnessLogResponseDto) => (
        <span>
          {new Date(row.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Activity Type",
      accessor: (row: FitnessLogResponseDto) => (
        <span className="font-medium text-green-600">{row.activityType}</span>
      ),
    },
    {
      header: "Duration",
      accessor: (row: FitnessLogResponseDto) => `${row.duration} mins`,
    },
    {
      header: "Calories",
      accessor: (row: FitnessLogResponseDto) => `${row.caloriesBurned} kcal`,
    },
    {
      header: "Notes",
      accessor: (row: FitnessLogResponseDto) => (
        <span className="text-gray-400 italic">{row.notes ?? "—"}</span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: FitnessLogResponseDto) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/fitness-log/edit/${row.id}`)}
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
    <div className="space-y-4">
      <PageHeader
        title="Fitness Activity Log"
        subtitle="Monitor your progress and stay consistent with your routine."
        action={
          <Button
            onClick={() => navigate("/fitness-log/log")}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Log Activity
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">
            Activity Frequency
          </p>
          <p className="mb-3 text-xs text-gray-400">
            Last 30 days distribution
          </p>
          <ActivityFrequencyChart logs={allLogs} />
        </div>
        <div className="flex flex-col gap-4">
          <StatCard
            label="Weekly Streak"
            value={`${streak.currentStreak} Days`}
            subtext={
              streak.longestStreak > 0
                ? `Best: ${streak.longestStreak} days`
                : "Keep it up!"
            }
            color="amber"
          />
          <StatCard
            label="Total Calories"
            value={totalCalories.toLocaleString()}
            subtext="calories burned"
            color="green"
          />
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
            Activity
          </span>
          <Select
            defaultValue="ALL"
            onValueChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                activityType: val === "ALL" ? undefined : val,
              }))
            }
          >
            <SelectTrigger className="h-8 w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={logs}
          loading={loading}
          emptyMessage="No activities logged yet."
        />

        {!loading && logs.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-400">
              Showing {logs.length} of {total} entries
            </p>
            <Pagination
              page={filters.page ?? 1}
              totalPages={totalPages}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </div>
        )}
      </div>
    </div>
  )
}
