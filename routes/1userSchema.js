const mongoose = require('mongoose');
const crypto = require('crypto');
const { logger } = require('../utils/logger');

const userSchema = new mongoose.Schema({
  username: {
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
  },
  id: {
    type: String,
    required: true
  }
})

userSchema.pre('save',function (next) {
  const user = this;
  if (user.isModified("password") || user.isNew) {
    crypto.pbkdf2(user.password, user.salt, 1000, 64, "sha256", function (err, derivedKey) {
      if (err) { return next(err); }
      user.password = derivedKey
      // logger({user});
    })
  }
  next();
});

let User = mongoose.model('User', userSchema)

module.exports = User;