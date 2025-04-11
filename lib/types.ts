export interface Employee {
  _id: string
  employeeId: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  joiningDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "user"
  createdAt: Date
  updatedAt: Date
}
