const express = require("express");
const {
  getWatchlist,
  getWatchlistDetails,
  addToWatchlist,
  deleteFromWatchlist,
} = require("../controllers/watchlistController");

// Initialize express router
const watchlistRoute = express.Router();

// Get all watchlist
watchlistRoute.get("/", getWatchlist);

// Get all watchlist with details
watchlistRoute.get("/details", getWatchlistDetails);

// Add a bookmark
watchlistRoute.post("/:id", addToWatchlist);

// Delete a bookmark
watchlistRoute.delete("/:id", deleteFromWatchlist);

// Export the bookmark routes
module.exports = watchlistRoute;
