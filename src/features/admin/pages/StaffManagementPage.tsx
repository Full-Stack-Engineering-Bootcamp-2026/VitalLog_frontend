import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { fetchStaffApi } from "../../auth/api/authApi"
import type { StaffResponseDto } from "../../auth/types/auth.types"
import StaffStatCards from "../components/StaffStatCards"
import StaffTable from "../components/StaffTable"

export default function StaffManagementPage() {
  const [staff, setStaff]     = useState<StaffResponseDto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetchStaffApi()
        setStaff(res.data.data)
      } catch {
        toast.error("Failed to load staff.", { duration: 3000 })
      } finally {
        setLoading(false)  // always runs — even if error
      }
    }
    load()
  }, [])  // empty array → runs once on mount

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Management / Staff List</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Staff Accounts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage administrative and clinical staff access levels.
          </p>
        </div>
        <Link to="/admin/add-staff">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus size={18} />
            Add Staff
          </Button>
        </Link>
      </div>

      {/* stat cards — passes staff array + loading */}
      <StaffStatCards staff={staff} loading={loading} />

      {/* table — passes staff array + loading */}
      <StaffTable staff={staff} loading={loading} />

    </div>
  )
}