const { odd, even } = require('./ment') // require 함수안에 불러올 모듈의 경로 작성

function checkOddOrEven(num) {
   if (num % 2 === 0) {
      return even
   } else {
      return odd
   }
}

module.exports = checkOddOrEven
