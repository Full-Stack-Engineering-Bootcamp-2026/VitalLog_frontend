import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { UserCircle, Pencil, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  fetchProfileApi,
  updateProfileApi,
  uploadProfileImageApi,
} from "../api/profileApi"
import type {
  ProfileResponseDto,
  UpdateProfileRequestDto,
} from "../types/profile.types"

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<ProfileResponseDto | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState<UpdateProfileRequestDto>({})

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProfileApi()
        setProfile(data)
        setForm({
          age: data.age ?? undefined,
          gender: data.gender ?? undefined,
          height: data.height ?? undefined,
          weight: data.weight ?? undefined,
        })
      } catch {
        toast.error("Failed to load profile.")
      }
    }
    load()
  }, [])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    try {
      const signedUrl = await uploadProfileImageApi(file)
      setProfile((prev) =>
        prev ? { ...prev, profileImageUrl: signedUrl } : prev
      )
      toast.success("Profile image updated")
    } catch {
      toast.error("Image upload failed")
      setImagePreview(null)
    }
  }

  const handleSave = async () => {
    try {
      await updateProfileApi(form)
      toast.success("Profile updated successfully")
      navigate("/profile")
    } catch {
      toast.error("Failed to update profile")
    }
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-3xl">

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Personal Information</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your health profile updated to ensure accurate metric
            calculations and personalized insights.
          </p>
        </div>

        <div className="space-y-4">

          {/* profile picture card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  {(imagePreview ?? profile.profileImageUrl) ? (
                    <img
                      src={imagePreview ?? profile.profileImageUrl ?? ""}
                      alt="profile"
                      className="h-20 w-20 rounded-full object-cover ring-2 ring-green-200"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <UserCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <span className="absolute right-0 bottom-0 rounded-full bg-green-600 p-1">
                    <Pencil size={10} className="text-white" />
                  </span>
                </div>

                <div>
                  <p className="font-semibold">Profile Picture</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    JPG, PNG or WEBP · Max size 5MB
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1"
                    >
                      Upload New
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setImagePreview(null)
                        setProfile((prev) =>
                          prev ? { ...prev, profileImageUrl: null } : prev
                        )
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* form card */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* full name — readonly */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Full Name</label>
                  <Input
                    value={profile.name}
                    readOnly
                    className="h-12 bg-muted text-muted-foreground"
                  />
                </div>

                {/* email — readonly */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Email Address</label>
                  <Input
                    value={profile.email}
                    readOnly
                    className="h-12 bg-muted text-muted-foreground"
                  />
                </div>

                {/* age */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Age</label>
                  <Input
                    type="number"
                    placeholder="28"
                    className="h-12"
                    value={form.age ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, age: Number(e.target.value) })
                    }
                  />
                </div>

                {/* gender */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Gender</label>
                  <Select
                    value={form.gender ?? ""}
                    onValueChange={(val) =>
                      setForm({
                        ...form,
                        gender: val as "MALE" | "FEMALE" | "OTHER",
                      })
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* height */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Height (cm)</label>
                  <Input
                    type="number"
                    placeholder="172"
                    className="h-12"
                    value={form.height ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, height: Number(e.target.value) })
                    }
                  />
                </div>

                {/* weight */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Weight (kg)</label>
                  <Input
                    type="number"
                    placeholder="68.5"
                    className="h-12"
                    value={form.weight ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, weight: Number(e.target.value) })
                    }
                  />
                </div>

              </div>

              {/* verified badge */}
              <div className="mt-5 flex items-center gap-3 rounded-lg bg-violet-50 p-4 dark:bg-violet-950/30">
                <ShieldCheck className="h-5 w-5 shrink-0 text-violet-500" />
                <div>
                  <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
                    Verified Member
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your profile status is active and metrics are being synced
                    via VitalLog.
                  </p>
                </div>
              </div>

              {/* actions */}
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="px-8"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} className="px-8">
                  Save Changes
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}