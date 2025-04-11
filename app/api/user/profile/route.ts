import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models/user"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, email } = body

    if (!name || !email) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    await connectToDatabase()

    // Find user by email since that's what we have in the session
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return new NextResponse("Email already in use", { status: 400 })
      }
    }

    user.name = name
    user.email = email
    await user.save()

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 