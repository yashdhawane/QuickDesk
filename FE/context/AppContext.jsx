"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AppContext = createContext();

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function AppProvider({ children }) {
  // User & Auth
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [userObj, setUserObj] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  // Tickets & UI State
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    showOpenOnly: false,
    showMyTicketsOnly: false,
    categories: [],
    statuses: [],
    sortBy: "Newest", // or "Newest" if you prefer
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage, setTicketsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users/getAllTickets`);
      if (!response.ok) throw new Error("Failed to fetch tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Login failed");
      const userData = await res.json();
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Add ticket
  const addTicket = async (newTicket) => {

    // setLoading(true);
    console.log("Adding ticket:", newTicket);

    try {
      // API call to create ticket using axios
      const res = await axios.post(
        `${BASE_URL}/users/createTicket`,
        newTicket,
        { headers: { "Content-Type": "application/json" } }
      );
      const createdTicket = res.data;
      console.log("Ticket created:", createdTicket);
      // Optionally update local tickets state with the new ticket
      // setTickets((prev) => [createdTicket, ...prev]);

      // setLoading(false);
      // return createdTicket;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Update ticket
  const updateTicket = (ticketId, updates) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ...updates } : ticket
      )
    );
  };

  // Vote on ticket
  const voteOnTicket = (ticketId, voteType) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        let upvotes = ticket.upvotes;
        let downvotes = ticket.downvotes;
        let userVote = voteType;

        if (ticket.userVote === voteType) {
          // Remove vote
          if (voteType === "up") upvotes--;
          else downvotes--;
          userVote = null;
        } else {
          // Add new vote, remove old if exists
          if (ticket.userVote === "up") upvotes--;
          else if (ticket.userVote === "down") downvotes--;

          if (voteType === "up") upvotes++;
          else downvotes++;
        }

        return { ...ticket, upvotes, downvotes, userVote };
      })
    );
  };

  // Set filters (merges with previous filters)
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    console.log("Filters updated:", filters);
  }, [filters]);

  // Set search query and reset page
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Set current page
  const updateCurrentPage = (page) => {
    setCurrentPage(page);
  };

  // Set tickets per page and reset page
  const updateTicketsPerPage = (count) => {
    setTicketsPerPage(count);
    setCurrentPage(1);
  };

  // Auth effect (optional, based on your previous logic)
  useEffect(() => {
    console.log("Checking local storage for auth data...");
    const token = localStorage.getItem("quickdesk_token");
    const user = JSON.parse(localStorage.getItem("quickdesk_user"));
    if (token && user) {
      setAccessToken(token);
      setUserObj(user);
      setAuthenticated(true);
    }
    console.log("Auth data loaded from local storage");
  }, []);

  const value = {
    // Auth state and setters
    user,
    isAuthenticated,
    accessToken,
    userObj,
    authenticated,
    setAccessToken,
    setUserObj,
    setAuthenticated,

    // Tickets state and actions
    tickets,
    setTickets,
    fetchTickets,
    loading,

    // Filters and pagination
    filters,
    updateFilters, // Only expose this!
    searchQuery,
    setSearchQuery: updateSearchQuery,
    currentPage,
    setCurrentPage: updateCurrentPage,
    ticketsPerPage,
    setTicketsPerPage: updateTicketsPerPage,

    // Auth actions
    login,
    logout,

    // Ticket actions
    addTicket,
    updateTicket,
    voteOnTicket,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
