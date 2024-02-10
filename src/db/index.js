const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Initialize dotenv to load environment variables from .env file
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/entertainment";

// Connect to MongoDB using Mongoose
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database successfully"))
  .catch((err) => console.error("Database connection error:", err));

// Export the mongoose connection
module.exports = mongoose.connection;
