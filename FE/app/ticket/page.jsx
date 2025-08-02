"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/context/AppContext"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import TicketCard from "@/components/tickets/TicketCard"
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { BASE_URL } from "@/lib/constants/constants"

export default function TicketsPage() {

  const [categories, setCategories] = useState([])

  const {
    tickets,
    fetchTickets,
    filters,
    searchQuery,
    currentPage,
    ticketsPerPage,
    user,
    setFilters,
    setSearchQuery,
    setCurrentPage,
    setTicketsPerPage,
  } = useApp()

  const fetchTags = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/getAllTags`)
      if (!response.ok) throw new Error("Failed to fetch tags")
      const data = await response.json()
      // console.log(data)
      let categories_list = data.tags.map(tag => tag.categoryName)
      setCategories(categories_list)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }


  useEffect(() => {
    fetchTags()
    fetchTickets()
  }, [])



  // console.log(tickets)

  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const statuses = ["Open", "In Progress", "Resolved", "Closed"]
  // const sortOptions = ["Most Comments", "Most Upvotes", "Newest", "Oldest"]
  const sortOptions = ["Newest", "Oldest"]

  const filteredTickets = useMemo(() => {
    let filtered = [...tickets]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          ticket.id.toLowerCase().includes(query) ||
          ticket.title.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.author.toLowerCase().includes(query) ||
          ticket.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Apply checkbox filters
    if (filters.showOpenOnly) {
      filtered = filtered.filter((ticket) => ticket.status === "Open")
    }

    if (filters.showMyTicketsOnly && user) {
      filtered = filtered.filter((ticket) => ticket.author === user.name)
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((ticket) => ticket.tags.some((tag) => filters.categories.includes(tag)))
    }

    // Apply status filters
    if (filters.statuses.length > 0) {
      filtered = filtered.filter((ticket) => filters.statuses.includes(ticket.status))
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "Most Comments":
        filtered.sort((a, b) => b.comments - a.comments)
        break
      case "Most Upvotes":
        filtered.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes))
        break
      case "Newest":
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        break
      case "Oldest":
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        break
      default:
        break
    }

    return filtered
  }, [tickets, searchQuery, filters, user])

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage)
  const startIndex = (currentPage - 1) * ticketsPerPage
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + ticketsPerPage)

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value })
  }

  const handleCategoryToggle = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    handleFilterChange("categories", newCategories)
  }

  const handleStatusToggle = (status) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status]
    handleFilterChange("statuses", newStatuses)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <Card className="sticky top-24">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    {showMobileFilters ? "Hide" : "Show"}
                  </Button>
                </CardHeader>
                <CardContent className={`space-y-6 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
                  {/* Checkbox Filters */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="my-tickets"
                        checked={filters.showMyTicketsOnly}
                        onCheckedChange={(checked) => handleFilterChange("showMyTicketsOnly", checked)}
                      />
                      <label htmlFor="my-tickets" className="text-sm font-medium">
                        Show My Tickets Only
                      </label>
                    </div>
                  </div>

                  {/* Categories */}
                  {
                    categories.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3">Categories</h3>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category}`}
                                checked={filters.categories.includes(category)}
                                onCheckedChange={() => handleCategoryToggle(category)}
                              />
                              <label htmlFor={`category-${category}`} className="text-sm">
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }

                  {/* Status */}
                  <div>
                    <h3 className="font-medium mb-3">Status</h3>
                    <div className="space-y-2">
                      {statuses.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={filters.statuses.includes(status)}
                            onCheckedChange={() => handleStatusToggle(status)}
                          />
                          <label htmlFor={`status-${status}`} className="text-sm">
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h3 className="font-medium mb-3">Sort By</h3>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`sort-${option}`}
                            name="sortBy"
                            value={option}
                            checked={filters.sortBy === option}
                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                            className="w-4 h-4 text-primary"
                          />
                          <label htmlFor={`sort-${option}`} className="text-sm">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Ask Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tickets by ID, title, description, comment, or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button asChild>
                  <Link href="/ask" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Ask Question
                  </Link>
                </Button>
              </div>

              {/* Results Summary */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {paginatedTickets.length} of {filteredTickets.length} tickets
                </p>
              </div>

              {console.log(paginatedTickets)}
              {/* Tickets List */}
              <div className="space-y-4 mb-8 flex flex-col">
                {paginatedTickets.length > 0 ? (
                  paginatedTickets.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-gray-500 text-lg mb-4">No tickets found</p>
                      <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                      <Button asChild>
                        <Link href="/ask">Ask Your First Question</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Pagination */}
              {/* {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <Select
                      value={ticketsPerPage.toString()}
                      onValueChange={(value) => setTicketsPerPage(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
