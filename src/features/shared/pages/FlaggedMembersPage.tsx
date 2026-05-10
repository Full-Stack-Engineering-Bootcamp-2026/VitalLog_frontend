import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { AlertTriangle, CheckCircle, Flag } from "lucide-react"

import type { RootState } from "@/app/store"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import FlagStatCard from "../components/FlagStatCard"
import FlagFilters from "../components/FlagFilters"
import FlaggedProfilesTable from "../components/FlaggedProfilesTable"
import ResolveFlagCard from "../components/ResolveFlagCard"

import { useDebounce } from "../hooks/useDebounce"
import { getFlagsApi, resolveFlagApi } from "../api/flagApi"

import type {
  FlagListItemResponseDto,
  FlagStatusType,
} from "../types/flag.types"

export default function FlaggedMembersPage() {
  const user = useSelector((state: RootState) => state.auth.user)

  const isStaff = user?.role === "STAFF"
  const isAdmin = user?.role === "ADMIN"

  const [flags, setFlags] = useState<FlagListItemResponseDto[]>([])
  const [status, setStatus] = useState<FlagStatusType | undefined>()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search)

  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [selectedFlagId, setSelectedFlagId] = useState<number | null>(null)
  const [resolutionNote, setResolutionNote] = useState("")

  const fetchFlags = async () => {
    try {
      const response = await getFlagsApi({
        page,
        limit,
        status,
        search: debouncedSearch,
      })

      setFlags(response.data.data.flags)
      setTotal(response.data.data.total)
      setTotalPages(response.data.data.totalPages)
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch flags")
    }
  }

  useEffect(() => {
    fetchFlags()
  }, [page, status, debouncedSearch])

  const handleStatusChange = (value?: FlagStatusType) => {
    setStatus(value)
    setPage(1)
  }

  const handleResolve = async () => {
    if (!selectedFlagId) return

    if (!resolutionNote.trim()) {
      toast.error("Resolution note is required")
      return
    }

    try {
      await resolveFlagApi(selectedFlagId, { resolutionNote })

      toast.success("Flag resolved successfully")

      setSelectedFlagId(null)
      setResolutionNote("")
      fetchFlags()
    } catch (error) {
      console.log(error)
      toast.error("Failed to resolve flag")
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Flagged Profiles
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage flagged member profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FlagStatCard title="Total Flags" value={total} icon={Flag} />

        <FlagStatCard
          title="Open Flags"
          value={flags.filter((flag) => flag.status === "OPEN").length}
          icon={AlertTriangle}
        />

        <FlagStatCard
          title="Resolved"
          value={flags.filter((flag) => flag.status === "RESOLVED").length}
          icon={CheckCircle}
        />
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>Flagged Members</CardTitle>

          <FlagFilters
            status={status}
            search={search}
            onSearchChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            onStatusChange={handleStatusChange}
          />
        </CardHeader>

        <CardContent>
          <FlaggedProfilesTable
            flags={flags}
            isStaff={isStaff}
            isAdmin={isAdmin}
            onResolveClick={setSelectedFlagId}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ResolveFlagCard
        selectedFlagId={selectedFlagId}
        resolutionNote={resolutionNote}
        onNoteChange={setResolutionNote}
        onSubmit={handleResolve}
        onCancel={() => {
          setSelectedFlagId(null)
          setResolutionNote("")
        }}
      />
    </div>
  )
}
