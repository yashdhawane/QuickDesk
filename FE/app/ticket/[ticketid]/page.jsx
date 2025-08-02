"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useApp } from "@/context/AppContext"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { ArrowLeft, ChevronUp, ChevronDown, MessageCircle, Share2, User, Clock, Check } from "lucide-react"

export default function TicketDetailPage() {
  const { ticketid } = useParams()
  const { tickets, voteOnTicket, user } = useApp()
  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const foundTicket = tickets.find((t) => t.id === ticketid)
    if (foundTicket) {
      setTicket(foundTicket)
      // Mock comments data
      setComments([
        {
          id: 1,
          author: "support_agent",
          content: "Thank you for reporting this issue. I'm looking into it and will get back to you shortly.",
          timestamp: new Date("2024-01-15T11:00:00"),
          isSupport: true,
        },
        {
          id: 2,
          author: "jane_smith",
          content: "I'm experiencing the same issue. It started happening after the latest update.",
          timestamp: new Date("2024-01-15T12:30:00"),
          isSupport: false,
        },
        {
          id: 3,
          author: "support_agent",
          content: "We've identified the root cause and are working on a fix. Expected resolution time is 2-3 hours.",
          timestamp: new Date("2024-01-15T14:15:00"),
          isSupport: true,
        },
      ])
    }
  }, [ticketid, tickets])

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket Not Found</h1>
            <p className="text-gray-600 mb-6">The ticket you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/ticket">Back to Tickets</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleVote = (voteType) => {
    voteOnTicket(ticket.id, voteType)
    // Update local ticket state
    const updatedTicket = tickets.find((t) => t.id === ticketid)
    if (updatedTicket) {
      setTicket(updatedTicket)
    }
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const comment = {
        id: comments.length + 1,
        author: user?.name || "Anonymous",
        content: newComment,
        timestamp: new Date(),
        isSupport: false,
      }
      setComments([...comments, comment])
      setNewComment("")
      setIsSubmitting(false)
    }, 500)
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "in progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = now - new Date(timestamp)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    return "Just now"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/ticket" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Tickets</span>
              </Link>
            </Button>
          </div>

          {/* Ticket Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={`${getStatusColor(ticket.status)} border`}>{ticket.status}</Badge>
                    <span className="text-sm text-gray-500">#{ticket.id}</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{ticket.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>
                        Posted by <strong>{ticket.author}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(ticket.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-1 h-8 w-8 ${ticket.userVote === "up" ? "text-green-600 bg-green-50" : "text-gray-400 hover:text-green-600"}`}
                      onClick={() => handleVote("up")}
                    >
                      <ChevronUp className="w-5 h-5" />
                    </Button>
                    <span className="text-lg font-semibold text-gray-700">{ticket.upvotes - ticket.downvotes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-1 h-8 w-8 ${ticket.userVote === "down" ? "text-red-600 bg-red-50" : "text-gray-400 hover:text-red-600"}`}
                      onClick={() => handleVote("down")}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Share Button */}
                  <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    {copied ? "Copied!" : "Share"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Comments */}
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className={comment.isSupport ? "bg-primary text-white" : "bg-gray-200"}>
                      {comment.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      {comment.isSupport && (
                        <Badge variant="default" className="text-xs">
                          Support
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}

              {/* Add Comment Form */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Add a Comment</h3>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts, ask for clarification, or provide additional information..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                      {isSubmitting ? "Posting..." : "Post Comment"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setNewComment("")}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
