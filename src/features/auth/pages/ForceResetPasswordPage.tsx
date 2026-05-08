import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Eye, EyeOff, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { forceResetPasswordApi } from "../api/authApi"
import { toast } from "sonner"
const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",

    path: ["confirmPassword"],
  })

type ResetFormData = z.infer<typeof resetSchema>

export default function ForceResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),

    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const password = form.watch("password")

  const PasswordStrengthFunction = (password: string) => {
    let points = 0

    // Min length
    if (password.length >= 8) points = points + 20

    // Upper case
    if (/[A-Z]/.test(password)) points = points + 20

    // Lower case
    if (/[a-z]/.test(password)) points = points + 20

    // Number
    if (/[0-9]/.test(password)) points = points + 20

    // Special char
    if (/[^A-Za-z0-9]/.test(password)) points = points + 20

    return points
  }

  const strength = PasswordStrengthFunction(password)

  const strengthText =
    strength < 40
      ? "Weak password"
      : strength < 80
        ? "Medium password"
        : "Strong password"

  const onSubmit = async (data: ResetFormData) => {
    console.log(data)
  }

  return (
    <div className="min-h-screen bg-[#f5faf6]">
      <div className="border-b bg-white py-3">
        <div className="flex items-center justify-center gap-2">
          <span className="font-medium text-green-700">VitalLog</span>
        </div>
      </div>

      <div className="border-b bg-yellow-100 py-3 text-center text-sm font-medium text-yellow-800">
        You must set a new password before continuing.
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md space-y-6">
          <div>
            <div className="inline-flex rounded-full bg-green-100 px-4 py-1 text-xs font-semibold text-green-700">
              SECURITY PROTOCOL
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-gray-900">
              Secure Your Access
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              As a staff or administrator member of VitalLog Health, maintaining
              a secure password is critical for protecting patient metrics and
              sensitive health data.
            </p>
          </div>

          <Card className="rounded-xl border shadow-sm">
            <CardContent className="flex gap-4 p-5">
              <div>
                <h3 className="font-medium">Compliance Requirement</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your temporary password has expired or is being reset for
                  first-time use.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border shadow-sm">
            <CardContent className="flex gap-4 p-5">
              <div>
                <h3 className="font-medium">Data Integrity</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  New credentials ensure that all VitalLog interactions are
                  tracked and authorized.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full max-w-md rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>

                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="h-11 pr-10"
                            {...field}
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      {/* Password Strength */}
                      <div className="space-y-2">
                        <Progress value={strength} className="h-2" />

                        <div className="flex justify-between text-xs">
                          <span className="text-primary">{strengthText}</span>

                          <span className="text-muted-foreground">
                            {strength}%
                          </span>
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
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            className="h-11 pr-10"
                            {...field}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="h-11 w-full">
                  Set Password & Continue
                </Button>

                <p className="text-center text-xs leading-5 text-muted-foreground">
                  By updating your password, you agree to VitalLogs internal
                  security policy and data access protocols.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
    </div>
  )
}
