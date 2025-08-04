"use client"

import { useState, useMemo, useEffect, useRef } from "react"
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
import TicketFilters from "@/components/tickets/TicketFilters"
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { BASE_URL } from "@/lib/constants/constants"

export default function TicketsPage() {
  // Track render count for debugging
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("TicketsPage render count:", renderCount.current);

  // Local state for categories and mobile filter sidebar
  const [categories, setCategories] = useState([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Get state and actions from context
  const {
    tickets,
    fetchTickets,
    filters,
    searchQuery,
    currentPage,
    ticketsPerPage,
    updateFilters, // <--- Only use this!
    setSearchQuery,
    setCurrentPage,
    setTicketsPerPage,
    userObj: user
  } = useApp();

  // Fetch categories/tags from API
  const fetchTags = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/getAllTags`)
      if (!response.ok) throw new Error("Failed to fetch tags")
      const data = await response.json()
      let categories_list = data.tags.map(tag => tag.categoryName)
      setCategories(categories_list)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  // Fetch tickets and tags on mount
  useEffect(() => {
    fetchTags()
    fetchTickets()
  }, [])

  // Status and sort options
  const statuses = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];
  const sortOptions = ["Newest", "Oldest"]

  // Filtering logic
  const filteredTickets = useMemo(() => {
    let filtered = [...tickets]

    // Search filter
    if (searchQuery) {
      // console.log(filtered)
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          //           {
          // console.log(ticket.createdBy?.name.toLowerCase().includes(query))
          //         }
          ticket._id.toLowerCase().includes(query) ||
          ticket.title?.toLowerCase().includes(query) ||
          ticket.description?.toLowerCase().includes(query) ||
          ticket.createdBy?.name.toLowerCase().includes(query) ||
          (Array.isArray(ticket.tag) && ticket?.tag.some((tag) => tag.toLowerCase().includes(query)))
      )
    }

    // Checkbox filters
    // console.log(filtered)
    // console.log(user)
    if (filters.showOpenOnly) {
      filtered = filtered.filter((ticket) => ticket.status === "open")
    }
    if (filters.showMyTicketsOnly && user) {
      filtered = filtered.filter((ticket) => ticket.createdBy._id === user.id);
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter(
        (ticket) =>
          Array.isArray(ticket.tag) &&
          ticket.tag.some((tag) => filters.categories.includes(tag))
      )
    }
    if (filters.statuses.length > 0) {
      filtered = filtered.filter((ticket) => filters.statuses.includes(ticket.status));
    }

    // Sorting
    switch (filters.sortBy) {
      case "Most Comments":
        filtered.sort((a, b) => b.comments - a.comments)
        break
      case "Most Upvotes":
        filtered.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes))
        break
      case "Newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "Oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      default:
        break
    }

    return filtered
  }, [tickets, searchQuery, filters, user])

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage)
  const startIndex = (currentPage - 1) * ticketsPerPage
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + ticketsPerPage)

  // Filter change handlers
  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value });
  };

  const handleCategoryToggle = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const handleStatusToggle = (statusValue) => {
    const newStatuses = filters.statuses.includes(statusValue)
      ? filters.statuses.filter((s) => s !== statusValue)
      : [...filters.statuses, statusValue];
    updateFilters({ statuses: newStatuses });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <TicketFilters
                filters={filters}
                categories={categories}
                statuses={statuses}
                sortOptions={sortOptions}
                showMobileFilters={showMobileFilters}
                setShowMobileFilters={setShowMobileFilters}
                handleFilterChange={handleFilterChange}
                handleCategoryToggle={handleCategoryToggle}
                handleStatusToggle={handleStatusToggle}
              />
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

      {/* Footer */}
      <Footer />
    </div>
  )
}
