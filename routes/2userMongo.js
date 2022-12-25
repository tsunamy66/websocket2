const User = require("./1userSchema")

async function saveUser(user ) {
  Object.assign(user,{
    salt: "salt"
  })
  console.log("inSaveUser=>",user);
  await User.create(user)
}

module.exports = {
  saveUser
}