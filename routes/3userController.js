const passport = require('passport')
const LocalStrategy = require('passport-local')
const crypto = require("node:crypto")
const { saveUser } = require('./2userMongo')

passport.use(new LocalStrategy(
  function (username, password, cb) {
    const user = { username, password }
    return cb(null, user)
  }
))

function signupGet(req, res, next) {
  res.render("signup");
}

async function signupPost(req, res, next) {
  console.log("req.bodyInSignupPost=>",req.body);
  const user = req.body
  await saveUser(user)
  req.login(user,function (err) {
    if (err) console.log("req.login=>",err);
  })
}

function loginGet(req, res, next) {
  res.render("login");
}

function loginPost(req,res,next) {
  
}

module.exports = {
  signupGet,
  signupPost,
  loginGet,
  loginPost
}