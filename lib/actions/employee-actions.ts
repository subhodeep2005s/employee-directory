"use server"

import { connectToDatabase } from "@/lib/db"
import { Employee } from "@/lib/models/employee"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createObjectCsvStringifier } from "csv-writer"

const employeeSchema = z.object({
  employeeId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  department: z.string().min(1),
  position: z.string().min(1),
  joiningDate: z.date(),
})

export async function createEmployee(employeeData: z.infer<typeof employeeSchema>) {
  const validatedFields = employeeSchema.parse(employeeData)

  await connectToDatabase()

  // Check if employee already exists
  const existingEmployee = await Employee.findOne({
    $or: [{ employeeId: validatedFields.employeeId }, { email: validatedFields.email }],
  })

  if (existingEmployee) {
    throw new Error("Employee with this ID or email already exists")
  }

  // Create the employee
  const employee = await Employee.create(validatedFields)

  revalidatePath("/dashboard/employees")

  return { id: employee._id.toString() }
}

export async function getEmployees(search?: string, department?: string) {
  await connectToDatabase()

  let query: any = {}

  if (search) {
    query = {
      $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
    }
  }

  if (department) {
    query.department = department
  }

  const employees = await Employee.find(query).sort({ createdAt: -1 })

  return employees.map((employee) => ({
    _id: employee._id.toString(),
    employeeId: employee.employeeId,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    position: employee.position,
    joiningDate: employee.joiningDate,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  }))
}

export async function getEmployeeById(id: string) {
  await connectToDatabase()

  const employee = await Employee.findById(id)

  if (!employee) {
    return null
  }

  return {
    _id: employee._id.toString(),
    employeeId: employee.employeeId,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    position: employee.position,
    joiningDate: employee.joiningDate,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  }
}

export async function updateEmployee(id: string, employeeData: z.infer<typeof employeeSchema>) {
  const validatedFields = employeeSchema.parse(employeeData)

  await connectToDatabase()

  // Check if another employee has the same email or ID
  const existingEmployee = await Employee.findOne({
    $and: [
      { _id: { $ne: id } },
      {
        $or: [{ employeeId: validatedFields.employeeId }, { email: validatedFields.email }],
      },
    ],
  })

  if (existingEmployee) {
    throw new Error("Another employee with this ID or email already exists")
  }

  // Update the employee
  const employee = await Employee.findByIdAndUpdate(id, validatedFields, {
    new: true,
  })

  if (!employee) {
    throw new Error("Employee not found")
  }

  revalidatePath("/dashboard/employees")

  return {
    _id: employee._id.toString(),
    employeeId: employee.employeeId,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    position: employee.position,
    joiningDate: employee.joiningDate,
  }
}

export async function deleteEmployee(id: string) {
  await connectToDatabase()

  const employee = await Employee.findByIdAndDelete(id)

  if (!employee) {
    throw new Error("Employee not found")
  }

  revalidatePath("/dashboard/employees")

  return { success: true }
}

export async function exportEmployees(format: "csv" | "json") {
  await connectToDatabase()

  const employees = await Employee.find().sort({ name: 1 })

  const formattedEmployees = employees.map((employee) => ({
    employeeId: employee.employeeId,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    position: employee.position,
    joiningDate: employee.joiningDate.toISOString().split("T")[0],
  }))

  if (format === "json") {
    return formattedEmployees
  }

  // Create CSV
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: "employeeId", title: "Employee ID" },
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "phone", title: "Phone" },
      { id: "department", title: "Department" },
      { id: "position", title: "Position" },
      { id: "joiningDate", title: "Joining Date" },
    ],
  })

  const header = csvStringifier.getHeaderString()
  const records = csvStringifier.stringifyRecords(formattedEmployees)

  return header + records
}
