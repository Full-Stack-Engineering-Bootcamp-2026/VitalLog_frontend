import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, CheckCircle, Flame } from "lucide-react"
import { toast } from "sonner"
import { createVitalApi } from "../api/vitalsApi"
import { fetchStreakApi } from "../api/streakApi"
import type { CreateVitalDto, VitalType } from "../types/vital.types"
import type { StreakResponseDto } from "../api/streakApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const VITAL_TYPES: { label: string; value: VitalType }[] = [
  { label: "Heart Rate", value: "HEART_RATE" },
  { label: "Blood Pressure", value: "BLOOD_PRESSURE" },
  { label: "Blood Glucose", value: "BLOOD_GLUCOSE" },
  { label: "Weight", value: "WEIGHT" },
  { label: "Sleep", value: "SLEEP" },
]

const HEALTHY_TIPS = [
  "Measure your BP at the same time daily, preferably in the morning before breakfast.",
  "Resting heart rate is best taken right after waking up while still in bed.",
]

// absolute physiological limits — not clinical ranges
// clinical ranges live in vital.constants.ts and are used by backend status calculation
// these limits only block humanly impossible values
const VITAL_LIMITS = {
  HEART_RATE: { min: 20, max: 300, unit: "bpm" },
  BLOOD_GLUCOSE: { min: 20, max: 600, unit: "mg/dL" },
  WEIGHT: { min: 5, max: 300, unit: "kg" },
  SLEEP: { min: 0, max: 24, unit: "hours" },
  BLOOD_PRESSURE: {
    systolic: { min: 50, max: 300 },
    diastolic: { min: 20, max: 200 },
  },
} as const

interface VitalCard {
  id: number
  vitalType: VitalType | ""
  value: string
  systolicValue: string
  diastolicValue: string
  saved: boolean
  saving: boolean
}

const emptyCard = (id: number): VitalCard => ({
  id,
  vitalType: "",
  value: "",
  systolicValue: "",
  diastolicValue: "",
  saved: false,
  saving: false,
})

export default function LogVitalsForm() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split("T")[0]

  const [date, setDate] = useState(today)
  const [cards, setCards] = useState<VitalCard[]>([emptyCard(1)])
  const [streak, setStreak] = useState<StreakResponseDto>({
    currentStreak: 0,
    longestStreak: 0,
    lastLoggedDate: null,
  })

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const data = await fetchStreakApi()
        setStreak(data)
      } catch {
        // streak is optional, so i wont show error
      }
    }
    loadStreak()
  }, [])

  const savedVitalTypes = cards.filter((c) => c.saved).map((c) => c.vitalType)

  const updateCard = (id: number, updates: Partial<VitalCard>) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
    )
  }

  const addCard = () => {
    setCards((prev) => [...prev, emptyCard(prev.length + 1)])
  }

  const removeCard = (id: number) => {
    setCards((prev) => prev.filter((card) => card.id !== id))
  }

  const saveCard = async (card: VitalCard) => {
    if (!card.vitalType) {
      toast.error("Please select a vital type.", { duration: 3000 })
      return
    }

    if (date > today) {
      toast.error("Date cannot be in the future.", { duration: 3000 })
      return
    }

    const payload: CreateVitalDto = {
      vitalType: card.vitalType as VitalType,
      loggedDate: date,
    }

    if (card.vitalType === "BLOOD_PRESSURE") {
      if (!card.systolicValue || !card.diastolicValue) {
        toast.error("Please enter both systolic and diastolic values.", {
          duration: 3000,
        })
        return
      }

      const sys = parseFloat(card.systolicValue)
      const dia = parseFloat(card.diastolicValue)
      const sysLimits = VITAL_LIMITS.BLOOD_PRESSURE.systolic
      const diaLimits = VITAL_LIMITS.BLOOD_PRESSURE.diastolic

      if (isNaN(sys) || sys < sysLimits.min || sys > sysLimits.max) {
        toast.error(
          `Systolic must be between ${sysLimits.min} and ${sysLimits.max} mmHg.`,
          { duration: 3000 }
        )
        return
      }
      if (isNaN(dia) || dia < diaLimits.min || dia > diaLimits.max) {
        toast.error(
          `Diastolic must be between ${diaLimits.min} and ${diaLimits.max} mmHg.`,
          { duration: 3000 }
        )
        return
      }

      payload.systolicValue = sys
      payload.diastolicValue = dia
    } else {
      if (!card.value) {
        toast.error("Please enter a value.", { duration: 3000 })
        return
      }

      const val = parseFloat(card.value)
      const limits = VITAL_LIMITS[
        card.vitalType as keyof typeof VITAL_LIMITS
      ] as {
        min: number
        max: number
        unit: string
      }

      if (isNaN(val) || val < limits.min || val > limits.max) {
        toast.error(
          `${card.vitalType.replace(/_/g, " ")} must be between ${limits.min} and ${limits.max} ${limits.unit}.`,
          { duration: 3000 }
        )
        return
      }

      payload.value = val
    }

    updateCard(card.id, { saving: true })

    try {
      await createVitalApi(payload)
      updateCard(card.id, { saved: true, saving: false })
      toast.success(
        `${card.vitalType.replace(/_/g, " ")} saved successfully.`,
        { duration: 3000 }
      )
    } catch (error: unknown) {
      updateCard(card.id, { saving: false })
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to save vital."
      toast.error(message, { duration: 3000 })
    }
  }

  const handleDone = () => {
    const unsaved = cards.some((c) => !c.saved && c.vitalType !== "")
    if (unsaved) {
      toast.warning("You have unsaved vitals.", {
        duration: 5000,
        description: "Save or remove them before leaving.",
        action: {
          label: "Leave anyway",
          onClick: () => navigate("/my-vitals"),
        },
      })
      return
    }
    navigate("/my-vitals")
  }

  const getValueField = (card: VitalCard) => {
    if (card.vitalType === "BLOOD_PRESSURE") {
      return (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Label className="text-xs text-gray-400">
              Systolic (50–300 mmHg)
            </Label>
            <Input
              type="number"
              min={50}
              max={300}
              placeholder="120"
              value={card.systolicValue}
              onChange={(e) =>
                updateCard(card.id, { systolicValue: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <span className="mt-5 text-gray-400">/</span>
          <div className="flex-1">
            <Label className="text-xs text-gray-400">
              Diastolic (20–200 mmHg)
            </Label>
            <Input
              type="number"
              min={20}
              max={200}
              placeholder="80"
              value={card.diastolicValue}
              onChange={(e) =>
                updateCard(card.id, { diastolicValue: e.target.value })
              }
              className="mt-1"
            />
          </div>
        </div>
      )
    }

    if (card.vitalType === "SLEEP") {
      return (
        <div>
          <Label className="text-xs text-gray-400">Hours (0–24)</Label>
          <Input
            type="number"
            min={0}
            max={24}
            placeholder="Enter hours"
            value={card.value}
            onChange={(e) => updateCard(card.id, { value: e.target.value })}
            className="mt-1"
          />
        </div>
      )
    }

    const labelMap: Partial<Record<VitalType, string>> = {
      HEART_RATE: "BPM (20–300)",
      BLOOD_GLUCOSE: "mg/dL (20–600)",
      WEIGHT: "kg (5–300)",
    }

    const minMaxMap: Partial<Record<VitalType, { min: number; max: number }>> =
      {
        HEART_RATE: { min: 20, max: 300 },
        BLOOD_GLUCOSE: { min: 20, max: 600 },
        WEIGHT: { min: 5, max: 300 },
      }

    const limits = card.vitalType ? minMaxMap[card.vitalType] : undefined

    return (
      <div>
        <Label className="text-xs text-gray-400">
          {card.vitalType ? (labelMap[card.vitalType] ?? "") : ""}
        </Label>
        <Input
          type="number"
          min={limits?.min}
          max={limits?.max}
          placeholder="Enter value"
          value={card.value}
          onChange={(e) => updateCard(card.id, { value: e.target.value })}
          className="mt-1"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Log Today's Vitals
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep track of your health journey with a quick daily update.
          </p>
        </div>
        <Button
          onClick={handleDone}
          variant="outline"
          className="border-gray-200"
        >
          Done
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* left — form */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {/* date */}
            <div className="rounded-xl bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <Label className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                Entry Date
              </Label>
              <Input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 max-w-xs"
              />
            </div>

            {/* vital cards */}
            {cards.map((card) => (
              <div
                key={card.id}
                className={`rounded-xl border bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md ${
                  card.saved ? "border-green-200" : "border-gray-100"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <Select
                    value={card.vitalType}
                    onValueChange={(val) =>
                      updateCard(card.id, {
                        vitalType: val as VitalType,
                        value: "",
                        systolicValue: "",
                        diastolicValue: "",
                        saved: false,
                      })
                    }
                    disabled={card.saved}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select vital type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VITAL_TYPES.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          disabled={
                            savedVitalTypes.includes(type.value) &&
                            card.vitalType !== type.value
                          }
                        >
                          {type.label}
                          {savedVitalTypes.includes(type.value) &&
                            card.vitalType !== type.value &&
                            " (already logged)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {card.saved ? (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Saved</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => removeCard(card.id)}
                      className="text-gray-300 transition-colors hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {card.vitalType && !card.saved && (
                  <div className="space-y-3">
                    {getValueField(card)}
                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => saveCard(card)}
                        disabled={card.saving}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        {card.saving ? "Saving..." : "Save Vital"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* add another vital */}
            <button
              onClick={addCard}
              className="flex items-center gap-2 text-sm font-medium text-green-600 transition-colors hover:text-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Another Vital
            </button>
          </div>
        </div>

        {/* right — tip cards */}
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Healthy Tips
              </p>
            </div>
            <ul className="space-y-3">
              {HEALTHY_TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  <p className="text-xs text-gray-500">{tip}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-green-900 p-4 transition-shadow duration-200 hover:shadow-lg">
            <div className="relative z-10">
              <p className="text-sm font-semibold text-white">
                Join the Morning Flow
              </p>
              <p className="mt-1 text-xs text-green-300">
                Live session starting in 20 mins
              </p>
            </div>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </div>
      </div>

      {/* consistency pays off — streak card */}
      {streak.currentStreak > 0 && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-violet-100 bg-violet-50 px-5 py-4 transition-shadow duration-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
              <Flame className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-violet-800">
                Consistency Pays Off!
              </p>
              <p className="text-xs text-violet-500">
                You're on a {streak.currentStreak}-day streak of logging your
                vitals. Keep it up!
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-violet-700">
              {String(streak.currentStreak).padStart(2, "0")}
            </p>
            <p className="text-xs font-medium text-violet-400 uppercase">
              Days
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
