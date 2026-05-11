import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { createManualFlagApi } from "../api/flagApi"
import type { FlagSeverityType } from "../types/flag.types"
type Props = {
  open: boolean
  memberId: number
  onClose: () => void
  onSuccess: () => void
}

export default function RaiseFlagModal({
  open,
  memberId,
  onClose,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState("")
  const [category, setCategory] = useState("HEART_RATE")
  const [severity, setSeverity] = useState<FlagSeverityType>("MEDIUM")
  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Reason is required")
      return
    }

    try {
      await createManualFlagApi({
        userId: memberId,
        reason,
        category,
        severity,
      })

      toast.success("Flag raised successfully")

      setReason("")
      setCategory("HEART_RATE")
      setSeverity("MEDIUM")

      onSuccess()
      onClose()
    } catch (error) {
      console.log(error)
      toast.error("Failed to raise flag")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Raise Manual Flag</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Category</label>

            <select
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="HEART_RATE">Heart Rate</option>
              <option value="BLOOD_PRESSURE">Blood Pressure</option>
              <option value="WEIGHT">Weight</option>
              <option value="GENERAL">General</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Severity</label>

            <select
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as FlagSeverityType)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Reason</label>

            <Textarea
              className="mt-1"
              placeholder="Write flag reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit}>Save Flag</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
