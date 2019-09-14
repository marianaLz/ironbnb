const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

router.get("/login", (req, res) => {
  res.render("auth-form", { action: "Login" });
});

router.get("/register", (req, res) => {
  res.render("auth-form");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.render("auth-form", { err });
    }
    if (!user) {
      return res.render("auth-form", { err });
    }
    req.logIn(user, err => {
      if (err) {
        return res.render("auth-form", { err });
      }
      if (user.status === "Pending Confirmation") {
        return res.render("auth-form", {
          pendingConfirm: "Please verify your email",
          action: "Login"
        });
      }
      return res.redirect("/profile");
    });
  })(req, res, next);
});

router.post("/register", (req, res) => {
  const { password } = req.body;
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const confirmationCode = token;

  const user = { ...req.body, confirmationCode };

  User.register(user, password)
    .then(data => {
      transporter.sendMail({
        from: "IRONBN <noreply@ironbnb.com>",
        to: data.email,
        subject: "Confirm Your Account at IRONBNB",

        text: `Hello ${data.username} 
          Please click here to confirm your IRONBNB account: 
          ${req.headers.origin}/auth/confirm/${data.confirmationCode}
          Thank you.`
      });
      res.render("email-sent", { data });
    })
    .catch(err => {
      res.render("auth-form", { err });
    });
});

router.get("/confirm/:confirmCode", (req, res) => {
  User.find({ confirmationCode: req.params.confirmCode }).then(user => {
    let id = user[0]._id;

    User.findByIdAndUpdate(id, { status: "Active" }, () => {
      let userEmail = user[0].email;
      let userId = user[0]._id;
      res.render("confirm", { userEmail, userId });
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

module.exports = router;
