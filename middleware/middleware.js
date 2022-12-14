const jsonWebToken = require("jsonwebtoken");
const User = require("../models/User.model");

const isAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ message: "No token found!" });
    }
    token = token.replace("Bearer ", "");
    const userToken = jsonWebToken.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({ username: userToken.username });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    req.user = user;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
  next();
};

module.exports = isAuth;
