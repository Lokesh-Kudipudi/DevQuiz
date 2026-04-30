const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const checkNotDemo = (req, res, next) => {
  if (req.user && req.user.isDemo) {
    return res
      .status(403)
      .json({ message: "Demo user cannot perform this action." });
  }
  next();
};

module.exports = { protect, checkNotDemo };
