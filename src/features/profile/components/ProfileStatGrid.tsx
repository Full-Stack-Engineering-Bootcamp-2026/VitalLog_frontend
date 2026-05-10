import type { ProfileResponseDto } from "../types/profile.types"

interface Props {
  profile: ProfileResponseDto
}

function MiniStatCard({ label, value, unit }: { label: string; value: string | number | null; unit: string }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border bg-white p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
        <p className="text-xs text-muted-foreground">{unit}</p>
      </div>
    </div>
  )
}

export default function ProfileStatGrid({ profile }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:col-span-2">
      <MiniStatCard label="Age" value={profile.age} unit="Years" />
      <MiniStatCard label="Gender" value={profile.gender} unit="Identity" />
      <MiniStatCard label="Height" value={profile.height} unit="Centimeters" />
      <MiniStatCard label="Weight" value={profile.weight} unit="Kilograms" />
    </div>
  )
}