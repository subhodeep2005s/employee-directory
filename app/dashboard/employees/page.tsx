import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EmployeeTable } from "@/components/employee-table"
import { EmployeeSearch } from "@/components/employee-search"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Employees" text="Manage your employee directory.">
        <Link href="/dashboard/employees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </DashboardHeader>
      <div className="mb-4">
        <EmployeeSearch />
      </div>
      <EmployeeTable />
    </DashboardShell>
  )
}
