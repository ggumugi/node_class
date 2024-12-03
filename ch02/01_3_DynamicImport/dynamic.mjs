const a = true

// dynamic import : 특정 조건일때 require
// es모듈은 특정 조건절에 사용이 불가능하다
// if (a) {
//    import './func.mjs'
// }
// console.log('성공')
if (a) {
   await import('./func.mjs')
}
console.log('성공')
