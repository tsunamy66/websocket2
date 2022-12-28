const { logger } = require("../utils/logger");
const crypto = require("crypto")
const User = require("./1userSchema")

async function saveUser(user) {
  Object.assign(user, {
    salt: crypto.randomUUID(),
    id: crypto.randomBytes(12).toString("hex"),
  })

  await User.create(user)
}

module.exports = {
  saveUser
}