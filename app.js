const errorHandler = require("http-errors")
const path = require("path");
const express = require("express");
const session = require('express-session');
const cookieParser = require("cookie-parser")
const sess = session({
  secret: "sakethereiswebsocket",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 5 * 1000 }
})

const { userRouter, isLoggedIn } = require("./routes/user/4userRouter");
const { reqLoger } = require("./utils/logger");
const passport = require("passport");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("PORT", process.env.PORT || 8080);

app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(function (req,res,next) {
  // console.log("req.cookies(bfrSes)|>",req.cookies);
  // console.log("req.signedCookies(bfrSes)|>",req.signedCookies);
  next()
},session({
  secret: "sakethereiswebsocket",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 5 * 1000 }
}),function (req,res,next) {
  // console.log("req.signedCookies(aftrSess)|>",req.signedCookies);
  // console.log("req.session(aftrSess)|>",req.session);
  // console.log("req.originalUrl(aftrSess)|>",req.originalUrl);
  // console.log("req.baseUrl(aftrSess)|>",req.baseUrl);
  // console.log("req.url(aftrSess)|>",req.url);
  // console.log("req.headers.location(aftrSess)|>",req.headers.location);
  // console.log("req.referer(aftrSess)|>",req.headers.referer);
  next()
})

//define req.login & req.logout & ...
app.use(passport.session()) //in req.login

app.use('/user', userRouter)

app.get("/chat",isLoggedIn, function (req, res, next) {
  res.render("chat",{
    username : req.user.username
  })
});

app.get("/home", function (req, res, next) {
  console.log("req.session(home)|>",req.session);
  res.render("home");
});

app.get("*",(req, res, next) => {
  console.log("/*|>",req.path);
  if (req.path == "/wsclient" || req.path == "/favicon.ico") {
    return next()
  }
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


module.exports = {
  app,
  sess
};
