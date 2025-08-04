import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter } from "lucide-react"

export default function TicketFilters({
  filters,
  categories,
  statuses,
  sortOptions,
  showMobileFilters,
  setShowMobileFilters,
  handleFilterChange,
  handleCategoryToggle,
  handleStatusToggle,
}) {
  return (
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
        
        {/* My Tickets Only */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="my-tickets"
              checked={filters.showMyTicketsOnly}
              onCheckedChange={(checked) => handleFilterChange("showMyTicketsOnly", !!checked)}
            />
            <label htmlFor="my-tickets" className="text-sm font-medium">
              Show My Tickets Only
            </label>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
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
        )}

        {/* Status */}
        <div>
          <h3 className="font-medium mb-3">Status</h3>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status.value}`}
                  checked={filters.statuses.includes(status.value)}
                  onCheckedChange={() => handleStatusToggle(status.value)}
                />
                <label htmlFor={`status-${status.value}`} className="text-sm">
                  {status.label}
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
  )
}