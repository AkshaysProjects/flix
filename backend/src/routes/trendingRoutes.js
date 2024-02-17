const express = require("express");
const { getTrending } = require("../controllers/trendingController");

// Initialize express router
const trendingRoutes = express.Router();

// Get all trendings
trendingRoutes.get("/", getTrending);

// Export the trending routes
module.exports = trendingRoutes;
