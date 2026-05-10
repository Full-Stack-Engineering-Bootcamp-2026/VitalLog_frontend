import { UserCircle, Pencil } from "lucide-react"
import { useRef } from "react"
import type { ProfileResponseDto } from "../types/profile.types"

interface Props {
  profile: ProfileResponseDto
  imagePreview: string | null
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ProfileIdentityCard({ profile, imagePreview, onImageChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border bg-white p-6 text-center">
      <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        {imagePreview ?? profile.profileImageUrl ? (
          <img
            src={imagePreview ?? profile.profileImageUrl ?? ""}
            alt="profile"
            className="h-24 w-24 rounded-full object-cover ring-2 ring-green-200"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <UserCircle className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <span className="absolute right-0 bottom-0 rounded-full bg-green-600 p-1">
          <Pencil size={10} className="text-white" />
        </span>
        <span className="absolute right-1 bottom-7 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
      </div>

      <h2 className="mt-3 text-lg font-semibold">{profile.name}</h2>
      <span className="mt-1 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold uppercase text-green-700">
        Member
      </span>
      <p className="mt-2 text-xs text-muted-foreground">{profile.email}</p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={onImageChange}
      />
    </div>
  )
}