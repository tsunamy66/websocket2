const passport = require('passport')
const LocalStrategy = require('passport-local')
const { saveUser, findUserById, findUserByUsername } = require('./2userMongo')
const bcrypt = require("bcryptjs")
const { logger } = require('../../utils/logger')

passport.use(new LocalStrategy({ passReqToCallback: true },//To access req
  async function (req, username, password, done) {
    const user = await findUserByUsername(username)
    console.log("user|>", user);
    req.session.messages = []
    if (!user) {
      console.log({ user });
      return done(null, false, { message: "Incorrect username" });
    }
    bcrypt.compare(password, user.password, function (err) {
      if (err) { return done(null, false, "Incorrect password") };
      done(null, user)
    })
  }
))

//initialize req.session.passport 
passport.serializeUser(function (user, done) {
  console.log("serialize|>", user);
  done(null, user._id)
  //Done & returns to req.login while signing up
  //درواقع انجام میشه و برمیگرده به ادامه کار در رک.لاگین موقع ثبت نام
})

//Get req.session.passport & save in req.user
passport.deserializeUser(async function (id, done) {
  const user = await findUserById(id)
  done(null, { username: user.username })
})

function signupGet(req, res, next) {
  res.render("signup");
}

async function signupPost(req, res, next) {
  // console.log("req.bodyInSignupPost=>",req.body);
  let user = req.body;

  console.log("signupPost0|>", user);
  user = await saveUser(user);
  console.log("signupPost|>", user);
  //pass user to serializeUser
  //req.login is primarily used when users sign up,during which req.login() can be invoked to automatically log in the newly registered user.
  req.login(user, function (err) {
    if (err) { return next(err); };
    console.log("befor res.redirect to chatttttttttttttttttttttttttttttttttttttttttttttttttttttttt");
    // console.log("signupUser|>", req.isAuthenticated());
    res.redirect("/chat")
  })
}

function loginGet(req, res, next) {
  console.log("req.session|>", req.session);
  if (req.session.messages) {
    res.render("login", {
      faiLogin: req.session.messages[0]
    });
  } else {
    res.render("login", {
      faiLogin: ""
    })
  }
}

function signoutGet(req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/home');
  });
}

module.exports = {
  signupGet,
  signupPost,
  loginGet,
  signoutGet,
}