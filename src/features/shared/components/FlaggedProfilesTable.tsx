import { Button } from "@/components/ui/button"

import FlagStatusBadge from "./FlagStatusBadge"

import type { FlagListItemResponseDto } from "../types/flag.types"
import { ResolveFlagModal } from "./ResolveFlagModal"

type Props = {
  flags: FlagListItemResponseDto[]
  isStaff: boolean
  isAdmin: boolean
  onResolveClick: (flagId: number, note: string) => void
}

export default function FlaggedProfilesTable({
  flags,
  isStaff,
  isAdmin,
  onResolveClick,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/50 text-xs text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3">MEMBER NAME</th>
            <th className="px-4 py-3">FLAG NOTE</th>
            <th className="px-4 py-3">CATEGORY</th>
            <th className="px-4 py-3">SEVERITY</th>
            <th className="px-4 py-3">FLAGGED BY</th>
            <th className="px-4 py-3">STATUS</th>
            <th className="px-4 py-3">FLAG DATE</th>
            <th className="px-4 py-3 text-right">ACTION</th>
          </tr>
        </thead>

        <tbody>
          {flags.map((flag) => (
            <tr key={flag.id} className="border-b">
              <td className="px-4 py-4">
                <p className="font-medium">{flag.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {flag.user.email}
                </p>
              </td>

              <td className="max-w-[280px] px-4 py-4">
                <p className="line-clamp-2">{flag.reason}</p>
              </td>

              <td className="px-4 py-4">{flag.category || "-"}</td>

              <td className="px-4 py-4 font-medium">{flag.severity}</td>
              <td className="px-4 py-4">
                {flag.source === "SYSTEM" ? "Auto-Algorithmic" : "Staff Manual"}
              </td>

              <td className="px-4 py-4">
                <FlagStatusBadge status={flag.status} />
              </td>

              <td className="px-4 py-4">
                {new Date(flag.createdAt).toLocaleDateString()}
              </td>

              <td className="px-4 py-4 text-right">
                {isStaff && flag.status === "OPEN" && (
                  <ResolveFlagModal
                    onResolve={(note) => onResolveClick(flag.id, note)}
                  />
                )}

                {isStaff && flag.status === "RESOLVED" && (
                  <Button size="sm" variant="outline" disabled>
                    Resolved
                  </Button>
                )}

                {isAdmin && (
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {flags.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No flagged profiles found.
        </p>
      )}
    </div>
  )
}
