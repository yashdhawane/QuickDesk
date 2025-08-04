"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/layout/Navbar"
import { ArrowLeft } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "@/lib/constants/constants"
import { useApp } from "@/context/AppContext"

export default function LoginPage() {
  const { setUserObj, setAccessToken, setAuthenticated, userObj:user } = useApp()

  if (user) {
    // If user is already authenticated, redirect to ticket page
    const router = useRouter()
    router.push("/ticket")
    return null
  }

  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState("")
  const router = useRouter()


  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Use backend login from context
      const response = await axios.post(`${BASE_URL}/users/login`, loginData)
      console.log("Login response:", response.data)

      const { token, user } = response.data

      // Store token in localStorage
      localStorage.setItem("quickdesk_token", token)
      localStorage.setItem("quickdesk_user", JSON.stringify(user))


      // saving the data in state variables
      setAuthenticated(true)
      setUserObj(user)
      setAccessToken(token)

      router.push("/ticket")
    } catch (err) {
      setErrorText("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (signupData.password !== signupData.confirmPassword) {
      setErrorText("Passwords do not match")
      return
    }
    setIsLoading(true)
    const userData = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
    }

    try {
      const response = await axios.post(`${BASE_URL}/users/register`, userData)
      router.push("/login")
    }
    catch (error) {
      setErrorText(error.response?.data?.message || "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to QuickDesk</CardTitle>
              <CardDescription>Sign in to your account or create a new one</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>

                  {/* Demo Credentials */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Demo Credentials:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        <strong>Admin:</strong> admin@gmail.com / admin123
                      </p>
                      <p>
                        <strong>Support Agent:</strong> support@gmail.com / support123
                      </p>
                      <p>
                        <strong>End User:</strong> user@gmail.com / user123
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    {
                      errorText && (
                        <span className="text-red-500 text-sm flex items-center -mt-3">{errorText}</span>
                      )
                    }
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
