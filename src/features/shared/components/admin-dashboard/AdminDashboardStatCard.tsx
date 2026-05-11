interface Props {
  label: string
  value: string | number
  subtext?: string
  color: "green" | "blue" | "red" | "amber"
}

const colorMap = {
  green: "text-emerald-600",
  blue: "text-indigo-600",
  red: "text-red-500",
  amber: "text-orange-500",
}

export default function AdminDashboardStatCard({
  label,
  value,
  subtext,
  color,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p
        className={`text-[11px] font-semibold tracking-wide uppercase ${colorMap[color]}`}
      >
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>

      {subtext && <p className="text-sm text-gray-400">{subtext}</p>}
    </div>
  )
}
