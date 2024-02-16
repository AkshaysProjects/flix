const db = require("../db");
const ObjectId = require("mongoose").Types.ObjectId;

// Get watchlist
const getWatchlist = async (req, res) => {
  try {
    // Fetch the user's watchlist
    const user = req.user;

    // If user does not exist return 404 Not Found
    if (user) {
      // Send the watchlist back to the client
      const watchlist = user.watchlist;
      res.status(200).json(watchlist);
    } else {
      res.status(404).json({ message: "No watchlist found" }); // 404 Not Found
    }
  } catch (err) {
    // Log the error to the console
    res.status(500).json({ message: "Server error" });
  }
};

// Add to watchlist
const addToWatchlist = async (req, res) => {
  // Get the movie or tvShow ID from the request parameters
  const { id } = req.params;
  try {
    // Fetch the Movies and TVShows collections from the database
    const Movies = await db.collection("Movies");
    const TVShows = await db.collection("Shows");

    // Fetch the Users collection from the database
    const Users = await db.collection("Users");

    // Fetch the movie and tvShow with the given ID
    const movie = await Movies.findOne({ _id: new ObjectId(id) });
    const tvShow = await TVShows.findOne({ _id: new ObjectId(id) });

    // Check if the movie or tvShow exists and get the type
    const type = movie ? "movie" : tvShow ? "tvShow" : null;

    // If the movie or tvShow exists
    if (!type) {
      // If no movie or tvShow exists with the given ID return 404 Not Found
      res.status(404).json({ message: "Movie or TV Show not found" }); // 404 Not Found
      return;
    }

    // Get a reference to the user's watchlist
    const watchlist = req.user.watchlist;

    // Check if the movie or tvShow is already in the user's watchlist
    if (watchlist.filter((item) => String(item._id) === id).length > 0) {
      res.status(400).json({ message: "Already in watchlist" }); // 400 Bad Request
      return;
    }

    // Add the movie or tvShow to the user's watchlist
    watchlist.push({ _id: new ObjectId(id), type: type });
    await Users.updateOne(
      { _id: new ObjectId(req.user._id) },
      { $set: { watchlist: watchlist } }
    );

    // Send a response back to the client
    res.status(200).json({ message: "Added to watchlist" });
  } catch (err) {
    // Log the error to the console
    res.status(500).json({ message: "Server error" });
  }
};

// Delete from watchlist
const deleteFromWatchlist = async (req, res) => {
  // Get the movie or tvShow ID from the request parameters
  const { id } = req.params;
  try {
    // Fetch the Users collection from the database
    const Users = await db.collection("Users");

    // Check if the movie or tvShow is in the user's watchlist
    let watchlist = req.user.watchlist;

    // Find the index of the movie or tvShow in the user's watchlist
    const index = watchlist.findIndex((item) => String(item._id) === id);

    // If the movie or tvShow is in the user's watchlist
    if (index !== -1) {
      watchlist.splice(index, 1);
      await Users.updateOne(
        { _id: new ObjectId(req.user._id) },
        { $set: { watchlist: watchlist } }
      );
      // Send a response back to the client
      res.status(200).json({ message: "Deleted from watchlist" });
    } else {
      // If the movie or tvShow is not in the user's watchlist return 404 Not Found
      res.status(404).json({ message: "Not in watchlist" }); // 404 Not Found
    }
  } catch (err) {
    // Log the error to the console
    res.status(500).json({ message: "Server error" });
  }
};

// Get watchlist details
const getWatchlistDetails = async (req, res) => {
  // Get the movie or tvShow ID from the request parameters
  const { id } = req.params;
  try {
    // Fetch the Users collection from the database
    const Users = await db.collection("Users");

    // Check if the movie or tvShow is in the user's watchlist
    let watchlist = req.user.watchlist;

    // Get all watchlist items
    const watchlistItems = await Promise.all(
      watchlist.map(async (item) => {
        const collectionName = item.type === "movie" ? "Movies" : "Shows";
        const collection = db.collection(collectionName);
        return await collection.findOne(
          { _id: new ObjectId(item._id) },
          {
            projection: {
              title: 1,
              bannerUrl: 1,
              releaseDate: 1,
              firstAirDate: 1,
              lastAirDate: 1,
              rated: 1,
              type: 1,
            },
          }
        );
      })
    );

    // Send the watchlist items back to the client
    res.status(200).json(watchlistItems);
  } catch (err) {
    // Log the error to the console
    res.status(500).json({ message: "Server error" });
  }
};

// Export the controller functions
module.exports = {
  getWatchlist,
  getWatchlistDetails,
  addToWatchlist,
  deleteFromWatchlist,
};
