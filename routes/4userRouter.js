const express = require("express");
const { signupGet, signupPost, loginGet, loginPost } = require('./3userController');

const userRouter = express.Router();

userRouter.get("/signup", signupGet);

userRouter.post("/signup", signupPost);

userRouter.get("/login", loginGet);

userRouter.post("/login", loginPost)

module.exports = userRouter;