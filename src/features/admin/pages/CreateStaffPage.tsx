import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { useNavigate, Link } from "react-router-dom"

import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Mail, User, Users } from "lucide-react"

const createStaffSchema = z.object({
  name: z.string().min(2, "Full name is required"),

  email: z.email("Enter valid email"),
})

type CreateStaffFormData = z.infer<typeof createStaffSchema>

export default function CreateStaffPage() {
  const navigate = useNavigate()

  const form = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = async (data: CreateStaffFormData) => {
    try {
      console.log(data)

      toast.success("Staff account created successfully")

      navigate("/admin/manage-staff")
    } catch (error) {
      console.log(error)

      toast.error("Failed to create staff account")
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-700 sm:text-4xl">
            VitalLog
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Active Calm Health Companion
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              to="/admin/manage-staff"
              className="flex items-center gap-1 hover:text-primary"
            >
              Back
            </Link>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create Staff Account
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a new staff member and send temporary credentials
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Staff Registration Form</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              {/*validate first if valid call onSubmit*/}
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>

                      <FormControl>
                        <div className="relative">
                          <User
                            size={18}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                          />

                          <Input
                            placeholder="Enter full name"
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>

                      <FormControl>
                        <div className="relative">
                          <Mail
                            size={18}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                          />

                          <Input
                            type="email"
                            placeholder="name@example.com"
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button
                    type="submit"
                    className="h-11 flex-1 gap-2 sm:flex-none"
                  >
                    <User size={18} />
                    Create Staff Account
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => navigate("/admin/manage-staff")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
