const mongoose = require('mongoose');
const crypto = require('crypto');
const { logger } = require('../../utils/logger');
const { findSourceMap } = require('module');

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
})

// userSchema.pre('save',function (next) {
//   if (this.isModified("password") || this.isNew) {
//     crypto.pbkdf2(this.password, this.salt, 1000, 64, "sha256", function (err, derivedKey) {
//       if (err) { return next(err); }
//       logger({derivedKey:derivedKey.toString('hex')});
//       this.password = derivedKey.toString("hex")
//       logger({user: this});
//       next();
//     })
//   }
// });

const User = mongoose.model('User', userSchema)

module.exports = User;