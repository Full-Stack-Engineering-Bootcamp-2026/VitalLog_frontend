import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { fetchVitalsTrendApi } from "../api/dashboardApi"
import type { VitalResponseDto } from "@/features/vitals/types/vital.types"

interface ChartDataPoint {
  day: string
  weight?: number
  heartRate?: number
}

function getDateRange(period: string): { from: string; to: string } {
  const to = new Date()
  const from = new Date()
  if (period === "7d") from.setDate(from.getDate() - 7)
  else if (period === "30d") from.setDate(from.getDate() - 30)
  else from.setDate(from.getDate() - 90)
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  }
}

function buildChartData(vitals: VitalResponseDto[]): ChartDataPoint[] {
  const map: Record<string, ChartDataPoint> = {}

  vitals.forEach((v) => {
    const day = new Date(v.loggedDate)
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase()
    if (!map[v.loggedDate]) map[v.loggedDate] = { day }
    if (v.vitalType === "WEIGHT" && v.value)
      map[v.loggedDate].weight = Number(v.value)
    if (v.vitalType === "HEART_RATE" && v.value)
      map[v.loggedDate].heartRate = Number(v.value)
  })

  return Object.values(map).sort((a, b) => a.day.localeCompare(b.day))
}

export default function VitalsTrendChart() {
  const [period, setPeriod] = useState("7d")
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const { from, to } = getDateRange(period)
        const vitals = await fetchVitalsTrendApi(from, to)
        setData(buildChartData(vitals))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [period])

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">Vitals Trend</p>
          <p className="text-xs text-gray-400"> Comparison of weight and heart rate variability</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-100 p-1">
          {["7d", "30d", "90d"].map((p) => (
            <button
              key={p} onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:text-gray-700"
              }`} >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-400">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-400">
          No trend data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}/>
            <YAxis hide />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="weight"
              name="Weight (kg)"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="heartRate"
              name="Heart Rate (bpm)"
              stroke="#16a34a"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
