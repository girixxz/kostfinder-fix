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
import { User, Heart, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { LogoutDialog } from "./logout-dialog"

export function Navbar() {
  const { user, logout, loading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
      setIsLoggingOut(false)
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
            onClick={closeMobileMenu}
          >
            <div className="bg-black text-white w-8 h-8 rounded flex items-center justify-center font-bold">K</div>
            <span className="text-xl font-bold">
              <span className="text-gray-900">Kost</span>
              <span className="text-yellow-600">Finder</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
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
                    <Link href="/dashboard" className="flex items-center transition-colors duration-200">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
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
                <Button
                  asChild
                  className="bg-[#B69A2A] text-white hover:bg-[#a68924] transition-all duration-200 hover:scale-105"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/search"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Cari Kost
              </Link>
              <Link
                href="/#about"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                href="/#contact"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>

              <div className="border-t border-gray-200 my-2"></div>

              {loading ? (
                <div className="px-3 py-2">
                  <div className="animate-pulse">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : user ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-100">
                    Logged in as <span className="font-medium text-gray-900">{user.name}</span>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Dashboard
                  </Link>
                  <Link
                    href="/favorites"
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <Heart className="w-4 h-4 mr-3" />
                    Favorit
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setShowLogoutDialog(true)
                      closeMobileMenu()
                    }}
                    className="flex items-center w-full px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-3 py-2">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center px-4 py-2 bg-[#B69A2A] text-white hover:bg-[#a68924] rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
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
