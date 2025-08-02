"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext();

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const initialState = {
  user: null,
  isAuthenticated: false,
  tickets: [],
  filters: {
    showOpenOnly: false,
    showMyTicketsOnly: false,
    categories: [],
    statuses: [],
    sortBy: "Most Comments",
  },
  searchQuery: "",
  currentPage: 1,
  ticketsPerPage: 5,
  loading: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case "SET_TICKETS":
      return {
        ...state,
        tickets: action.payload,
      };
    case "ADD_TICKET":
      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
      };
    case "UPDATE_TICKET":
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === action.payload.id
            ? { ...ticket, ...action.payload }
            : ticket
        ),
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        currentPage: 1,
      };
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };
    case "SET_TICKETS_PER_PAGE":
      return {
        ...state,
        ticketsPerPage: action.payload,
        currentPage: 1,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize with mock data
  useEffect(() => {
    const mockTickets = [
      {
        id: "ticket-001",
        title: "Login Issues with Mobile App",
        description: "Unable to login using mobile app after recent update",
        tags: ["mobile", "login", "bug"],
        status: "Open",
        author: "john_doe",
        timestamp: new Date("2024-01-15T10:30:00"),
        upvotes: 5,
        downvotes: 1,
        comments: 3,
        userVote: null,
        assignedTo: "Vivek",
      },
      {
        id: "ticket-002",
        title: "Feature Request: Dark Mode",
        description:
          "Would love to see a dark mode option for better user experience",
        tags: ["feature", "ui", "enhancement"],
        status: "In Progress",
        author: "jane_smith",
        timestamp: new Date("2025-08-2T14:45:00"),
        upvotes: 12,
        downvotes: 0,
        comments: 7,
        userVote: "up",
        assignedTo: "Vivek",
      },
      {
        id: "ticket-003",
        title: "Payment Processing Error",
        description: "Getting error 500 when trying to process payments",
        tags: ["payment", "error", "critical"],
        status: "Resolved",
        author: "mike_wilson",
        timestamp: new Date("2024-01-13T09:15:00"),
        upvotes: 8,
        downvotes: 2,
        comments: 15,
        userVote: null,
        assignedTo: "Vivek",
      },
      {
        id: "ticket-004",
        title: "API Documentation Update Needed",
        description:
          "The API documentation is outdated and missing new endpoints",
        tags: ["documentation", "api", "improvement"],
        status: "Open",
        author: "sarah_dev",
        timestamp: new Date("2024-01-12T14:20:00"),
        upvotes: 3,
        downvotes: 0,
        comments: 2,
        userVote: null,
        assignedTo: "Vivek",
      },
      {
        id: "ticket-005",
        title: "Slow Loading Times on Dashboard",
        description:
          "Dashboard takes more than 10 seconds to load with large datasets",
        tags: ["performance", "dashboard", "optimization"],
        status: "Closed",
        author: "alex_admin",
        timestamp: new Date("2024-01-11T11:00:00"),
        upvotes: 6,
        downvotes: 1,
        comments: 9,
        userVote: "down",
        assignedTo: "Vivek",
      },
      {
        id: "ticket-006",
        title: "Slow Loading Times on Dashboard",
        description:
          "Dashboard takes more than 10 seconds to load with large datasets",
        tags: ["performance", "dashboard", "optimization"],
        status: "Closed",
        author: "alex_admin",
        timestamp: new Date("2024-01-11T11:00:00"),
        upvotes: 6,
        downvotes: 1,
        comments: 9,
        userVote: "down",
        assignedTo: "Vivek",
      },
    ];

    dispatch({ type: "SET_TICKETS", payload: mockTickets });
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // if using cookies/session
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Login failed");
      const user = await res.json();
      console.log("Login successful:", user);
      dispatch({ type: "SET_USER", payload: user });
      // Optionally: return user or success
      return user;
    } catch (err) {
      dispatch({ type: "SET_USER", payload: null });
      // Optionally: handle error (show message, etc.)
      throw err;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const addTicket = (ticket) => {
    const newTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      timestamp: new Date(),
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      userVote: null,
    };
    dispatch({ type: "ADD_TICKET", payload: newTicket });
    return newTicket.id;
  };

  const updateTicket = (ticketId, updates) => {
    dispatch({ type: "UPDATE_TICKET", payload: { id: ticketId, ...updates } });
  };

  const voteOnTicket = (ticketId, voteType) => {
    const ticket = state.tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

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

    updateTicket(ticketId, { upvotes, downvotes, userVote });
  };

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  };

  const setCurrentPage = (page) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const setTicketsPerPage = (count) => {
    dispatch({ type: "SET_TICKETS_PER_PAGE", payload: count });
  };

  const value = {
    ...state,
    login, // <-- now async
    logout,
    addTicket,
    updateTicket,
    voteOnTicket,
    setFilters,
    setSearchQuery,
    setCurrentPage,
    setTicketsPerPage,
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
