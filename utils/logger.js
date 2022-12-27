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

module.exports = logger