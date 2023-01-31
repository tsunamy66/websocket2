// const logger = require("./utils/logger")
// const bcrypt = require("bcryptjs")

// let x = "hello"
// let y = "bye"

// function foo() {
//   logger({x})
// }

// function bar() {
//   logger({y})
// }

// const callbakOnced = once(callcback)
// foo()
// bar()
// let i = 0
// let j = 10
// var something = (function () {
//   console.log(i++);
//   var executed = false;
//   return function () {
//     if (!executed) {
//       executed = true;
//       console.log(j++);
//       // do something
//     }
//   };
// })();

// something("f"); // "do something" happens
// something("");

const hero = {
  name: 'Batman'
};

// console.log(hero.toString); // => function() {...}
console.log('hasOwnProperty' in hero);              // => true
console.log(hero.hasOwnProperty('toString')); 