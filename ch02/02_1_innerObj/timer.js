const timeout = setTimeout(() => {
   console.log('1.5초후 실행')
}, 1500)

const interval = setInterval(() => {
   console.log('1초 마다 실행')
}, 1000)

setTimeout(() => {
   clearTimeout(timeout) // 7초 뒤 중지
   clearInterval(interval) // 7초 뒤 중지
}, 7000)

// setTimeout(함수, 0)qhek setImmediate 먼저 실행되기는 하지만 항상 그렇지는 않으므로 두개를 같이 사용하는 것을 권장하지 않는다.
const immediate = setImmediate(() => {
   console.log('즉시실행')
})

const immediate2 = setImmediate(() => {
   console.log('실행되지 않습니다.')
})

clearImmediate(immediate2)
