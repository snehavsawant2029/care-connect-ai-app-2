"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, Users } from "lucide-react"
import { getAgeCategory, needsGuardianVerification, isValidAge } from "@/lib/age-utils"
import type { UserAgeInfo } from "@/lib/types"

interface AgeVerificationProps {
  onAgeVerified: (ageInfo: UserAgeInfo) => void
}

export function AgeVerification({ onAgeVerified }: AgeVerificationProps) {
  const [age, setAge] = useState("")
  const [showGuardianQuestion, setShowGuardianQuestion] = useState(false)
  const [hasGuardian, setHasGuardian] = useState<"yes" | "no" | "">("")
  const [error, setError] = useState<string | null>(null)

  const handleAgeSubmit = () => {
    const ageNum = Number.parseInt(age, 10)

    // Validate age
    if (isNaN(ageNum) || !isValidAge(ageNum)) {
      setError("Please enter a valid age between 0 and 120")
      return
    }

    setError(null)

    // Check if guardian verification is needed
    if (needsGuardianVerification(ageNum)) {
      setShowGuardianQuestion(true)
    } else {
      // Age 18+, proceed directly
      const ageCategory = getAgeCategory(ageNum)
      onAgeVerified({ age: ageNum, ageCategory })
    }
  }

  const handleGuardianResponse = () => {
    const ageNum = Number.parseInt(age, 10)
    const ageCategory = getAgeCategory(ageNum)

    if (hasGuardian === "no") {
      // Show precaution message for minors without guardian
      setError(
        "For your safety, we recommend having a guardian or trusted adult help you access these services. You can still continue, but please be cautious.",
      )
    }

    // Proceed with age verification
    setTimeout(
      () => {
        onAgeVerified({
          age: ageNum,
          ageCategory,
          hasGuardian: hasGuardian === "yes",
        })
      },
      hasGuardian === "no" ? 2000 : 0,
    )
  }

  if (showGuardianQuestion) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-start gap-3 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <Users className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="font-medium text-foreground">Guardian Verification Required</p>
            <p className="text-sm text-muted-foreground">
              Since you're under 18, we want to make sure you have support. Do you have a parent or guardian helping
              you?
            </p>
          </div>
        </div>

        <RadioGroup value={hasGuardian} onValueChange={(value) => setHasGuardian(value as "yes" | "no")}>
          <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="yes" id="guardian-yes" />
            <Label htmlFor="guardian-yes" className="cursor-pointer flex-1 text-sm">
              Yes, I have a guardian with me
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="no" id="guardian-no" />
            <Label htmlFor="guardian-no" className="cursor-pointer flex-1 text-sm">
              No, I'm accessing this alone
            </Label>
          </div>
        </RadioGroup>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
          </div>
        )}

        <Button onClick={handleGuardianResponse} disabled={!hasGuardian} className="w-full">
          Continue
        </Button>

        <button
          onClick={() => {
            setShowGuardianQuestion(false)
            setHasGuardian("")
            setError(null)
          }}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="age" className="text-base font-medium">
          What is your age?
        </Label>
        <p className="text-sm text-muted-foreground">
          We use your age to provide more relevant services and support tailored to your needs.
        </p>
      </div>

      <div className="space-y-2">
        <Input
          id="age"
          type="number"
          placeholder="Enter your age"
          value={age}
          onChange={(e) => {
            setAge(e.target.value)
            setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAgeSubmit()
            }
          }}
          min="0"
          max="120"
          className="text-base"
        />

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </div>

      <Button onClick={handleAgeSubmit} disabled={!age} className="w-full">
        Continue
      </Button>

      <div className="pt-2 space-y-2">
        <p className="text-xs text-muted-foreground text-center">Age categories we support:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-muted/50 rounded text-center">0-3: Baby care</div>
          <div className="p-2 bg-muted/50 rounded text-center">4-9: Child services</div>
          <div className="p-2 bg-muted/50 rounded text-center">10-12: Pre-teen</div>
          <div className="p-2 bg-muted/50 rounded text-center">13-17: Teen support</div>
          <div className="col-span-2 p-2 bg-muted/50 rounded text-center">18+: Adult services</div>
        </div>
      </div>
    </div>
  )
}
