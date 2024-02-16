const db = require("../db");
const ObjectId = require("mongoose").Types.ObjectId;

// Get all tvShows
const getTVShows = async (req, res) => {
  try {
    // Define offset
    const offset = req.query.page ? (parseInt(req.query.page) - 1) * 20 : 0;

    // Fetch the TvShows collection from the database
    const TvShows = await db.collection("Shows");

    // Fetch all tvShows
    const tvShows = await TvShows.find(
      {},
      {
        projection: {
          title: 1,
          bannerUrl: 1,
          firstAirDate: 1,
          lastAirDate: 1,
          type: 1,
        },
      }
    )
      .skip(offset)
      .limit(20)
      .toArray();

    // If no tvShows are found return 404 Not Found
    if (tvShows.length === 0) {
      return res.status(404).json({ message: "No TVShows found" });
    }

    // Send the tvShows back to the client
    res.json(tvShows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Search for tvShows
const searchTVShows = async (req, res) => {
  try {
    // Fetch the query parameter from the request
    const { query } = req.query;

    // Fetch the TvShows collection from the database
    const TvShows = await db.collection("Shows");

    // Search for tvShows with the given query
    const tvShows = await TvShows.find(
      {
        title: { $regex: new RegExp(query, "i") },
      },
      {
        projection: {
          title: 1,
          bannerUrl: 1,
          firstAirDate: 1,
          lastAirDate: 1,
          rated: 1,
        },
      }
    )
      .limit(20)
      .toArray();

    // If no tvShows are found return 404 Not Found
    if (tvShows.length === 0) {
      return res.status(404).json({ message: "No TVShows found" });
    }

    // Send the tvShows back to the client
    res.json(tvShows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a tvShow by its ID
const getTVShow = async (req, res) => {
  try {
    // Fetch the TvShows collection from the database
    const TVShows = await db.collection("Shows");

    // Fetch the tvShow with the given ID
    const tvShow = await TVShows.findOne(
      { _id: new ObjectId(req.params.id) },
      {
        projection: {
          title: 1,
          firstAirDate: 1,
          lastAirDate: 1,
          rating: 1,
          plot: 1,
          genres: 1,
          runtime: 1,
          language: 1,
          posterUrl: 1,
          status: 1,
        },
      }
    );

    // If tvShow does not exist return 404 Not Found
    if (!tvShow) {
      return res.status(404).json({ message: "TvShow not found" });
    }

    // Send the tvShow back to the client
    res.json(tvShow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get URLs for the tvShow
const getTVShowUrls = async (req, res) => {
  try {
    // Fetch the TVShows collection from the database
    const TVShows = await db.collection("Shows");

    // Fetch the TV Show with the given ID
    const tvShow = await TVShows.findOne(
      { _id: new ObjectId(req.params.id) },
      {
        projection: {
          homepage: 1,
          trailerUrl: 1,
          imdbUrl: {
            $cond: {
              if: { $eq: ["$imdbId", ""] }, // Check if imdbId exists and is not empty
              then: "", // If imdbId is empty, return an empty string for imdbUrl
              else: { $concat: ["https://www.imdb.com/title/", "$imdbId"] }, // If imdbId exists, concatenate the URL
            },
          },
        },
      }
    );

    // If TV Show does not exist return 404 Not Found
    if (!tvShow) {
      return res.status(404).json({ message: "TV Show not found" });
    }

    // Send the TV Show back to the client
    res.json(tvShow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get cast for the tvShow
const getTVShowCast = async (req, res) => {
  try {
    // Fetch the TVShows collection from the database
    const TVShows = await db.collection("Shows");

    // Fetch the TV Show with the given ID
    const tvShow = await TVShows.findOne(
      { _id: new ObjectId(req.params.id) },
      {
        projection: {
          cast: 1,
        },
      }
    );

    // If TV Show does not exist return 404 Not Found
    if (!tvShow) {
      return res.status(404).json({ message: "TV Show not found" });
    }

    // Send the TV Show back to the client
    res.json(tvShow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Export the controller functions
module.exports = {
  getTVShows,
  searchTVShows,
  getTVShow,
  getTVShowUrls,
  getTVShowCast,
};
