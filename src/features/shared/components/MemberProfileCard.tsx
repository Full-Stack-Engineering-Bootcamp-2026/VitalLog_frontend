import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"

import type { StaffMemberListItemDto } from "../types/staff.types"

type Props = {
  member: StaffMemberListItemDto
  onViewDashboard: (memberId: number) => void
}
//Profile avatar fallback if image is missing
export default function MemberProfileCard({ member, onViewDashboard }: Props) {
  const initials = member.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 flex items-start justify-between">
          {member.profile?.profileImageUrl ? (
            <img
              src={member.profile.profileImageUrl}
              alt={member.name}
              className="h-14 w-14 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              {initials}
            </div>
          )}

          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            Active
          </span>
        </div>

        <h3 className="font-semibold">{member.name}</h3>

        <p className="mt-1 text-xs text-muted-foreground">{member.email}</p>

        <p className="mt-2 text-xs text-muted-foreground">
          Joined: {new Date(member.createdAt).toLocaleDateString()}
        </p>

        <Button
          className="mt-4 w-full"
          size="sm"
          onClick={() => onViewDashboard(member.id)}
        >
          View Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
