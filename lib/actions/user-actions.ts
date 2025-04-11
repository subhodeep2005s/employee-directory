"use server"

import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models/user"
import { hash } from "bcrypt"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "user"]),
})

export async function registerUser(userData: z.infer<typeof userSchema>) {
  const validatedFields = userSchema.parse(userData)

  await connectToDatabase()

  // Check if user already exists
  const existingUser = await User.findOne({ email: validatedFields.email })

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Hash the password
  const hashedPassword = await hash(validatedFields.password, 10)

  // Create the user
  const user = await User.create({
    name: validatedFields.name,
    email: validatedFields.email,
    password: hashedPassword,
    role: validatedFields.role,
  })

  return { id: user._id.toString() }
}
