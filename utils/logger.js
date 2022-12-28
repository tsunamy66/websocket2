function logger(obj, exp = "") {
  const varName = getVarName(obj);
  //Formal Err to find filename or line
  const e = new Error();
  const regex = /\((.*):(\d+):(\d+)\)$/
  const match = regex.exec(e.stack.split("\n")[2])[1]
  const fileName = match.split('/')
  const funCallerName = logger.caller.name || fileName[fileName.length - 1]
  const finaLog = "|" + varName + exp + "(" + funCallerName + ")|>"
  console.log(finaLog,obj[varName])
  // console.log(logger.caller.name)
}

function getVarName(varObj) {
  return Object.keys(varObj)[0]
}

function reqLoger(req,res,next) {
  console.log("req.sessionID|>", req.sessionID);
  console.log("req.path|>", req.path);
  console.log("req.user     |>", req.user);
  console.log("req.session  |>", req.session);
  console.log("req.cookies  |>", req.cookies);
  next()
}

module.exports = {logger,reqLoger}