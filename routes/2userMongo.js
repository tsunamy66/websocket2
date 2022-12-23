const User = require("./1userSchema")

async function saveUser(user) {
  Object.assign({},{
    salt: "salt"
  })
  await User.create(user)
}

module.exports = {
  saveUser
}