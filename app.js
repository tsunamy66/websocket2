const path = require("path");
const express = require("express");
const session = require('express-session');

const userRouter = require("./routes/3userController");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("PORT", process.env.PORT || 8080);

app.use(express.json())
app.use(express.static(path.join(__dirname, "views")));

app.use('/',userRouter)

app.get("/", function (req, res, next) {
  res.render("home");
});

app.get("/chat", function (req, res, next) {
  res.render("chat")
});

module.exports = app;
