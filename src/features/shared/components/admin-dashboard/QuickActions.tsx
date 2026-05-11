import { AlertTriangle, UserPlus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminQuickActions() {
  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl bg-green-50 p-4 text-left hover:bg-green-100"
        >
          <UserPlus className="h-5 w-5 text-green-600" />

          <div>
            <p className="text-sm font-semibold text-gray-900">Add Staff</p>
            <p className="text-xs text-gray-500">Onboard new practitioners</p>
          </div>
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl bg-red-50 p-4 text-left hover:bg-red-100"
        >
          <AlertTriangle className="h-5 w-5 text-red-500" />

          <div>
            <p className="text-sm font-semibold text-gray-900">
              View Flagged Profiles
            </p>
            <p className="text-xs text-gray-500">24 critical issues pending</p>
          </div>
        </button>
      </CardContent>
    </Card>
  )
}
