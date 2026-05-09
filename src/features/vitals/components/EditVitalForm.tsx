import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { fetchVitalsApi, updateVitalApi } from "../api/vitalsApi"
import type { VitalResponseDto } from "../types/vital.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditVitalForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [vital, setVital] = useState<VitalResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [value, setValue] = useState("")
  const [systolicValue, setSystolicValue] = useState("")
  const [diastolicValue, setDiastolicValue] = useState("")

  useEffect(() => {
    const loadVital = async () => {
      try {
        const response = await fetchVitalsApi({ page: 1, limit: 100 })
        const found = response.data.find((v) => v.id === parseInt(id ?? "0"))
        if (!found) {
          toast.error("Vital not found.")
          navigate("/my-vitals")
          return
        }
        setVital(found)
        setValue(found.value?.toString() ?? "")
        setSystolicValue(found.systolicValue?.toString() ?? "")
        setDiastolicValue(found.diastolicValue?.toString() ?? "")
      } catch {
        toast.error("Failed to load vital.")
        navigate("/my-vitals")
      } finally {
        setLoading(false)
      }
    }
    loadVital()
  }, [id, navigate])
  const handleSave = async () => {
    if (!vital) return

    const payload: { value?: number; systolicValue?: number; diastolicValue?: number } = {}

    if (vital.vitalType === "BLOOD_PRESSURE") {
      if (!systolicValue || !diastolicValue) {
        toast.error("Please enter both systolic and diastolic values.")
        return
      }
      payload.systolicValue = parseFloat(systolicValue)
      payload.diastolicValue = parseFloat(diastolicValue)
    } else {
      if (!value) {
        toast.error("Please enter a value.")
        return
      }
      payload.value = parseFloat(value)
    }

    setSaving(true)
    try {
      await updateVitalApi(vital.id, payload)
      toast.success("Vital updated successfully.")
      navigate("/my-vitals")
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update vital."
      toast.error(message)
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

  if (!vital) return null

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Vital</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update your{" "}
            <span className="font-medium">
              {vital.vitalType.replace(/_/g, " ")}
            </span>{" "}
            reading for {vital.loggedDate}.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/my-vitals")}
          className="border-gray-200">
          Cancel
        </Button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        {vital.vitalType === "BLOOD_PRESSURE" ? (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label className="text-xs text-gray-400">Systolic</Label>
              <Input
                type="number"
                min={0}
                value={systolicValue}
                onChange={(e) => setSystolicValue(e.target.value)}
                className="mt-1"
              />
            </div>
            <span className="mt-5 text-gray-400">/</span>
            <div className="flex-1">
              <Label className="text-xs text-gray-400">Diastolic</Label>
              <Input
                type="number"
                min={0}
                value={diastolicValue}
                onChange={(e) => setDiastolicValue(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          <div>
            <Label className="text-xs text-gray-400">
              {vital.unit ?? "Value"}
            </Label>
            <Input
              type="number"
              min={0}
              max={vital.vitalType === "SLEEP" ? 24 : undefined}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1 max-w-xs"
            />
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white"> {saving ? "Saving..." : "Update Vital"}
          </Button>
        </div>
      </div>
    </div>
  )
}