const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
  messages: [{
    message: String,
    senderId: String,
    // messageId: Number,
    date: {
      type: Date,
      default: Date.now,
    },
    _id: false,
  }],
  users: {
    ids: [String],
    usernames: [String],
  },
  // senderuser: {
  //   username: {
  //     type: String,
  //     required: true,
  //   },
  //   id: {
  //     type: String,
  //     required: true,
  //   }
  // },
  // recieveruser: {
  //   username: {
  //     type: String,
  //     required: true,
  //   },
  //   id: {
  //     type: String,
  //     required: true,
  //   }
  // },
  date: {
    type: Date,
    default: Date.now,
  },
})

const Message = mongoose.model("Message", messageSchema)

module.exports = Message