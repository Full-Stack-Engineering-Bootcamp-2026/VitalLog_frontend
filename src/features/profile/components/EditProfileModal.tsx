import { UserCircle, Pencil } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UpdateProfileRequestDto, ProfileResponseDto } from "../types/profile.types"

interface Props {
  open: boolean
  onOpenChange: (val: boolean) => void
  form: UpdateProfileRequestDto
  onFormChange: (form: UpdateProfileRequestDto) => void
  onSave: () => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imagePreview: string | null
  profile: ProfileResponseDto
}

export default function EditProfileModal({
  open, onOpenChange, form, onFormChange, onSave, onImageChange, imagePreview, profile,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* image upload */}
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ?? profile.profileImageUrl ? (
                <img
                  src={imagePreview ?? profile.profileImageUrl ?? ""}
                  alt="preview"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-green-200"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <UserCircle className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <span className="absolute right-0 bottom-0 rounded-full bg-green-600 p-1">
                <Pencil size={10} className="text-white" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">Profile Photo</p>
              <p className="text-xs text-muted-foreground">JPEG, PNG or WEBP · Max 5MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={onImageChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Age</label>
              <Input
                type="number"
                placeholder="28"
                value={form.age ?? ""}
                onChange={(e) => onFormChange({ ...form, age: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Gender</label>
              <Select
                value={form.gender ?? ""}
                onValueChange={(val) => onFormChange({ ...form, gender: val as "MALE" | "FEMALE" | "OTHER" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Height (cm)</label>
              <Input
                type="number"
                placeholder="172"
                value={form.height ?? ""}
                onChange={(e) => onFormChange({ ...form, height: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Weight (kg)</label>
              <Input
                type="number"
                placeholder="68.5"
                value={form.weight ?? ""}
                onChange={(e) => onFormChange({ ...form, weight: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Medical Conditions</label>
            <Input
              placeholder="e.g. Diabetes, Hypertension"
              value={form.medicalConditions ?? ""}
              onChange={(e) => onFormChange({ ...form, medicalConditions: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Separate multiple conditions with a comma</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Fitness Goals</label>
            <Input
              placeholder="e.g. Lose Weight, Improve Stamina"
              value={form.fitnessGoal ?? ""}
              onChange={(e) => onFormChange({ ...form, fitnessGoal: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Separate multiple goals with a comma</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={onSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}