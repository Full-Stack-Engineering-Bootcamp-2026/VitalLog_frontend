import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import { Plus, Users, Clock3, UserCheck } from "lucide-react"

const staffData = [
  {
    id: 1,
    name: "Dr. Julianne Moore",
    email: "j.moore@vitallog.com",
    status: "Active",
    joinedDate: "Oct 12, 2023",
  },

  {
    id: 2,
    name: "Marcus Thompson",
    email: "m.thompson@vitallog.com",
    status: "Active",
    joinedDate: "Jan 05, 2024",
  },

  {
    id: 3,
    name: "Elena Rodriguez",
    email: "e.rodriguez@vitallog.com",
    status: "Inactive",
    joinedDate: "May 22, 2022",
  },
]

export default function StaffManagementPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Management / Staff List
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Staff Accounts
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage administrative and clinical staff access levels.
          </p>
        </div>

        <Link to="/staff/create">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus size={18} />
            Add Staff
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-full bg-green-100 p-3 text-green-700">
              <Users size={18} />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Total Staff</p>

              <h2 className="text-2xl font-bold">42</h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-full bg-blue-100 p-3 text-blue-700">
              <UserCheck size={18} />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Active Now</p>

              <h2 className="text-2xl font-bold">38</h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-full bg-orange-100 p-3 text-orange-700">
              <Clock3 size={18} />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Pending Invites</p>

              <h2 className="text-2xl font-bold">4</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>

                  <TableHead>Email</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Joined Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {staffData.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="min-w-[180px] font-medium">
                      {staff.name}
                    </TableCell>

                    <TableCell className="min-w-[220px]">
                      {staff.email}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          staff.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="min-w-[140px]">
                      {staff.joinedDate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
