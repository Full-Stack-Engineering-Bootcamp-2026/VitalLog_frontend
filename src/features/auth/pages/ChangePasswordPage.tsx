import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, ShieldCheck, CircleCheck, Lightbulb, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Form, FormField, FormLabel, FormControl, FormMessage, FormItem,
} from "@/components/ui/form"
import API from "@/api/axios"
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
function getStrength(password: string) {
  let points = 0
  if (password.length >= 8) points += 20
  if (/[A-Z]/.test(password)) points += 20
  if (/[a-z]/.test(password)) points += 20
  if (/[0-9]/.test(password)) points += 20
  if (/[^A-Za-z0-9]/.test(password)) points += 20
  return points
}
const guidelines = [
  "At least 8 characters long",
  "Include one uppercase letter",
  "One special character (@#$%^&*)",
]
export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const newPassword = form.watch("newPassword")
  const strength = getStrength(newPassword)
  const strengthLabel =
    strength < 40 ? "Weak" : strength < 80 ? "Medium" : "Strong"

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await API.patch("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success("Password updated successfully")
      form.reset()
    } catch (error) {
      console.log(error)
      toast.error("Current password is incorrect")
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Left Sidebar ── */}
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <h2 className="font-semibold">Security Center</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Protect your VitalLog account by using a strong, unique password.
                  We recommend a combination of letters, numbers, and symbols.
                </p>
              </CardContent>
            </Card>

            <div className="px-1">
              <h3 className="mb-3 font-semibold">Password Guidelines</h3>
              <ul className="space-y-2">
                {guidelines.map((g) => (
                  <li key={g} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CircleCheck className="h-4 w-4 shrink-0 text-green-600" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right Main ── */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardContent className="p-6 sm:p-8">

                {/* Header */}
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold">Change Password</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ensure your account stays secure by updating your credentials.
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    LAST UPDATED: 30 DAYS AGO
                  </span>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                    {/* Current Password */}
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                type={showCurrent ? "text" : "password"}
                                placeholder="Enter current password"
                                className="h-12 bg-input pr-10 pl-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                              >
                                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* New + Confirm side by side */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                      {/* New Password */}
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  type={showNew ? "text" : "password"}
                                  placeholder="Create new password"
                                  className="h-12 bg-input pr-10 pl-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNew(!showNew)}
                                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                                >
                                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </FormControl>
                            {/* Strength bar */}
                            <div className="space-y-1">
                              <Progress value={strength} className="h-2" />
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Password Strength</span>
                                <span className="font-medium text-green-600">{newPassword ? strengthLabel : ""}</span>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Confirm Password */}
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  type={showConfirm ? "text" : "password"}
                                  placeholder="Repeat new password"
                                  className="h-12 bg-input pr-10 pl-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirm(!showConfirm)}
                                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                                >
                                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" className="px-8">
                        Update Password
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        className="px-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Pro Tip */}
            <Card className="border-violet-100 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30">
              <CardContent className="flex gap-3 p-5">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
                <div>
                  <p className="font-medium text-violet-700 dark:text-violet-300">
                    Pro Tip: Enable 2FA
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    For maximum security, enable Two-Factor Authentication in your Privacy Settings.
                    This adds an extra layer of protection to your health data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}