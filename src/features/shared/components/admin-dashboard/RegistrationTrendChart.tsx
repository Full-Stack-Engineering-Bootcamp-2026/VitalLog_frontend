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

import type { RegistrationTrendItemDto } from "@/features/shared/types/dashboard.types"

interface Props {
  data: RegistrationTrendItemDto[]
}

export default function RegistrationTrendChart({ data }: Props) {
  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm xl:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          New Member Registrations
        </CardTitle>

        <p className="text-sm text-gray-500">
          Growth trajectory for the last 30 days
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={6}>
              <CartesianGrid vertical={false} stroke="#eef4f1" />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(value: string) => value.slice(5, 10)}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
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

              <Bar dataKey="count" fill="#dcece7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
