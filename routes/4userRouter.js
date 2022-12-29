const express = require("express");
const { signupGet, signupPost, loginGet, loginPost } = require('./3userController');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && !!req.user) {
    next();
  } else {
    res.redirect("/user/login");
  }
}

const userRouter = express.Router();

userRouter.get("/signup", isLoggedIn, signupGet);

userRouter.post("/signup", signupPost);

userRouter.get("/login", loginGet);

userRouter.post("/login", loginPost)

module.exports = userRouter;