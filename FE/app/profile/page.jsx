"use client"

import { useState, useRef, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/context/AppContext"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { User, Upload, Edit2, Save } from "lucide-react"

export default function ProfilePage() {
  const { userObj: user, login, authenticated } = useApp()

  useEffect(() => {
    console.log(user, " User Object")
    setFormData({
      name: user?.name || "",
      role: user?.role || "User",
      categoryInterest: user?.categoryInterest || "",
      language: user?.language || "English",
      avatar: user?.avatar || null,
    })
  }, [user])

  const router = useRouter()
  const fileInputRef = useRef(null)

  const [isEditing, setIsEditing] = useState({
    name: false,
    categoryInterest: false,
  })

  const [formData, setFormData] = useState({
    name: user?.name || "",
    role: user?.role || "User",
    categoryInterest: user?.categoryInterest || "",
    language: user?.language || "English",
    avatar: user?.avatar || null,
  })



  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true })
  }

  const handleSave = (field) => {
    setIsEditing({ ...isEditing, [field]: false })
    // Update user data in context
    login({ ...user, [field]: formData[field] })
  }

  const handleUpgradeRole = () => {
    // Simulate API call to upgrade role
    const upgradedUser = { ...user, role: "Premium User" }
    login(upgradedUser)
    setFormData({ ...formData, role: "Premium User" })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setFormData({ ...formData, avatar: imageUrl })
        login({ ...user, avatar: imageUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveAll = () => {
    login({ ...user, ...formData })
    alert("Profile updated successfully!")
  }

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section - Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="flex items-center space-x-2">
                    {isEditing.name ? (
                      <>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => handleSave("name")}>
                          <Save className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Input value={formData.name} readOnly className="flex-1 bg-gray-50" />
                        <Button size="sm" variant="outline" onClick={() => handleEdit("name")}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="flex items-center space-x-2">
                    <Input value={formData.role} readOnly className="flex-1 bg-gray-50" />
                    {formData.role === "End User" && (
                      <Button
                        size="sm"
                        onClick={handleUpgradeRole}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        ✨ Upgrade
                      </Button>
                    )}
                  </div>
                  {formData.role === "End User" && (
                    <p className="text-sm text-gray-500">
                      Upgrade to Premium for advanced features and priority support
                    </p>
                  )}
                </div>

                {/* Category Interest */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category of Interest</Label>
                  <div className="flex items-center space-x-2">
                    {isEditing.categoryInterest ? (
                      <>
                        <Input
                          id="category"
                          value={formData.categoryInterest}
                          onChange={(e) => setFormData({ ...formData, categoryInterest: e.target.value })}
                          placeholder="e.g., Technical Support, Billing, General"
                          className="flex-1"
                        />
                        <Button size="sm" onClick={() => handleSave("categoryInterest")}>
                          <Save className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Input value={formData.categoryInterest} readOnly className="flex-1 bg-gray-50" />
                        <Button size="sm" variant="outline" onClick={() => handleEdit("categoryInterest")}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveAll} className="w-full">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Right Section - Profile Image */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar || "/placeholder.svg"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 ">
                  <p className="text-sm text-gray-600">Upload a profile picture to personalize your account</p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    {formData.avatar ? "Change Photo" : "Upload Photo"}
                  </Button>

                  {formData.avatar && (
                    <Button
                      onClick={() => {
                        setFormData({ ...formData, avatar: null })
                        login({ ...user, avatar: null })
                      }}
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>


              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
