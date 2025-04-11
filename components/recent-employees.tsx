"use client"

import { useEmployees } from "@/lib/hooks/use-employees"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { UserRound } from "lucide-react"
import Link from "next/link"

export function RecentEmployees() {
  const { employees, isLoading } = useEmployees()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  // Sort employees by joining date (most recent first)
  const sortedEmployees = [...(employees || [])]
    .sort((a, b) => {
      return new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()
    })
    .slice(0, 5) // Show only 5 most recent employees

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Employees</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEmployees.length > 0 ? (
          <div className="space-y-4">
            {sortedEmployees.map((employee) => (
              <div key={employee._id} className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <UserRound className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <Link href={`/dashboard/employees/${employee._id}`} className="font-medium hover:underline">
                    {employee.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {employee.position} • {employee.department}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">{format(new Date(employee.joiningDate), "PP")}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No employees found</div>
        )}
      </CardContent>
    </Card>
  )
}
