const express = require("express");
const userRoutes = express.Router();
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const uuid = require("uuid/v4");
const nodeMailer = require("nodemailer");

// GET api/user

userRoutes.post("/signup", (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  //simple validation

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: "User already exist" });

    const newUser = new User({
      name,
      email,
      password
    });

    //
    if (!user) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(user => {
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
      return res.json({ msg: "registered success" });
    }
  });
});

//forgotpassword
userRoutes.post("/forgot", (req, res) => {
  // return console.log(req.body);
  const email = req.body.email;
  let token = uuid();
  User.findOne({ email }, (err, user) => {
    // console.log(user);
    if (err) {
      return res.status(500).json({ msg: "server problem" });
    }
    if (!user) {
      return res.status(400).json({ msg: "no user with this email" });
    }
    user.token = token;
    user.tokenExpire = Date.now() + 3600000;
    user.save().then(result => {
      var smtpTransport = nodeMailer.createTransport({
        service: "Gmail",
        // auth: {
        //   user: process.env.gmailid,
        //   pass: process.env.gmailpassword
        // }
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "hindustanschool1@gmail.com",
          pass: "ajayajayajay"
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      var mailOptions = {
        to: req.body.email,
        from: "hindustanschool1@gmail.com",
        subject: "Password Reset",
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> </p>
        `
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        if (err) {
          return res
            .status(500)
            .json({ msg: "Server Problem Please try again after some time" });
        }
        console.log("reset password mail sent");
        res.status(200).json({
          msg: "Reset password link sent to ur email successfully"
        });
        // console.log(response);
        // return response.json({ msg: "email sent success" });
      });
    });
    // return res.json({
    //   msg: "Reset password link sent to ur email successfully"
    // });
  });
});

//resetPassword
userRoutes.post("/updatePassword/:token", (req, res) => {
  let password = req.body.password;
  const token = req.params.token;
  const currentDate = Date.now();
  User.findOne({ token }, (err, foundToken) => {
    if (err) {
      return res.json({ msg: "server problem" });
    }

    if (!foundToken) {
      return res.json({ msg: "invalid token" });
    }
    if (foundToken.tokenExpire < currentDate) {
      return res.json({ msg: "token expired" });
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        password = hash;
        foundToken.token = "";
        foundToken.tokenExpire = "";
        foundToken.password = password;
        foundToken
          .save()
          .then(result => {
            res.json({ msg: "password updated success" });
          })
          .catch(err => {
            res.json({ msg: "password update fail" });
          });
      });
    });
  });
});
module.exports = userRoutes;
