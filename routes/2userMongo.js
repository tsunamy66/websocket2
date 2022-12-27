const logger = require("../utils/logger");
const User = require("./1userSchema")

async function saveUser(user) {
  Object.assign(user, {
    salt: "salt"
  })
  logger({user});
  await User.create(user)
}

module.exports = {
  saveUser
}