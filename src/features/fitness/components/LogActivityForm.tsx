import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { createFitnessLogApi } from "../api/fitnessApi"
import type { CreateFitnessLogDto } from "../types/fitness.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ACTIVITY_TYPES = [
  "Running",
  "Cycling",
  "Strength",
  "Yoga",
  "Swim",
  "Walking",
  "Other",
]

const today = new Date().toISOString().split("T")[0]

export default function LogActivityForm() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<CreateFitnessLogDto>({
    activityType: "",
    duration: 0,
    caloriesBurned: 0,
    date: today,
    notes: "",
  })

  const update = (field: keyof CreateFitnessLogDto, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!form.activityType) {
      toast.error("Please select an activity type.", { duration: 3000 })
      return
    }
    if (!form.duration || form.duration <= 0) {
      toast.error("Please enter a valid duration.", { duration: 3000 })
      return
    }
    if (!form.caloriesBurned || form.caloriesBurned < 0) {
      toast.error("Please enter calories burned.", { duration: 3000 })
      return
    }

    setSaving(true)
    try {
      await createFitnessLogApi({
        ...form,
        // distance: form.distance || undefined,
        notes: form.notes || undefined,
      })
      toast.success("Activity logged successfully.", { duration: 3000 })
      navigate("/fitness-log")
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to save activity."
      toast.error(message, { duration: 3000 })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Log Your Activity
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your workout and stay consistent.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/fitness-log")}
          className="border-gray-200"
        >
          Cancel
        </Button>
      </div>

      <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        {/* Date + Activity Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-400">Date</Label>
            <Input
              type="date"
              value={form.date}
              max={today}
              onChange={(e) => update("date", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Activity Type</Label>
            <Select onValueChange={(val) => update("activityType", val)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Duration + Calories */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-400">Duration (mins)</Label>
            <Input
              type="number"
              min={1}
              placeholder="0"
              value={form.duration || ""}
              onChange={(e) =>
                update("duration", parseInt(e.target.value) || 0)
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Calories Burned</Label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={form.caloriesBurned || ""}
              onChange={(e) =>
                update("caloriesBurned", parseInt(e.target.value) || 0)
              }
              className="mt-1"
            />
          </div>
        </div>
        {/* Notes */}
        <div>
          <Label className="text-xs text-gray-400">Notes</Label>
          <Textarea
            placeholder="How did you feel during this activity?"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="mt-1 resize-none"
            rows={3}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {saving ? "Saving..." : "Save Activity"}
          </Button>
        </div>
      </div>
    </div>
  )
}
