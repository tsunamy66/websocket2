const mongoose = require('mongoose');
const crypto = require('crypto');
const logger = require('../utils/logger');

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
  }
})

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified("password") || user.isNew) {
    const salt = crypto.randomUUID().toString();
    logger({salt});
    user.salt = salt;
    crypto.pbkdf2(user.password, salt, 1000, 64, "sha256", function (err, derivedKey) {
      if (err) {
        logger({err});
      }
      user.password = derivedKey
      logger({user});
    })
  }
  next();
});

let User = mongoose.model('User', userSchema)

module.exports = User;