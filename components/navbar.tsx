"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Heart, Settings, LogOut } from "lucide-react"
import { useState } from "react"
import { LogoutDialog } from "./logout-dialog"

export function Navbar() {
  const { user, logout, loading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return // Prevent double-clicking

    setIsLoggingOut(true)

    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
      // Force logout even if there's an error
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105">
            <div className="bg-black text-white w-8 h-8 rounded flex items-center justify-center font-bold">K</div>
            <span className="text-xl font-bold text-gray-900">KostFinder</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Cari Kost
            </Link>
            <Link href="/#about" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
              About
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 transition-colors duration-200">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex items-center transition-colors duration-200">
                      <Heart className="w-4 h-4 mr-2" />
                      Favorit
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center transition-colors duration-200">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex items-center transition-colors duration-200 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="transition-colors duration-200">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="transition-all duration-200 hover:scale-105">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
        loading={isLoggingOut}
      />
    </nav>
  )
}
