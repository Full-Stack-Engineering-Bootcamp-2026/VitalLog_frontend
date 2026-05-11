import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { getStaffMembersApi } from "../api/staffApi"
import MemberProfileCard from "../components/MemberProfileCard"
import { useDebounce } from "../hooks/useDebounce"

import type { StaffMemberListItemDto } from "../types/staff.types"

export default function MembersPage() {
  const navigate = useNavigate()

  const [members, setMembers] = useState<StaffMemberListItemDto[]>([])
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search)

  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const fetchMembers = async () => {
    try {
      const response = await getStaffMembersApi({
        page,
        limit,
        search: debouncedSearch,
      })

      setMembers(response.data.data.members)
      setTotal(response.data.data.total)
      setTotalPages(response.data.data.totalPages)
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch members")
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [page, debouncedSearch])

  const handleViewDashboard = (memberId: number) => {
    navigate(`/members/${memberId}/dashboard`)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Member Profiles
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor health profiles for all active members.
          </p>
        </div>

        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full lg:max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <MemberProfileCard
            key={member.id}
            member={member}
            onViewDashboard={handleViewDashboard}
          />
        ))}
      </div>

      {members.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No members found.
        </p>
      )}

      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {members.length} of {total} members
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          <span className="rounded-md bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
            {page}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
