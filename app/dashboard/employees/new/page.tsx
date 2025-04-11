import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EmployeeForm } from "@/components/employee-form"

export default async function NewEmployeePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Add Employee" text="Add a new employee to your directory." />
      <div className="grid gap-8">
        <EmployeeForm />
      </div>
    </DashboardShell>
  )
}
