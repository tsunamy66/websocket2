const logger = require("./utils/logger")

let x = "hello"
let y = "bye"

function foo() {
  logger({x})
}

function bar() {
  logger({y})
}

foo()
bar()