import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { fetchFitnessLogsApi, updateFitnessLogApi } from "../api/fitnessApi"
import type {
  FitnessLogResponseDto,
  UpdateFitnessLogDto,
} from "../types/fitness.types"
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

export default function EditActivityForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<UpdateFitnessLogDto>({
    activityType: "",
    duration: 0,
    caloriesBurned: 0,
    date: today,
    notes: "",
  })

  useEffect(() => {
    const loadLog = async () => {
      try {
        const response = await fetchFitnessLogsApi({ page: 1, limit: 100 })
        const found: FitnessLogResponseDto | undefined = response.data.find(
          (l) => l.id === parseInt(id ?? "0")
        )
        if (!found) {
          toast.error("Activity not found.", { duration: 3000 })
          navigate("/fitness-log")
          return
        }
        setForm({
          activityType: found.activityType,
          duration: found.duration,
          caloriesBurned: found.caloriesBurned,
          date: found.date, //   distance: found.distance ?? "",
          notes: found.notes ?? "",
        })
      } catch {
        toast.error("Failed to load activity.", { duration: 3000 })
        navigate("/fitness-log")
      } finally {
        setLoading(false)
      }
    }
    loadLog()
  }, [id, navigate])

  const update = (field: keyof UpdateFitnessLogDto, value: string | number) => {
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

    setSaving(true)
    try {
      await updateFitnessLogApi(parseInt(id ?? "0"), {
        ...form,
        notes: form.notes || undefined,
      })
      toast.success("Activity updated successfully.", { duration: 3000 })
      navigate("/fitness-log")
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update activity."
      toast.error(message, { duration: 3000 })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Activity</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update your activity details.
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
            <Select
              value={form.activityType}
              onValueChange={(val) => update("activityType", val)}
            >
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-400">Duration (mins)</Label>
            <Input
              type="number"
              min={1}
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
              value={form.caloriesBurned || ""}
              onChange={(e) =>
                update("caloriesBurned", parseInt(e.target.value) || 0)
              }
              className="mt-1"
            />
          </div>
        </div>
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
            {saving ? "Saving..." : "Update Activity"}
          </Button>
        </div>
      </div>
    </div>
  )
}
