"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-primary hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Heart size={20} />
          </div>
          <span className="hidden sm:inline">CareConnect</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-1">
          <Link href="/">
            <Button variant={isActive("/") ? "default" : "ghost"} size="sm">
              Home
            </Button>
          </Link>
          <Link href="/discover">
            <Button variant={isActive("/discover") ? "default" : "ghost"} size="sm">
              Discover
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant={isActive("/chat") ? "default" : "ghost"} size="sm">
              Chat
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
