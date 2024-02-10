const db = require("../db");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

// Create a new user
const createUser = async (req, res) => {
  try {
    // Fetch the users collection from the database
    const Users = await db.collection("Users");

    // Check if a user with the given email already exists
    const emailExists = await Users.findOne({ email: req.body.email });
    if (emailExists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" }); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Create a new Instance of the User model with the hashed password
    const user = new User({
      email: req.body.email,
      password_hashed: hashedPassword,
    });

    // Save the user to the database
    const userCreated = await Users.insertOne(user);

    // Create a Response object to send back to the client with sensitive data excluded
    const responseUser = {
      _id: userCreated.insertedId,
      email: user.email,
    };

    // Generate an access token for the newly created user
    const accessToken = jwt.sign(
      { _id: userCreated.insertedId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Send the response back to the client
    res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: responseUser,
      access_token: accessToken,
      token_type: "Bearer",
      expiresIn: "3600",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    // Fetch the users collection from the database
    const Users = await db.collection("Users");

    // Fetch the user with the given email or username
    const user = await Users.findOne({ email: req.body.email });

    // If user does not exist return 404 Not Found
    if (!user) {
      return res
        .status(404) // 404 Not Found
        .json({ success: false, message: "User does not exist" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password_hashed
    );

    // If the password is incorrect return 401 Unauthorized
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" }); // 401 Unauthorized
    }

    // Create a Response object to send back to the client with sensitive data excluded
    const responseUser = {
      _id: user._id,
      email: user.email,
    };

    // Generate an access token for the user
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the response back to the client
    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: responseUser,
      access_token: accessToken,
      token_type: "Bearer",
      expiresIn: "3600",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
};

const getUser = async (req, res) => {
  try {
    // Fetch the users collection from the database
    const Users = await db.collection("Users");

    // Fetch the user with the given email or username
    const user = await Users.findOne(
      { _id: new ObjectId(req.user._id) },
      { projection: { password_hashed: 0 } }
    );

    // If user does not exist return 404 Not Found
    if (!user) {
      return res
        .status(404) // 404 Not Found
        .json({ success: false, message: "User does not exist" });
    } else {
      res.status(200).json({
        success: true,
        user: user,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
};

module.exports = { createUser, loginUser, getUser };
