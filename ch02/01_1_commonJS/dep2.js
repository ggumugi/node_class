const dep1 = require('./dep1')

console.log('require dept1:', dep1)

function insideDep2() {
   console.log('dept1:', dep1)
}

module.exports = insideDep2
