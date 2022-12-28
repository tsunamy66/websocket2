const passport = require('passport')
const LocalStrategy = require('passport-local')
const crypto = require("node:crypto")
const { saveUser } = require('./2userMongo')
const { logger } = require('../utils/logger')

// passport.use(new LocalStrategy(
//   function (username, password, done) {
//     const user = { username, password }
//     return done(null, user)
//   }
// ))

//initialize req.session.passport 
passport.serializeUser(function (user, done) {
  console.log("serialize|>",user);
  done(null, user.id)
  //Done & returns to req.login while signing up
})

//Get req.session.passport from serialize & save in req.user
passport.deserializeUser(function (id,done) {
  console.log("desrialize|>",id)
  done(null,id)
})

function signupGet(req, res, next) {
  res.render("signup");
}

async function signupPost(req, res, next) {
  // console.log("req.bodyInSignupPost=>",req.body);
  const user = req.body
  await saveUser(user)
  console.log("signupUser|>",user);

  //send user to serializeUser
  req.login(user, function (err) {
    if (err) { return next(err); };
    console.log("befor res.redirect to chatttttttttttttttttttttttttttttttttttttttttttttttttttttttt");
    res.redirect("/chat")
  })
}

function loginGet(req, res, next) {
  res.render("login");
}

function loginPost(req, res, next) {

}

module.exports = {
  signupGet,
  signupPost,
  loginGet,
  loginPost
}