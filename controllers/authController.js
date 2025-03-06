const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.register = async (req, res) => {
  try {
    let { username, password } = req.body;

    
    username = username?.trim();
    password = password?.trim();


    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    if (password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters long");
    }


    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const user = new User({ username, password });
    await user.save();

    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).send("Error registering user");
  }
};

exports.login = async (req, res) => {
  try {
    let { username, password } = req.body;


    username = username?.trim();
    password = password?.trim();


    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    res.status(200).send("Login successful");
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).send("Error logging in");
  }
};
