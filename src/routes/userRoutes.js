const express = require("express");
const {
  createUser,
  loginUser,
  getUser,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

// Initialize express router
const userRoutes = express.Router();

// Create a new user
userRoutes.post("/register", createUser);

// Login a user
userRoutes.post("/login", loginUser);

// Use the authenticateToken middleware to protect the /me endpoint
userRoutes.use("/me", authenticateToken);

// Get the information of the currently logged in user
userRoutes.get("/me", getUser);

// Export the user routes
module.exports = userRoutes;
