const express = require("express");

// Initialize express application
const app = express();

// Hello World
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
