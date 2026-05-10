import { Heart } from "lucide-react"

interface Props {
  conditions: string[]
  onAddClick: () => void
}

function TagBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      {label}
    </span>
  )
}

export default function HealthConditionsCard({ conditions, onAddClick }: Props) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-red-500" />
          <h3 className="font-semibold">Health Conditions</h3>
        </div>
        <button onClick={onAddClick} className="text-xs text-green-600 hover:underline">
          + Add Condition
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {conditions.length > 0
          ? conditions.map((c) => <TagBadge key={c} label={c} />)
          : <p className="text-xs text-muted-foreground">No conditions added yet.</p>
        }
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        This data is only visible to you and your assigned practitioner.
      </p>
    </div>
  )
}