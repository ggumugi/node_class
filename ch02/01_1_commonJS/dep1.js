const dep2 = require('./dep2')

console.log('require dept2:', dep2)

function insideDep1() {
   console.log('dept2:', dep2)
}

module.exports = insideDep1
