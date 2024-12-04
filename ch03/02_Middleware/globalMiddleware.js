const express = require('express')
require('dotenv').config() // env 파일을 사용하기 위한

const app = express()
app.set('port', process.env.PORT || 3000)

// 1. 전역 미들웨어 : 애플리케이션의 모든 request에서 동작하는 미들웨어
// 미들웨어는 use() 함수 사용
// request - 미들웨어 - response => 중간에서 동작
app.use((req, res, next) => {
   // req(request): 리퀘스트에 대한 정보가 들어있는 객체
   // res(response): 리스폰스에 대한 정보가 들어있는 객체(주로 응답할 때 사용)
   console.log(`${req.method} ${req.url}`)
   console.log('미들웨어 1 실행.')
   next() // 2번째로 이동
})
app.use((req, res, next) => {
   console.log('미들웨어 2 실행.')
   next() // 다음이 없으니 app.get으로 이동
})
app.get('/', (req, res) => {
   res.send('홈페이지')
})
app.get('/about', (req, res) => {
   res.send('소개 페이지')
})

app.listen(app.get('port'), () => {
   console.log(`서버가 작동 중 입니다. https://localhost:${app.get('port')}`)
})
