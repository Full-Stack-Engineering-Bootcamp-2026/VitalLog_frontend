import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { FlaggedVitalsDistributionItemDto } from "@/features/shared/types/dashboard.types"

interface Props {
  data: FlaggedVitalsDistributionItemDto[]
}

export default function FlaggedVitalsDistribution({ data }: Props) {
  return (
    <Card className="mt-6 rounded-2xl border border-gray-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Flagged Vitals Distribution
        </CardTitle>

        <p className="text-sm text-gray-500">
          Analysis of top 5 high-risk metrics across all profiles
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-[320px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              barSize={14}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid horizontal={false} stroke="#eef4f1" />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />

              <YAxis
                type="category"
                dataKey="vitalType"
                width={150}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#374151" }}
              />

              <Tooltip
                cursor={false}
                itemStyle={{
                  color: "#111827",
                  fontSize: "12px",
                }}
                labelStyle={{
                  color: "#111827",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  padding: "8px 10px",
                }}
              />

              <Bar dataKey="count" fill="#dc6b6b" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
