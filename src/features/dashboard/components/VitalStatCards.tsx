import { Scale, Heart, Moon, Droplets } from "lucide-react"
import type { VitalResponseDto } from "@/features/vitals/types/vital.types"

interface Props {
  vitals: VitalResponseDto[]
}

interface VitalCardData {
  label: string
  value: string
  subtext: string
  icon: React.ReactNode
  iconBg: string
}

function getLatestByType(vitals: VitalResponseDto[], type: string): VitalResponseDto | undefined {
  return vitals.find((v) => v.vitalType === type)
}

function formatValue(vital: VitalResponseDto | undefined): string {
  if (!vital) return "—"
  if (vital.systolicValue && vital.diastolicValue) return `${vital.systolicValue}/${vital.diastolicValue}`
  return vital.value ? `${vital.value}` : "—"
}

export default function VitalStatCards({ vitals }: Props) {
  const weight = getLatestByType(vitals, "WEIGHT")
  const heartRate = getLatestByType(vitals, "HEART_RATE")
  const sleep = getLatestByType(vitals, "SLEEP")
  const glucose = getLatestByType(vitals, "BLOOD_GLUCOSE")

  const cards: VitalCardData[] = [
    {
      label: "WEIGHT",
      value: weight ? `${formatValue(weight)} kg` : "—",
      subtext: weight ? `Status: ${weight.status}` : "No data",
      icon: <Scale className="h-4 w-4 text-gray-400" />,
      iconBg: "bg-gray-100",
    },
    {
      label: "HEART RATE",
      value: heartRate ? `${formatValue(heartRate)} bpm` : "—",
      subtext: heartRate ? `Status: ${heartRate.status}` : "No data",
      icon: <Heart className="h-4 w-4 text-red-400" />,
      iconBg: "bg-red-50",
    },
    {
      label: "SLEEP DURATION",
      value: sleep ? `${formatValue(sleep)} hrs` : "—",
      subtext: sleep ? `Status: ${sleep.status}` : "No data",
      icon: <Moon className="h-4 w-4 text-blue-400" />,
      iconBg: "bg-blue-50",
    },
    {
      label: "BLOOD GLUCOSE",
      value: glucose ? `${formatValue(glucose)} mg/dL` : "—",
      subtext: glucose ? `Status: ${glucose.status}` : "No data",
      icon: <Droplets className="h-4 w-4 text-green-500" />,
      iconBg: "bg-green-50",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{card.label}</p>
            <div className={`flex h-7 w-7 items-center justify-center rounded-full ${card.iconBg}`}>
              {card.icon}
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="mt-1 text-xs text-gray-400">{card.subtext}</p>
        </div>
      ))}
    </div>
  )
}