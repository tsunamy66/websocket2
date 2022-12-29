const passport = require('passport')
const LocalStrategy = require('passport-local')
const crypto = require("node:crypto")
const { saveUser, findUserById } = require('./2userMongo')
const { logger } = require('../utils/logger')

// passport.use(new LocalStrategy(
//   function (username, password, done) {
//     const user = { username, password }
//     return done(null, user)
//   }
// ))

//initialize req.session.passport 
passport.serializeUser(function (user, done) {
  console.log("serialize|>", user);
  done(null, user.id)
  //Done & returns to req.login while signing up
  //درواقع انجام میشه و برمیگرده به ادامه کار در رک.لاگین موقع ثبت نام
})

//Get req.session.passport & save in req.user
passport.deserializeUser(async function (id, done) {
  const user = await findUserById(id)
  console.log("desrialize|>", user)
  done(null, { username: user.username })
})

function signupGet(req, res, next) {
  res.render("signup");
}

async function signupPost(req, res, next) {
  // console.log("req.bodyInSignupPost=>",req.body);
  const user = req.body;
  await saveUser(user);
  console.log("signupUser|>", req.isAuthenticated());

  //pass user to serializeUser
  req.login(user, function (err) {
    if (err) { return next(err); };
    console.log("befor res.redirect to chatttttttttttttttttttttttttttttttttttttttttttttttttttttttt");
    console.log("signupUser|>", req.isAuthenticated());
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