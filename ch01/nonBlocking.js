// 논블로킹 방식으로 작성한 코드
// 이전 작업이 완료될 때까지 기다리지 않고 다음 작업 시작

function longRunningTask() {
   //오래걸리는 작업..

   console.log('작업끝')
}

console.log('시작')
// 오래 걸리는 작업에 논블로킹 처리를 해주는 것이 좋다
// 다음 작업을 처리하면서 longRunningTask를 동시에 실행한다
setTimeout(longRunningTask, 0)
console.log('다음작업')
