"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ServiceCategory } from "@/lib/types"

interface CategoryDropdownProps {
  value: ServiceCategory | ""
  onValueChange: (value: ServiceCategory) => void
  disabled?: boolean
}

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: "FOOD", label: "Food & Nutrition" },
  { value: "SHELTER", label: "Shelter & Housing" },
  { value: "MEDICAL", label: "Medical Help" },
  { value: "MENTAL_HEALTH", label: "Mental Health Support" },
  { value: "COMMUNITY_NGOS", label: "Community NGOs" },
  { value: "RETIREMENT_HOMES", label: "Retirement Homes" },
  { value: "OTHER", label: "Other Essential Services" },
]

export function CategoryDropdown({ value, onValueChange, disabled }: CategoryDropdownProps) {
  return (
    <Select value={value} onValueChange={(val) => onValueChange(val as ServiceCategory)} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="What kind of help are you looking for?" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORIES.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
