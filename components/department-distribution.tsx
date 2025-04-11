"use client"

import { useEmployees } from "@/lib/hooks/use-employees"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "lucide-react"

export function DepartmentDistribution() {
  const { employees, isLoading } = useEmployees()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Department Distribution</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  // Count employees by department
  const departmentCounts: Record<string, number> = {}

  employees?.forEach((employee) => {
    const dept = employee.department
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1
  })

  // Sort departments by count (descending)
  const sortedDepartments = Object.entries(departmentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) // Show top 5 departments

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Department Distribution</CardTitle>
        <PieChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {sortedDepartments.length > 0 ? (
          <div className="space-y-2">
            {sortedDepartments.map(([dept, count]) => (
              <div key={dept} className="flex items-center">
                <div className="w-full flex justify-between">
                  <span className="text-sm">{dept}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No data available</div>
        )}
      </CardContent>
    </Card>
  )
}
