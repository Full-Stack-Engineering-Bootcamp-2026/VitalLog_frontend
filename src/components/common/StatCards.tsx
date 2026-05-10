interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  color: "green" | "blue" | "red" | "amber"
  icon?: React.ReactNode
}

const colorMap = {
  green: { label: "text-green-600", bar: "bg-green-500" },
  blue: { label: "text-blue-600", bar: "bg-blue-500" },
  red: { label: "text-red-500", bar: "bg-red-400" },
  amber: { label: "text-amber-500", bar: "bg-amber-400" },
}

export default function StatCard({
  label,
  value,
  subtext,
  color,
  icon,
}: StatCardProps) {
  const c = colorMap[color]

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p
          className={`text-xs font-semibold tracking-wide uppercase ${c.label}`}
        >
          {label}
        </p>

        {icon && <div>{icon}</div>}
      </div>

      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>

      {subtext && <p className="text-xs text-gray-400">{subtext}</p>}

      <div className={`mt-3 h-1 w-full rounded-full ${c.bar}`} />
    </div>
  )
}
