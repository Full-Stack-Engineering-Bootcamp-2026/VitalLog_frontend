import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { FitnessLogResponseDto } from "../types/fitness.types"

interface Props {
  logs: FitnessLogResponseDto[]
}

export default function ActivityFrequencyChart({ logs }: Props) {
  const activityCounts = logs.reduce<Record<string, number>>((acc, log) => {
    const type = log.activityType.toUpperCase()
    acc[type] = (acc[type] ?? 0) + 1
    return acc
  }, {})

  const data = Object.entries(activityCounts).map(([activity, count]) => ({
    activity,
    count,
  }))

  const config = {
    count: { label: "Activities", color: "#16a34a" },
  }

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        No activity data yet.
      </div>
    )
  }

  return (
    <ChartContainer config={config} className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={32}>
          <XAxis dataKey="activity" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}