import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { exportEmployees } from "@/lib/actions/employee-actions"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const format = (searchParams.get("format") || "csv") as "csv" | "json"

  try {
    const data = await exportEmployees(format)

    if (format === "csv") {
      return new NextResponse(data, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=employees.csv",
        },
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error exporting employees:", error)
    return NextResponse.json({ error: "Failed to export employees" }, { status: 500 })
  }
}
