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
      toast.error("Please select a vital type.")
      return
    }

    const payload: CreateVitalDto = {
      vitalType: card.vitalType as VitalType,
      loggedDate: date,
    }

    if (card.vitalType === "BLOOD_PRESSURE") {
      if (!card.systolicValue || !card.diastolicValue) {
        toast.error("Please enter both systolic and diastolic values.")
        return
      }
      payload.systolicValue = parseFloat(card.systolicValue)
      payload.diastolicValue = parseFloat(card.diastolicValue)
    } else {
      if (!card.value) {
        toast.error("Please enter a value.")
        return
      }
      payload.value = parseFloat(card.value)
    }

    updateCard(card.id, { saving: true })

    try {
      await createVitalApi(payload)
      updateCard(card.id, { saved: true, saving: false })
      toast.success(`${card.vitalType.replace(/_/g, " ")} saved successfully.`)
    } catch (error: unknown) {
      updateCard(card.id, { saving: false })
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to save vital."
      toast.error(message)
    }
  }

  const handleDone = () => {
    const unsaved = cards.some((c) => !c.saved && c.vitalType !== "")
    if (unsaved) {
      const confirmed = window.confirm(
        "You have unsaved vitals. Leave anyway?",
      )
      if (!confirmed) return
    }
    navigate("/my-vitals")
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
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

      {/* Date picker */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <Label className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Entry Date
        </Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2 max-w-xs"
        />
      </div>

      {/* Vital cards */}
      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`rounded-xl bg-white p-5 shadow-sm border transition-colors ${
              card.saved ? "border-green-200" : "border-gray-100"
            }`}
          >
            {/* Card header */}
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
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
                cards.length > 1 && (
                  <button
                    onClick={() => removeCard(card.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )
              )}
            </div>

            {/* Fields */}
            {card.vitalType && !card.saved && (
              <div className="space-y-3">
                {card.vitalType === "BLOOD_PRESSURE" ? (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="text-xs text-gray-400">
                        Systolic
                      </Label>
                      <Input
                        type="number"
                        placeholder="120"
                        value={card.systolicValue}
                        onChange={(e) =>
                          updateCard(card.id, {
                            systolicValue: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <span className="mt-5 text-gray-400">/</span>
                    <div className="flex-1">
                      <Label className="text-xs text-gray-400">
                        Diastolic
                      </Label>
                      <Input
                        type="number"
                        placeholder="80"
                        value={card.diastolicValue}
                        onChange={(e) =>
                          updateCard(card.id, {
                            diastolicValue: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label className="text-xs text-gray-400">
                      {card.vitalType === "HEART_RATE" && "BPM"}
                      {card.vitalType === "BLOOD_GLUCOSE" && "mg/dL"}
                      {card.vitalType === "WEIGHT" && "kg"}
                      {card.vitalType === "SLEEP" && "Hours"}
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter value"
                      value={card.value}
                      onChange={(e) =>
                        updateCard(card.id, { value: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => saveCard(card)}
                    disabled={card.saving}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {card.saving ? "Saving..." : "Save Vital"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add another vital */}
      <button
        onClick={addCard}
        className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Another Vital
      </button>
    </div>
  )
}