const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const isAuth = require("../middleware/middleware");

///// Sign up route - Used only for initial admin account creation

const salt = 10;

router.post("/signup", async (req, res, next) => {
  const { username, password, email } = req.body;
  if (!password || !username || !email) {
    return res.status(400).json({ message: "username and password requires" });
  }
  try {
    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(400).json({ message: "this username is taken" });
    }
    const generatedSalt = bcrypt.genSaltSync(salt);
    const saltedPassword = bcrypt.hashSync(password, generatedSalt);

    const newUser = {
      username,
      password: saltedPassword,
      email,
    };
    const createdUser = await User.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.status(400).json({ message: "username incorrect" });
    }
    const matchingPassword = bcrypt.compareSync(password, foundUser.password);
    if (!matchingPassword) {
      return res.status(400).json({ message: "password incorrect" });
    }

    const payload = { username };
    const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    res.status(200).json(token);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/me", isAuth, (req, res, next) => {
  res.status(200).json(req.user);
});

module.exports = router;
