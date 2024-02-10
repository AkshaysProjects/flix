const express = require("express");
const { createUser, loginUser } = require("../controllers/userController");

// Initialize express router
const userRoutes = express.Router();

// Create a new user
userRoutes.post("/register", createUser);

// Login a user
userRoutes.post("/login", loginUser);

// Export the user routes
module.exports = userRoutes;
