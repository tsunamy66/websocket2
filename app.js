const errorHandler = require("http-errors")
const path = require("path");
const express = require("express");
const session = require('express-session');

const userRouter = require("./routes/4userRouter");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("PORT", process.env.PORT || 8080);

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter)

app.get("/home", function (req, res, next) {
  res.render("home");
});

app.get("/chat", function (req, res, next) {
  res.render("chat")
});

app.use((req, res, next) => {
  next(errorHandler(404))  // next(new Error("404"))
})

app.use((err, req, res, next) => {
  console.log(err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // console.log("req.app.get('env')=>",req.app.get('env')); //development
  // console.log('process.env.NODE_ENV=>',process.env.NODE_ENV);
  res.status(err.status || 500);
  res.render('error');
})


module.exports = app;
