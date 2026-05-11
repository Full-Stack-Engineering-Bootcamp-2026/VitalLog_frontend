import type { RangeStatus } from "@/features/vitals/types/vital.types"

interface StatusBadgeProps {
  status: RangeStatus
}

const statusConfig = {
  NORMAL: {
    label: "Healthy",
    className: "bg-green-50 text-green-700 border border-green-200",
  },
  WARNING: {
    label: "Borderline",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  CRITICAL: {
    label: "Out of Range",
    className: "bg-red-50 text-red-700 border border-red-200",
  },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
