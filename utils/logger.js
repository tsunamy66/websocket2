function logger(obj,exp = "") {
  let varName = getVarName(obj);
  let funCallerName = logger.caller.name;
  let finaLog = "|"+varName+exp+"In"+funCallerName+"|>="+obj[varName]
  console.log(finaLog)
  console.log(logger.caller.name)
}

function getVarName(varObj) {
  return Object.keys(varObj)[0]
}

module.exports = logger