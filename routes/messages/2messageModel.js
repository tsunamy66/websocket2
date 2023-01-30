const Message = require("./1messageSchma")

async function saveMessage(data) {
  console.log("data|>", data);//{recieverId: 'Savedmessage',recieverUsername:"J..",message: 'sal...',senderId: '63...',senderUsername:"H.."}

  // Message.findOneAndUpdate({
  //   senderuser: { id: data.senderId },
  //   recieveruser: { id: data.id }
  // }, {
  //   $push: { messages: { message: data.message } }
  // }, {
  //   new: true
  // }, function (err, doc) {
  //   if (err) {
  //     console.log("errSavemessage|>", err);
  //   }
  //   console.log("doc|>", doc);
  //   if (doc == null){
  //     //  یعنی اولین بار است که پیام میخواهد ذخیره شود و عملیات ذخیره اینجا انجام میشه
  //   }
  // })

  const messageQuery = await Message.findOne({
    "users.ids": {
      $all: [data["senderId"], data["recieverId"]]
    }
  })

  console.log("messageQuery|>", messageQuery);

  if (messageQuery === null) {
    const firstMessageQuery = new Message({
      messages: [{
        message: data["message"],
        senderId: data["senderId"]
      }],
      users: {
        ids: [data["senderId"], data["recieverId"]],
        usernames: [data["senderUsername"], data["recieverUsername"]],
      },
      // senderuser: {
      //   username: data["senderUsername"],
      //   id: data["senderId"],
      // },
      // recieveruser: {
      //   username: data["recieverUsername"],
      //   id: data["recieverId"],
      // }
    })

    await firstMessageQuery.save();
    console.log("firstMessageQuery|>", firstMessageQuery);
  } else {
    // messageQuery.messages.push({ message: data["message"] });
    // await messageQuery.save();
    //OR
    await Message.updateOne({
      "users.ids": {
        $all: [data["senderId"], data["recieverId"]]
      }
    }, {
      $push: {
        messages: {
          message: data["message"],
          senderId: data["senderId"]
        },
        senderId: data["senderId"],
      }
    })

  }

}

async function getAllMessages(data) {

  return await Message.findOne({
    "users.ids": {
      $all: [data["senderId"], data["recieverId"]]
    }
  }, { messages:1 })
}

module.exports = {
  saveMessage,
  getAllMessages,
}