"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { LocationPrompt } from "@/components/location-prompt"
import { AgeVerification } from "@/components/age-verification"
import { CategoryDropdown } from "@/components/category-dropdown"
import { ServiceCard } from "@/components/service-card"
import { Button } from "@/components/ui/button"
import type { Location, Service, ServiceCategory, UserAgeInfo } from "@/lib/types"

const DUMMY_SERVICES: Service[] = [
  {
    id: "1",
    name: "City Food Bank",
    category: "FOOD",
    address: "123 Main Street, Downtown",
    distance_km: 2.3,
    availability: "AVAILABLE",
    phone: "(555) 123-4567",
    email: "info@cityfoodbank.org",
  },
  {
    id: "2",
    name: "Hope Shelter",
    category: "SHELTER",
    address: "456 Oak Avenue, Riverside",
    distance_km: 3.8,
    availability: "AVAILABLE",
    phone: "(555) 234-5678",
    email: "help@hopeshelter.org",
  },
  {
    id: "3",
    name: "Community Health Center",
    category: "MEDICAL",
    address: "789 Health Plaza, Midtown",
    distance_km: 1.5,
    availability: "LIMITED",
    phone: "(555) 345-6789",
    email: "services@commhealth.org",
  },
  {
    id: "4",
    name: "Mental Wellness Hub",
    category: "MENTAL_HEALTH",
    address: "321 Peace Lane, Westside",
    distance_km: 4.2,
    availability: "AVAILABLE",
    phone: "(555) 456-7890",
    email: "support@mentalwellness.org",
  },
]

export default function DiscoverPage() {
  const [ageInfo, setAgeInfo] = useState<UserAgeInfo | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "">("")
  const [services, setServices] = useState<Service[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleAgeVerified = (verifiedAgeInfo: UserAgeInfo) => {
    setAgeInfo(verifiedAgeInfo)
  }

  const handleLocationSelect = (selectedLocation: Location) => {
    setLocation(selectedLocation)
  }

  const handleSearchServices = () => {
    if (!location || !selectedCategory) {
      return
    }

    const filtered = DUMMY_SERVICES.filter((service) => service.category === selectedCategory)
    setServices(filtered.length > 0 ? filtered : DUMMY_SERVICES.slice(0, 2))
    setHasSearched(true)
  }

  const isSearchEnabled = location !== null && selectedCategory !== ""

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Discover Services</h1>
            <p className="text-muted-foreground">Find nearby services and support in your area</p>
          </div>

          {/* Search Form */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
            <div className="space-y-6">
              {/* Age Verification Step */}
              <div>
                <h3 className="font-bold mb-3 text-foreground">
                  {ageInfo ? "✓ Age Verified" : "Step 1: Verify Your Age"}
                </h3>
                {!ageInfo ? (
                  <AgeVerification onAgeVerified={handleAgeVerified} />
                ) : (
                  <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-foreground block">
                        Age: {ageInfo.age} ({ageInfo.ageCategory})
                      </span>
                      {ageInfo.hasGuardian !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          Guardian present: {ageInfo.hasGuardian ? "Yes" : "No"}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAgeInfo(null)
                        setLocation(null)
                        setServices([])
                        setHasSearched(false)
                      }}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </div>

              {/* Location Section */}
              <div>
                <h3 className="font-bold mb-3 text-foreground">
                  {location ? "✓ Location Selected" : "Step 2: Select Your Location"}
                </h3>
                {!location ? (
                  <LocationPrompt onLocationSelect={handleLocationSelect} isLoading={false} />
                ) : (
                  <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                    <span className="text-sm font-medium text-foreground">
                      Location set: {location.city || "Custom location"}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLocation(null)
                        setServices([])
                        setHasSearched(false)
                      }}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <h3 className="font-bold mb-3 text-foreground">Step 3: What Help Do You Need?</h3>
                <CategoryDropdown
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  disabled={!location || !ageInfo}
                />
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearchServices}
                disabled={!isSearchEnabled || !ageInfo}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Search Services
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {hasSearched && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Services Found ({services.length})</h2>
              {services.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">No services found. Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
