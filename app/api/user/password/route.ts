import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models/user"
import { compare, hash } from "bcrypt"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    await connectToDatabase()

    // Find user by email since that's what we have in the session
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const isPasswordValid = await compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return new NextResponse("Current password is incorrect", { status: 400 })
    }

    const hashedPassword = await hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("[PASSWORD_UPDATE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 