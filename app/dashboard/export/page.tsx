import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ExportOptions } from "@/components/export-options"

export default async function ExportPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Export Data" text="Export employee data in different formats." />
      <div className="grid gap-8">
        <ExportOptions />
      </div>
    </DashboardShell>
  )
}
