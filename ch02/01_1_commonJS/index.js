// 1. 사용법
const checkNumber = require('./func.js')

console.log('Checking number: ', checkNumber(9))
console.log('Checking number: ', checkNumber(10))

// 2. require는 함수이고 함수는 객체이다. 따라서 require는 객체로서 속성을 가지고 있음

console.log(require.main)

// require는 가장 앞에 오지 않아도 된다 - 순서가 상관 없다

// 3. 순환 참조 문제
// 순환참조(서로가 서로를 require)시 일부 결과가 제대로 나오지 않을 수 있으므로 사용하지 않도록 주의
const insideDep1 = require('./dep1')
const insideDep2 = require('./dep2')

insideDep1()
insideDep2()
