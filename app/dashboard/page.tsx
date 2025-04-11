import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EmployeeStats } from "@/components/employee-stats"
import { RecentEmployees } from "@/components/recent-employees"
import { DepartmentDistribution } from "@/components/department-distribution"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome to your employee directory dashboard." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <EmployeeStats />
        <DepartmentDistribution />
      </div>
      <div className="mt-6">
        <RecentEmployees />
      </div>
    </DashboardShell>
  )
}
