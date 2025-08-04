"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, MessageCircle, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function TicketCard({ ticket }) {
  const { voteOnTicket } = useApp();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-red-500";
      case "in progress":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const handleVote = (voteType, e) => {
    e.preventDefault();
    e.stopPropagation();
    voteOnTicket(ticket._id, voteType);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
      // Fallback: capitalize first letter
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Link href={`/ticket/${ticket._id}`} className="">
      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <CardContent className="px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 justify-between">
                <h3 className="font-semibold text-gray-900 truncate">
                  {ticket.title}
                  <span className="text-gray-500 text-xs"> &nbsp; # {ticket._id}</span>
                </h3>
                <h3 className="text-gray-500 text-sm">
                  <span
                    className={`status-dot ${
                      ticket.status === "open"
                        ? "status-open"
                        : `status-${ticket.status.replace("_", "-")}`
                    }`}
                  ></span>
                  {getStatusLabel(ticket.status)}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-3 text-gray-500">
                {ticket.tag.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-10 text-xs text-gray-600 mt-6">
                <div className="flex items-center gap-1">
                  <span>Created by: </span>
                  <User className="w-4 h-4" />
                  <span>{ticket.createdBy.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Assigned to: </span>
                  <User className="w-4 h-4" />
                  {
                    ticket.assignedTo ? (
                      <span>{ticket.assignedTo.name}</span>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )
                  }
                </div>
                <span>{formatTimeAgo(ticket.createdAt)}</span>
              </div>
            </div>

            {/* Vote Section */}
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 h-8 w-8 ${
                  ticket.userVote === "up"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-400 hover:text-green-600"
                }`}
                onClick={(e) => handleVote("up", e)}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700">
                {ticket.vote.up - ticket.vote.down}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 h-8 w-8 ${
                  ticket.userVote === "down"
                    ? "text-red-600 bg-red-50"
                    : "text-gray-400 hover:text-red-600"
                }`}
                onClick={(e) => handleVote("down", e)}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Comments */}
            {/* <div className="flex items-center gap-1 text-gray-600 min-w-[60px] justify-end">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{ticket.comments}</span>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
