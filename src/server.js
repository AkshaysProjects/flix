const express = require("express");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const tvShowRoutes = require("./routes/tvShowRoutes");
const authenticateToken = require("./middlewares/authenticateToken");

// Initialize express application
const app = express();

// Middleware to parse the request body as JSON
app.use(express.json());

// Hello World
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use the user routes for the /user endpoint
app.use("/user", userRoutes);

// Use the authenticateToken middleware to protect the /movie and /tvshow endpoints
app.use("/movies", authenticateToken);
app.use("/tvshows", authenticateToken);

// Use the movie routes for the /movie endpoint
app.use("/movies", movieRoutes);

// Use the tv show routes for the /tvshow endpoint
app.use("/tvshows", tvShowRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
