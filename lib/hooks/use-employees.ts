"use client"

import useSWR from "swr"
import type { Employee } from "@/lib/types"
import { useSearchParams } from "next/navigation"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useEmployees() {
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""
  const department = searchParams.get("department") || ""

  // Build the query string
  let queryString = ""
  if (search) queryString += `search=${search}`
  if (department) queryString += `${queryString ? "&" : ""}department=${department}`

  const url = `/api/employees${queryString ? `?${queryString}` : ""}`

  const { data, error, mutate } = useSWR<Employee[]>(url, fetcher)

  return {
    employees: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
