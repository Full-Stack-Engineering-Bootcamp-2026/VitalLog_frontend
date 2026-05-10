import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { FlagStatusType } from "../types/flag.types"

type Props = {
  status?: FlagStatusType
  search: string
  onSearchChange: (value: string) => void
  onStatusChange: (value?: FlagStatusType) => void
}

export default function FlagFilters({
  status,
  search,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by member name or email..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full lg:max-w-sm"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant={!status ? "default" : "outline"}
          onClick={() => onStatusChange(undefined)}
        >
          All
        </Button>

        <Button
          variant={status === "OPEN" ? "default" : "outline"}
          onClick={() => onStatusChange("OPEN")}
        >
          Open
        </Button>

        <Button
          variant={status === "RESOLVED" ? "default" : "outline"}
          onClick={() => onStatusChange("RESOLVED")}
        >
          Resolved
        </Button>
      </div>
    </div>
  )
}
