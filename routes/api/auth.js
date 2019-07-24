const express = require("express");
const userRoutes = express.Router();
const user = require("../../models/user");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// GET api/user

userRoutes.post("/login", (req, res) => {
  const { email, password } = req.body;

  //simple validation

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  user.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ msg: "User doesnot exist" });

    bcrypt.compare(password, user.password).then(isMatch => {
      console.log(password);
      console.log(user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });
      jwt.sign(
        { id: user.id },
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            id: user.id,
            name: user.name,
            email: user.email
          });
        }
      );
    });
  });
});
userRoutes.get("/user", auth, (req, res) => {
  user
    .findById(req.user.id)
    .select("-password")
    .then(user => res.json(user));
});

module.exports = userRoutes;
