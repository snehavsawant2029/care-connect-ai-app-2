"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getLocationFromBrowser } from "@/lib/location"
import type { Location } from "@/lib/types"

interface LocationPromptProps {
  onLocationSelect: (location: Location) => void
  isLoading?: boolean
}

export function LocationPrompt({ onLocationSelect, isLoading }: LocationPromptProps) {
  const [manualLocation, setManualLocation] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const handleBrowserLocation = async () => {
    setIsLoadingLocation(true)
    try {
      const location = await getLocationFromBrowser()
      if (location) {
        onLocationSelect(location)
      } else {
        alert("Unable to get your location. Please enable location services.")
        setShowManualInput(true)
      }
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const handleManualSubmit = () => {
    // For demo: use default coordinates for common cities
    const defaultCoordinates: Record<string, Location> = {
      bangalore: { latitude: 12.9716, longitude: 77.5946 },
      delhi: { latitude: 28.7041, longitude: 77.1025 },
      mumbai: { latitude: 19.0761, longitude: 72.8775 },
    }

    const city = manualLocation.toLowerCase().trim()
    const coords = defaultCoordinates[city]

    if (coords) {
      onLocationSelect(coords)
    } else {
      alert("City not found. Please try Bangalore, Delhi, or Mumbai.")
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">We need your location to find nearby services</p>

        <Button onClick={handleBrowserLocation} disabled={isLoading || isLoadingLocation} className="w-full">
          {isLoadingLocation ? "Getting location..." : "Use My Location"}
        </Button>
      </div>

      {!showManualInput && (
        <button
          onClick={() => setShowManualInput(true)}
          className="w-full text-center text-sm text-primary hover:underline"
        >
          Enter location manually
        </button>
      )}

      {showManualInput && (
        <div className="space-y-2">
          <Input
            placeholder="Enter city (e.g., Bangalore)"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleManualSubmit()
              }
            }}
          />
          <Button onClick={handleManualSubmit} disabled={!manualLocation.trim()} className="w-full">
            Set Location
          </Button>
        </div>
      )}
    </div>
  )
}
