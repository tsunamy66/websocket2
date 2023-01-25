const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema({
  username :{
    type: String,
    required: true
  },
  id :{
    type:String,
    required:true
  }
})

const Client = mongoose.model("Client",clientSchema)

module.exports = Client