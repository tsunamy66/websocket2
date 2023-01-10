const { logger } = require("../../utils/logger");
const bcrypt = require('bcryptjs')
const User = require("./1userSchema")

function genPasSaltId(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return { password : hash };
}

async function saveUser(user) {
  Object.assign(user, genPasSaltId(user.password))

  return await User.create(user) //return user with _id
  // console.log("saveUser|>", user);
}

async function findUserById(id) {
  return await User.findById(id, { _id: 0, __v: 0 })
}

async function findUserByUsername(username) {
  return await User.findOne({ username });
}

module.exports = {
  saveUser,
  findUserById,
  findUserByUsername,
}