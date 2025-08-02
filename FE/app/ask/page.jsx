"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/context/AppContext"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { ArrowLeft, Plus, X } from "lucide-react"

export default function AskPage() {
  const { addTicket, user, isAuthenticated } = useApp()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
  })
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim().toLowerCase()],
      })
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const ticketData = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        status: "Open",
        author: user?.name || "Anonymous",
      }

      const ticketId = addTicket(ticketData)
      setIsSubmitting(false)

      // Show success message and redirect
      alert(`Ticket created successfully! ID: ${ticketId}`)
      router.push(`/ticket/${ticketId}`)
    }, 1000)
  }

  const suggestedTags = [
    "bug",
    "feature",
    "question",
    "help",
    "urgent",
    "mobile",
    "web",
    "api",
    "login",
    "payment",
    "performance",
    "ui",
    "documentation",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/tickets" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Tickets</span>
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Ask a Question</CardTitle>
              <p className="text-gray-600">
                Describe your issue or question in detail to get the best help from our community.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Question Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a clear, descriptive title for your question"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Be specific and concise. Good titles help others find and answer your question.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about your question or issue..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Include steps to reproduce the issue, error messages, and what you've already tried.
                  </p>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Add a tag and press Enter"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag} disabled={!currentTag.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Suggested Tags */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags
                        .filter((tag) => !formData.tags.includes(tag))
                        .slice(0, 8)
                        .map((tag) => (
                          <Button
                            key={tag}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData({ ...formData, tags: [...formData.tags, tag] })}
                            className="text-xs"
                          >
                            + {tag}
                          </Button>
                        ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    Tags help categorize your question and make it easier for others to find.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                    className="flex-1 sm:flex-none"
                  >
                    {isSubmitting ? "Posting..." : "Post Question"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/tickets">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Tips for Getting Great Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  • <strong>Be specific:</strong> Include exact error messages and steps to reproduce
                </li>
                <li>
                  • <strong>Show your work:</strong> Mention what you've already tried
                </li>
                <li>
                  • <strong>Use proper tags:</strong> Help others find and categorize your question
                </li>
                <li>
                  • <strong>Format code:</strong> Use code blocks for better readability
                </li>
                <li>
                  • <strong>Be respectful:</strong> Remember there are real people helping you
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
