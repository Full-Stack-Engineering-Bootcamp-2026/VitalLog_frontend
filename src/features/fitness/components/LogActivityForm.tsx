import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Zap, Target } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFitnessLogApi } from "../api/fitnessApi"
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

const logActivitySchema = z.object({
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => val <= today, "Date cannot be in the future"),

  activityType: z
    .string()
    .min(1, "Activity type is required")
    .refine((val) => ACTIVITY_TYPES.includes(val), "Invalid activity type"),

  duration: z
    .number()
    .min(1, "Minimum duration is 1 minute")
    .max(240, "Maximum duration is 240 minutes"),

  caloriesBurned: z
    .number()
    .min(1, "Minimum is 1 kcal")
    .max(10000, "Maximum is 10,000 kcal"),

  notes: z
    .string()
    .min(3, "Notes must be at least 3 characters")
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
})

type LogActivityFormData = z.infer<typeof logActivitySchema>

export default function LogActivityForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LogActivityFormData>({
    resolver: zodResolver(logActivitySchema),
    defaultValues: {
      date: today,
      activityType: "",
      duration: undefined,
      caloriesBurned: undefined,
      notes: "",
    },
  })

  const onSubmit = async (data: LogActivityFormData) => {
    try {
      await createFitnessLogApi({
        ...data,
        notes: data.notes || undefined,
      })
      toast.success("Activity logged successfully.", { duration: 3000 })
      navigate("/fitness-log")
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to save activity."
      toast.error(message, { duration: 3000 })
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Your Activity</h1>
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">

          {/* Date + Activity Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-400">Date</Label>
              <Input
                type="date"
                max={today}
                className="mt-1"
                {...register("date")}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div>
              <Label className="text-xs text-gray-400">Activity Type</Label>
              <Controller
                control={control}
                name="activityType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
                )}
              />
              {errors.activityType && (
                <p className="mt-1 text-xs text-red-500">{errors.activityType.message}</p>
              )}
            </div>
          </div>

          {/* Duration + Calories */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-400">Duration (mins)</Label>
              <Input
                type="number"
                min={1}
                max={240}
                placeholder="0"
                className="mt-1"
                {...register("duration", { valueAsNumber: true })}
              />
              {errors.duration && (
                <p className="mt-1 text-xs text-red-500">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <Label className="text-xs text-gray-400">Calories Burned</Label>
              <Input
                type="number"
                min={1}
                max={10000}
                placeholder="0"
                className="mt-1"
                {...register("caloriesBurned", { valueAsNumber: true })}
              />
              {errors.caloriesBurned && (
                <p className="mt-1 text-xs text-red-500">{errors.caloriesBurned.message}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs text-gray-400">
              Notes
              <span className="ml-1 text-gray-300">(optional · 3–500 chars)</span>
            </Label>
            <Textarea
              placeholder="How did you feel during this activity?"
              className="mt-1 resize-none"
              rows={3}
              {...register("notes")}
            />
            {errors.notes && (
              <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isSubmitting ? "Saving..." : "Save Activity"}
            </Button>
          </div>
        </div>
      </form>

      {/* bottom cards */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-green-50 p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-600" />
            <p className="text-sm font-semibold text-green-700">Pro Tip</p>
          </div>
          <p className="mt-2 text-xs text-green-700">
            Logging your intensity level in the notes helps VitalLog calibrate
            your recovery time more accurately.
          </p>
        </div>

        <div className="rounded-xl bg-violet-50 p-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-violet-600" />
            <p className="text-sm font-semibold text-violet-700">Daily Goal</p>
          </div>
          <p className="mt-2 text-xs text-violet-700">
            You're just 15 minutes away from completing your daily movement goal!
          </p>
        </div>
      </div>
    </div>
  )
}