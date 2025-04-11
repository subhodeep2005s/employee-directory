import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EmployeeForm } from "@/components/employee-form"
import { getEmployeeById } from "@/lib/actions/employee-actions"

export default async function EditEmployeePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const employee = await getEmployeeById(params.id)

  if (!employee) {
    redirect("/dashboard/employees")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Employee" text="Update employee information." />
      <div className="grid gap-8">
        <EmployeeForm employee={employee} />
      </div>
    </DashboardShell>
  )
}
