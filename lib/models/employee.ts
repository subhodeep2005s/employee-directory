import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    joiningDate: {
      type: Date,
      required: [true, "Joining date is required"],
    },
  },
  {
    timestamps: true,
  },
)

export const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema)
