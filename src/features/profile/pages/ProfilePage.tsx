import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchProfileApi, updateProfileApi, uploadProfileImageApi } from "../api/profileApi"
import { fetchStreakApi } from "@/features/vitals/api/streakApi"
import type { ProfileResponseDto, UpdateProfileRequestDto } from "../types/profile.types"
import type { StreakResponseDto } from "@/features/vitals/api/streakApi"
import ProfileIdentityCard from "../components/ProfileIdentityCard"
import ProfileStatGrid from "../components/ProfileStatGrid"
import HealthConditionsCard from "../components/HealthConditions"
import FitnessGoalsCard from "../components/FitnessGoalsCard"
import WellnessScore from "../components/WellnessScore"
import EditProfileModal from "../components/EditProfileModal"

const toTags = (val: string | null): string[] =>
  val ? val.split(",").map((s) => s.trim()).filter(Boolean) : []

const getWellnessScore = (profile: ProfileResponseDto): number => {
  const fields = [profile.age, profile.gender, profile.height, profile.weight, profile.medicalConditions, profile.fitnessGoal]
  const filled = fields.filter((f) => f !== null && f !== "").length
  return Math.round((filled / fields.length) * 100)
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponseDto | null>(null)
  const [streak, setStreak] = useState<StreakResponseDto>({ currentStreak: 0, longestStreak: 0, lastLoggedDate: null })
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState<UpdateProfileRequestDto>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [profileData, streakData] = await Promise.all([
          fetchProfileApi(),
          fetchStreakApi(),
        ])
        setProfile(profileData)
        setStreak(streakData)
      } catch {
        toast.error("Failed to load profile.", { duration: 3000 })
      }
    }
    load()
  }, [])

  const openEdit = () => {
    if (!profile) return
    setForm({
      age: profile.age ?? undefined,
      gender: profile.gender ?? undefined,
      height: profile.height ?? undefined,
      weight: profile.weight ?? undefined,
      medicalConditions: profile.medicalConditions ?? undefined,
      fitnessGoal: profile.fitnessGoal ?? undefined,
    })
    setImagePreview(null)
    setEditOpen(true)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    try {
      const signedUrl = await uploadProfileImageApi(file)
      setProfile((prev) => prev ? { ...prev, profileImageUrl: signedUrl } : prev)
      toast.success("Profile image updated")
    } catch {
      toast.error("Image upload failed")
      setImagePreview(null)
    }
  }

  const handleSave = async () => {
    try {
      const updated = await updateProfileApi(form)
      setProfile(updated)
      setEditOpen(false)
      toast.success("Profile updated successfully")
    } catch {
      toast.error("Failed to update profile")
    }
  }

  if (!profile) return null

  return (
    <div className="space-y-4">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Health Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your baseline metrics and health preferences.</p>
        </div>
        <Button variant="outline" onClick={openEdit} className="gap-2">
          <Pencil size={14} />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ProfileIdentityCard
          profile={profile}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
        />
        <ProfileStatGrid profile={profile} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HealthConditionsCard
          conditions={toTags(profile.medicalConditions)}
          onAddClick={openEdit}
        />
        <FitnessGoalsCard
          goals={toTags(profile.fitnessGoal)}
          streak={streak}
          onAddClick={openEdit}
        />
      </div>

      <WellnessScore score={getWellnessScore(profile)} />

      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        form={form}
        onFormChange={setForm}
        onSave={handleSave}
        onImageChange={handleImageChange}
        imagePreview={imagePreview}
        profile={profile}
      />
    </div>
  )
}