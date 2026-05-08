import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { createVitalApi } from "../api/vitalsApi"
import type { CreateVitalDto, VitalType } from "../types/vital.types"
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

  // track saved vital types to prevent duplicate selection
  const savedVitalTypes = cards
    .filter((c) => c.saved)
    .map((c) => c.vitalType)

  const updateCard = (id: number, updates: Partial<VitalCard>) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card)),
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
      payload.systolicValue = parseFloat(card.systolicValue)
      payload.diastolicValue = parseFloat(card.diastolicValue)
    } else {
      if (!card.value) {
        toast.error("Please enter a value.", { duration: 3000 })
        return
      }
      payload.value = parseFloat(card.value)
    }

    updateCard(card.id, { saving: true })

    try {
      await createVitalApi(payload)
      updateCard(card.id, { saved: true, saving: false })
      toast.success(
        `${card.vitalType.replace(/_/g, " ")} saved successfully.`,
        { duration: 3000 },
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
            <Label className="text-xs text-gray-400">Systolic</Label>
            <Input
              type="number"
              min={0}
              placeholder="120"
              value={card.systolicValue}
              onChange={(e) =>
                updateCard(card.id, { systolicValue: e.target.value })}
              className="mt-1"
            />
          </div>
          <span className="mt-5 text-gray-400">/</span>
          <div className="flex-1">
            <Label className="text-xs text-gray-400">Diastolic</Label>
            <Input
              type="number"
              min={0}
              placeholder="80"
              value={card.diastolicValue}
              onChange={(e) =>
                updateCard(card.id, { diastolicValue: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      )
    }

    if (card.vitalType === "SLEEP") {
      return (
        <div>
          <Label className="text-xs text-gray-400">Hours (0 - 24)</Label>
          <Input
            type="number"
            min={0}
            max={24}
            placeholder="Enter hours"
            value={card.value}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              if (!isNaN(val) && val >= 0 && val <= 24) {
                updateCard(card.id, { value: String(val) })
              } else if (e.target.value === "") {
                updateCard(card.id, { value: "" })
              }
            }}
            className="mt-1"
          />
        </div>
      )
    }

    const labelMap: Partial<Record<VitalType, string>> = {
      HEART_RATE: "BPM",
      BLOOD_GLUCOSE: "mg/dL",
      WEIGHT: "kg",
    }

    return (
      <div>
        <Label className="text-xs text-gray-400">
          {card.vitalType ? (labelMap[card.vitalType] ?? "") : ""}
        </Label>
        <Input
          type="number"
          min={0}
          placeholder="Enter value"
          value={card.value}
          onChange={(e) => updateCard(card.id, { value: e.target.value })}
          className="mt-1"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
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
          className="border-gray-200">
          Done
        </Button>
      </div>

      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <Label className="text-xs font-medium uppercase tracking-wide text-gray-400">
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

      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`rounded-xl bg-white p-5 shadow-sm border transition-colors ${
              card.saved ? "border-green-200" : "border-gray-100"
            }`}>
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
                disabled={card.saved}>
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
                      }>
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
                  className="text-gray-300 hover:text-red-400 transition-colors">
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
                    className="bg-green-600 hover:bg-green-700 text-white">
                    {card.saving ? "Saving..." : "Save Vital"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addCard}
        className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
        <Plus className="h-4 w-4" />
        Add Another Vital
      </button>
    </div>
  )
}