const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  salt: {
    type: String,
    required: true
  }
})

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified("password") || user.isNew) {
    const salt = crypto.getRandomValues(16).toString();
    user.salt = salt;
    crypto.pbkdf2(user.password, salt, 1000, 64, "sha256", function (err, derivedKey) {
      if (err) {
        console.log(err);
      }
      user.password = derivedKey
    })
  }
  next();
});

let User = mongoose.model('User', userSchema)

module.exports = User;