const express = require('express')

require('dotenv').config()

const app = express()

app.set('port', process.env.PORT || 3000)

app.get('/',(req,res)=>{
    res.send('환영합니다!')
})

// 강제로 에러 발생
app.get('/error',(req,res,next)=>{
    const err = new Error('에러 발생')
    err.status=500
    next(err)
})

// 에러 처리 미들 웨어
app.use((err,req,res,next)=>{
    console.error('Error :', err.message) // 에러 메시지 출력
   res.status(err.status || 500).json({
      error: {
         message: err.message || '서버 내부 에러',
      },
   })

})

app.listen(app.get('port'), () => {
   console.log(`서버가 작동 중입니다. http://localhost:${app.get('port')}`)
})
