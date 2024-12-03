const a = true

// dynamic import : 특정 조건일때 require
//
if (a) {
   require('./func')
}
console.log('성공')
