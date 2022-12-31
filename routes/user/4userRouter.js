const express = require("express");
const passport = require('passport')
const { signupGet, signupPost, loginGet, signoutGet } = require('./3userController');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && !!req.user) {
    next();
  } else {
    res.redirect("/user/login");
  }
}

const userRouter = express.Router();

userRouter.get("/signup", signupGet);

userRouter.post("/signup", signupPost);

userRouter.get("/login", loginGet);

//passport.authenticate() middleware invokes req.login() automatically.
userRouter.post("/login", passport.authenticate("local", {
  successReturnToOrRedirect: "/chat",
  failureRedirect: "/login",
  failureMessage: true,
}))

userRouter.get("/logout", signoutGet)

module.exports = {
  userRouter,
  isLoggedIn,
};