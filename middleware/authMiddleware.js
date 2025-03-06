const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure User model is imported

exports.authMiddleware = async (req, res, next) => {
  try {
    // console.log("Cookies:", req.cookies);

    const token = req.cookies?.token; 

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded);

    
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; 

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};
