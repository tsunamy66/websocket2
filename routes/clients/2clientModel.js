const Client = require("./1clientSchema");

async function saveClient(client) {
  return await Client.create(client)
}
