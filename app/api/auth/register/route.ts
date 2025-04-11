import { NextResponse } from "next/server"
import { registerUser } from "@/lib/actions/user-actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await registerUser(body)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Failed to register user" }, { status: 500 })
  }
}
