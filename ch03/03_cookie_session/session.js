const express = require('express')
const session = require('express-session')
require('dotenv').config() // env파일을 사용하기 위한 라이브러리

const app = express()
app.set('port', process.env.PORT || 3000)

// 세션 설정
app.use(
   session({
      name: 'my-session', // 세션 id를 저장하는 쿠키의 이름(자유)
      secret: 'your-secret-key', // 세션을 암호화 하는 키(자유)
      resave: false, // 세션 데이터가 바뀌지 않아도 저장소에 다시 저장할지 여부
      saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부
      cookie: {
         maxAge: 1000 * 60 * 60, // 세션 id를 저장하는 쿠키의 저장 시간
         secure: false, // HTTPS를 사용할 때만 쿠키 전송
         // false 이므로 https, http 다 사용
         // https는 서버 보안이 존재, http는 서버 보안 x
      },
   })
)

// 세션 값 저장
app.get('/set-session', (req, res) => {
   // 세션 객체 자체는 서버에 저장이 된다
   // 세션 객체가 생성 될 때 같이 생성되는 세션 id는 cookie에 저장되어 response 된다
   req.session.username = '하서' // 세션 객체도 키와 밸류로 구성 key username, value 하서
   req.session.role = 'admin' // key role ,value admin
   res.send('세션에 데이터가 저장되었습니다.')
})

// 세션 값 확인
app.get('/get-session', (req, res) => {
   const { username, role } = req.session
   if (username && role) {
      res.send(`username : ${username}, role : ${role}, 세션 id : ${req.sessionID}`)
   } else {
      res.send('세션을 찾을 수 없습니다.')
   }
})

// 세션 값 삭제
app.get('/destroy-session', (req, res) => {
   req.session.destroy((err) => {
      if (err) {
         res.send(`세션 삭제 실패: ${err.message}`)
      } else {
         res.send('세션이 삭제되었습니다.')
      }
   })
})

app.listen(app.get('port'), () => {
   console.log(`서버가 작동 중 입니다. http://localhost:${app.get('port')}`)
})
