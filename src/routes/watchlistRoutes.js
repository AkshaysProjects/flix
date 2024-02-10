const express = require("express");
const {
  getWatchlist,
  addToWatchlist,
  deleteFromWatchlist,
} = require("../controllers/watchlistController");

// Initialize express router
const watchlistRoute = express.Router();

// Get all bookmarks
watchlistRoute.get("/", getWatchlist);

// Add a bookmark
watchlistRoute.post("/:id", addToWatchlist);

// Delete a bookmark
watchlistRoute.delete("/:id", deleteFromWatchlist);

// Export the bookmark routes
module.exports = watchlistRoute;
