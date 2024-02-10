const express = require("express");
const userRoutes = require("./routes/userRoutes");

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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
