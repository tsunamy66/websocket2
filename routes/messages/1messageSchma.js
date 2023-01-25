const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  senderuser: {
    username: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    }
  },
  recieveruser: {
    username: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    }
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const Message = mongoose.model("Message", messageSchema)

module.exports = Message