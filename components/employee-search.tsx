"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const departments = [
  "All Departments",
  "Engineering",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Operations",
  "Product",
  "Customer Support",
]

export function EmployeeSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = React.useState(searchParams.get("search") || "")
  const [department, setDepartment] = React.useState(searchParams.get("department") || "All Departments")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (department && department !== "All Departments") params.set("department", department)

    router.push(`/dashboard/employees?${params.toString()}`)
  }

  const handleReset = () => {
    setSearch("")
    setDepartment("All Departments")
    router.push("/dashboard/employees")
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or email..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">Search</Button>
      <Button type="button" variant="outline" onClick={handleReset}>
        Reset
      </Button>
    </form>
  )
}
