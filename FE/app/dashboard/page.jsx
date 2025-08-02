"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/context/AppContext"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { MessageCircle, TrendingUp, Clock, CheckCircle, AlertCircle, BarChart3, Settings, Shield } from "lucide-react"

export default function AdminDashboard() {
  const { user, isAuthenticated, tickets } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "Admin") {
    return null
  }

  // Calculate stats
  const totalTickets = tickets.length
  const openTickets = tickets.filter((t) => t.status === "Open").length
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved").length
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length

  const recentTickets = tickets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)

  const stats = [
    {
      title: "Total Tickets",
      value: totalTickets,
      icon: <MessageCircle className="w-6 h-6" />,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Open Tickets",
      value: openTickets,
      icon: <AlertCircle className="w-6 h-6" />,
      color: "bg-red-500",
      change: "-5%",
    },
    {
      title: "Resolved",
      value: resolvedTickets,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-green-500",
      change: "+18%",
    },
    {
      title: "In Progress",
      value: inProgressTickets,
      icon: <Clock className="w-6 h-6" />,
      color: "bg-yellow-500",
      change: "+3%",
    },
  ]

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600">
              Welcome back, {user.name}! Here's what's happening with your support system.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"} mt-1`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color} text-white`}>{stat.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Recent Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{ticket.title}</h4>
                        <p className="text-sm text-gray-600">by {ticket.author}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Tickets
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Button className="justify-start h-auto p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <div className="text-left">
                      <div className="font-medium">Manage Users</div>
                      <div className="text-sm opacity-90">View and manage user accounts</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4 hover:bg-gray-50 bg-transparent">
                    <div className="text-left">
                      <div className="font-medium">System Settings</div>
                      <div className="text-sm text-gray-600">Configure system preferences</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4 hover:bg-gray-50 bg-transparent">
                    <div className="text-left">
                      <div className="font-medium">Reports</div>
                      <div className="text-sm text-gray-600">Generate detailed reports</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4 hover:bg-gray-50 bg-transparent">
                    <div className="text-left">
                      <div className="font-medium">Backup Data</div>
                      <div className="text-sm text-gray-600">Create system backup</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart Placeholder */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Performance Chart</p>
                  <p className="text-sm text-gray-500">Chart visualization would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
