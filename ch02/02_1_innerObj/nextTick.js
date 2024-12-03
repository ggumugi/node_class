setImmediate(() => {
   console.log('immediate')
}) // 3등 거의 차이 없음

process.nextTick(() => {
   console.log('nextTick')
}) // 1등 실행

setTimeout(() => {
   console.log('timeout')
}, 0) // 2등 거의 차이 없음

// 셋 모두 즉시 실행 해주는 함수

Promise.reslove().then(() => console.log('promise'))

// process.nextTick은 setTimeout 이나 setImmediate 보다 먼저 실행된다.
// promise 객체는 비동기이고 이 객체 역시 settimeout이나 setImmediate보다 빠르다
