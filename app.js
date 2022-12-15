const http = require("http");
const path = require("path");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("PORT", process.env.PORT || 8080);

app.use(express.static(path.join(__dirname, "views")));

app.get("/", function (req, res, next) {
  // res.send('<h1>'+ 'testing' + '</h1>')
  res.sendFile("index.html"); //, { root: path.join(__dirname, 'views') })
});

const server = http.createServer(app);
server.listen(app.get("PORT"), () => {
  console.log(`server is listening on port ${app.get("PORT")}`);
});

module.exports = server;
