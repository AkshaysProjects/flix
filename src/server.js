const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const tvShowRoutes = require("./routes/tvShowRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const authenticateToken = require("./middlewares/authenticateToken");

// Initialize express application
const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse the request body as JSON
app.use(express.json());

// Hello World
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use the user routes for the /user endpoint
app.use("/user", userRoutes);

// Use the authenticateToken middleware to protect the /movie, /tvshow and /watchlist endpoints
app.use("/movies", authenticateToken);
app.use("/tvshows", authenticateToken);
app.use("/watchlist", authenticateToken);

// Use the movie routes for the /movie endpoint
app.use("/movies", movieRoutes);

// Use the tv show routes for the /tvshow endpoint
app.use("/tvshows", tvShowRoutes);

// Use the watchlist routes for the /watchlist endpoint
app.use("/watchlist", watchlistRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
