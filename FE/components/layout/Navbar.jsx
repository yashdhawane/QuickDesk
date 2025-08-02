"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/AppContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut } from "lucide-react"

export default function Navbar() {
  const { isAuthenticated, userObj:user, setUserObj, setAccessToken, authenticated, setAuthenticated } = useApp()

  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("quickdesk_token")
    localStorage.removeItem("quickdesk_user")
    // Authorization context should also be updated
    setUserObj(null)
    setAccessToken(null)
    setAuthenticated(false)
    router.push("/")
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/ticket", label: "Ticket" },
    { href: "/ask", label: "Ask Question" },
  ]

  // Add dashboard link for admin users
  const adminNavLinks = user?.role === "admin" ? [{ href: "/dashboard", label: "Dashboard" }, ...navLinks] : navLinks

  useEffect(() => {
    if (authenticated) {
      const token = localStorage.getItem("quickdesk_token")
      const user = JSON.parse(localStorage.getItem("quickdesk_user"))
      if (token && user) {
        setAccessToken(token)
        setUserObj(user)
      }
    }
    // console.log("User authenticated:", authenticated);
  }, [authenticated]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">QD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">QuickDesk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {adminNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-600 hover:text-primary transition-colors duration-200 ${link.label === "Dashboard"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold"
                  : ""
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{user?.name || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Login / Signup</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-gray-600 hover:text-primary transition-colors duration-200 ${link.label === "Dashboard"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold"
                    : ""
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/profile"
                      className="text-gray-600 hover:text-primary transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="text-left text-gray-600 hover:text-primary transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Login / Signup
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
