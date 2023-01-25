const Message = require("./1messageSchma")

async function saveMessage(data) {
  return await Message.save(data)
}

async function getAllMessages(id) {
  return await Message.find(id)
}

module.exports = {
  saveMessage,
  getAllMessages,
}